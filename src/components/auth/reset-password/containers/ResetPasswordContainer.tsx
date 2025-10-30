"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResetPasswordPresenter from "../presenters/ResetPasswordPresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import axios from "axios";

export default function ResetPasswordContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setToast({ message: "Token invalide ou manquant.", type: "error" });
    }
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);
    setIsLoading(true);

    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      setToast({ message: "Veuillez remplir tous les champs.", type: "error" });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setToast({
        message: "Le mot de passe doit contenir au moins 6 caractères.",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ message: "Les mots de passe ne correspondent pas.", type: "error" });
      setIsLoading(false);
      return;
    }

    if (!token) {
      setToast({ message: "Token invalide.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("/api/password/reset", {
        token,
        newPassword: formData.newPassword,
      });

      setResetSuccess(true);
      setToast({
        message: "Mot de passe réinitialisé avec succès !",
        type: "success",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Une erreur est survenue. Veuillez réessayer.";
      setToast({ message: errorMessage, type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      <ResetPasswordPresenter
        formData={formData}
        isLoading={isLoading}
        resetSuccess={resetSuccess}
        hasToken={!!token}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
