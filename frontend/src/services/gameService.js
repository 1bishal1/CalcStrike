import api from './api';

export const gameService = {
  async startGame(difficulty) {
    return api.post('/game/start', { difficulty });
  },

  async submitAnswer(sessionId, answer) {
    return api.post(`/game/${sessionId}/answer`, { answer });
  },

  async stopGame(sessionId) {
    return api.post(`/game/${sessionId}/stop`);
  },

  async getStats() {
    return api.get('/game/stats');
  },

  async getHistory() {
    return api.get('/game/history');
  }
};
