import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
const cleanApiUrl = rawApiUrl.replace(/\/$/, "");
const API_BASE = cleanApiUrl.endsWith("/api") ? cleanApiUrl : `${cleanApiUrl}/api`;

function unwrapList(data) {
  return Array.isArray(data) ? data : data?.results ?? [];
}

export function authHeaders(token) {
  return { Authorization: `Token ${token}` };
}

export function fetchEvaluations(token) {
  return axios
    .get(`${API_BASE}/evaluations/`, { headers: authHeaders(token) })
    .then((res) => unwrapList(res.data));
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
