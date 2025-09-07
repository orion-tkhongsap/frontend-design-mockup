'use client'

import { useEffect, useState } from 'react'
import { 
  TrendingUp, 
  Layers, 
  GitBranch, 
  Brain,
  BarChart3,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react'

interface Feature {
  title: string
  subtitle: string
  description: string
  icon: any
  gradient: string
  shadowColor: string
  delay: number
}

export default function FeatureCards() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features: Feature[] = [
    {
      title: 'Financial Reports',
      subtitle: 'Interactive P&L, Balance Sheet, Cash Flow',
      description: 'Real-time financial statements with drill-down capabilities and variance analysis',
      icon: BarChart3,
      gradient: 'from-blue-500 to-cyan-400',
      shadowColor: 'shadow-blue-500/20',
      delay: 0,
    },
    {
      title: 'Scenario Analysis',
      subtitle: 'What-if modeling and comparisons',
      description: 'Create unlimited scenarios and compare outcomes with powerful visualization',
      icon: Layers,
      gradient: 'from-emerald-500 to-teal-400',
      shadowColor: 'shadow-emerald-500/20',
      delay: 100,
    },
    {
      title: 'Cost Allocation',
      subtitle: 'Visual allocation rule builder',
      description: 'Transparent cost distribution with drag-and-drop configuration',
      icon: GitBranch,
      gradient: 'from-orange-500 to-amber-400',
      shadowColor: 'shadow-orange-500/20',
      delay: 200,
    },
    {
      title: 'AI Assistant',
      subtitle: 'Natural language insights',
      description: 'Ask questions in plain English and get instant financial insights',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-400',
      shadowColor: 'shadow-purple-500/20',
      delay: 300,
    },
  ]

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Core Platform Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Modern financial planning tools designed for enterprise teams
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-6 transition-all duration-700 hover:scale-105 cursor-pointer
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ 
                  transitionDelay: `${feature.delay}ms`,
                }}
              >
                {/* Card Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    {feature.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
                </div>

                {/* Hover Shadow Effect */}
                <div className={`absolute inset-0 rounded-2xl shadow-xl ${feature.shadowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-gray-200">
          {[
            { value: '500K+', label: 'Reports Generated', icon: LineChart },
            { value: '99.99%', label: 'Uptime SLA', icon: Activity },
            { value: '< 5s', label: 'Report Generation', icon: TrendingUp },
            { value: '24/7', label: 'AI Support', icon: PieChart },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <Icon className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .group:hover h3 {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}