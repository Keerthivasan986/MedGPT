import { body } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'pharmacist'])
];

export const loginRules = [body('email').isEmail(), body('password').notEmpty()];
