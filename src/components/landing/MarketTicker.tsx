'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TickerItem {
  label: string
  value: string
  change: number
  trend: 'up' | 'down'
}

export default function MarketTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    { label: 'S&P 500', value: '4,783.45', change: 0.8, trend: 'up' },
    { label: 'NASDAQ', value: '15,123.68', change: 1.2, trend: 'up' },
    { label: 'EUR/USD', value: '1.0823', change: -0.3, trend: 'down' },
    { label: 'System Uptime', value: '99.99%', change: 0, trend: 'up' },
    { label: 'Reports Today', value: '12,847', change: 15.2, trend: 'up' },
    { label: 'Active Users', value: '3,421', change: 8.5, trend: 'up' },
    { label: 'API Latency', value: '23ms', change: -5.0, trend: 'down' },
    { label: 'Data Processed', value: '847TB', change: 12.3, trend: 'up' },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerItems(prev => prev.map(item => ({
        ...item,
        change: item.change + (Math.random() - 0.5) * 0.5,
        trend: item.change > 0 ? 'up' : 'down'
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-[#0D1117] border-b border-gray-800 overflow-hidden">
      <div className="relative flex">
        <div className="animate-scroll flex gap-8 py-2 px-6">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-gray-400 text-xs font-mono">{item.label}</span>
              <span className="text-white text-xs font-mono font-semibold">{item.value}</span>
              <div className={`flex items-center gap-1 ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {item.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-mono">
                  {Math.abs(item.change).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}