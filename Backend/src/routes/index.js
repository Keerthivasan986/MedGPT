import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import pharmacyRoutes from './pharmacy.routes.js';
import medicineRoutes from './medicine.routes.js';
import inventoryRoutes from './inventory.routes.js';
import reservationRoutes from './reservation.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/pharmacies', pharmacyRoutes);
router.use('/medicines', medicineRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reservations', reservationRoutes);
router.use('/search', searchRoutes);

export default router;
