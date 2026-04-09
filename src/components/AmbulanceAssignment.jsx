function AmbulanceAssignment({ assignment }) {
  if (!assignment) {
    return null;
  }

  return (
    <div className="ambulance-card">
      <div className="alert-banner alert-banner--ambulance">
        <span>🚑</span>
        <div>
          <strong>Ambulance Assigned</strong>
          <p>{assignment.message}</p>
        </div>
      </div>
      <div className="ambulance-details">
        <div>
          <p className="status-text">Ambulance ID</p>
          <strong>{assignment.ambulanceId}</strong>
        </div>
        <div>
          <p className="status-text">ETA</p>
          <strong>{assignment.eta}</strong>
        </div>
        <div>
          <p className="status-text">Hospital</p>
          <strong>{assignment.hospital}</strong>
        </div>
      </div>
    </div>
  );
}

export default AmbulanceAssignment;
