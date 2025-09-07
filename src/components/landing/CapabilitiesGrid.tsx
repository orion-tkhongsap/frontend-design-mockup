'use client'

import { useEffect, useState } from 'react'
import { Activity, Brain, Layers, Zap } from 'lucide-react'

interface Capability {
  icon: any
  title: string
  metric: string
  description: string
  sparkline: number[]
  color: string
}

export default function CapabilitiesGrid() {
  const [capabilities] = useState<Capability[]>([
    {
      icon: Activity,
      title: 'Real-Time Consolidation',
      metric: '75% faster',
      description: 'Close books in hours, not days',
      sparkline: [20, 35, 40, 25, 45, 60, 55, 70, 65, 75],
      color: '#00FF88',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      metric: '10x insights',
      description: 'Natural language queries',
      sparkline: [30, 40, 35, 50, 45, 60, 70, 65, 80, 90],
      color: '#00BFFF',
    },
    {
      icon: Layers,
      title: 'Scenario Modeling',
      metric: 'Unlimited',
      description: 'What-if analysis in seconds',
      sparkline: [40, 45, 50, 45, 55, 60, 65, 70, 75, 80],
      color: '#FFB800',
    },
    {
      icon: Zap,
      title: 'Unified Platform',
      metric: '5+ tools',
      description: 'Replace legacy systems',
      sparkline: [50, 55, 60, 65, 60, 70, 75, 80, 85, 90],
      color: '#FF3366',
    },
  ])

  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})

  // Animate sparklines on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        'Real-Time Consolidation': 75,
        'AI-Powered Analysis': 90,
        'Scenario Modeling': 80,
        'Unified Platform': 90,
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data)
    const points = data
      .map((value, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 50 - (value / max) * 40
        return `${x},${y}`
      })
      .join(' ')

    return (
      <svg className="w-full h-12" viewBox="0 0 100 50" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.6"
          className="animate-draw"
        />
        <polyline
          points={`${points} 100,50 0,50`}
          fill={`url(#gradient-${color})`}
          opacity="0.2"
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Platform Capabilities</h2>
          <p className="text-gray-500 font-mono text-sm">
            Enterprise-grade features built for modern finance teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, i) => {
            const Icon = capability.icon
            return (
              <div
                key={i}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-6 h-6" style={{ color: capability.color }} />
                  <span
                    className="text-2xl font-bold font-mono"
                    style={{ color: capability.color }}
                  >
                    {capability.metric}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold mb-2">{capability.title}</h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4">{capability.description}</p>

                {/* Sparkline */}
                <div className="mt-4">
                  <Sparkline data={capability.sparkline} color={capability.color} />
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${animatedValues[capability.title] || 0}%`,
                      backgroundColor: capability.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes draw {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-draw {
          animation: draw 2s ease-out forwards;
        }
      `}</style>
    </section>
  )
}