import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QueueList from "../components/QueueList";
import {
  createSimulatedCriticalPatient,
  getPatients,
  isSupabaseConfigured,
  subscribeToPatients,
} from "../services/supabase";
import { sortPatientsByPriority } from "../utils/triage";
import { logoutDoctor } from "../utils/auth";

function DoctorDashboardPage({ copy, queueCopy }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [incomingAlert, setIncomingAlert] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  const dashboardStatus = isSupabaseConfigured
    ? `${copy.autoRefresh} ${copy.realtime}`
    : copy.autoRefresh;

  async function loadPatients(showSpinner = false) {
    console.log("[dashboard] Queue load started");

    try {
      if (showSpinner) {
        setLoading(true);
      }
      setError("");
      const records = await getPatients();
      const sortedRecords = sortPatientsByPriority(records);
      console.log("[dashboard] Queue load completed", {
        fetched: records.length,
        sorted: sortedRecords.length,
      });
      setPatients(sortedRecords);
      setLastUpdated(
        new Intl.DateTimeFormat(undefined, {
          timeStyle: "medium",
        }).format(new Date()),
      );
    } catch (loadError) {
      console.error("[dashboard] Queue load failed", loadError);
      setError(loadError.message || "Unable to load patient queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients(true);

    const refreshTimer = globalThis.window?.setInterval(() => {
      loadPatients();
    }, 4000);

    const unsubscribe = subscribeToPatients((payload) => {
      if (payload?.new?.priority === "CRITICAL") {
        setIncomingAlert(true);
      }
      loadPatients();
    });

    return () => {
      if (refreshTimer) {
        globalThis.window.clearInterval(refreshTimer);
      }
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!incomingAlert) {
      return undefined;
    }

    const timeout = globalThis.window?.setTimeout(() => {
      setIncomingAlert(false);
    }, 5000);

    return () => {
      if (timeout) {
        globalThis.window.clearTimeout(timeout);
      }
    };
  }, [incomingAlert]);

  const navigate = useNavigate();

  async function handleSimulateIncomingPatient() {
    setIsSimulating(true);
    setError("");

    try {
      await createSimulatedCriticalPatient();
      setIncomingAlert(true);
      await loadPatients();
    } catch (simulationError) {
      setError(simulationError.message || "Unable to simulate incoming patient.");
    } finally {
      setIsSimulating(false);
    }
  }

  return (
    <section className="panel">
      <div className="dashboard-header">
        <div>
          <p className="panel__eyebrow">{copy.eyebrow}</p>
          <h2 className="dashboard-title">{copy.title}</h2>
          <p className="dashboard-subtitle">{copy.subtitle}</p>
          <p className="status-text">{dashboardStatus}</p>
          {lastUpdated ? (
            <p className="status-text">
              {copy.updated}: {lastUpdated}
            </p>
          ) : null}
        </div>

        <div className="dashboard-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              logoutDoctor();
              navigate("/", { replace: true });
            }}
          >
            Logout
          </button>
          <button
            className="button button--danger"
            type="button"
            onClick={handleSimulateIncomingPatient}
            disabled={isSimulating}
          >
            {isSimulating ? copy.simulateBusy : copy.simulate}
          </button>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => loadPatients(true)}
          >
            {copy.refresh}
          </button>
        </div>
      </div>

      {incomingAlert ? (
        <div className="alert-banner">
          <span>🚨</span>
          <span>{copy.alertBanner}</span>
        </div>
      ) : null}

      {!isSupabaseConfigured ? (
        <div className="message message--info">{copy.localMode}</div>
      ) : null}
      {loading ? <p className="status-text">{copy.loading}</p> : null}
      {error ? <div className="message message--error">{error}</div> : null}
      {!loading && !error ? <QueueList patients={patients} copy={queueCopy} /> : null}
    </section>
  );
}

export default DoctorDashboardPage;
