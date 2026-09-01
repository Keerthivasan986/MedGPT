import { Pharmacy, Inventory } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { nearSphere } from '../utils/geo.js';

export function listPharmacies({ lat, lng, radiusKm = 5 }) {
  if (lat !== undefined && lng !== undefined) {
    return Pharmacy.find({ location: nearSphere([lng, lat], radiusKm) });
  }
  return Pharmacy.find().sort({ name: 1 });
}

export async function getPharmacy(id) {
  const pharmacy = await Pharmacy.findById(id);
  if (!pharmacy) throw ApiError.notFound('Pharmacy not found');
  return pharmacy;
}

export function getPharmacyInventory(pharmacyId) {
  return Inventory.find({ pharmacy: pharmacyId }).populate('medicine');
}

export function createPharmacy(payload) {
  return Pharmacy.create(payload);
}

export default { listPharmacies, getPharmacy, getPharmacyInventory, createPharmacy };
