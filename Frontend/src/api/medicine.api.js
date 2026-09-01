import axiosClient from './axiosClient.js';

export const fetchMedicines = (q) =>
  axiosClient.get('/medicines', { params: q ? { q } : {} }).then((res) => res.data.medicines);
