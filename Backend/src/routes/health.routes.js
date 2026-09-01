import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MedGPT API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptimeSeconds: Math.round(process.uptime())
  });
});

export default router;
