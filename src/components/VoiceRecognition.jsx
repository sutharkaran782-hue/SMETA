import { useEffect, useRef, useState } from "react";

function VoiceRecognition({ onTranscript, onStatusChange, onError, children }) {
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Ready to receive emergency call");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  function updateStatus(message) {
    setStatus(message);
    onStatusChange?.(message);
  }

  function handleResult(event) {
    const allResults = Array.from(event.results)
      .map((result) => result[0]?.transcript ?? "")
      .join(" ")
      .trim();

    setTranscript(allResults);
    if (event.results[event.results.length - 1].isFinal) {
      onTranscript?.(allResults);
      updateStatus("Transcript captured");
      setListening(false);
    } else {
      updateStatus("Listening... speak now");
    }
  }

  function handleError(event) {
    const message = event.error === "not-allowed"
      ? "Microphone permission is required."
      : "Voice recognition failed. Please try again.";
    setListening(false);
    updateStatus(message);
    onError?.(message);
  }

  function startListening() {
    const SpeechRecognition =
      globalThis.window?.SpeechRecognition || globalThis.window?.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const message = "Speech recognition is not supported in this browser.";
      updateStatus(message);
      onError?.(message);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      updateStatus("Listening for emergency description...");
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = () => {
      setListening(false);
      if (transcript) {
        updateStatus("Processing transcript...");
      } else {
        updateStatus("Voice capture ended.");
      }
    };

    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop?.();
    setListening(false);
    updateStatus("Voice recognition stopped.");
  }

  return children({
    transcript,
    status,
    listening,
    startListening,
    stopListening,
  });
}

export default VoiceRecognition;
