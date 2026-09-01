import mongoose from 'mongoose';
import env from '../config/env.js';

export const RESERVATION_STATUSES = ['pending', 'collected', 'cancelled', 'expired'];

const reservationSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: RESERVATION_STATUSES, default: 'pending' },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + env.reservationWindowHours * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);

export default mongoose.model('Reservation', reservationSchema);
