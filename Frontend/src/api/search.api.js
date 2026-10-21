import axiosClient from './axiosClient.js';

export const searchMedicines = ({ q, lat, lng, radiusKm, sortBy = 'distance' }) =>
  axiosClient
    .get('/search', { params: { q, lat, lng, radiusKm, sortBy } })
    .then((res) => res.data.results);

export const getSubstitutes = (medicineId) =>
  axiosClient.get(`/search/substitutes/${medicineId}`).then((res) => res.data.substitutes);

export const getCheapestAlternative = (medicineId, pharmacyId, { lat, lng, radiusKm }) =>
  axiosClient
    .get(`/search/cheapest/${medicineId}/${pharmacyId}`, { params: { lat, lng, radiusKm } })
    .then((res) => res.data.alternative);
