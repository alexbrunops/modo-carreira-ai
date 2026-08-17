import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor para log
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ============================================
// ENDPOINTS
// ============================================

// Teams
export const teamsApi = {
    getAll: () => api.get('/teams'),
    // getById: (id) => api.get(`/teams/${id}`),
    getByName: (name) => api.get(`/teams/${name}`),
    create: (data) => api.post('/teams', data),
    update: (id, data) => api.put(`/teams/${id}`, data),
    delete: (id) => api.delete(`/teams/${id}`),
};

// Players
export const playersApi = {
    getAll: (params) => api.get('/players', { params }),
    // getById: (id) => api.get(`/players/${id}`),
    getByName: (name) => api.get(`/players/${name}`),
    create: (data) => api.post('/players', data),
    update: (id, data) => api.put(`/players/${id}`, data),
    delete: (id) => api.delete(`/players/${id}`),
};

// Managers
export const managersApi = {
    getAll: () => api.get('/managers'),
    getById: (id) => api.get(`/managers/${id}`),
    create: (data) => api.post('/managers', data),
    update: (id, data) => api.put(`/managers/${id}`, data),
    delete: (id) => api.delete(`/managers/${id}`),
};

// AI endpoints
export const aiApi = {
    getProviders: () => api.get('/ai/providers'),
    generate: (data) => api.post('/ai/generate', data),
    generateMultiple: (data) => api.post('/ai/generate-multiple', data),
};

// Accounts endpoints
export const accountsApi = {
    register: (data) => api.post('/accounts/register', data),
    login: (data) => api.post(`/accounts/login`, data),
    getProfile: () => api.get('/accounts/profile'),
    updateProfile: (data) => api.put('/accounts/profile', data),
    changePassword: (id, data) => api.put(`/accounts/${id}/change-password`, data),
    delete: (id) => api.delete(`/accounts/${id}`),
};

// // Events
// export const eventsApi = {
//     getAll: (params) => api.get('/events', { params }),
//     getById: (id) => api.get(`/events/${id}`),
//     create: (data) => api.post('/events', data),
//     delete: (id) => api.delete(`/events/${id}`),
//     clearAll: () => api.delete('/events'),
// };

// // Leagues
// export const leaguesApi = {
//     getAll: () => api.get('/leagues'),
//     getById: (id) => api.get(`/leagues/${id}`),
//     getTable: (id) => api.get(`/leagues/${id}/table`),
//     create: (data) => api.post('/leagues', data),
//     addTeam: (id, data) => api.post(`/leagues/${id}/table`, data),
// };

export default api;