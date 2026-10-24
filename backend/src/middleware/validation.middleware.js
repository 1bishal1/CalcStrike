import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstMsg = errors.array()[0]?.msg || 'Validation failed';
    return res.status(400).json({
      error: firstMsg,
      errors: errors.array()
    });
  }
  next();
};
