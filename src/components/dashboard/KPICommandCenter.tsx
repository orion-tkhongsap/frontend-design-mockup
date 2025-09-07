'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, MoreVertical, ExternalLink } from 'lucide-react'
import { KPIMetric, generateKPIMetrics } from '@/lib/mockData/financialData'
import { formatCurrency, formatPercentage, formatNumber, getStatusColor } from '@/lib/utils/dataFormatters'

// Sparkline component
function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100" height="40" className="sparkline">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <style jsx>{`
        .sparkline {
          opacity: 0.8;
        }
      `}</style>
    </svg>
  )
}

// Individual KPI Card
function KPICard({ metric }: { metric: KPIMetric }) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentValue, setCurrentValue] = useState(metric.value)
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * metric.value * 0.001 // 0.1% variation
      setCurrentValue(prev => prev + variation)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [metric.value])

  const formatValue = (value: number, unit: KPIMetric['unit']) => {
    switch (unit) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return formatPercentage(value, 1, false)
      case 'days':
        return `${Math.round(value)} days`
      default:
        return formatNumber(value)
    }
  }

  const getTrendIcon = () => {
    if (metric.changeType === 'increase') {
      return <TrendingUp className="w-3 h-3" />
    } else if (metric.changeType === 'decrease') {
      return <TrendingDown className="w-3 h-3" />
    }
    return <Minus className="w-3 h-3" />
  }

  const getSparklineColor = () => {
    switch (metric.status) {
      case 'on-track':
        return 'var(--color-positive)'
      case 'at-risk':
        return 'var(--color-warning)'
      case 'off-track':
        return 'var(--color-negative)'
      default:
        return 'var(--color-neutral)'
    }
  }

  return (
    <div 
      className={`kpi-card ${getStatusColor(metric.status)}-border`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="kpi-header">
        <div className="kpi-title-row">
          <h3 className="kpi-title">{metric.name}</h3>
          <button className="kpi-menu">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        <span className="kpi-period">{metric.period}</span>
      </div>

      <div className="kpi-body">
        <div className="kpi-value-section">
          <div className="kpi-value number">
            {formatValue(currentValue, metric.unit)}
          </div>
          <div className={`kpi-change ${metric.changeType}`}>
            {getTrendIcon()}
            <span>{formatPercentage(Math.abs(metric.change), 1, false)}</span>
          </div>
        </div>

        <div className="kpi-sparkline">
          <Sparkline data={metric.trend} color={getSparklineColor()} />
        </div>
      </div>

      <div className="kpi-footer">
        <div className="kpi-target">
          <span className="label">Target:</span>
          <span className="value number">{formatValue(metric.target, metric.unit)}</span>
        </div>
        <div className={`kpi-status ${metric.status}`}>
          <span className="status-dot"></span>
          <span className="status-text">{metric.status.replace('-', ' ')}</span>
        </div>
      </div>

      {isHovered && (
        <div className="kpi-hover-actions">
          <button className="action-btn">
            <ExternalLink className="w-3 h-3" />
            <span>Drill Down</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          position: relative;
          transition: all var(--transition-base);
          overflow: hidden;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-primary);
        }

        .kpi-card.positive-border {
          border-left: 3px solid var(--color-positive);
        }

        .kpi-card.warning-border {
          border-left: 3px solid var(--color-warning);
        }

        .kpi-card.negative-border {
          border-left: 3px solid var(--color-negative);
        }

        .kpi-header {
          margin-bottom: var(--spacing-md);
        }

        .kpi-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-xs);
        }

        .kpi-title {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0;
        }

        .kpi-menu {
          padding: 4px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .kpi-menu:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .kpi-period {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .kpi-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
          gap: var(--spacing-md);
        }

        .kpi-value-section {
          flex: 1;
        }

        .kpi-value {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .kpi-change {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
        }

        .kpi-change.increase {
          color: var(--color-positive);
        }

        .kpi-change.decrease {
          color: var(--color-negative);
        }

        .kpi-sparkline {
          flex-shrink: 0;
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-secondary);
        }

        .kpi-target {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--text-xs);
        }

        .kpi-target .label {
          color: var(--text-muted);
        }

        .kpi-target .value {
          color: var(--text-secondary);
          font-weight: var(--font-medium);
        }

        .kpi-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          text-transform: capitalize;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .kpi-status.on-track {
          color: var(--color-positive);
        }

        .kpi-status.on-track .status-dot {
          background: var(--color-positive);
        }

        .kpi-status.at-risk {
          color: var(--color-warning);
        }

        .kpi-status.at-risk .status-dot {
          background: var(--color-warning);
        }

        .kpi-status.off-track {
          color: var(--color-negative);
        }

        .kpi-status.off-track .status-dot {
          background: var(--color-negative);
        }

        .kpi-hover-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-primary);
          padding: var(--spacing-sm);
          transform: translateY(100%);
          animation: slideUp 200ms ease forwards;
        }

        @keyframes slideUp {
          to {
            transform: translateY(0);
          }
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--accent-primary);
          color: var(--text-inverse);
          border: none;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
          width: 100%;
          justify-content: center;
        }

        .action-btn:hover {
          background: var(--accent-secondary);
        }

        .number {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  )
}

// Main KPI Command Center Component
export default function KPICommandCenter() {
  const [metrics, setMetrics] = useState<KPIMetric[]>([])

  useEffect(() => {
    setMetrics(generateKPIMetrics())
  }, [])

  return (
    <div className="kpi-command-center">
      <div className="kpi-header-section">
        <h2 className="section-title">Financial Performance Metrics</h2>
        <div className="kpi-controls">
          <select className="period-selector">
            <option>YTD 2024</option>
            <option>Q4 2024</option>
            <option>Q3 2024</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        {metrics.map(metric => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </div>

      <style jsx>{`
        .kpi-command-center {
          margin-bottom: var(--spacing-lg);
        }

        .kpi-header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .section-title {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        .period-selector {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .period-selector:hover {
          border-color: var(--accent-primary);
        }

        .period-selector:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.2);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-md);
        }

        @media (min-width: 1440px) {
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .kpi-header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  )
}