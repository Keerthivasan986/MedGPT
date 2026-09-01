import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createReservationRules, updateStatusRules } from '../validators/reservation.validator.js';

const router = Router();

router.use(requireAuth);

router.get('/mine', reservationController.mine);
router.post('/', validate(createReservationRules), reservationController.create);
router.patch('/:id/status', validate(updateStatusRules), reservationController.updateStatus);

export default router;
