import { Router } from 'express';
import * as searchController from '../controllers/search.controller.js';
import validate from '../middleware/validate.middleware.js';
import { searchRules } from '../validators/search.validator.js';

const router = Router();

router.get('/', validate(searchRules), searchController.search);

export default router;
