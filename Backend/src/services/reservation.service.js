import { Inventory, Reservation } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { generateReservationCode } from '../utils/reservationCode.js';
import { emitStockUpdate } from '../sockets/stock.socket.js';

export function listReservationsFor(user) {
  const filter = user.role === 'pharmacist' ? { pharmacy: user.pharmacy } : { patient: user._id };
  return Reservation.find(filter)
    .sort({ createdAt: -1 })
    .populate('medicine')
    .populate('pharmacy')
    .populate('patient', 'name phone');
}

// Holds units against the stock line so two patients cannot claim the same pack.
export async function createReservation(user, { inventoryId, quantity }) {
  const inventory = await Inventory.findById(inventoryId);
  if (!inventory) throw ApiError.notFound('Stock entry not found');
  if (inventory.available < quantity) {
    throw ApiError.conflict(`Only ${inventory.available} unit(s) available`);
  }

  inventory.reserved += quantity;
  await inventory.save();

  const reservation = await Reservation.create({
    code: generateReservationCode(),
    patient: user._id,
    pharmacy: inventory.pharmacy,
    medicine: inventory.medicine,
    quantity
  });

  emitStockUpdate({
    pharmacyId: inventory.pharmacy,
    medicineId: inventory.medicine,
    available: inventory.available
  });

  return reservation;
}

export async function updateReservationStatus(user, reservationId, status) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) throw ApiError.notFound('Reservation not found');

  const ownsReservation =
    user.role === 'pharmacist'
      ? String(reservation.pharmacy) === String(user.pharmacy)
      : String(reservation.patient) === String(user._id);
  if (!ownsReservation) throw ApiError.forbidden();
  if (reservation.status !== 'pending') {
    throw ApiError.conflict(`Reservation already ${reservation.status}`);
  }

  const inventory = await Inventory.findOne({
    pharmacy: reservation.pharmacy,
    medicine: reservation.medicine
  });

  if (inventory) {
    inventory.reserved = Math.max(inventory.reserved - reservation.quantity, 0);
    if (status === 'collected') {
      inventory.quantity = Math.max(inventory.quantity - reservation.quantity, 0);
    }
    await inventory.save();
    emitStockUpdate({
      pharmacyId: inventory.pharmacy,
      medicineId: inventory.medicine,
      available: inventory.available
    });
  }

  reservation.status = status;
  await reservation.save();
  return reservation;
}

export default { listReservationsFor, createReservation, updateReservationStatus };
