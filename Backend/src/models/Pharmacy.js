import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    openingHours: { type: String, default: '9:00 AM - 10:00 PM' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [longitude, latitude]
    }
  },
  { timestamps: true }
);

pharmacySchema.index({ location: '2dsphere' });

export default mongoose.model('Pharmacy', pharmacySchema);
