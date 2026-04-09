import { useEffect, useRef, useState } from "react";
import {
  createPatientRecord,
  isSupabaseConfigured,
  uploadPatientImage,
} from "../services/supabase";
import { analyzeSeverity, getPriorityDisplay } from "../utils/triage";
import PriorityBadge from "./PriorityBadge";

const initialPreview = {
  priority: "",
  summary: "",
};

function PatientForm({ copy }) {
  const [symptoms, setSymptoms] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(initialPreview);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  function handleVoiceInput() {
    const SpeechRecognition =
      globalThis.window?.SpeechRecognition || globalThis.window?.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(copy.voiceUnsupported);
      setVoiceStatus("");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop?.();
      setIsListening(false);
      setVoiceStatus("");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    setError("");
    setVoiceStatus(copy.voiceListening);
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (transcript) {
        setSymptoms((currentSymptoms) =>
          currentSymptoms
            ? `${currentSymptoms}${currentSymptoms.endsWith(" ") ? "" : " "}${transcript}`
            : transcript,
        );
        setVoiceStatus(copy.voiceCaptured);
      }
    };

    recognition.onerror = () => {
      setError(copy.voiceFailed);
      setVoiceStatus("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedSymptoms = symptoms.trim();
    console.log("[patient-form] Submit started", {
      hasSymptoms: Boolean(trimmedSymptoms),
      hasImage: Boolean(imageFile),
    });

    if (!trimmedSymptoms) {
      setError(copy.requiredError);
      setSuccess("");
      return;
    }

    const analysis = analyzeSeverity(trimmedSymptoms);
    setPreview({
      priority: analysis.priority,
      summary: analysis.summary,
    });
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    console.log("[patient-form] Severity analysis", analysis);

    try {
      const imageUrl = imageFile ? await uploadPatientImage(imageFile) : null;

      await createPatientRecord({
        symptoms: trimmedSymptoms,
        priority: analysis.priority,
        summary: analysis.summary,
        image_url: imageUrl,
      });

      const display = getPriorityDisplay(analysis.priority);
      console.log("[patient-form] Submit completed", {
        priority: analysis.priority,
        imageUrl,
      });
      setSuccess(copy.submitSuccess(display.label));
      setSymptoms("");
      setImageFile(null);
      setImagePreviewUrl("");
      setVoiceStatus("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (submitError) {
      console.error("[patient-form] Submit failed", submitError);
      setError(submitError.message || "Unable to submit patient details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <div className="field__toolbar">
          <label htmlFor="symptoms">{copy.symptomsLabel}</label>
          <button
            className={`button button--secondary button--small${
              isListening ? " button--listening" : ""
            }`}
            type="button"
            onClick={handleVoiceInput}
          >
            {isListening ? copy.voiceStop : copy.voiceStart}
          </button>
        </div>
        <textarea
          id="symptoms"
          name="symptoms"
          placeholder={copy.symptomsPlaceholder}
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
          required
        />
        <span className="field__hint">{copy.symptomsHint}</span>
        <span className="status-text">{voiceStatus || copy.voiceReady}</span>
      </div>

      <div className="field">
        <label htmlFor="image">{copy.uploadLabel}</label>
        <input
          ref={fileInputRef}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
        />
        <span className="field__hint">
          {isSupabaseConfigured
            ? copy.uploadHintSupabase
            : copy.uploadHintLocal}
        </span>
        {imagePreviewUrl ? (
          <div className="media-preview">
            <span className="status-text">{copy.previewLabel}</span>
            <img src={imagePreviewUrl} alt={copy.uploadAlt} />
          </div>
        ) : null}
      </div>

      {!isSupabaseConfigured ? (
        <div className="message message--info">{copy.localMode}</div>
      ) : null}
      {error ? <div className="message message--error">{error}</div> : null}
      {success ? <div className="message message--success">{success}</div> : null}

      {preview.priority ? (
        <div className="result-card">
          <div>
            <span className="status-text">{copy.triageResult}</span>
          </div>
          <PriorityBadge priority={preview.priority} />
          <div>
            <strong>{copy.summaryTitle}</strong>
            <p className="panel__text">{preview.summary}</p>
          </div>
        </div>
      ) : null}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? copy.submitBusy : copy.submitIdle}
      </button>
    </form>
  );
}

export default PatientForm;
