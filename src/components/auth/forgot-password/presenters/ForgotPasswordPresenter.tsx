"use client";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";

interface ForgotPasswordPresenterProps {
  email: string;
  isLoading: boolean;
  emailSent: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
}

export default function ForgotPasswordPresenter({
  email,
  isLoading,
  emailSent,
  onEmailChange,
  onSubmit,
  onResend,
}: ForgotPasswordPresenterProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors">
      <div className="w-full max-w-md">
        <Card variant="auth" padding="lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600 dark:text-slate-300">
              {emailSent 
                ? "Vérifiez votre boîte mail"
                : "Entrez votre email pour recevoir un lien de réinitialisation"}
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={onSubmit} className="space-y-6">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
                variant="auth"
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
                label={isLoading ? "Envoi en cours..." : "Envoyer le lien"}
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
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-300">
                  Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques instants.
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                  Le lien expirera dans 1 heure.
                </p>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Vous n'avez pas reçu l'email ?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  disabled={isLoading}
                  onClick={onResend}
                  label={isLoading ? "Envoi en cours..." : "Renvoyer le lien"}
                />
                <Link 
                  href="/login" 
                  className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
