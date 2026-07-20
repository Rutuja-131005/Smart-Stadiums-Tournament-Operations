import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const role = localStorage.getItem('simulated_role') || 'admin';
  config.headers['X-Simulated-Role'] = role;
  return config;
});

export const authAPI = {
  updateAccessibility: (data) => Promise.resolve({ data: { success: true } }),
  updateLanguage: (lang) => Promise.resolve({ data: { success: true } }),
};

export const stadiumAPI = {
  getAll: () => api.get('/stadiums'),
  getById: (id) => api.get(`/stadiums/${id}`),
  getZones: (id) => api.get(`/stadiums/${id}/zones`),
};

export const matchAPI = {
  getAll: (params) => api.get('/matches', { params }),
  getLive: () => api.get('/matches/live'),
  getById: (id) => api.get(`/matches/${id}`),
};

export const crowdAPI = {
  getByStadium: (id) => api.get(`/crowd/stadium/${id}`),
  getHeatmap: (id) => api.get(`/crowd/stadium/${id}/heatmap`),
  getRouteRecommendation: (data) => api.post('/crowd/route-recommendation', data),
};

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  translate: (data) => api.post('/ai/translate', data),
  navigate: (data) => api.post('/ai/navigate', data),
};

export const transportAPI = {
  getByStadium: (id) => api.get(`/transport/stadium/${id}`),
  getPlan: (id, params) => api.get(`/transport/stadium/${id}/plan`, { params }),
};

export const volunteerAPI = {
  getTasks: (params) => api.get('/volunteer/tasks', { params }),
  updateTask: (id, data) => api.patch(`/volunteer/tasks/${id}`, data),
  askKnowledge: (question) => api.post('/volunteer/knowledge', { question }),
  getAnnouncements: () => api.get('/volunteer/announcements'),
};

export const organizerAPI = {
  getKPIs: (stadiumId) => api.get(`/organizer/kpis/${stadiumId}`),
  getSummary: (stadiumId) => api.get(`/organizer/summary/${stadiumId}`),
  getIncidents: (params) => api.get('/organizer/incidents', { params }),
  createIncident: (data) => api.post('/organizer/incidents', data),
  updateIncident: (id, data) => api.patch(`/organizer/incidents/${id}`, data),
};

export const securityAPI = {
  getAlerts: (stadiumId) => api.get(`/security/alerts/${stadiumId}`),
  getEvacuationPlan: (data) => api.post('/security/evacuation-plan', data),
  getWorkflows: () => api.get('/security/workflows'),
};

export const sustainabilityAPI = {
  getByStadium: (id) => api.get(`/sustainability/stadium/${id}`),
  getLatest: (id) => api.get(`/sustainability/stadium/${id}/latest`),
  getSuggestions: (id) => api.post(`/sustainability/stadium/${id}/suggestions`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  getReports: (params) => api.get('/notifications/reports', { params }),
  generateReport: (data) => api.post('/notifications/reports/generate', data),
};

export default api;
