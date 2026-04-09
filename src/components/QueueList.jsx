import EmptyState from "./EmptyState";
import PriorityBadge from "./PriorityBadge";

function formatTimestamp(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function QueueList({ patients }) {
  if (patients.length === 0) {
    return (
      <EmptyState
        title="No patients in queue"
        description="New submissions will appear here in severity order after they are saved."
      />
    );
  }

  return (
    <div className="queue-list">
      {patients.map((patient) => (
        <article className="queue-card" key={patient.id || patient.created_at}>
          <div className="queue-card__top">
            <PriorityBadge priority={patient.priority} />
            <strong>{formatTimestamp(patient.created_at)}</strong>
          </div>

          <p className="queue-card__summary">{patient.summary}</p>
          <p className="queue-card__symptoms">{patient.symptoms}</p>

          <div className="queue-card__meta">
            <span>Queue priority: {patient.priority}</span>
            <span>Patient ID: {patient.id ? patient.id.slice(0, 8) : "Pending"}</span>
          </div>

          {patient.image_url ? (
            <div className="queue-card__image">
              <a href={patient.image_url} target="_blank" rel="noreferrer">
                View uploaded image
              </a>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default QueueList;
