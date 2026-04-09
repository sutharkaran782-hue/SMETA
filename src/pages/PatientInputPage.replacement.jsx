import PatientForm from "../components/PatientForm";

function PatientInputPage({ copy, formCopy }) {
  return (
    <>
      <section className="hero">
        <div className="hero__card">
          <span className="hero__eyebrow">{copy.eyebrow}</span>
          <div className="hero__content">
            <h2>{copy.title}</h2>
            <p>{copy.description}</p>
          </div>
        </div>

        <div className="hero__card hero__card--stats">
          <div className="stats">
            <div className="stat">
              <p className="stat__value" aria-hidden="true">
                {"\uD83D\uDEA8"}
              </p>
              <p className="stat__label">{copy.statCritical}</p>
            </div>
            <div className="stat">
              <p className="stat__value" aria-hidden="true">
                {"\uD83D\uDFE0"}
              </p>
              <p className="stat__label">{copy.statUrgent}</p>
            </div>
            <div className="stat">
              <p className="stat__value" aria-hidden="true">
                {"\uD83D\uDFE2"}
              </p>
              <p className="stat__label">{copy.statStable}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">{copy.intakeEyebrow}</p>
              <h3 className="panel__title">{copy.intakeTitle}</h3>
            </div>
          </div>
          <PatientForm copy={formCopy} />
        </div>

        <aside className="panel">
          <p className="panel__eyebrow">{copy.rulesEyebrow}</p>
          <h3 className="panel__title">{copy.rulesTitle}</h3>
          <p className="panel__text">{copy.rulesTextOne}</p>
          <p className="panel__text">{copy.rulesTextTwo}</p>
          <p className="panel__text">{copy.rulesTextThree}</p>
        </aside>
      </section>
    </>
  );
}

export default PatientInputPage;
