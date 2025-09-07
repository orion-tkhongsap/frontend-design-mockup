'use client'

import React, { useState } from 'react'
import { Briefcase, Shield, TrendingUp, Users } from 'lucide-react'

interface Persona {
  id: string
  icon: any
  name: string
  title: string
  features: string[]
  metrics: { label: string; value: string }[]
  color: string
}

export default function PersonaSelector() {
  const [activePersona, setActivePersona] = useState('cfo')

  const personas: Persona[] = [
    {
      id: 'cfo',
      icon: TrendingUp,
      name: 'Sarah',
      title: 'CFO',
      features: [
        'Executive dashboards with real-time KPIs',
        'Board-ready reports in seconds',
        'Natural language financial queries',
        'Strategic scenario planning',
      ],
      metrics: [
        { label: 'Board Prep Time', value: '↓ 80%' },
        { label: 'Decision Speed', value: '↑ 5x' },
      ],
      color: '#00BFFF',
    },
    {
      id: 'controller',
      icon: Shield,
      name: 'David',
      title: 'Financial Controller',
      features: [
        'Automated consolidation workflows',
        'Real-time audit trails',
        'Compliance monitoring dashboard',
        'Cost allocation transparency',
      ],
      metrics: [
        { label: 'Close Time', value: '↓ 75%' },
        { label: 'Audit Readiness', value: '100%' },
      ],
      color: '#00FF88',
    },
    {
      id: 'analyst',
      icon: Briefcase,
      name: 'Priya',
      title: 'Finance Analyst',
      features: [
        'Deep-dive variance analysis',
        'One-click Excel exports',
        'Automated report generation',
        'Drill-down to transaction level',
      ],
      metrics: [
        { label: 'Analysis Time', value: '↓ 90%' },
        { label: 'Report Accuracy', value: '↑ 99%' },
      ],
      color: '#FFB800',
    },
    {
      id: 'manager',
      icon: Users,
      name: 'Mark',
      title: 'Department Head',
      features: [
        'Simple budget input forms',
        'Real-time spending tracker',
        'Mobile-first dashboard',
        'Automated variance alerts',
      ],
      metrics: [
        { label: 'Budget Submission', value: '< 10min' },
        { label: 'Visibility', value: 'Real-time' },
      ],
      color: '#FF3366',
    },
  ]

  const currentPersona = personas.find(p => p.id === activePersona) || personas[0]

  return (
    <section className="py-20 bg-gray-900/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Built for Every Finance Professional</h2>
          <p className="text-gray-500 font-mono text-sm">
            Tailored experiences for each member of your finance team
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Persona Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {personas.map((persona) => {
              const Icon = persona.icon
              return (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(persona.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all duration-300 ${
                    activePersona === persona.id
                      ? 'bg-gray-800 text-white border border-gray-600'
                      : 'bg-transparent text-gray-500 border border-transparent hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: activePersona === persona.id ? persona.color : undefined }} />
                  <span>{persona.title}</span>
                </button>
              )
            })}
          </div>

          {/* Persona Content */}
          <div className="bg-[#0D1117] border border-gray-800 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side - Features */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {React.createElement(currentPersona.icon, {
                    className: 'w-8 h-8',
                    style: { color: currentPersona.color }
                  })}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {currentPersona.name}, {currentPersona.title}
                    </h3>
                    <p className="text-sm text-gray-500">Primary User Persona</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentPersona.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2"
                        style={{ backgroundColor: currentPersona.color }}
                      />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Metrics & Visual */}
              <div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h4 className="text-sm text-gray-500 mb-4 font-mono">Impact Metrics</h4>
                  <div className="space-y-4">
                    {currentPersona.metrics.map((metric, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{metric.label}</span>
                        <span
                          className="text-2xl font-bold font-mono"
                          style={{ color: currentPersona.color }}
                        >
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mini Dashboard Preview */}
                  <div className="mt-6 space-y-2">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: '85%',
                          backgroundColor: currentPersona.color,
                          opacity: 0.6
                        }}
                      />
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: '92%',
                          backgroundColor: currentPersona.color,
                          opacity: 0.5
                        }}
                      />
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-900"
                        style={{
                          width: '78%',
                          backgroundColor: currentPersona.color,
                          opacity: 0.4
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}