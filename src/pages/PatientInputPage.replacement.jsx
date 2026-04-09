import PatientForm from "../components/PatientForm";

function PatientInputPage() {
  return (
    <>
      <section className="hero">
        <div className="hero__card">
          <span className="hero__eyebrow">Tier 1 Intake Workflow</span>
          <h2>Fast emergency intake for frontline symptom screening</h2>
          <p>
            Capture symptom notes and an optional image, then assign triage priority
            instantly using simple emergency keyword rules.
          </p>
        </div>

        <div className="hero__card">
          <div className="stats">
            <div className="stat">
              <p className="stat__value">{"\uD83D\uDD34"}</p>
              <p className="stat__label">Critical conditions first</p>
            </div>
            <div className="stat">
              <p className="stat__value">{"\uD83D\uDFE0"}</p>
              <p className="stat__label">Moderate cases next</p>
            </div>
            <div className="stat">
              <p className="stat__value">{"\uD83D\uDFE2"}</p>
              <p className="stat__label">Low urgency cases last</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Patient Input</p>
              <h3 className="panel__title">Submit symptoms</h3>
            </div>
          </div>
          <PatientForm />
        </div>

        <aside className="panel">
          <p className="panel__eyebrow">Severity Rules</p>
          <h3 className="panel__title">Current triage logic</h3>
          <p className="panel__text">
            Critical keywords include chest pain, bleeding, unconscious state, and
            breathing difficulty.
          </p>
          <p className="panel__text">
            Moderate keywords include fever, injury, and moderate pain.
          </p>
          <p className="panel__text">
            If none of the urgent rules match, the case is marked low priority for
            routine assessment.
          </p>
        </aside>
      </section>
    </>
  );
}

export default PatientInputPage;
