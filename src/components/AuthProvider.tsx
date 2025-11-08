"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useUiStore } from "@/stores/uiStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useUserStore((state) => state.initializeAuth);
  const isLoading = useUiStore((state) => state.isLoading('auth'));

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
}