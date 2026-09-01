import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';

export const ROLES = ['patient', 'pharmacist'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: 'patient' },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' }
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, env.bcryptRounds);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toJSON = function toJSON() {
  const { _id, name, email, phone, role, pharmacy } = this;
  return { id: _id, name, email, phone, role, pharmacy };
};

export default mongoose.model('User', userSchema);
