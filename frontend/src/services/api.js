import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOnlineCount = () => api.get('/online');
export const getQuestions = () => api.get('/questions');
export const getMatch = (id) => api.get(`/match/${id}`);
export const healthCheck = () => api.get('/health');

export default api;
