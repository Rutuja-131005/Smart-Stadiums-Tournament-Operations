import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateAccessibility: (data) => api.patch('/auth/me/accessibility', data),
  updateLanguage: (lang) => api.patch('/auth/me/language', { language: lang }),
  importExcel: (formData) => api.post('/auth/import-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
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
