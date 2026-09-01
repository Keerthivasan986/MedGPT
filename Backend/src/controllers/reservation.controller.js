import asyncHandler from '../utils/asyncHandler.js';
import * as reservationService from '../services/reservation.service.js';

export const mine = asyncHandler(async (req, res) => {
  res.json({ reservations: await reservationService.listReservationsFor(req.user) });
});

export const create = asyncHandler(async (req, res) => {
  const reservation = await reservationService.createReservation(req.user, req.body);
  res.status(201).json({ reservation });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateReservationStatus(
    req.user,
    req.params.id,
    req.body.status
  );
  res.json({ reservation });
});
