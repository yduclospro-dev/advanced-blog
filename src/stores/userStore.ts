import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import { UserRole } from "@prisma/client";
import { isAxiosError } from "axios";
import { useUiStore } from "./uiStore";

interface AuthUser {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
}

interface UserState {
  currentUser: AuthUser | null;
  token: string | null;

  initializeAuth: () => Promise<void>;
  fetchCurrentUser: () => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (userName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const userStoreCreator: StateCreator<UserState, [], [], UserState> = (set, get) => ({
  currentUser: null,
  token: null,

  initializeAuth: async () => {
    const token = get().token;
    
    if (!token) {
      useUiStore.getState().setLoading('auth', false);
      return;
    }

    useUiStore.getState().setLoading('auth', true);
    const result = await get().fetchCurrentUser();
    
    if (!result.success) {
      set({ 
        token: null, 
        currentUser: null
      });
      localStorage.removeItem('token-storage');
      useUiStore.getState().setLoading('auth', false);
      return;
    }
    
    set({ 
      currentUser: result.user
    });
    useUiStore.getState().setLoading('auth', false);
  },

  fetchCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/me');
      
      if (response.status !== 200) {
        return { success: false, error: "Erreur lors de la récupération de l'utilisateur authentifié" };
      }

      return { 
        success: true, 
        user: {
          id: response.data.id,
          email: response.data.email,
          userName: response.data.userName,
          role: response.data.role
        }
      };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return { success: false, error: err.response?.data?.message || "Erreur lors de la récupération de l'utilisateur" };
      }
      return { success: false, error: "Erreur réseau ou serveur" };
    }
  },

  register: async (userName: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/register', {
        userName,
        email,
        password
      });
      if (response.status !== 201 && response.status !== 200) {
        return { success: false, error: response.data?.message || "Erreur lors de l'inscription" };
      }
      return { success: true };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return { success: false, error: err.response?.data?.message || "Erreur lors de l'inscription" };
      }
      return { success: false, error: "Erreur réseau ou serveur" };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const loginResponse = await axiosInstance.post('/login', { email, password });
      
      if (loginResponse.status !== 200) {
        return { success: false, error: loginResponse.data?.message };
      }

      const token = loginResponse.data.token;
      
      set({ token });

      const currentUserRequest = await get().fetchCurrentUser();
      if (!currentUserRequest.success) {
        set({ token: null });
        return { success: false, error: currentUserRequest.error };
      }

      set({ 
        currentUser: currentUserRequest.user
      });

      return { success: true };
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        return { success: false, error: err.response?.data?.message || "Email ou mot de passe incorrect" };
      }
      return { success: false, error: "Erreur réseau ou serveur" };
    }
  },

  logout: () => {
    set({ 
      currentUser: null, 
      token: null
    });
    
    localStorage.removeItem('token-storage');
  },
});

export const useUserStore = create<UserState>()(
  persist(
    userStoreCreator,
    {
      name: 'token-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);