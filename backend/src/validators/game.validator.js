import { body } from 'express-validator';

export const startGameValidation = [
  body('difficulty')
    .optional()
    .customSanitizer(val => (val ? val.toLowerCase() : 'easy'))
    .isIn(['easy', 'medium', 'hard', 'difficult'])
    .withMessage('Difficulty must be easy, medium, or difficult')
];

export const submitAnswerValidation = [
  body('answer').optional()
];
