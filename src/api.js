import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

export function authHeaders(token) {
  return { Authorization: `Token ${token}` };
}

export function fetchEvaluations(token) {
  return axios.get(`${API_BASE}/evaluations/`, { headers: authHeaders(token) }).then((res) => res.data);
}

export function createEvaluation(token, payload) {
  return axios.post(`${API_BASE}/evaluations/`, payload, { headers: authHeaders(token) }).then((res) => res.data);
}

export function updateEvaluation(token, evaluationId, payload) {
  return axios.patch(`${API_BASE}/evaluations/${evaluationId}/`, payload, { headers: authHeaders(token) }).then((res) => res.data);
}

export function deleteEvaluation(token, evaluationId) {
  return axios.delete(`${API_BASE}/evaluations/${evaluationId}/`, { headers: authHeaders(token) });
}
