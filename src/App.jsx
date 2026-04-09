import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientInputPage from "./pages/PatientInputPage.replacement";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PatientInputPage />} />
        <Route path="/dashboard" element={<DoctorDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
