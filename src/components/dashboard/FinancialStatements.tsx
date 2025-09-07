'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Download, RefreshCw, FileSpreadsheet, FileText } from 'lucide-react'
import { 
  FinancialStatement, 
  FinancialLineItem,
  generatePLStatement, 
  generateBalanceSheet, 
  generateCashFlow 
} from '@/lib/mockData/financialData'
import { formatCurrency, formatPercentage, getVarianceColor } from '@/lib/utils/dataFormatters'

interface LineItemRowProps {
  item: FinancialLineItem
  level: number
  viewMode: 'actual' | 'budget' | 'variance'
  expanded: boolean
  onToggle: () => void
}

function LineItemRow({ item, level, viewMode, expanded, onToggle }: LineItemRowProps) {
  const hasChildren = item.children && item.children.length > 0
  const isParent = level === 0 || hasChildren

  const getValue = () => {
    switch (viewMode) {
      case 'budget':
        return item.budget
      case 'variance':
        return item.variance
      default:
        return item.actual
    }
  }

  const getVarianceClass = () => {
    if (item.variance > 0) return 'positive'
    if (item.variance < 0) return 'negative'
    return 'neutral'
  }

  return (
    <>
      <tr className={`line-item-row level-${level} ${isParent ? 'parent-row' : ''}`}>
        <td className="line-item-name">
          <div className="name-cell" style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren && (
              <button onClick={onToggle} className="expand-btn">
                {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            )}
            <span className={isParent ? 'font-semibold' : ''}>{item.name}</span>
          </div>
        </td>
        <td className="line-item-value number">
          {formatCurrency(item.actual)}
        </td>
        <td className="line-item-value number">
          {formatCurrency(item.budget)}
        </td>
        <td className={`line-item-value number ${getVarianceClass()}`}>
          {formatCurrency(item.variance)}
        </td>
        <td className={`line-item-value number ${getVarianceClass()}`}>
          {formatPercentage(item.variancePercent)}
        </td>
        <td className="line-item-value number">
          {formatCurrency(item.priorYear)}
        </td>
      </tr>
      {expanded && item.children && item.children.map(child => (
        <LineItemRow
          key={child.id}
          item={child}
          level={level + 1}
          viewMode={viewMode}
          expanded={true}
          onToggle={() => {}}
        />
      ))}
      <style jsx>{`
        .line-item-row {
          border-bottom: 1px solid var(--border-secondary);
          transition: background-color var(--transition-fast);
        }

        .line-item-row:hover {
          background: var(--bg-hover);
        }

        .parent-row {
          font-weight: var(--font-semibold);
          background: var(--bg-secondary);
        }

        .line-item-name {
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: left;
        }

        .name-cell {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .expand-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }

        .expand-btn:hover {
          color: var(--text-primary);
        }

        .line-item-value {
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: right;
          font-size: var(--text-sm);
        }

        .number {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }

        .positive {
          color: var(--color-positive);
        }

        .negative {
          color: var(--color-negative);
        }

        .neutral {
          color: var(--text-secondary);
        }

        .font-semibold {
          font-weight: var(--font-semibold);
        }

        .level-1 {
          font-size: var(--text-sm);
        }

        .level-2 {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }
      `}</style>
    </>
  )
}

export default function FinancialStatements() {
  const [activeTab, setActiveTab] = useState<'P&L' | 'BalanceSheet' | 'CashFlow'>('P&L')
  const [period, setPeriod] = useState('2024 Q4')
  const [viewMode, setViewMode] = useState<'actual' | 'budget' | 'variance'>('actual')
  const [statement, setStatement] = useState<FinancialStatement | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadStatement()
  }, [activeTab, period])

  const loadStatement = () => {
    setIsLoading(true)
    setTimeout(() => {
      let data: FinancialStatement
      switch (activeTab) {
        case 'BalanceSheet':
          data = generateBalanceSheet(period)
          break
        case 'CashFlow':
          data = generateCashFlow(period)
          break
        default:
          data = generatePLStatement(period)
      }
      setStatement(data)
      // Expand all parent items by default
      const parents = new Set(data.lineItems.filter(item => item.children).map(item => item.id))
      setExpandedItems(parents)
      setIsLoading(false)
    }, 500)
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  const handleExport = (format: 'excel' | 'pdf') => {
    // Simulate export
    console.log(`Exporting ${activeTab} as ${format}`)
  }

  return (
    <div className="financial-statements">
      <div className="statements-header">
        <h2 className="section-title">Financial Statements</h2>
        <div className="statements-controls">
          <select 
            className="period-selector"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="2024 Q4">Q4 2024</option>
            <option value="2024 Q3">Q3 2024</option>
            <option value="2024 Q2">Q2 2024</option>
            <option value="2024 Q1">Q1 2024</option>
            <option value="2024 FY">FY 2024</option>
          </select>
          <button onClick={() => loadStatement()} className="refresh-btn">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="statements-tabs">
        <button
          className={`tab ${activeTab === 'P&L' ? 'active' : ''}`}
          onClick={() => setActiveTab('P&L')}
        >
          P&L Statement
        </button>
        <button
          className={`tab ${activeTab === 'BalanceSheet' ? 'active' : ''}`}
          onClick={() => setActiveTab('BalanceSheet')}
        >
          Balance Sheet
        </button>
        <button
          className={`tab ${activeTab === 'CashFlow' ? 'active' : ''}`}
          onClick={() => setActiveTab('CashFlow')}
        >
          Cash Flow
        </button>
      </div>

      <div className="statements-body">
        {isLoading ? (
          <div className="loading-state">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading {activeTab}...</span>
          </div>
        ) : statement ? (
          <>
            <div className="table-controls">
              <div className="view-toggles">
                <button
                  className={`view-btn ${viewMode === 'actual' ? 'active' : ''}`}
                  onClick={() => setViewMode('actual')}
                >
                  Actual
                </button>
                <button
                  className={`view-btn ${viewMode === 'budget' ? 'active' : ''}`}
                  onClick={() => setViewMode('budget')}
                >
                  Budget
                </button>
                <button
                  className={`view-btn ${viewMode === 'variance' ? 'active' : ''}`}
                  onClick={() => setViewMode('variance')}
                >
                  Variance
                </button>
              </div>
              <div className="export-buttons">
                <button onClick={() => handleExport('excel')} className="export-btn">
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
                <button onClick={() => handleExport('pdf')} className="export-btn">
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="statements-table">
                <thead>
                  <tr>
                    <th>Line Item</th>
                    <th className="number">Actual</th>
                    <th className="number">Budget</th>
                    <th className="number">Variance</th>
                    <th className="number">Var %</th>
                    <th className="number">Prior Year</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.lineItems.map(item => (
                    <LineItemRow
                      key={item.id}
                      item={item}
                      level={0}
                      viewMode={viewMode}
                      expanded={expandedItems.has(item.id)}
                      onToggle={() => toggleExpanded(item.id)}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="totals-row">
                    <td>Total</td>
                    <td className="number">{formatCurrency(statement.totals.actual)}</td>
                    <td className="number">{formatCurrency(statement.totals.budget)}</td>
                    <td className="number">{formatCurrency(statement.totals.actual - statement.totals.budget)}</td>
                    <td className="number">
                      {formatPercentage(
                        ((statement.totals.actual - statement.totals.budget) / Math.abs(statement.totals.budget)) * 100
                      )}
                    </td>
                    <td className="number">{formatCurrency(statement.totals.priorYear)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : null}
      </div>

      <style jsx>{`
        .financial-statements {
          background: var(--bg-card);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .statements-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-primary);
        }

        .section-title {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
        }

        .statements-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .period-selector {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: var(--text-sm);
          cursor: pointer;
        }

        .refresh-btn {
          padding: var(--spacing-xs);
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .refresh-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent-primary);
        }

        .statements-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-primary);
          background: var(--bg-secondary);
        }

        .tab {
          padding: var(--spacing-sm) var(--spacing-md);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
          background: var(--bg-card);
        }

        .statements-body {
          padding: var(--spacing-md);
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .table-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }

        .view-toggles {
          display: flex;
          gap: var(--spacing-xs);
          background: var(--bg-secondary);
          padding: 2px;
          border-radius: var(--radius-md);
        }

        .view-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .view-btn:hover {
          color: var(--text-primary);
        }

        .view-btn.active {
          background: var(--bg-card);
          color: var(--accent-primary);
          box-shadow: var(--shadow-sm);
        }

        .export-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--bg-secondary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .export-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent-primary);
        }

        .table-container {
          overflow-x: auto;
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
        }

        .statements-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm);
        }

        .statements-table thead {
          background: var(--bg-secondary);
        }

        .statements-table th {
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: left;
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-primary);
        }

        .statements-table th.number {
          text-align: right;
        }

        .totals-row {
          background: var(--bg-secondary);
          font-weight: var(--font-bold);
          border-top: 2px solid var(--border-primary);
        }

        .totals-row td {
          padding: var(--spacing-sm) var(--spacing-md);
        }

        @media (max-width: 768px) {
          .statements-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .table-controls {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .statements-table {
            font-size: var(--text-xs);
          }
        }
      `}</style>
    </div>
  )
}