import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientInputPage from "./pages/PatientInputPage.replacement";

const translations = {
  en: {
    layout: {
      brandTitle: "Emergency Triage Prioritization",
      brandSubtitle: "Multimodal intake prototype for patient urgency sorting",
      patientIntake: "Patient Intake",
      doctorDashboard: "Doctor Dashboard",
      languageLabel: "Language",
      english: "English",
      hindi: "Hindi",
    },
    patientPage: {
      eyebrow: "Tier-2 Emergency Intake",
      title: "Multimodal emergency intake for faster frontline triage",
      description:
        "Capture symptom text, voice notes, and reference images, then assign a triage priority instantly for the doctor queue.",
      statCritical: "Critical cases first",
      statUrgent: "Urgent cases next",
      statStable: "Stable cases monitored",
      intakeEyebrow: "Patient Input",
      intakeTitle: "Submit symptoms",
      rulesEyebrow: "Smart Triage",
      rulesTitle: "Tier-2 workflow",
      rulesTextOne:
        "Critical cases are highlighted for chest pain, bleeding, unconsciousness, and breathing difficulty.",
      rulesTextTwo:
        "Urgent cases include fever, injuries, swelling, and persistent pain that need quick review.",
      rulesTextThree:
        "Stable cases stay visible in the queue with image previews, summaries, and timestamps for routine assessment.",
    },
    form: {
      symptomsLabel: "Symptoms",
      symptomsPlaceholder:
        "Describe the patient's symptoms, for example: chest pain, sweating, dizziness",
      symptomsHint: "Required. The triage engine checks emergency keywords instantly.",
      uploadLabel: "Upload image",
      uploadHintSupabase: "Optional. Images are stored in Supabase Storage.",
      uploadHintLocal:
        "Optional. Without Supabase, the image stays only in this browser demo.",
      previewLabel: "Image preview",
      voiceStart: "Start Voice Input",
      voiceStop: "Stop Listening",
      voiceReady: "Use your microphone to fill the symptoms field.",
      voiceListening: "Listening for patient symptoms...",
      voiceCaptured: "Voice note added to symptoms.",
      voiceUnsupported: "Voice input is not supported in this browser.",
      voiceFailed: "Voice input could not be captured. Please try again.",
      localMode:
        "Supabase is not connected yet. New submissions will still work and stay saved in this browser until you add your .env keys.",
      triageResult: "Latest triage result",
      summaryTitle: "Emergency summary",
      submitIdle: "Submit Patient for Triage",
      submitBusy: "Submitting...",
      submitSuccess: (label) => `Patient submitted successfully. Severity assigned: ${label}.`,
      requiredError: "Symptoms are required before submitting.",
      uploadAlt: "Selected patient reference",
    },
    dashboard: {
      eyebrow: "Doctor Dashboard",
      title: "Live emergency queue",
      subtitle:
        "Critical, urgent, and stable patients stay sorted automatically with summaries, media, and live updates.",
      refresh: "Refresh Queue",
      simulate: "Simulate Incoming Patient",
      loading: "Loading patient queue...",
      localMode:
        "Demo mode is active. The queue below is loading from this browser until Supabase credentials are added to .env.",
      alertBanner: "Incoming Critical Patient",
      autoRefresh: "Auto-refresh active every 4 seconds.",
      realtime: "Supabase realtime listener active.",
      updated: "Last updated",
      simulateBusy: "Simulating...",
    },
    queue: {
      emptyTitle: "No patients in queue",
      emptyDescription:
        "New submissions will appear here in severity order after they are saved.",
      queuePriority: "Severity",
      patientId: "Patient ID",
      uploadedImage: "Uploaded image",
      viewImage: "Open full image",
      summaryFallback: "AI summary pending.",
      imageAlt: "Patient upload",
    },
  },
  hi: {
    layout: {
      brandTitle: "Emergency Triage Prioritization",
      brandSubtitle: "मल्टीमॉडल इंटेक प्रोटोटाइप for patient urgency sorting",
      patientIntake: "रोगी इनटेक",
      doctorDashboard: "डॉक्टर डैशबोर्ड",
      languageLabel: "भाषा",
      english: "English",
      hindi: "हिंदी",
    },
    patientPage: {
      eyebrow: "Tier-2 इमरजेंसी इनटेक",
      title: "फ्रंटलाइन ट्रायज के लिए मल्टीमॉडल इमरजेंसी इनटेक",
      description:
        "लक्षण टेक्स्ट, वॉइस नोट और रेफरेंस इमेज कैप्चर करें, फिर डॉक्टर क्यू के लिए तुरंत ट्रायज प्रायोरिटी असाइन करें।",
      statCritical: "Critical cases first",
      statUrgent: "Urgent cases next",
      statStable: "Stable cases monitored",
      intakeEyebrow: "रोगी इनपुट",
      intakeTitle: "लक्षण सबमिट करें",
      rulesEyebrow: "Smart Triage",
      rulesTitle: "Tier-2 workflow",
      rulesTextOne:
        "Critical cases chest pain, bleeding, unconsciousness और breathing difficulty के लिए highlight होते हैं।",
      rulesTextTwo:
        "Urgent cases में fever, injury, swelling और persistent pain शामिल हैं जिन्हें जल्दी review चाहिए।",
      rulesTextThree:
        "Stable cases queue में image preview, summary और timestamp के साथ routine assessment के लिए दिखते रहते हैं।",
    },
    form: {
      symptomsLabel: "लक्षण",
      symptomsPlaceholder:
        "रोगी के लक्षण लिखें, जैसे: chest pain, sweating, dizziness",
      symptomsHint: "Required. Triage engine emergency keywords तुरंत check करता है।",
      uploadLabel: "इमेज अपलोड",
      uploadHintSupabase: "Optional. Images Supabase Storage में store होंगी।",
      uploadHintLocal:
        "Optional. Supabase के बिना image इस browser demo में ही रहेगी।",
      previewLabel: "इमेज प्रीव्यू",
      voiceStart: "वॉइस इनपुट शुरू करें",
      voiceStop: "सुनना बंद करें",
      voiceReady: "Symptoms field भरने के लिए microphone उपयोग करें।",
      voiceListening: "रोगी के लक्षण सुन रहे हैं...",
      voiceCaptured: "Voice note symptoms में जोड़ दी गई है।",
      voiceUnsupported: "इस browser में voice input supported नहीं है।",
      voiceFailed: "Voice input capture नहीं हो सका। फिर से कोशिश करें।",
      localMode:
        "Supabase अभी connected नहीं है। नई submissions इस browser में save रहेंगी जब तक आप .env keys नहीं जोड़ते।",
      triageResult: "Latest triage result",
      summaryTitle: "Emergency summary",
      submitIdle: "रोगी को ट्रायज के लिए सबमिट करें",
      submitBusy: "सबमिट हो रहा है...",
      submitSuccess: (label) => `Patient submitted successfully. Severity assigned: ${label}.`,
      requiredError: "Submit करने से पहले symptoms required हैं।",
      uploadAlt: "Selected patient reference",
    },
    dashboard: {
      eyebrow: "डॉक्टर डैशबोर्ड",
      title: "Live emergency queue",
      subtitle:
        "Critical, urgent और stable patients summary, media और live updates के साथ automatically sorted रहते हैं।",
      refresh: "क्यू रिफ्रेश करें",
      simulate: "Incoming Patient Simulate करें",
      loading: "Patient queue लोड हो रही है...",
      localMode:
        "Demo mode active है। जब तक Supabase credentials .env में नहीं जुड़ते, नीचे की queue इस browser से load हो रही है।",
      alertBanner: "Incoming Critical Patient",
      autoRefresh: "हर 4 सेकंड में auto-refresh active है।",
      realtime: "Supabase realtime listener active है।",
      updated: "Last updated",
      simulateBusy: "Simulating...",
    },
    queue: {
      emptyTitle: "Queue में कोई patient नहीं है",
      emptyDescription:
        "नई submissions save होने के बाद यहाँ severity order में दिखाई देंगी।",
      queuePriority: "Severity",
      patientId: "Patient ID",
      uploadedImage: "Uploaded image",
      viewImage: "Full image खोलें",
      summaryFallback: "AI summary pending.",
      imageAlt: "Patient upload",
    },
  },
};

function App() {
  const [language, setLanguage] = useState("en");
  const copy = translations[language];

  return (
    <Layout
      copy={copy.layout}
      language={language}
      onLanguageChange={setLanguage}
    >
      <Routes>
        <Route
          path="/"
          element={<PatientInputPage copy={copy.patientPage} formCopy={copy.form} />}
        />
        <Route
          path="/dashboard"
          element={<DoctorDashboardPage copy={copy.dashboard} queueCopy={copy.queue} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
