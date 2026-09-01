import { Router } from 'express';
import * as medicineController from '../controllers/medicine.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createMedicineRules } from '../validators/medicine.validator.js';

const router = Router();

router.get('/', medicineController.list);
router.post(
  '/',
  requireAuth,
  requireRole('pharmacist'),
  validate(createMedicineRules),
  medicineController.create
);

export default router;
