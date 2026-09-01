import { Medicine } from '../models/index.js';
import { escapeRegex } from '../utils/geo.js';

export function listMedicines(q) {
  const filter = q ? { name: new RegExp(escapeRegex(q), 'i') } : {};
  return Medicine.find(filter).sort({ name: 1 }).limit(100);
}

export function createMedicine(payload) {
  return Medicine.create(payload);
}

export default { listMedicines, createMedicine };
