'use client'

import SimplifiedHero from '@/components/landing/SimplifiedHero'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section (fills available viewport height) */}
      <div className="flex-1">
        <SimplifiedHero />
      </div>

      {/* Simple Footer */}
      <footer className="py-8 text-center border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <p className="text-sm text-gray-600">
          © 2025 Orion FP&A Platform • Enterprise Financial Intelligence
        </p>
      </footer>
    </div>
  )
}