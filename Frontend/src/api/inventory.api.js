import axiosClient from './axiosClient.js';

export const fetchMyInventory = () => axiosClient.get('/inventory/mine').then((res) => res.data.inventory);

export const saveStock = (payload) => axiosClient.put('/inventory', payload).then((res) => res.data.inventory);

export const deleteStock = (id) => axiosClient.delete(`/inventory/${id}`).then((res) => res.data);
