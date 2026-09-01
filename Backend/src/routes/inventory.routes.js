import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { upsertStockRules } from '../validators/inventory.validator.js';

const router = Router();

router.use(requireAuth, requireRole('pharmacist'));

router.get('/mine', inventoryController.mine);
router.put('/', validate(upsertStockRules), inventoryController.upsert);
router.delete('/:id', inventoryController.remove);

export default router;
