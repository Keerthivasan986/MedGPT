import { query } from 'express-validator';

export const searchRules = [
  query('q').trim().notEmpty().withMessage('Query parameter "q" is required'),
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lng').optional().isFloat({ min: -180, max: 180 }),
  query('radiusKm').optional().isFloat({ min: 0.1, max: 100 })
];
