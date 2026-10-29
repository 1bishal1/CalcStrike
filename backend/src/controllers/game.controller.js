import gameService from '../services/game.service.js';

export class GameController {
  async startGame(req, res, next) {
    try {
      const { difficulty } = req.body;
      const userId = req.session.userId;
      const result = await gameService.startGame(userId, difficulty || 'easy');
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async submitAnswer(req, res, next) {
    try {
      const sessionId = req.params.sessionId || req.body.sessionId;
      const { answer } = req.body;
      const userId = req.session.userId;
      const result = await gameService.submitAnswer(userId, sessionId, answer);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async stopGame(req, res, next) {
    try {
      const sessionId = req.params.sessionId || req.body.sessionId;
      const userId = req.session.userId;
      const result = await gameService.stopGame(userId, sessionId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStats(req, res, next) {
    try {
      const userId = req.session.userId;
      const stats = gameService.getStats(userId);
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHistory(req, res, next) {
    try {
      const userId = req.session.userId;
      const history = gameService.getHistory(userId);
      res.json({ history });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GameController();
