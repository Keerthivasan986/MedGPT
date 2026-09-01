import axios from 'axios';
import { API_URL, TOKEN_KEY } from '../utils/constants.js';

const axiosClient = axios.create({ baseURL: `${API_URL}/api` });

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem(TOKEN_KEY);
    return Promise.reject(error);
  }
);

export default axiosClient;
