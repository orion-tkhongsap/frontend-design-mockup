'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { 
  generateKPIMetrics, 
  generatePLStatement, 
  generateBalanceSheet, 
  generateCashFlow, 
  generateAlerts,
  generateAIInsights,
  generateAnomalies,
  generateRecommendations
} from '@/lib/mockData/financialData'

// Dynamic imports for better performance
const ExecutiveAlertBar = dynamic(() => import('@/components/dashboard/ExecutiveAlertBar'), {
  loading: () => <div className="h-12 bg-gray-800 animate-pulse" />
})

const KPICommandCenter = dynamic(() => import('@/components/dashboard/KPICommandCenter'), {
  loading: () => <div className="h-96 bg-gray-800 animate-pulse" />
})

const FinancialStatements = dynamic(() => import('@/components/dashboard/FinancialStatements'), {
  loading: () => <div className="h-96 bg-gray-800 animate-pulse" />
})

const AIInsightsPanel = dynamic(() => import('@/components/dashboard/AIInsightsPanel'), {
  loading: () => <div className="h-96 bg-gray-800 animate-pulse" />
})

const ExecutiveSummary = dynamic(() => import('@/components/dashboard/ExecutiveSummary'), {
  loading: () => <div className="h-64 bg-gray-800 animate-pulse" />
})

const AnomalyDetection = dynamic(() => import('@/components/dashboard/AnomalyDetection'), {
  loading: () => <div className="h-64 bg-gray-800 animate-pulse" />
})

const ActionableRecommendations = dynamic(() => import('@/components/dashboard/ActionableRecommendations'), {
  loading: () => <div className="h-64 bg-gray-800 animate-pulse" />
})

export default function DashboardPage() {
  const [data, setData] = useState({
    kpis: generateKPIMetrics(),
    plStatement: generatePLStatement(),
    balanceSheet: generateBalanceSheet(),
    cashFlow: generateCashFlow(),
    alerts: generateAlerts(),
    insights: generateAIInsights(),
    anomalies: generateAnomalies(),
    recommendations: generateRecommendations()
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        kpis: generateKPIMetrics(),
        alerts: generateAlerts()
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen dashboard-container" data-theme="dark">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">ORION COMMAND CENTER</h1>
            <span className="dashboard-subtitle">Executive Financial Intelligence Dashboard</span>
          </div>
          <div className="header-right">
            <span className="last-update">Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      {/* Alert Bar */}
      <Suspense fallback={<div className="h-12 bg-gray-800 animate-pulse" />}>
        <ExecutiveAlertBar alerts={data.alerts} />
      </Suspense>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* KPI Command Center */}
        <section className="grid-section kpi-section">
          <Suspense fallback={<div className="h-96 bg-gray-800 animate-pulse" />}>
            <KPICommandCenter metrics={data.kpis} />
          </Suspense>
        </section>

        {/* Executive Summary */}
        <section className="grid-section summary-section">
          <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
            <ExecutiveSummary 
              revenue={data.kpis[0]?.value || 0}
              profit={data.kpis[1]?.value || 0}
              cashFlow={data.kpis[4]?.value || 0}
            />
          </Suspense>
        </section>

        {/* Financial Statements */}
        <section className="grid-section statements-section">
          <Suspense fallback={<div className="h-96 bg-gray-800 animate-pulse" />}>
            <FinancialStatements 
              plData={data.plStatement}
              balanceSheetData={data.balanceSheet}
              cashFlowData={data.cashFlow}
            />
          </Suspense>
        </section>

        {/* AI Insights */}
        <section className="grid-section insights-section">
          <Suspense fallback={<div className="h-96 bg-gray-800 animate-pulse" />}>
            <AIInsightsPanel insights={data.insights} />
          </Suspense>
        </section>

        {/* Anomaly Detection */}
        <section className="grid-section anomaly-section">
          <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
            <AnomalyDetection anomalies={data.anomalies} />
          </Suspense>
        </section>

        {/* Actionable Recommendations */}
        <section className="grid-section recommendations-section">
          <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
            <ActionableRecommendations recommendations={data.recommendations} />
          </Suspense>
        </section>
      </div>

      <style jsx>{`
        .dashboard-container {
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .dashboard-header {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 1.5rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1920px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .dashboard-title {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .dashboard-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .last-update {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          padding: 1.5rem;
          max-width: 1920px;
          margin: 0 auto;
        }

        .grid-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .kpi-section {
          grid-column: span 12;
        }

        .summary-section {
          grid-column: span 4;
        }

        .statements-section {
          grid-column: span 8;
        }

        .insights-section {
          grid-column: span 4;
        }

        .anomaly-section {
          grid-column: span 4;
        }

        .recommendations-section {
          grid-column: span 4;
        }

        @media (max-width: 1536px) {
          .summary-section,
          .insights-section {
            grid-column: span 6;
          }

          .anomaly-section,
          .recommendations-section {
            grid-column: span 6;
          }
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .grid-section {
            grid-column: span 1 !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-header {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .dashboard-title {
            font-size: 1.25rem;
          }

          .dashboard-grid {
            padding: 1rem;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}