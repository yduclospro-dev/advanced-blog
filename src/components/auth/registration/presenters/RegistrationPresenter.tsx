import Link from 'next/link'
import { Button, Input, Card } from '@/components/ui'

interface RegistrationFormData {
  username: string
  email: string
  password: string
}

interface RegistrationPresenterProps {
  formData: RegistrationFormData
  isLoading: boolean
  error: string
  onInputChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function RegistrationPresenter({
  formData,
  isLoading,
  error,
  onInputChange,
  onSubmit
}: RegistrationPresenterProps) {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors">
      <div className="w-full max-w-md">
        <Card variant="auth" padding="lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-slate-300">Créez votre compte</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              id="username"
              type="text"
              label="Nom d'utilisateur"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('username', e.target.value)}
              placeholder="john_doe"
              disabled={isLoading}
              variant="auth"
            />

            <Input
              id="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('email', e.target.value)}
              placeholder="john@example.com"
              disabled={isLoading}
              variant="auth"
            />

            <Input
              id="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('password', e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              variant="auth"
            />

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              fullWidth
              label={isLoading ? 'Inscription...' : "S'inscrire"}
            />
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-300">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
              Se connecter
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}