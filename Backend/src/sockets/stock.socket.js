import { getIO } from './io.js';
import { PHARMACY_ROOM, STOCK_UPDATED } from './events.js';

// A pharmacist dashboard can subscribe to just its own pharmacy's stock stream.
export default function registerStockHandlers(io, socket) {
  socket.on('pharmacy:subscribe', (pharmacyId) => socket.join(PHARMACY_ROOM(pharmacyId)));
  socket.on('pharmacy:unsubscribe', (pharmacyId) => socket.leave(PHARMACY_ROOM(pharmacyId)));
}

export function emitStockUpdate(payload) {
  const io = getIO();
  io.emit(STOCK_UPDATED, payload);
  io.to(PHARMACY_ROOM(payload.pharmacyId)).emit(STOCK_UPDATED, payload);
}
