const AUTH_ROLE_KEY = "role";
const DOCTOR_ROLE = "doctor";
const DOCTOR_EMAIL = "doctor@hospital.com";
const DOCTOR_PASSWORD = "123456";

export function getRole() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(AUTH_ROLE_KEY);
}

export function isDoctorAuthenticated() {
  return getRole() === DOCTOR_ROLE;
}

export function loginDoctor(email, password) {
  if (email === DOCTOR_EMAIL && password === DOCTOR_PASSWORD) {
    window.localStorage.setItem(AUTH_ROLE_KEY, DOCTOR_ROLE);
    return true;
  }
  return false;
}

export function logoutDoctor() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_ROLE_KEY);
  }
}
