import { body } from 'express-validator';

export const createPharmacyRules = [
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('licenseNumber').trim().notEmpty(),
  body('location.coordinates').isArray({ min: 2, max: 2 })
];
