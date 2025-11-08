"use client";

import { create } from "zustand";

interface LoadingState {
  articles: boolean;
  auth: boolean;
  [key: string]: boolean;
}

interface UiStore {
  loading: LoadingState;
  setLoading: (key: keyof LoadingState | string, value: boolean) => void;
  isLoading: (key: keyof LoadingState | string) => boolean;
}

export const useUiStore = create<UiStore>()((set, get) => ({
  loading: {
    articles: false,
    auth: false,
  },

  setLoading: (key, value) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      },
    }));
  },

  isLoading: (key) => {
    return get().loading[key] || false;
  },
}));
