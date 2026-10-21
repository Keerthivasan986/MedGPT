import { Router } from 'express';
import * as searchController from '../controllers/search.controller.js';
import validate from '../middleware/validate.middleware.js';
import { searchRules } from '../validators/search.validator.js';

const router = Router();

router.get('/', validate(searchRules), searchController.search);
router.get('/substitutes/:medicineId', searchController.getSubstitutes);
router.get('/cheapest/:medicineId/:pharmacyId', searchController.getCheapestAlternative);

export default router;
