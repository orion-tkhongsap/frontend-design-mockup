'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Tooltip,
  LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Remove,
  FilterList,
  GetApp,
  Refresh,
} from '@mui/icons-material'

interface BalanceSheetItem {
  id: string
  label: string
  level: number
  currentAmount: number
  priorAmount: number
  variance: number
  variancePercent: number
  category: 'asset' | 'liability' | 'equity' | 'total'
}

const mockBalanceSheetData: BalanceSheetItem[] = [
  // Assets
  {
    id: 'current-assets',
    label: 'Current Assets',
    level: 0,
    currentAmount: 1850000,
    priorAmount: 1720000,
    variance: 130000,
    variancePercent: 7.56,
    category: 'asset',
  },
  {
    id: 'cash',
    label: 'Cash and Cash Equivalents',
    level: 1,
    currentAmount: 850000,
    priorAmount: 780000,
    variance: 70000,
    variancePercent: 8.97,
    category: 'asset',
  },
  {
    id: 'accounts-receivable',
    label: 'Accounts Receivable',
    level: 1,
    currentAmount: 650000,
    priorAmount: 620000,
    variance: 30000,
    variancePercent: 4.84,
    category: 'asset',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    level: 1,
    currentAmount: 350000,
    priorAmount: 320000,
    variance: 30000,
    variancePercent: 9.38,
    category: 'asset',
  },
  {
    id: 'fixed-assets',
    label: 'Fixed Assets',
    level: 0,
    currentAmount: 2100000,
    priorAmount: 2000000,
    variance: 100000,
    variancePercent: 5.0,
    category: 'asset',
  },
  {
    id: 'total-assets',
    label: 'Total Assets',
    level: 0,
    currentAmount: 3950000,
    priorAmount: 3720000,
    variance: 230000,
    variancePercent: 6.18,
    category: 'total',
  },
  // Liabilities
  {
    id: 'current-liabilities',
    label: 'Current Liabilities',
    level: 0,
    currentAmount: 980000,
    priorAmount: 920000,
    variance: 60000,
    variancePercent: 6.52,
    category: 'liability',
  },
  {
    id: 'accounts-payable',
    label: 'Accounts Payable',
    level: 1,
    currentAmount: 420000,
    priorAmount: 380000,
    variance: 40000,
    variancePercent: 10.53,
    category: 'liability',
  },
  {
    id: 'accrued-expenses',
    label: 'Accrued Expenses',
    level: 1,
    currentAmount: 560000,
    priorAmount: 540000,
    variance: 20000,
    variancePercent: 3.70,
    category: 'liability',
  },
  {
    id: 'long-term-debt',
    label: 'Long-term Debt',
    level: 0,
    currentAmount: 1200000,
    priorAmount: 1150000,
    variance: 50000,
    variancePercent: 4.35,
    category: 'liability',
  },
  {
    id: 'total-liabilities',
    label: 'Total Liabilities',
    level: 0,
    currentAmount: 2180000,
    priorAmount: 2070000,
    variance: 110000,
    variancePercent: 5.31,
    category: 'total',
  },
  // Equity
  {
    id: 'shareholders-equity',
    label: 'Shareholders\' Equity',
    level: 0,
    currentAmount: 1770000,
    priorAmount: 1650000,
    variance: 120000,
    variancePercent: 7.27,
    category: 'equity',
  },
]

interface BalanceSheetProps {
  data?: BalanceSheetItem[]
  period?: string
  comparisonPeriod?: string
}

export function BalanceSheet({ 
  data = mockBalanceSheetData, 
  period = 'Q3 2025',
  comparisonPeriod = 'Q2 2025' 
}: BalanceSheetProps) {
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    if (absAmount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return '#22c55e'
    if (variance < 0) return '#ef4444'
    return '#6b7280'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    if (variance < 0) return <TrendingDown sx={{ fontSize: 16 }} />
    return <Remove sx={{ fontSize: 16 }} />
  }

  const getCategoryStyle = (category: string, level: number) => {
    const baseStyle = {
      fontWeight: level === 0 ? 600 : 400,
      fontSize: level === 0 ? '0.95rem' : '0.875rem',
      paddingLeft: level * 24 + 16,
    }

    switch (category) {
      case 'total':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(72, 101, 129, 0.08)',
          fontWeight: 700,
          fontSize: '1rem',
        }
      case 'asset':
        return {
          ...baseStyle,
          backgroundColor: level === 0 ? 'rgba(34, 197, 94, 0.04)' : 'transparent',
        }
      case 'liability':
        return {
          ...baseStyle,
          backgroundColor: level === 0 ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
        }
      case 'equity':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(59, 130, 246, 0.04)',
        }
      default:
        return baseStyle
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'asset': return 'Asset'
      case 'liability': return 'Liability'
      case 'equity': return 'Equity'
      default: return ''
    }
  }

  const assetsData = data.filter(item => item.category === 'asset' || item.id === 'total-assets')
  const liabilitiesData = data.filter(item => item.category === 'liability' || item.id === 'total-liabilities')
  const equityData = data.filter(item => item.category === 'equity')

  const renderSection = (sectionData: BalanceSheetItem[], title: string) => (
    <>
      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
        <TableCell colSpan={4} sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#374151' }}>
          {title}
        </TableCell>
      </TableRow>
      {sectionData.map((item) => (
        <TableRow 
          key={item.id}
          sx={{
            ...getCategoryStyle(item.category, item.level),
            '&:hover': {
              backgroundColor: 'rgba(72, 101, 129, 0.02)',
            },
          }}
        >
          <TableCell sx={getCategoryStyle(item.category, item.level)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 'inherit',
                fontSize: 'inherit',
              }}>
                {item.label}
              </Typography>
              {item.level === 0 && item.category !== 'total' && (
                <Chip
                  label={getCategoryLabel(item.category)}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    backgroundColor: item.category === 'asset' ? '#dcfce7' : 
                                    item.category === 'liability' ? '#fee2e2' : '#dbeafe',
                    color: item.category === 'asset' ? '#166534' : 
                           item.category === 'liability' ? '#991b1b' : '#1e40af',
                  }}
                />
              )}
            </Box>
          </TableCell>
          
          <TableCell align="right" sx={getCategoryStyle(item.category, item.level)}>
            <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
              {formatCurrency(item.currentAmount)}
            </Typography>
          </TableCell>
          
          <TableCell align="right" sx={getCategoryStyle(item.category, item.level)}>
            <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
              {formatCurrency(item.priorAmount)}
            </Typography>
          </TableCell>
          
          <TableCell align="right" sx={getCategoryStyle(item.category, item.level)}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
              <Box sx={{ color: getVarianceColor(item.variance) }}>
                {getVarianceIcon(item.variance)}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getVarianceColor(item.variance),
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                {formatCurrency(item.variance)}
              </Typography>
              <Chip
                label={formatPercent(item.variancePercent)}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: item.variancePercent >= 0 ? '#dcfce7' : '#fee2e2',
                  color: item.variancePercent >= 0 ? '#166534' : '#991b1b',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafbfc',
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Balance Sheet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {period} vs {comparisonPeriod}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Filter">
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterList />}
              sx={{ textTransform: 'none' }}
            >
              Filter
            </Button>
          </Tooltip>
          
          <Tooltip title="Export">
            <Button
              variant="outlined"
              size="small"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
          </Tooltip>
          
          <Tooltip title="Refresh">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{ textTransform: 'none' }}
            >
              Refresh
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading indicator */}
      {loading && <LinearProgress />}

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>
                Account
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>
                {period}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>
                {comparisonPeriod}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>
                Variance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderSection(assetsData, 'ASSETS')}
            {renderSection(liabilitiesData, 'LIABILITIES')}
            {renderSection(equityData, 'SHAREHOLDERS\' EQUITY')}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}