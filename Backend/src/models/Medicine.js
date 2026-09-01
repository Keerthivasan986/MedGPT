import mongoose from 'mongoose';

export const MEDICINE_FORMS = ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops'];

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    composition: { type: String, trim: true },
    form: { type: String, enum: MEDICINE_FORMS, default: 'tablet' },
    strength: { type: String, trim: true },
    prescriptionRequired: { type: Boolean, default: false }
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', brand: 'text', composition: 'text' });

export default mongoose.model('Medicine', medicineSchema);
