import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginDoctor } from "../utils/auth";

function DoctorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const authenticated = loginDoctor(email.trim(), password);
    if (authenticated) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setError("Unauthorized Access");
  }

  return (
    <section className="panel" style={{ maxWidth: 520, margin: "0 auto" }}>
      <div className="panel__header" style={{ marginBottom: 24 }}>
        <div>
          <p className="panel__eyebrow">Doctor Login</p>
          <h2 className="dashboard-title">Secure doctor access</h2>
          <p className="dashboard-subtitle">
            Use your hospital credentials to review the live emergency queue.
          </p>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="doctor-email">Email</label>
          <input
            id="doctor-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="doctor@hospital.com"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="doctor-password">Password</label>
          <input
            id="doctor-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error ? <div className="message message--error">{error}</div> : null}

        <button className="button" type="submit">
          Login
        </button>
      </form>
    </section>
  );
}

export default DoctorLoginPage;
