const PRIORITY_WEIGHT = {
  CRITICAL: 0,
  MODERATE: 1,
  LOW: 2,
};

const RULES = [
  {
    priority: "CRITICAL",
    label: "chest pain",
    patterns: ["chest pain"],
    reason: "possible cardiac issue",
  },
  {
    priority: "CRITICAL",
    label: "bleeding",
    patterns: ["bleeding", "heavy bleeding", "blood loss"],
    reason: "active bleeding requires urgent attention",
  },
  {
    priority: "CRITICAL",
    label: "unconscious",
    patterns: ["unconscious", "passed out", "not responding"],
    reason: "loss of consciousness detected",
  },
  {
    priority: "CRITICAL",
    label: "breathing difficulty",
    patterns: ["breathing difficulty", "shortness of breath", "difficulty breathing"],
    reason: "possible respiratory distress",
  },
  {
    priority: "MODERATE",
    label: "fever",
    patterns: ["fever", "high temperature"],
    reason: "possible infection or inflammatory response",
  },
  {
    priority: "MODERATE",
    label: "injury",
    patterns: ["injury", "sprain", "swelling", "fracture"],
    reason: "physical injury should be assessed soon",
  },
  {
    priority: "MODERATE",
    label: "moderate pain",
    patterns: ["moderate pain", "persistent pain", "severe headache"],
    reason: "pain management and evaluation needed",
  },
  {
    priority: "LOW",
    label: "mild symptoms",
    patterns: ["mild symptoms", "mild cough", "headache", "tiredness", "minor rash"],
    reason: "mild symptoms suggest routine assessment",
  },
];

function normalizeSymptoms(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function analyzeSeverity(symptoms) {
  const normalized = normalizeSymptoms(symptoms);
  const matches = RULES.filter((rule) =>
    rule.patterns.some((pattern) => normalized.includes(pattern)),
  );

  const priority =
    matches.find((match) => match.priority === "CRITICAL")?.priority ||
    matches.find((match) => match.priority === "MODERATE")?.priority ||
    "LOW";

  const summary = buildSummary(normalized, matches, priority);

  return {
    priority,
    summary,
    matches,
  };
}

function buildSummary(symptoms, matches, priority) {
  const includesSweating = symptoms.includes("sweating");
  const hasChestPain = matches.some((match) => match.label === "chest pain");

  if (hasChestPain && includesSweating) {
    return "Chest pain + sweating detected -> possible cardiac issue";
  }

  if (matches.length > 0) {
    const labels = matches.slice(0, 2).map((match) => match.label);
    const reason = matches[0].reason;
    return `${labels.join(" + ")} detected -> ${reason}`;
  }

  if (priority === "LOW") {
    return "No high-risk keywords detected -> routine assessment recommended";
  }

  return "Symptoms detected -> further assessment required";
}

export function sortPatientsByPriority(patients) {
  return [...patients].sort((first, second) => {
    const firstWeight = PRIORITY_WEIGHT[first.priority] ?? Number.MAX_SAFE_INTEGER;
    const secondWeight = PRIORITY_WEIGHT[second.priority] ?? Number.MAX_SAFE_INTEGER;
    const priorityDifference = firstWeight - secondWeight;

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const secondTime = new Date(second.created_at).getTime() || 0;
    const firstTime = new Date(first.created_at).getTime() || 0;

    return secondTime - firstTime;
  });
}

export function getPriorityDisplay(priority) {
  const map = {
    CRITICAL: { icon: "🔴", label: "CRITICAL", className: "critical" },
    MODERATE: { icon: "🟠", label: "MODERATE", className: "moderate" },
    LOW: { icon: "🟢", label: "LOW", className: "low" },
  };

  return map[priority] || map.LOW;
}
