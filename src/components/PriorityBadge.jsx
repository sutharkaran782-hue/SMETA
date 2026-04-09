import { getPriorityDisplay } from "../utils/triage";

function PriorityBadge({ priority }) {
  const display = getPriorityDisplay(priority);

  return (
    <span className={`badge badge--${display.className}`}>
      <span>{display.icon}</span>
      <span>{display.label}</span>
    </span>
  );
}

export default PriorityBadge;
