import { Medicine, Pharmacy, Inventory } from '../models/index.js';
import env from '../config/env.js';
import { distanceKm, escapeRegex, nearSphere } from '../utils/geo.js';

// Helper: Check if pharmacy is currently open
function isPharmacyOpen(openingHours) {
  if (!openingHours) return null;
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  // Parse "9:00 AM - 10:00 PM" format
  const match = openingHours.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
  if (!match) return null;

  let openTime = parseInt(match[1]) * 60 + parseInt(match[2]);
  let closeTime = parseInt(match[4]) * 60 + parseInt(match[5]);

  if (match[3] && match[3].toUpperCase() === 'PM' && openTime < 720) openTime += 12 * 60;
  if (match[6] && match[6].toUpperCase() === 'PM' && closeTime < 720) closeTime += 12 * 60;

  const isOpen = currentTime >= openTime && currentTime < closeTime;
  const minutesUntilClose = Math.max(0, closeTime - currentTime);

  return { isOpen, minutesUntilClose, openTime, closeTime };
}

// Matches medicines by name/brand/composition, then ranks live stock by distance.
export async function searchMedicines({
  q,
  lat,
  lng,
  radiusKm = env.defaultRadiusKm,
  inStockOnly = true,
  sortBy = 'distance' // 'distance', 'price', 'available', 'cheapest'
}) {
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

  const results = stock
    .filter((item) => item.pharmacy && item.medicine)
    .map((item) => {
      const pharmacyStatus = isPharmacyOpen(item.pharmacy.openingHours);
      return {
        inventoryId: item._id,
        medicine: item.medicine,
        pharmacy: item.pharmacy,
        price: item.price,
        available: item.available,
        expiryDate: item.expiryDate,
        updatedAt: item.updatedAt,
        distanceKm: origin ? distanceKm(origin, item.pharmacy.location.coordinates) : null,
        pharmacyOpen: pharmacyStatus?.isOpen || false,
        minutesUntilClose: pharmacyStatus?.minutesUntilClose || null,
        isNearExpiry: item.expiryDate && new Date(item.expiryDate) - new Date() < 30 * 24 * 60 * 60 * 1000
      };
    });

  // Apply sorting
  results.sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'available':
        return b.available - a.available;
      case 'cheapest':
        return a.price - b.price; // Same as price
      case 'distance':
      default:
        if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
        return b.available - a.available;
    }
  });

  return results;
}

// Get generic/substitute medicines for a given medicine
export async function getGenericSubstitutes(medicineId) {
  const medicine = await Medicine.findById(medicineId).populate('generics');
  if (!medicine || !medicine.generics.length) return [];

  return medicine.generics;
}

// Find cheapest alternative for a medicine (same composition, different brand)
export async function getCheapestAlternative({ medicineId, pharmacyId, radiusKm = 10, lat, lng }) {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine || !medicine.composition) return null;

  const hasLocation = lat !== undefined && lng !== undefined;
  const origin = hasLocation ? [Number(lng), Number(lat)] : null;

  let pharmacyFilter = {};
  if (hasLocation && origin) {
    const nearby = await Pharmacy.find({ location: nearSphere(origin, radiusKm) }).select('_id');
    pharmacyFilter = { pharmacy: { $in: nearby.map((p) => p._id) } };
  }

  const alternatives = await Inventory.find({
    medicine: { $ne: medicineId },
    ...pharmacyFilter
  })
    .populate({
      path: 'medicine',
      match: { composition: medicine.composition }
    })
    .populate('pharmacy')
    .sort({ price: 1 })
    .limit(1);

  if (alternatives.length === 0 || !alternatives[0].medicine) return null;

  const alternative = alternatives[0];
  const savingsAmount = (alternative.price - (await Inventory.findOne({ medicine: medicineId, pharmacy: pharmacyId }))?.price) || 0;

  return {
    medicine: alternative.medicine,
    pharmacy: alternative.pharmacy,
    price: alternative.price,
    savings: Math.abs(savingsAmount),
    savingPercent: Math.abs((savingsAmount / alternative.price) * 100).toFixed(1)
  };
}

export default { searchMedicines, getGenericSubstitutes, getCheapestAlternative };
