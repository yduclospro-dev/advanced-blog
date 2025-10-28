"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import LoginPresenter from "../presenters/LoginPresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import ClientOnly from "@/components/ClientOnly";

export default function LoginContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setToast({ message: "Inscription réussie ! Vous pouvez maintenant vous connecter.", type: "success" });
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);
    setIsLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      setToast({ message: "Veuillez remplir tous les champs.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setToast({ message: result.error || "Email ou mot de passe incorrect.", type: "error" });
        setIsLoading(false);
        return;
      }

      setToast({ message: "Connexion réussie !", type: "success" });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch {
      setToast({ message: "Une erreur est survenue. Veuillez réessayer.", type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <ClientOnly fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
          <p className="text-gray-600">Chargement...</p>
        </div>
      }>
        <LoginPresenter
          formData={formData}
          error=""
          successMessage=""
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleLogin}
        />
      </ClientOnly>
    </>
  );
}