import axiosClient from './axiosClient.js';

export const fetchPharmacies = () => axiosClient.get('/pharmacies').then((res) => res.data.pharmacies);

export const fetchPharmacyInventory = (id) =>
  axiosClient.get(`/pharmacies/${id}/inventory`).then((res) => res.data.inventory);
