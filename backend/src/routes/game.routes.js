import express from 'express';
import gameController from '../controllers/game.controller.js';
import { startGameValidation, submitAnswerValidation } from '../validators/game.validator.js';
import { validate } from '../middleware/validation.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/start', startGameValidation, validate, gameController.startGame);
router.post('/:sessionId/answer', submitAnswerValidation, validate, gameController.submitAnswer);
router.post('/:sessionId/stop', gameController.stopGame);
router.post('/answer', submitAnswerValidation, validate, gameController.submitAnswer);
router.get('/stats', gameController.getStats);
router.get('/history', gameController.getHistory);

export default router;
