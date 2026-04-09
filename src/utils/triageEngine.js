const priorityRules = [
  {
    score: 1,
    priority: "CRITICAL",
    label: "Critical",
    color: "red",
    terms: [
      "accident",
      "unconscious",
      "not breathing",
      "heavy bleeding",
      "severe bleeding",
      "cardiac arrest",
    ],
  },
  {
    score: 2,
    priority: "URGENT",
    label: "Very Urgent",
    color: "orange",
    terms: ["chest pain", "breathing difficulty", "fracture", "head injury"],
  },
  {
    score: 3,
    priority: "MODERATE",
    label: "Urgent",
    color: "yellow",
    terms: ["fever", "moderate bleeding", "injury"],
  },
  {
    score: 4,
    priority: "STABLE",
    label: "Mild",
    color: "green",
    terms: ["mild symptoms", "mild pain", "minor wound", "minor cut", "light discomfort"],
  },
];

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatches(normalized) {
  return priorityRules.filter((rule) =>
    rule.terms.some((term) => normalized.includes(term)),
  );
}

function buildSummary(transcript, matches, score) {
  if (matches.length === 0) {
    return `Emergency call captured: ${transcript}. Assessment indicates stable observation may be sufficient.`;
  }

  const labels = matches.map((item) => item.label);
  const uniqueLabels = [...new Set(labels)];
  const termList = uniqueLabels.join(", ");
  const highest = matches[0];

  return `Emergency call captured: ${transcript}. Keywords detected: ${termList}. This is a ${highest.label.toLowerCase()} situation.`;
}

export function analyzeEmergencyCall(transcript) {
  const normalized = normalizeText(transcript);
  const matches = findMatches(normalized);
  const score = matches.length > 0 ? matches[0].score : 5;
  const match = matches[0];
  const priority = match ? match.priority : "LOW";
  const label = match ? match.label : "Observation";
  const color = match ? match.color : "blue";
  const summary = buildSummary(transcript, matches, score);

  return {
    transcript,
    normalized,
    score,
    priority,
    label,
    color,
    summary,
    matches,
  };
}

export function getAmbulanceAssignment(score) {
  if (score !== 1) {
    return null;
  }

  return {
    ambulanceId: "A-102",
    eta: "6 minutes",
    hospital: "Emergency Center",
    message: "Ambulance dispatched to the scene immediately.",
  };
}
