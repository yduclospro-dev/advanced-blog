"use client";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordPresenterProps {
  formData: ResetPasswordFormData;
  isLoading: boolean;
  resetSuccess: boolean;
  hasToken: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ResetPasswordPresenter({
  formData,
  isLoading,
  resetSuccess,
  hasToken,
  onInputChange,
  onSubmit,
}: ResetPasswordPresenterProps) {
  if (!hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors">
        <div className="w-full max-w-md">
          <Card variant="auth" padding="lg">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Lien invalide
              </h1>
              <p className="text-gray-600 dark:text-slate-300 mb-6">
                Ce lien de réinitialisation est invalide ou a expiré.
              </p>
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Demander un nouveau lien →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors">
      <div className="w-full max-w-md">
        <Card variant="auth" padding="lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600 dark:text-slate-300">
              {resetSuccess
                ? "Redirection vers la connexion..."
                : "Choisissez un nouveau mot de passe sécurisé"}
            </p>
          </div>

          {!resetSuccess ? (
            <form onSubmit={onSubmit} className="space-y-6">
              <Input
                id="newPassword"
                type="password"
                label="Nouveau mot de passe"
                placeholder="Min. 6 caractères"
                value={formData.newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onInputChange("newPassword", e.target.value)
                }
                variant="auth"
                disabled={isLoading}
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirmer le mot de passe"
                placeholder="Retapez votre mot de passe"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onInputChange("confirmPassword", e.target.value)
                }
                variant="auth"
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
                label={isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              />

              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <p className="text-green-800 dark:text-green-300 mb-2">
                Votre mot de passe a été réinitialisé avec succès !
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
