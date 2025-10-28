'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui'

interface ForbiddenAccessProps {
  message?: string
}

export default function ForbiddenAccess({ 
  message = "Vous n'avez pas les droits nécessaires pour accéder à cette page."
}: ForbiddenAccessProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 px-4 transition-colors">
      <Card variant="auth" padding="lg" className="max-w-md w-full text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <svg 
            className="w-12 h-12 text-red-600 dark:text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Accès refusé
        </h1>

        <p className="text-gray-600 dark:text-slate-300 mb-8">
          {message}
        </p>

        <div className="mb-8">
          <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-sm font-semibold px-4 py-2 rounded-full">
            Erreur 403 - Forbidden
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
          >
            ← Retour
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-slate-600 transition-all duration-200"
          >
            🏠 Accueil
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            💡 Vous devez être connecté pour accéder à cette fonctionnalité.
          </p>
        </div>
      </Card>
    </div>
  )
}
