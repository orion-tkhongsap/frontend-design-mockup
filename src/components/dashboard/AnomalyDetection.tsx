'use client'

import React from 'react'
import { Anomaly } from '@/lib/mockData/financialData'

interface AnomalyDetectionProps {
  anomalies: Anomaly[]
}

export default function AnomalyDetection({ anomalies }: AnomalyDetectionProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--color-negative)'
      case 'high': return '#FF9500'
      case 'medium': return '#FFCC00'
      case 'low': return 'var(--text-secondary)'
      default: return 'var(--text-secondary)'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🟡'
      case 'low': return '🔵'
      default: return '⚪'
    }
  }

  return (
    <div className="anomaly-detection">
      <div className="anomaly-header">
        <h2 className="anomaly-title">Anomaly Detection</h2>
        <span className="anomaly-count">{anomalies.length} detected</span>
      </div>

      <div className="anomaly-list">
        {anomalies.slice(0, 5).map((anomaly) => (
          <div key={anomaly.id} className="anomaly-item">
            <div className="anomaly-indicator">
              <span className="severity-icon">{getSeverityIcon(anomaly.severity)}</span>
            </div>
            <div className="anomaly-content">
              <div className="anomaly-metric">{anomaly.metric}</div>
              <div className="anomaly-description">{anomaly.description}</div>
              <div className="anomaly-meta">
                <span className="anomaly-deviation">
                  {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}% deviation
                </span>
                <span className="anomaly-time">{anomaly.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="anomaly-footer">
        <button className="view-all-btn">View All Anomalies →</button>
      </div>

      <style jsx>{`
        .anomaly-detection {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .anomaly-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }

        .anomaly-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .anomaly-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          border: 1px solid var(--border-color);
        }

        .anomaly-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .anomaly-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
          transition: all 0.2s;
        }

        .anomaly-item:hover {
          background: var(--bg-hover);
          border-color: var(--color-primary);
        }

        .anomaly-indicator {
          display: flex;
          align-items: center;
        }

        .severity-icon {
          font-size: 1rem;
        }

        .anomaly-content {
          flex: 1;
        }

        .anomaly-metric {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .anomaly-description {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .anomaly-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.625rem;
        }

        .anomaly-deviation {
          color: var(--color-negative);
          font-weight: 600;
        }

        .anomaly-time {
          color: var(--text-tertiary);
        }

        .anomaly-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .view-all-btn {
          width: 100%;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          color: var(--color-primary);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: var(--bg-tertiary);
          border-color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .anomaly-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .anomaly-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}