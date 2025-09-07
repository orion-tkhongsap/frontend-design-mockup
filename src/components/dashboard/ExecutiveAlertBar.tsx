'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, Info, CheckCircle, XCircle, X, ChevronRight } from 'lucide-react'
import { Alert, generateAlerts } from '@/lib/mockData/financialData'
import { formatTimeAgo } from '@/lib/utils/dataFormatters'

export default function ExecutiveAlertBar() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Load initial alerts
    setAlerts(generateAlerts())

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      setAlerts(prev => {
        const newAlerts = generateAlerts()
        // Keep only non-dismissed alerts and merge with new ones
        return newAlerts.filter(alert => !dismissedAlerts.has(alert.id))
      })
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [dismissedAlerts])

  // Auto-scroll through alerts
  useEffect(() => {
    const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id))
    if (visibleAlerts.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % visibleAlerts.length)
    }, 5000) // Change alert every 5 seconds

    return () => clearInterval(timer)
  }, [alerts, dismissedAlerts])

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id))
  const currentAlert = visibleAlerts[currentIndex]

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4" />
      case 'warning':
        return <AlertCircle className="w-4 h-4" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getAlertClass = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'alert-error'
      case 'warning':
        return 'alert-warning'
      case 'success':
        return 'alert-success'
      default:
        return 'alert-info'
    }
  }

  const getPriorityClass = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'priority-high'
      case 'medium':
        return 'priority-medium'
      default:
        return 'priority-low'
    }
  }

  if (visibleAlerts.length === 0) {
    return (
      <div className="alert-bar alert-empty">
        <CheckCircle className="w-4 h-4 text-success" />
        <span>All systems operational. No alerts at this time.</span>
      </div>
    )
  }

  return (
    <div className="alert-bar">
      {/* Alert Indicators */}
      <div className="alert-indicators">
        {visibleAlerts.map((alert, index) => (
          <button
            key={alert.id}
            onClick={() => setCurrentIndex(index)}
            className={`indicator ${index === currentIndex ? 'active' : ''} ${getPriorityClass(alert.priority)}`}
            aria-label={`Alert ${index + 1}`}
          />
        ))}
      </div>

      {/* Current Alert */}
      {currentAlert && (
        <div className={`alert-content ${getAlertClass(currentAlert.type)}`}>
          <div className="alert-icon">
            {getAlertIcon(currentAlert.type)}
          </div>
          
          <div className="alert-body">
            <div className="alert-header">
              <span className="alert-title">{currentAlert.title}</span>
              <span className={`alert-priority ${getPriorityClass(currentAlert.priority)}`}>
                {currentAlert.priority.toUpperCase()}
              </span>
            </div>
            <div className="alert-description">{currentAlert.description}</div>
            <div className="alert-meta">
              <span className="alert-time">{formatTimeAgo(currentAlert.timestamp)}</span>
              {currentAlert.actionable && currentAlert.action && (
                <button className="alert-action">
                  {currentAlert.action.label}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => dismissAlert(currentAlert.id)}
            className="alert-dismiss"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <style jsx>{`
        .alert-bar {
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          position: relative;
          overflow: hidden;
        }

        .alert-bar.alert-empty {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }

        .alert-indicators {
          display: flex;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }

        .indicator {
          width: 32px;
          height: 3px;
          background: var(--bg-tertiary);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .indicator.active {
          background: var(--accent-primary);
        }

        .indicator.priority-high {
          background: var(--color-negative);
        }

        .indicator.priority-medium {
          background: var(--color-warning);
        }

        .indicator.priority-low {
          background: var(--text-muted);
        }

        .alert-content {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          animation: slideIn 300ms ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .alert-icon {
          flex-shrink: 0;
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-error .alert-icon {
          background: rgba(255, 51, 102, 0.1);
          color: var(--color-negative);
        }

        .alert-warning .alert-icon {
          background: rgba(255, 184, 0, 0.1);
          color: var(--color-warning);
        }

        .alert-success .alert-icon {
          background: rgba(0, 255, 136, 0.1);
          color: var(--color-positive);
        }

        .alert-info .alert-icon {
          background: rgba(0, 191, 255, 0.1);
          color: var(--color-neutral);
        }

        .alert-body {
          flex: 1;
          min-width: 0;
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xs);
        }

        .alert-title {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .alert-priority {
          font-size: var(--text-xs);
          font-weight: var(--font-bold);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .priority-high {
          background: rgba(255, 51, 102, 0.2);
          color: var(--color-negative);
        }

        .priority-medium {
          background: rgba(255, 184, 0, 0.2);
          color: var(--color-warning);
        }

        .priority-low {
          background: var(--bg-tertiary);
          color: var(--text-muted);
        }

        .alert-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
          line-height: var(--line-height-relaxed);
        }

        .alert-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          font-size: var(--text-xs);
        }

        .alert-time {
          color: var(--text-muted);
        }

        .alert-action {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          background: var(--accent-primary);
          color: var(--text-inverse);
          border: none;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .alert-action:hover {
          background: var(--accent-secondary);
          transform: translateX(2px);
        }

        .alert-dismiss {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          padding: var(--spacing-xs);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .alert-dismiss:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
          border-radius: var(--radius-sm);
        }

        .text-success {
          color: var(--color-positive);
        }

        @media (max-width: 768px) {
          .alert-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .alert-meta {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}