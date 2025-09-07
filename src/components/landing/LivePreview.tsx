'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Target } from 'lucide-react'

export default function LivePreview() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [kpiValues, setKpiValues] = useState({
    revenue: 12.4,
    expenses: 9.8,
    netIncome: 2.6,
    margin: 21,
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiValues(prev => ({
        revenue: prev.revenue + (Math.random() - 0.5) * 0.1,
        expenses: prev.expenses + (Math.random() - 0.5) * 0.08,
        netIncome: prev.netIncome + (Math.random() - 0.5) * 0.05,
        margin: prev.margin + (Math.random() - 0.5) * 0.5,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const tooltips = {
    kpi: 'Real-time KPI tracking with automatic refresh',
    chart: 'Interactive charts with drill-down capabilities',
    table: 'Financial statements with variance analysis',
    ai: 'AI-powered insights and recommendations',
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Live Dashboard Preview</h2>
          <p className="text-gray-500 font-mono text-sm">
            Experience the power of real-time financial intelligence
          </p>
        </div>

        {/* Dashboard Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="bg-[#0D1117] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
            {/* Dashboard Header */}
            <div className="bg-[#0A0E1A] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono">Orion Dashboard</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* KPI Cards */}
              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 relative"
                onMouseEnter={() => setActiveTooltip('kpi')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {[
                  { label: 'Revenue YTD', value: kpiValues.revenue, unit: 'M', icon: DollarSign, color: 'text-green-400', change: 8.2 },
                  { label: 'Expenses YTD', value: kpiValues.expenses, unit: 'M', icon: Package, color: 'text-yellow-400', change: 3.1 },
                  { label: 'Net Income', value: kpiValues.netIncome, unit: 'M', icon: Target, color: 'text-blue-400', change: 18.5 },
                  { label: 'Profit Margin', value: kpiValues.margin, unit: '%', icon: Users, color: 'text-purple-400', change: 2.1 },
                ].map((kpi, i) => {
                  const Icon = kpi.icon
                  const isPositive = kpi.change > 0
                  return (
                    <div key={i} className="bg-gray-900/50 border border-gray-800 rounded p-4 hover:border-gray-600 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                        <div className="flex items-center gap-1">
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 text-green-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          )}
                          <span className={`text-xs font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {Math.abs(kpi.change)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
                      <div className="text-2xl font-bold font-mono text-white">
                        ${kpi.value.toFixed(1)}{kpi.unit}
                      </div>
                    </div>
                  )
                })}
                {activeTooltip === 'kpi' && (
                  <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {tooltips.kpi}
                  </div>
                )}
              </div>

              {/* Charts and Tables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart Preview */}
                <div
                  className="bg-gray-900/50 border border-gray-800 rounded p-4 hover:border-gray-600 transition-all relative"
                  onMouseEnter={() => setActiveTooltip('chart')}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div className="text-sm text-gray-400 mb-3">Revenue Trend</div>
                  <div className="h-32 flex items-end justify-between gap-2">
                    {[65, 75, 80, 70, 85, 90, 88, 92, 95, 98, 96, 100].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-all"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-600">Jan</span>
                    <span className="text-xs text-gray-600">Dec</span>
                  </div>
                  {activeTooltip === 'chart' && (
                    <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {tooltips.chart}
                    </div>
                  )}
                </div>

                {/* Table Preview */}
                <div
                  className="bg-gray-900/50 border border-gray-800 rounded p-4 hover:border-gray-600 transition-all relative"
                  onMouseEnter={() => setActiveTooltip('table')}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div className="text-sm text-gray-400 mb-3">P&L Statement</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Revenue', actual: '12.4M', budget: '11.8M', variance: '+5.1%', positive: true },
                      { label: 'COGS', actual: '4.2M', budget: '4.5M', variance: '-6.7%', positive: true },
                      { label: 'Gross Profit', actual: '8.2M', budget: '7.3M', variance: '+12.3%', positive: true },
                      { label: 'OpEx', actual: '5.6M', budget: '5.4M', variance: '+3.7%', positive: false },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">{row.label}</span>
                        <div className="flex gap-4">
                          <span className="text-white">{row.actual}</span>
                          <span className="text-gray-600">{row.budget}</span>
                          <span className={row.positive ? 'text-green-400' : 'text-red-400'}>
                            {row.variance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {activeTooltip === 'table' && (
                    <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {tooltips.table}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Insights Bar */}
              <div
                className="mt-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded p-4 relative"
                onMouseEnter={() => setActiveTooltip('ai')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-400 font-mono">AI Insight:</span>
                  <span className="text-sm text-gray-300">
                    Revenue growth trending 15% above forecast. Consider increasing Q4 guidance.
                  </span>
                </div>
                {activeTooltip === 'ai' && (
                  <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {tooltips.ai}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              <span className="text-gray-400">Hover over elements</span> to explore features
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}