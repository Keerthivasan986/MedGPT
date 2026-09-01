import axiosClient from './axiosClient.js';

export const searchMedicines = ({ q, lat, lng, radiusKm }) =>
  axiosClient.get('/search', { params: { q, lat, lng, radiusKm } }).then((res) => res.data.results);
