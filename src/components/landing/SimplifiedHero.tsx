'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function SimplifiedHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-full flex items-center justify-center overflow-hidden px-6 py-16 md:py-20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Simplified Background - removed heavy animations */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-green-400 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">AI-First FP&A Platform</span>
        </div>

        {/* Main Title */}
        <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300">
            ORION
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`text-xl md:text-2xl text-gray-700 mb-4 font-light transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Financial Planning & Analysis Platform
        </p>

        {/* Description */}
        <p className={`text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          A comprehensive frontend mockup for an AI-first FP&A platform designed to replace IBM TM1 Cognos. 
          Experience modern UI/UX patterns for financial reporting, analysis, and budgeting workflows.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:shadow-blue-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Dashboard
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:scale-105">
            Learn More
          </button>
        </div>

        {/* Compact Trust Strip (md+ only to keep single-screen height on small devices) */}
        <div className={`hidden md:block mt-10 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-gray-400 text-sm">
            <span className="hover:text-gray-600 transition-colors">Goldman Sachs</span>
            <span className="hover:text-gray-600 transition-colors">J.P. Morgan</span>
            <span className="hover:text-gray-600 transition-colors">BlackRock</span>
            <span className="hover:text-gray-600 transition-colors">Morgan Stanley</span>
            <span className="hover:text-gray-600 transition-colors">Citi</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          animation: gradient 6s ease infinite;
        }

        .bg-300 {
          background-size: 300% 300%;
        }
      `}</style>
    </section>
  )
}