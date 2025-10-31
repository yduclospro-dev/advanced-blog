import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🎯 Intercepteur REQUEST - Ajoute automatiquement le token depuis Zustand
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Récupère le token depuis le store Zustand (pas localStorage)
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

// 🎯 Intercepteur RESPONSE - Gère les erreurs d'authentification
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    const status = error.response?.status;
    
    // ⚠️ NE PAS logout si c'est une erreur 401 sur /login (credentials incorrects)
    if (status === 401 && !url.includes('/login')) {
      useUserStore.getState().logout();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;