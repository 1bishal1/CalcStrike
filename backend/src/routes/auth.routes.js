import express from 'express';
import authController from '../controllers/auth.controller.js';
import { signupValidation, loginValidation } from '../validators/auth.validator.js';
import { validate } from '../middleware/validation.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupValidation, validate, authController.signup);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', authController.me);

export default router;
