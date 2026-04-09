import { getPriorityDisplay } from "../utils/severity.replacement";

const ICON_BY_PRIORITY = {
  CRITICAL: "\uD83D\uDD34",
  MODERATE: "\uD83D\uDFE0",
  LOW: "\uD83D\uDFE2",
};

function PriorityBadge({ priority }) {
  const display = getPriorityDisplay(priority);
  const icon = ICON_BY_PRIORITY[display.label] || ICON_BY_PRIORITY.LOW;

  return (
    <span className={`badge badge--${display.className}`}>
      <span>{icon}</span>
      <span>{display.label}</span>
    </span>
  );
}

export default PriorityBadge;
