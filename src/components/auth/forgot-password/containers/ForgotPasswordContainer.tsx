"use client";
import { useState } from "react";
import ForgotPasswordPresenter from "../presenters/ForgotPasswordPresenter";
import { Toast } from "@/components/ui";
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import axios from "axios";

export default function ForgotPasswordContainer() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);
    setIsLoading(true);

    if (!email.trim()) {
      setToast({ message: "Veuillez entrer votre email.", type: "error" });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({ message: "Veuillez entrer un email valide.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("/api/password/forgot", { email });
      
      setEmailSent(true);
      setToast({ 
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.", 
        type: "success" 
      });
    } catch (error) {
      setToast({ 
        message: "Une erreur est survenue. Veuillez réessayer.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setToast(null);
    setIsLoading(true);

    try {
      await axios.post("/api/password/forgot", { email });
      
      setToast({ 
        message: "Un nouveau lien de réinitialisation a été envoyé.", 
        type: "success" 
      });
    } catch (error) {
      setToast({ 
        message: "Une erreur est survenue. Veuillez réessayer.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ForgotPasswordPresenter
        email={email}
        isLoading={isLoading}
        emailSent={emailSent}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
        onResend={handleResend}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
