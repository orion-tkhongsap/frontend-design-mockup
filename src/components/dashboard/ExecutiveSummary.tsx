'use client'

import React from 'react'

interface ExecutiveSummaryProps {
  revenue: number
  profit: number
  cashFlow: number
}

export default function ExecutiveSummary({ revenue, profit, cashFlow }: ExecutiveSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number, total: number) => {
    return `${((value / total) * 100).toFixed(1)}%`
  }

  return (
    <div className="executive-summary">
      <div className="summary-header">
        <h2 className="summary-title">Executive Summary</h2>
        <span className="summary-period">Q4 2024</span>
      </div>

      <div className="summary-content">
        <div className="summary-metric">
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">{formatCurrency(revenue)}</div>
          <div className="metric-subtitle">YoY Growth: +12.3%</div>
        </div>

        <div className="summary-metric">
          <div className="metric-label">Net Profit</div>
          <div className="metric-value">{formatCurrency(profit)}</div>
          <div className="metric-subtitle">Margin: {formatPercentage(profit, revenue)}</div>
        </div>

        <div className="summary-metric">
          <div className="metric-label">Operating Cash Flow</div>
          <div className="metric-value">{formatCurrency(cashFlow)}</div>
          <div className="metric-subtitle">FCF Conversion: 85%</div>
        </div>

        <div className="summary-insights">
          <h3 className="insights-title">Key Highlights</h3>
          <ul className="insights-list">
            <li>Revenue exceeded forecast by 8.2%</li>
            <li>Operating margin improved 220 bps YoY</li>
            <li>Strong cash generation in all segments</li>
            <li>Cloud services revenue up 45% YoY</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .executive-summary {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
        }

        .summary-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .summary-period {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .summary-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .summary-metric {
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 0.25rem;
        }

        .metric-subtitle {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .summary-insights {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .insights-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
        }

        .insights-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .insights-list li {
          font-size: 0.75rem;
          color: var(--text-secondary);
          padding-left: 1rem;
          position: relative;
        }

        .insights-list li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: var(--color-primary);
        }

        @media (max-width: 1536px) {
          .metric-value {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .summary-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}