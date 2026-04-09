import { useEffect, useState } from "react";
import QueueList from "../components/QueueList";
import { getPatients, isSupabaseConfigured } from "../services/supabase";
import { sortPatientsByPriority } from "../utils/severity.replacement";

function DoctorDashboardPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPatients() {
    console.log("[dashboard] Queue load started");

    try {
      setLoading(true);
      setError("");
      const records = await getPatients();
      const sortedRecords = sortPatientsByPriority(records);
      console.log("[dashboard] Queue load completed", {
        fetched: records.length,
        sorted: sortedRecords.length,
      });
      setPatients(sortedRecords);
    } catch (loadError) {
      console.error("[dashboard] Queue load failed", loadError);
      setError(loadError.message || "Unable to load patient queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <section className="panel">
      <div className="dashboard-header">
        <div>
          <p className="panel__eyebrow">Doctor Dashboard</p>
          <h2 className="dashboard-title">Live emergency queue</h2>
          <p className="dashboard-subtitle">
            Patients are sorted automatically: Critical, then Moderate, then Low.
          </p>
        </div>

        <button className="button button--ghost" type="button" onClick={loadPatients}>
          Refresh Queue
        </button>
      </div>

      {!isSupabaseConfigured ? (
        <div className="message message--info">
          Demo mode is active. The queue below is loading from this browser until
          Supabase credentials are added to `.env`.
        </div>
      ) : null}
      {loading ? <p className="status-text">Loading patient queue...</p> : null}
      {error ? <div className="message message--error">{error}</div> : null}
      {!loading && !error ? <QueueList patients={patients} /> : null}
    </section>
  );
}

export default DoctorDashboardPage;
