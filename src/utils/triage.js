const PRIORITY_WEIGHT = {
  CRITICAL: 0,
  URGENT: 1,
  MODERATE: 1,
  STABLE: 2,
  LOW: 2,
};

const RULES = [
  {
    priority: "CRITICAL",
    label: "chest pain",
    patterns: ["chest pain", "crushing chest pain", "pressure in chest"],
    emergency: "possible cardiac emergency",
  },
  {
    priority: "CRITICAL",
    label: "heavy bleeding",
    patterns: ["bleeding", "heavy bleeding", "blood loss", "hemorrhage"],
    emergency: "possible hemorrhagic emergency",
  },
  {
    priority: "CRITICAL",
    label: "unconsciousness",
    patterns: ["unconscious", "passed out", "not responding", "collapsed"],
    emergency: "possible life-threatening emergency",
  },
  {
    priority: "CRITICAL",
    label: "breathing difficulty",
    patterns: ["breathing difficulty", "shortness of breath", "difficulty breathing"],
    emergency: "possible respiratory emergency",
  },
  {
    priority: "MODERATE",
    label: "high fever",
    patterns: ["fever", "high temperature", "burning up"],
    emergency: "urgent medical review recommended",
  },
  {
    priority: "MODERATE",
    label: "injury",
    patterns: ["injury", "sprain", "swelling", "fracture", "cut wound"],
    emergency: "urgent trauma review recommended",
  },
  {
    priority: "MODERATE",
    label: "persistent pain",
    patterns: ["moderate pain", "persistent pain", "severe headache", "pain for hours"],
    emergency: "urgent assessment recommended",
  },
  {
    priority: "LOW",
    label: "mild symptoms",
    patterns: ["mild symptoms", "mild cough", "headache", "tiredness", "minor rash"],
    emergency: "stable for routine assessment",
  },
];

function normalizeSymptoms(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function formatList(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function getFallbackSnippet(symptoms) {
  const snippet = symptoms
    .replace(/[^\w\s,]/g, "")
    .split(/[,.]/)
    .map((part) => part.trim())
    .find(Boolean);

  if (!snippet) {
    return "general symptoms";
  }

  const words = snippet.split(" ").slice(0, 8).join(" ");
  return words || "general symptoms";
}

function buildSummary(symptoms, matches, priority) {
  const includesSweating = symptoms.includes("sweating");
  const hasChestPain = matches.some((match) => match.label === "chest pain");
  const hasBreathingDifficulty = matches.some(
    (match) => match.label === "breathing difficulty",
  );

  if (hasChestPain && includesSweating) {
    return "Patient shows chest pain and sweating, possible cardiac emergency.";
  }

  if (hasChestPain && hasBreathingDifficulty) {
    return "Patient shows chest pain and breathing difficulty, possible cardiopulmonary emergency.";
  }

  if (matches.length > 0) {
    const labels = [...new Set(matches.slice(0, 3).map((match) => match.label))];
    return `Patient shows ${formatList(labels)}, ${matches[0].emergency}.`;
  }

  const snippet = getFallbackSnippet(symptoms);

  if (priority === "LOW") {
    return `Patient reports ${snippet}, stable for routine assessment.`;
  }

  return `Patient reports ${snippet}, further assessment required.`;
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

  return {
    priority,
    summary: buildSummary(normalized, matches, priority),
    matches,
  };
}

export function sortPatientsByPriority(patients) {
  return [...patients].sort((first, second) => {
    const firstWeight =
      PRIORITY_WEIGHT[String(first.priority || "").toUpperCase()] ?? Number.MAX_SAFE_INTEGER;
    const secondWeight =
      PRIORITY_WEIGHT[String(second.priority || "").toUpperCase()] ?? Number.MAX_SAFE_INTEGER;
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
  const normalized = String(priority || "").toUpperCase();
  const map = {
    CRITICAL: { icon: "🚨", label: "Critical", className: "critical" },
    URGENT: { icon: "🟠", label: "Urgent", className: "urgent" },
    MODERATE: { icon: "🟠", label: "Urgent", className: "urgent" },
    STABLE: { icon: "🟢", label: "Stable", className: "stable" },
    LOW: { icon: "🟢", label: "Stable", className: "stable" },
  };

  return map[normalized] || map.LOW;
}
