'use client'

import dynamic from 'next/dynamic'

// Lazy load the hero component
const SimplifiedHero = dynamic(() => import('@/components/landing/SimplifiedHero'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Orion...</p>
      </div>
    </div>
  ),
  ssr: true
})

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