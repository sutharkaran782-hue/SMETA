import { Navigate } from "react-router-dom";
import { isDoctorAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }) {
  return isDoctorAuthenticated() ? children : <Navigate to="/doctor-login" replace />;
}

export default ProtectedRoute;
