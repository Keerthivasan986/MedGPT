import { body } from 'express-validator';

export const createReservationRules = [
  body('inventoryId').notEmpty(),
  body('quantity').isInt({ min: 1 })
];

export const updateStatusRules = [body('status').isIn(['collected', 'cancelled'])];
