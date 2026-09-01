import { body } from 'express-validator';

export const upsertStockRules = [
  body('medicineId').notEmpty().withMessage('medicineId is required'),
  body('quantity').isInt({ min: 0 }).withMessage('quantity must be 0 or more'),
  body('price').isFloat({ min: 0 }).withMessage('price must be 0 or more'),
  body('expiryDate').optional({ nullable: true }).isISO8601()
];
