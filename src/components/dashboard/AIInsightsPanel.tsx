'use client'

import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Shield, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'
import { AIInsight, generateAIInsights } from '@/lib/mockData/financialData'

function InsightCard({ insight }: { insight: AIInsight }) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)

  const getIcon = () => {
    switch (insight.type) {
      case 'variance':
        return <TrendingUp className="w-4 h-4" />
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4" />
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />
      case 'risk':
        return <Shield className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (insight.type) {
      case 'risk':
        return 'risk'
      case 'anomaly':
        return 'anomaly'
      case 'recommendation':
        return 'recommendation'
      default:
        return 'default'
    }
  }

  const getImpactColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'high-impact'
      case 'medium':
        return 'medium-impact'
      default:
        return 'low-impact'
    }
  }

  return (
    <div className={`insight-card ${getTypeColor()}`}>
      <div className="insight-header">
        <div className="insight-type">
          {getIcon()}
          <span>{insight.type}</span>
        </div>
        <div className="confidence-score">
          <span className="number">{insight.confidence}%</span>
          <span className="label">confidence</span>
        </div>
      </div>

      <h4 className="insight-title">{insight.title}</h4>
      <p className="insight-description">{insight.description}</p>

      {insight.metrics && (
        <div className="related-metrics">
          {insight.metrics.map(metric => (
            <span key={metric} className="metric-tag">{metric}</span>
          ))}
        </div>
      )}

      {insight.suggestedAction && (
        <div className="suggested-action">
          <strong>Recommended Action:</strong>
          <p>{insight.suggestedAction}</p>
          <button className="action-button">
            Take Action
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="insight-footer">
        <div className={`impact-badge ${getImpactColor()}`}>
          {insight.impact} impact
        </div>
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${feedback === 'helpful' ? 'active' : ''}`}
            onClick={() => setFeedback('helpful')}
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            className={`feedback-btn ${feedback === 'not-helpful' ? 'active' : ''}`}
            onClick={() => setFeedback('not-helpful')}
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .insight-card {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          transition: all var(--transition-base);
        }

        .insight-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .insight-card.risk {
          border-left: 3px solid var(--color-negative);
        }

        .insight-card.anomaly {
          border-left: 3px solid var(--color-warning);
        }

        .insight-card.recommendation {
          border-left: 3px solid var(--color-positive);
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .insight-type {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--text-xs);
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: var(--font-semibold);
        }

        .confidence-score {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .confidence-score .number {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--accent-primary);
          font-family: var(--font-mono);
        }

        .confidence-score .label {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .insight-title {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-sm);
        }

        .insight-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--spacing-sm);
        }

        .related-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }

        .metric-tag {
          padding: 2px 6px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .suggested-action {
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .suggested-action strong {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .suggested-action p {
          font-size: var(--text-sm);
          color: var(--text-primary);
          margin: var(--spacing-xs) 0;
        }

        .action-button {
          display: inline-flex;
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
        }

        .action-button:hover {
          background: var(--accent-secondary);
          transform: translateX(2px);
        }

        .insight-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-secondary);
        }

        .impact-badge {
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          text-transform: uppercase;
        }

        .high-impact {
          background: rgba(255, 51, 102, 0.1);
          color: var(--color-negative);
        }

        .medium-impact {
          background: rgba(255, 184, 0, 0.1);
          color: var(--color-warning);
        }

        .low-impact {
          background: var(--bg-secondary);
          color: var(--text-muted);
        }

        .feedback-buttons {
          display: flex;
          gap: var(--spacing-xs);
        }

        .feedback-btn {
          padding: var(--spacing-xs);
          background: transparent;
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .feedback-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .feedback-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: var(--text-inverse);
        }

        .number {
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  )
}

export default function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [filter, setFilter] = useState<'all' | 'high' | 'actionable'>('all')

  useEffect(() => {
    setInsights(generateAIInsights())
  }, [])

  const filteredInsights = insights.filter(insight => {
    if (filter === 'high') return insight.impact === 'high'
    if (filter === 'actionable') return insight.suggestedAction !== undefined
    return true
  })

  return (
    <div className="ai-insights-panel">
      <div className="panel-header">
        <div className="header-title">
          <Brain className="w-5 h-5 text-accent" />
          <h2 className="section-title">AI-Powered Insights</h2>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High Impact
          </button>
          <button
            className={`filter-btn ${filter === 'actionable' ? 'active' : ''}`}
            onClick={() => setFilter('actionable')}
          >
            Actionable
          </button>
        </div>
      </div>

      <div className="insights-grid">
        {filteredInsights.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      <style jsx>{`
        .ai-insights-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .text-accent {
          color: var(--accent-primary);
        }

        .section-title {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        .filter-buttons {
          display: flex;
          gap: var(--spacing-xs);
        }

        .filter-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: transparent;
          border: 1px solid var(--border-secondary);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: var(--text-inverse);
        }

        .insights-grid {
          display: grid;
          gap: var(--spacing-md);
          max-height: 600px;
          overflow-y: auto;
          padding-right: var(--spacing-xs);
        }

        .insights-grid::-webkit-scrollbar {
          width: 6px;
        }

        .insights-grid::-webkit-scrollbar-thumb {
          background: var(--text-muted);
          border-radius: var(--radius-sm);
        }

        @media (max-width: 768px) {
          .panel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  )
}