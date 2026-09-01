import { Inventory } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { emitStockUpdate } from '../sockets/stock.socket.js';

export function listPharmacyStock(pharmacyId) {
  return Inventory.find({ pharmacy: pharmacyId }).populate('medicine');
}

// Creates the stock line if the pharmacy has never carried this medicine.
export async function upsertStock(pharmacyId, { medicineId, quantity, price, expiryDate }) {
  const inventory = await Inventory.findOneAndUpdate(
    { pharmacy: pharmacyId, medicine: medicineId },
    { $set: { quantity, price, expiryDate } },
    { new: true, upsert: true }
  ).populate('medicine');

  emitStockUpdate({
    pharmacyId,
    medicineId,
    available: inventory.available,
    price: inventory.price
  });

  return inventory;
}

export async function removeStock(pharmacyId, inventoryId) {
  const inventory = await Inventory.findOneAndDelete({ _id: inventoryId, pharmacy: pharmacyId });
  if (!inventory) throw ApiError.notFound('Stock entry not found');

  emitStockUpdate({ pharmacyId, medicineId: inventory.medicine, available: 0 });
  return inventory;
}

export default { listPharmacyStock, upsertStock, removeStock };
