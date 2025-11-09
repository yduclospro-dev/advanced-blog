import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    const status = error.response?.status;
    
    if (status === 401 && !url.includes('/login')) {
      // trigger logout and wait for it to complete
      return useUserStore.getState().logout().then(() => Promise.reject(error));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;