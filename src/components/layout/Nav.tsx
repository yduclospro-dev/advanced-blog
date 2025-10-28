'use client'

import Link from 'next/link'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'next/navigation'
import { Button, ButtonLink, Toast } from '@/components/ui'
import { useState, useEffect } from 'react'
import type { ToastType } from "@/components/ui/Toast/toastTypes";
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useUserStore()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout()
    setToast({ message: "Déconnexion réussie !", type: "success" });
    setIsMenuOpen(false)
    
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 1500);
  }

  useEffect(() => {
    setIsMenuOpen(false)
  }, [router])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <nav className="bg-blue-600 dark:bg-slate-800 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        
        <div className="flex items-center justify-between">
          
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-white hover:opacity-90 transition-all duration-200 flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold">Blog</span>
            </Link>
          </div>

          
          <div className="hidden lg:flex flex-1 justify-center">
            <Link 
              href="/articles" 
              className="text-lg font-semibold text-white hover:text-gray-100 transition-all duration-200"
            >
              Articles
            </Link>
          </div>

          
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && currentUser ? (
              <>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-semibold">
                    {currentUser.username}
                  </span>
                </div>
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  label="Déconnexion"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                />
              </>
            ) : (
              <>
                <ButtonLink 
                  href="/login" 
                  variant="secondary"
                  label="Connexion"
                />
                <ButtonLink 
                  href="/registration" 
                  variant="primary"
                  label="S'inscrire"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                />
              </>
            )}

            
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {mounted && (theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ))}
            </button>
          </div>

          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[73px] bg-blue-600 dark:bg-slate-800 z-40 overflow-y-auto transition-colors">
            <div className="px-4 py-6 space-y-4">
              
              <Link 
                href="/articles" 
                className="flex items-center text-white text-lg font-semibold hover:bg-white/10 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>

              
              <button
                onClick={toggleTheme}
                className="flex items-center text-white text-lg font-semibold hover:bg-white/10 px-4 py-3 rounded-lg transition-colors w-full text-left"
                suppressHydrationWarning
              >
                {mounted && (theme === 'light' ? 'Mode sombre' : 'Mode clair')}
              </button>

              <div className="border-t border-white/20 my-4"></div>

              
              {isAuthenticated && currentUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-lg">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-semibold text-lg">
                      {currentUser.username}
                    </span>
                  </div>
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    label="Déconnexion"
                    className="w-full"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <ButtonLink 
                    href="/login" 
                    variant="secondary"
                    label="Connexion"
                    className="w-full justify-center"
                  />
                  <ButtonLink 
                    href="/registration" 
                    variant="primary"
                    label="S'inscrire"
                    className="w-full justify-center bg-white text-blue-600 hover:bg-gray-100"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}