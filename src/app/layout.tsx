import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/bloomberg-theme.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Orion - AI-First Financial Planning & Analysis',
  description: 'Modern FP&A platform designed to replace IBM TM1 Cognos with AI-powered financial reporting, budgeting, and strategic planning capabilities.',
  keywords: 'FP&A, financial planning, analysis, budgeting, forecasting, AI, dashboard',
  authors: [{ name: 'Orion Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#486581',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}