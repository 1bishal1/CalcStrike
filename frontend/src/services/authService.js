import api from './api';

export const authService = {
  async signup(userData) {
    return api.post('/auth/signup', userData);
  },

  async login(username, password, rememberMe = false) {
    return api.post('/auth/login', { username, password, rememberMe });
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async getCurrentUser() {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      return null;
    }
  }
};
