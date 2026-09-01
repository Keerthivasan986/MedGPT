import { body } from 'express-validator';
import { MEDICINE_FORMS } from '../models/Medicine.js';

export const createMedicineRules = [
  body('name').trim().notEmpty(),
  body('form').optional().isIn(MEDICINE_FORMS),
  body('prescriptionRequired').optional().isBoolean()
];
