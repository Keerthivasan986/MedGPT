import axiosClient from './axiosClient.js';

export const fetchMyReservations = () =>
  axiosClient.get('/reservations/mine').then((res) => res.data.reservations);

export const createReservation = (inventoryId, quantity) =>
  axiosClient.post('/reservations', { inventoryId, quantity }).then((res) => res.data.reservation);

export const updateReservationStatus = (id, status) =>
  axiosClient.patch(`/reservations/${id}/status`, { status }).then((res) => res.data.reservation);
