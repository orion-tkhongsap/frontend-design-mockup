'use client'

import { Check, X, Minus } from 'lucide-react'

export default function ComparisonTable() {
  const features = [
    {
      category: 'Implementation',
      items: [
        { feature: 'Setup Time', legacy: '6-12 months', orion: '2 weeks', highlight: true },
        { feature: 'Learning Curve', legacy: '40+ hours training', orion: '2 hours', highlight: false },
        { feature: 'IT Resources Required', legacy: 'Dedicated team', orion: 'Self-service', highlight: false },
      ],
    },
    {
      category: 'Performance',
      items: [
        { feature: 'Report Generation', legacy: '30+ minutes', orion: '< 5 seconds', highlight: true },
        { feature: 'Data Processing', legacy: 'Batch (nightly)', orion: 'Real-time', highlight: false },
        { feature: 'Concurrent Users', legacy: '< 100', orion: 'Unlimited', highlight: false },
      ],
    },
    {
      category: 'Features',
      items: [
        { feature: 'AI Assistance', legacy: false, orion: true, highlight: false },
        { feature: 'Natural Language Queries', legacy: false, orion: true, highlight: false },
        { feature: 'Mobile Access', legacy: 'Limited', orion: true, highlight: false },
        { feature: 'Automated Insights', legacy: false, orion: true, highlight: true },
      ],
    },
    {
      category: 'Cost',
      items: [
        { feature: 'Total Cost of Ownership', legacy: '$$$$$', orion: '$$', highlight: true },
        { feature: 'Maintenance Cost', legacy: 'High', orion: 'Included', highlight: false },
        { feature: 'Upgrade Cost', legacy: 'Project-based', orion: 'Continuous', highlight: false },
      ],
    },
  ]

  const renderValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-400" />
      ) : (
        <X className="w-5 h-5 text-red-400" />
      )
    }
    if (value === 'Limited') {
      return <Minus className="w-5 h-5 text-yellow-400" />
    }
    return <span className="font-mono text-sm">{value}</span>
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Orion vs Legacy Systems</h2>
          <p className="text-gray-500 font-mono text-sm">
            See why Fortune 500 companies are switching to Orion
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0D1117] border border-gray-800 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-900/50 border-b border-gray-800">
              <div className="p-4">
                <span className="text-gray-400 text-sm font-mono">Feature</span>
              </div>
              <div className="p-4 text-center border-x border-gray-800">
                <span className="text-gray-500 text-sm font-mono">Legacy TM1</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-[#00BFFF] text-sm font-mono font-semibold">Orion</span>
              </div>
            </div>

            {/* Table Body */}
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* Category Header */}
                <div className="grid grid-cols-3 bg-gray-900/30 border-b border-gray-800">
                  <div className="col-span-3 px-4 py-2">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                      {category.category}
                    </span>
                  </div>
                </div>

                {/* Category Items */}
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`grid grid-cols-3 border-b border-gray-800 hover:bg-gray-900/30 transition-colors ${
                      item.highlight ? 'bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="p-4">
                      <span className="text-gray-300 text-sm">{item.feature}</span>
                      {item.highlight && (
                        <span className="ml-2 text-xs text-blue-400 font-mono">KEY</span>
                      )}
                    </div>
                    <div className="p-4 flex justify-center items-center border-x border-gray-800 text-gray-500">
                      {renderValue(item.legacy)}
                    </div>
                    <div className="p-4 flex justify-center items-center text-white">
                      {renderValue(item.orion)}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Summary Row */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
              <div className="p-4">
                <span className="text-white font-semibold">Overall ROI</span>
              </div>
              <div className="p-4 text-center border-x border-gray-800">
                <span className="text-gray-500 font-mono">Baseline</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-2xl font-bold text-[#00FF88] font-mono">287% ↑</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <p className="text-gray-400 mb-4">
              Ready to modernize your FP&A platform?
            </p>
            <button className="px-8 py-3 bg-[#00BFFF] text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] transition-all duration-300 hover:scale-105">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}