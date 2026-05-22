import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export async function signupUser(payload) {
  const response = await axios.post(`${API_BASE}/auth/signup/`, payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await axios.post(`${API_BASE}/auth/login/`, payload);
  return response.data;
}

export function logoutUser(setAuthToken, setUser) {
  localStorage.removeItem("evaluation_token");
  setAuthToken(null);
  setUser(null);
}

export async function getCurrentUser(token) {
  const response = await axios.get(`${API_BASE}/evaluations/current-user/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
}
