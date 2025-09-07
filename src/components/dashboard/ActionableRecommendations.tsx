'use client'

import React from 'react'
import { Recommendation } from '@/lib/mockData/financialData'

interface ActionableRecommendationsProps {
  recommendations: Recommendation[]
}

export default function ActionableRecommendations({ recommendations }: ActionableRecommendationsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--color-negative)'
      case 'high': return '#FF9500'
      case 'medium': return '#FFCC00'
      case 'low': return 'var(--text-secondary)'
      default: return 'var(--text-secondary)'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'var(--color-positive)'
      case 'medium': return 'var(--color-primary)'
      case 'low': return 'var(--text-secondary)'
      default: return 'var(--text-secondary)'
    }
  }

  return (
    <div className="recommendations">
      <div className="recommendations-header">
        <h2 className="recommendations-title">Action Items</h2>
        <div className="filter-buttons">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Cost</button>
          <button className="filter-btn">Revenue</button>
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.slice(0, 4).map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="rec-header">
              <span 
                className="rec-priority"
                style={{ color: getPriorityColor(rec.priority) }}
              >
                {rec.priority.toUpperCase()}
              </span>
              <span 
                className="rec-impact"
                style={{ color: getImpactColor(rec.impact) }}
              >
                {rec.impact} impact
              </span>
            </div>
            
            <h3 className="rec-title">{rec.title}</h3>
            <p className="rec-description">{rec.description}</p>
            
            <div className="rec-metrics">
              <div className="rec-metric">
                <span className="metric-label">Est. Impact</span>
                <span className="metric-value">{rec.estimatedImpact}</span>
              </div>
              <div className="rec-metric">
                <span className="metric-label">Timeline</span>
                <span className="metric-value">{rec.timeline}</span>
              </div>
            </div>

            <div className="rec-actions">
              <button className="action-btn primary">Take Action</button>
              <button className="action-btn secondary">Details</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .recommendations {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .recommendations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }

        .recommendations-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.25rem 0.75rem;
          font-size: 0.625rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: var(--bg-tertiary);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .recommendations-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recommendation-card {
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .recommendation-card:hover {
          background: var(--bg-hover);
          border-color: var(--color-primary);
        }

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .rec-priority {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .rec-impact {
          font-size: 0.625rem;
          font-style: italic;
        }

        .rec-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .rec-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0 0 1rem 0;
        }

        .rec-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .rec-metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.625rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .rec-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: var(--color-primary);
          border: 1px solid var(--color-primary);
          color: var(--bg-primary);
        }

        .action-btn.primary:hover {
          opacity: 0.9;
        }

        .action-btn.secondary {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .action-btn.secondary:hover {
          background: var(--bg-hover);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .recommendations-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .filter-buttons {
            width: 100%;
          }

          .filter-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}