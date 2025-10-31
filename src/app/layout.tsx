import "./globals.css"
import Navbar from "../components/layout/Nav"
import Footer from "../components/layout/Footer"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AuthProvider } from "@/components/AuthProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            <header>
              <Navbar />
            </header>
            <main>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
         </AuthProvider> 
      </body>
    </html>
  )
}