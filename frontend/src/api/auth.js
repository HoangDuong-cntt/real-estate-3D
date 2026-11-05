import api from './axios';

export const authApi = {
  register: (data) => api.post('/register', data),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getMe: () => api.get('/me'),
};

