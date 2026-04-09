import VoiceRecognition from "./VoiceRecognition";

function EmergencyCallButton({ onEmergencyDetected, processing }) {
  return (
    <VoiceRecognition
      onTranscript={(text) => onEmergencyDetected(text)}
      onError={() => {}}
    >
      {({ transcript, status, listening, startListening, stopListening }) => (
        <div className="emergency-call-card">
          <div className="field__toolbar">
            <button
              className={`button button--emergency ${listening ? "button--listening" : ""}`}
              type="button"
              onClick={listening ? stopListening : startListening}
            >
              <span className="button-icon">{listening ? "🎙️" : "📞"}</span>
              {listening ? "Stop Emergency Call" : "📞 Simulate Emergency Call"}
            </button>
            <span className="status-text">{status}</span>
          </div>
          <div className={`call-transcript${processing ? " call-transcript--processing" : ""}`}>
            {transcript
              ? `Transcript: "${transcript}"`
              : "Speak an emergency description such as accident, heavy bleeding, unconscious."}
          </div>
        </div>
      )}
    </VoiceRecognition>
  );
}

export default EmergencyCallButton;
