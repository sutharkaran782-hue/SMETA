import { useRef, useState } from "react";
import {
  createPatientRecord,
  isSupabaseConfigured,
  uploadPatientImage,
} from "../services/supabase";
import { analyzeSeverity, getPriorityDisplay } from "../utils/severity.replacement";
import PriorityBadge from "./PriorityBadge";

const initialPreview = {
  priority: "",
  summary: "",
};

function PatientForm() {
  const [symptoms, setSymptoms] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(initialPreview);
  const fileInputRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedSymptoms = symptoms.trim();
    console.log("[patient-form] Submit started", {
      hasSymptoms: Boolean(trimmedSymptoms),
      hasImage: Boolean(imageFile),
    });

    if (!trimmedSymptoms) {
      setError("Symptoms are required before submitting.");
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
      setSuccess(
        `Patient submitted successfully. Severity assigned: ${display.icon} ${display.label}.`,
      );
      setSymptoms("");
      setImageFile(null);
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
        <label htmlFor="symptoms">Symptoms</label>
        <textarea
          id="symptoms"
          name="symptoms"
          placeholder="Describe the patient's symptoms, for example: chest pain, sweating, dizziness"
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
          required
        />
        <span className="field__hint">
          Required. The rule-based system checks for emergency keywords instantly.
        </span>
      </div>

      <div className="field">
        <label htmlFor="image">Upload image</label>
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
            ? "Optional. Images are stored in Supabase Storage."
            : "Optional. Without Supabase, the image stays only in this browser demo."}
        </span>
      </div>

      {!isSupabaseConfigured ? (
        <div className="message message--info">
          Supabase is not connected yet. New submissions will still work and stay saved
          in this browser until you add your `.env` keys.
        </div>
      ) : null}
      {error ? <div className="message message--error">{error}</div> : null}
      {success ? <div className="message message--success">{success}</div> : null}

      {preview.priority ? (
        <div className="result-card">
          <div>
            <span className="status-text">Latest triage result</span>
          </div>
          <PriorityBadge priority={preview.priority} />
          <div>
            <strong>Emergency summary</strong>
            <p className="panel__text">{preview.summary}</p>
          </div>
        </div>
      ) : null}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Patient for Triage"}
      </button>
    </form>
  );
}

export default PatientForm;
