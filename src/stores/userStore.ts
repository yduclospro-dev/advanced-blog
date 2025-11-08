import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/User";
import axiosInstance from "../utils/axios";
import { UserRole } from "@prisma/client";
import axios from "axios";

interface AuthUser {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
}

interface UserState {
  users: User[];
  currentUser: AuthUser | null;
  token: string | null;
  isLoading: boolean;

  initializeAuth: () => Promise<void>;
  fetchCurrentUser: () => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  getAllUsers: () => User[];
  register: (userName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const userStoreCreator: StateCreator<UserState, [], [], UserState> = (set, get) => ({
  users: [],
  currentUser: null,
  token: null,
  isLoading: false,

  initializeAuth: async () => {
    const token = get().token;
    
    if (!token) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    const result = await get().fetchCurrentUser();
    
    if (!result.success) {
      set({ 
        token: null, 
        currentUser: null, 
        isLoading: false 
      });
      localStorage.removeItem('token-storage');
      return;
    }
    
    set({ 
      currentUser: result.user,
      isLoading: false 
    });
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
      if (axios.isAxiosError(err)) {
        return { success: false, error: err.response?.data?.error || "Erreur lors de la récupération de l'utilisateur" };
      }
      return { success: false, error: "Erreur réseau ou serveur" };
    }
  },

  getAllUsers: () => get().users,

  register: async (userName: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/register', {
        userName,
        email,
        password
      });
      if (response.status !== 201 && response.status !== 200) {
        return { success: false, error: response.data?.error || "Erreur lors de l'inscription" };
      }
      return { success: true };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return { success: false, error: err.response?.data?.error };
      }
      return { success: false, error: "Erreur réseau ou serveur" };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const loginResponse = await axiosInstance.post('/login', { email, password });
      
      if (loginResponse.status !== 200) {
        return { success: false, error: loginResponse.data?.error };
      }

      const token = loginResponse.data.token;
      
      // Store token in state (will be persisted via middleware)
      set({ token });

      // Fetch current user with the new token
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
      if (axios.isAxiosError(err)) {
        return { success: false, error: err.response?.data?.error };
      }
      return { success: false, error: "Erreur réseau ou serveur" };
    }
  },

  logout: () => {
    set({ 
      currentUser: null, 
      token: null
    });
    
    // Manually remove from localStorage to ensure clean logout
    localStorage.removeItem('token-storage');
  },
});

export const useUserStore = create<UserState>()(
  persist(
    userStoreCreator,
    {
      name: 'token-storage',
      // Only persist the token, not the user data or users list
      partialize: (state) => ({ token: state.token }),
    }
  )
);