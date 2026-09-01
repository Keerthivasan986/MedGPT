import { Router } from 'express';
import * as pharmacyController from '../controllers/pharmacy.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createPharmacyRules } from '../validators/pharmacy.validator.js';

const router = Router();

router.get('/', pharmacyController.list);
router.get('/:id', pharmacyController.detail);
router.get('/:id/inventory', pharmacyController.inventory);
router.post(
  '/',
  requireAuth,
  requireRole('pharmacist'),
  validate(createPharmacyRules),
  pharmacyController.create
);

export default router;
