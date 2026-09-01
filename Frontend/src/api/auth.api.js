import axiosClient from './axiosClient.js';

export const loginRequest = (email, password) =>
  axiosClient.post('/auth/login', { email, password }).then((res) => res.data);

export const registerRequest = (payload) =>
  axiosClient.post('/auth/register', payload).then((res) => res.data);

export const fetchCurrentUser = () => axiosClient.get('/auth/me').then((res) => res.data.user);
