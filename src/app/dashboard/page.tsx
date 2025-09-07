'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/lib/theme/ThemeContext'
import DashboardLayout from './DashboardLayout'

// Dynamically import heavy components for better performance
const ExecutiveAlertBar = dynamic(() => import('@/components/dashboard/ExecutiveAlertBar'), {
  loading: () => <div className="skeleton-loader">Loading alerts...</div>
})

const KPICommandCenter = dynamic(() => import('@/components/dashboard/KPICommandCenter'), {
  loading: () => <div className="skeleton-loader">Loading metrics...</div>
})

const FinancialStatements = dynamic(() => import('@/components/dashboard/FinancialStatements'), {
  loading: () => <div className="skeleton-loader">Loading statements...</div>
})

const AIInsightsPanel = dynamic(() => import('@/components/dashboard/AIInsightsPanel'), {
  loading: () => <div className="skeleton-loader">Loading insights...</div>
})

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="dashboard-container">
          {/* Page Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Orion Financial Command Center</h1>
              <p className="page-subtitle">
                Real-time financial intelligence and performance metrics
              </p>
            </div>
            <div className="header-meta">
              <span className="last-updated">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Executive Alert Bar - Full Width */}
          <ExecutiveAlertBar />

          {/* Main Grid Layout */}
          <div className="dashboard-grid">
            {/* KPI Command Center - 12 columns */}
            <div className="col-span-12">
              <KPICommandCenter />
            </div>

            {/* Financial Statements - 6 columns */}
            <div className="col-span-12 lg:col-span-6">
              <FinancialStatements />
            </div>

            {/* AI Insights Panel - 6 columns */}
            <div className="col-span-12 lg:col-span-6">
              <AIInsightsPanel />
            </div>
          </div>
        </div>

        <style jsx>{`
          .dashboard-container {
            min-height: 100vh;
            padding: var(--spacing-lg);
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--spacing-lg);
            padding-bottom: var(--spacing-md);
            border-bottom: 1px solid var(--border-primary);
          }

          .page-title {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin: 0 0 var(--spacing-xs) 0;
          }

          .page-subtitle {
            font-size: var(--text-base);
            color: var(--text-secondary);
            margin: 0;
          }

          .header-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          .last-updated {
            font-size: var(--text-xs);
            color: var(--text-muted);
            font-family: var(--font-mono);
          }

          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: var(--spacing-lg);
          }

          .col-span-6 {
            grid-column: span 6;
          }

          .col-span-12 {
            grid-column: span 12;
          }

          .skeleton-loader {
            background: var(--bg-secondary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-lg);
            padding: var(--spacing-xl);
            text-align: center;
            color: var(--text-muted);
            font-size: var(--text-sm);
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          @media (max-width: 1024px) {
            .lg\\:col-span-6 {
              grid-column: span 12;
            }
          }

          @media (max-width: 768px) {
            .dashboard-header {
              flex-direction: column;
              align-items: flex-start;
              gap: var(--spacing-sm);
            }

            .header-meta {
              align-items: flex-start;
            }

            .dashboard-grid {
              grid-template-columns: 1fr;
            }

            [class*="col-span"] {
              grid-column: span 1;
            }
          }
        `}</style>
      </DashboardLayout>
    </ThemeProvider>
  )
}