"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useUserStore((state) => state.initializeAuth);
  const isLoading = useUserStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
}