import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/User";
import axios from "axios";

interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface UserState {
  users: User[];
  addUser: (user: User) => boolean;
  getUserByEmail: (email: string) => User | undefined;
  getAllUsers: () => User[];
  checkIfUsernameOrEmailExists: (username: string, email: string) => boolean;
  
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const userStoreCreator: StateCreator<UserState, [], [], UserState> = (set, get) => ({
  users: [],
  currentUser: null,
  isAuthenticated: false,

  addUser: (user: User) => {
    if (!user.id || !user.username || !user.email || !user.password) return false
    set((state) => ({ users: [...state.users, user] }))
    return true
  },
  
  getUserByEmail: (email: string) =>
    get().users.find((u) => u.email === email),
  
  getAllUsers: () => get().users,
  
  checkIfUsernameOrEmailExists: (username: string, email: string) =>
    get().users.some(user => user.username === username || user.email === email),

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/login', { email, password });

      if (response.status !== 200) {
        return { success: false, error: response.data?.error || "Erreur lors de la connexion" };
      }

      set({
        isAuthenticated: true
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
    set({ isAuthenticated: false });
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/register', {
        username,
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
  }
});

export const useUserStore = create<UserState>()(
  persist(userStoreCreator, {
    name: "users-storage",
    storage: createJSONStorage(() => localStorage),
  })
);