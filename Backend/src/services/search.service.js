import { Medicine, Pharmacy, Inventory } from '../models/index.js';
import env from '../config/env.js';
import { distanceKm, escapeRegex, nearSphere } from '../utils/geo.js';

// Matches medicines by name/brand/composition, then ranks live stock by distance.
export async function searchMedicines({ q, lat, lng, radiusKm = env.defaultRadiusKm, inStockOnly = true }) {
  const pattern = new RegExp(escapeRegex(q.trim()), 'i');
  const medicines = await Medicine.find({
    $or: [{ name: pattern }, { brand: pattern }, { composition: pattern }]
  }).limit(25);

  if (medicines.length === 0) return [];

  const hasLocation = lat !== undefined && lng !== undefined;
  const origin = hasLocation ? [Number(lng), Number(lat)] : null;

  let pharmacyFilter = {};
  if (hasLocation) {
    const nearby = await Pharmacy.find({ location: nearSphere(origin, radiusKm) }).select('_id');
    pharmacyFilter = { pharmacy: { $in: nearby.map((p) => p._id) } };
  }

  const query = { medicine: { $in: medicines.map((m) => m._id) }, ...pharmacyFilter };
  if (inStockOnly) query.quantity = { $gt: 0 };

  const stock = await Inventory.find(query).populate('pharmacy').populate('medicine');

  return stock
    .filter((item) => item.pharmacy && item.medicine)
    .map((item) => ({
      inventoryId: item._id,
      medicine: item.medicine,
      pharmacy: item.pharmacy,
      price: item.price,
      available: item.available,
      expiryDate: item.expiryDate,
      updatedAt: item.updatedAt,
      distanceKm: origin ? distanceKm(origin, item.pharmacy.location.coordinates) : null
    }))
    .sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      return b.available - a.available;
    });
}

export default { searchMedicines };
