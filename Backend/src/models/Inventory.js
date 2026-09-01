import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reserved: { type: Number, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date }
  },
  { timestamps: true }
);

inventorySchema.index({ pharmacy: 1, medicine: 1 }, { unique: true });

// Units a patient can actually reserve right now.
inventorySchema.virtual('available').get(function available() {
  return Math.max(this.quantity - this.reserved, 0);
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

export default mongoose.model('Inventory', inventorySchema);
