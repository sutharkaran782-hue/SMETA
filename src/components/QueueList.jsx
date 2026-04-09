import EmptyState from "./EmptyState";
import PriorityBadge from "./PriorityBadge";
import { getPriorityDisplay } from "../utils/triage";

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

function QueueList({ patients, copy }) {
  if (patients.length === 0) {
    return (
      <EmptyState
        title={copy.emptyTitle}
        description={copy.emptyDescription}
      />
    );
  }

  return (
    <div className="queue-list">
      {patients.map((patient) => {
        const display = getPriorityDisplay(patient.priority);

        return (
          <article
            className={`queue-card queue-card--${display.className}`}
            key={patient.id || patient.created_at}
          >
            <div className="queue-card__top">
              <div className="queue-card__header">
                <PriorityBadge priority={patient.priority} />
                <strong>{formatTimestamp(patient.created_at)}</strong>
              </div>

              <div className="queue-card__details">
                <span>
                  {copy.queuePriority}: {display.label}
                </span>
                <span>
                  {copy.patientId}: {patient.id ? patient.id.slice(0, 8) : "Pending"}
                </span>
              </div>
            </div>

            <p className="queue-card__summary">{patient.summary || copy.summaryFallback}</p>
            <p className="queue-card__symptoms">{patient.symptoms}</p>

            {patient.image_url ? (
              <div className="queue-card__image">
                <span className="queue-card__summary-label">{copy.uploadedImage}</span>
                <img
                  className="queue-card__image-preview"
                  src={patient.image_url}
                  alt={copy.imageAlt}
                />
                <a
                  className="queue-card__image-link"
                  href={patient.image_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.viewImage}
                </a>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default QueueList;
