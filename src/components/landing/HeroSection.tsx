'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Zap } from 'lucide-react'

export default function HeroSection() {
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number; opacity: number }[]>([])

  // Generate floating data points for background animation
  useEffect(() => {
    const points = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.1,
    }))
    setDataPoints(points)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00BFFF 1px, transparent 1px),
              linear-gradient(to bottom, #00BFFF 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Data Points */}
      <div className="absolute inset-0">
        {dataPoints.map((point, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              opacity: point.opacity,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-mono">Enterprise-Ready FP&A Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-7xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ORION
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
          Enterprise FP&A Command Center
        </p>

        {/* Subtext */}
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto font-mono">
          Replace legacy systems. Accelerate decisions. <br />
          Real-time consolidation. AI-powered insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-[#00BFFF] text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Live Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF] to-[#0099DD] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg transition-all duration-300 hover:border-gray-400 hover:text-white hover:bg-gray-900/50">
            Request Access
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { label: 'Reports Generated', value: '500K+', suffix: '/month' },
            { label: 'Uptime', value: '99.99%', suffix: 'guaranteed' },
            { label: 'Setup Time', value: '2', suffix: 'weeks' },
            { label: 'ROI', value: '287%', suffix: 'average' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-600">
                {stat.suffix}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(10px) translateX(-10px);
          }
          75% {
            transform: translateY(-10px) translateX(20px);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  )
}