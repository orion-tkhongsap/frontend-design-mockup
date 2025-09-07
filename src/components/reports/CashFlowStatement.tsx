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

interface CashFlowItem {
  id: string
  label: string
  level: number
  currentAmount: number
  priorAmount: number
  variance: number
  variancePercent: number
  category: 'operating' | 'investing' | 'financing' | 'total'
}

const mockCashFlowData: CashFlowItem[] = [
  // Operating Activities
  {
    id: 'net-income',
    label: 'Net Income',
    level: 0,
    currentAmount: 435000,
    priorAmount: 411000,
    variance: 24000,
    variancePercent: 5.84,
    category: 'operating',
  },
  {
    id: 'depreciation',
    label: 'Depreciation & Amortization',
    level: 0,
    currentAmount: 125000,
    priorAmount: 120000,
    variance: 5000,
    variancePercent: 4.17,
    category: 'operating',
  },
  {
    id: 'working-capital-changes',
    label: 'Changes in Working Capital',
    level: 0,
    currentAmount: -45000,
    priorAmount: -35000,
    variance: -10000,
    variancePercent: 28.57,
    category: 'operating',
  },
  {
    id: 'operating-cash-flow',
    label: 'Net Cash from Operating Activities',
    level: 0,
    currentAmount: 515000,
    priorAmount: 496000,
    variance: 19000,
    variancePercent: 3.83,
    category: 'total',
  },
  // Investing Activities
  {
    id: 'capex',
    label: 'Capital Expenditures',
    level: 0,
    currentAmount: -150000,
    priorAmount: -135000,
    variance: -15000,
    variancePercent: 11.11,
    category: 'investing',
  },
  {
    id: 'acquisitions',
    label: 'Acquisitions',
    level: 0,
    currentAmount: -200000,
    priorAmount: 0,
    variance: -200000,
    variancePercent: 0,
    category: 'investing',
  },
  {
    id: 'investing-cash-flow',
    label: 'Net Cash from Investing Activities',
    level: 0,
    currentAmount: -350000,
    priorAmount: -135000,
    variance: -215000,
    variancePercent: 159.26,
    category: 'total',
  },
  // Financing Activities
  {
    id: 'debt-issuance',
    label: 'Debt Issuance',
    level: 0,
    currentAmount: 100000,
    priorAmount: 50000,
    variance: 50000,
    variancePercent: 100.0,
    category: 'financing',
  },
  {
    id: 'dividends',
    label: 'Dividends Paid',
    level: 0,
    currentAmount: -85000,
    priorAmount: -80000,
    variance: -5000,
    variancePercent: 6.25,
    category: 'financing',
  },
  {
    id: 'financing-cash-flow',
    label: 'Net Cash from Financing Activities',
    level: 0,
    currentAmount: 15000,
    priorAmount: -30000,
    variance: 45000,
    variancePercent: -150.0,
    category: 'total',
  },
  // Net Change
  {
    id: 'net-change-cash',
    label: 'Net Change in Cash',
    level: 0,
    currentAmount: 180000,
    priorAmount: 331000,
    variance: -151000,
    variancePercent: -45.62,
    category: 'total',
  },
  {
    id: 'cash-beginning',
    label: 'Cash at Beginning of Period',
    level: 0,
    currentAmount: 670000,
    priorAmount: 449000,
    variance: 221000,
    variancePercent: 49.22,
    category: 'total',
  },
  {
    id: 'cash-ending',
    label: 'Cash at End of Period',
    level: 0,
    currentAmount: 850000,
    priorAmount: 780000,
    variance: 70000,
    variancePercent: 8.97,
    category: 'total',
  },
]

interface CashFlowStatementProps {
  data?: CashFlowItem[]
  period?: string
  comparisonPeriod?: string
}

export function CashFlowStatement({ 
  data = mockCashFlowData, 
  period = 'Q3 2025',
  comparisonPeriod = 'Q2 2025' 
}: CashFlowStatementProps) {
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    if (absAmount >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000).toFixed(0)}K`
    }
    return `${amount < 0 ? '-' : ''}$${absAmount.toLocaleString()}`
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

  const getCategoryStyle = (category: string) => {
    const baseStyle = {
      fontWeight: 400,
      fontSize: '0.875rem',
      paddingLeft: 16,
    }

    switch (category) {
      case 'total':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(72, 101, 129, 0.08)',
          fontWeight: 700,
          fontSize: '1rem',
        }
      case 'operating':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(34, 197, 94, 0.02)',
        }
      case 'investing':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(239, 68, 68, 0.02)',
        }
      case 'financing':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(59, 130, 246, 0.02)',
        }
      default:
        return baseStyle
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'operating': return 'Operating'
      case 'investing': return 'Investing'
      case 'financing': return 'Financing'
      default: return ''
    }
  }

  const operatingData = data.filter(item => 
    item.category === 'operating' || item.id === 'operating-cash-flow'
  )
  const investingData = data.filter(item => 
    item.category === 'investing' || item.id === 'investing-cash-flow'
  )
  const financingData = data.filter(item => 
    item.category === 'financing' || item.id === 'financing-cash-flow'
  )
  const summaryData = data.filter(item => 
    ['net-change-cash', 'cash-beginning', 'cash-ending'].includes(item.id)
  )

  const renderSection = (sectionData: CashFlowItem[], title: string) => (
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
            ...getCategoryStyle(item.category),
            '&:hover': {
              backgroundColor: 'rgba(72, 101, 129, 0.02)',
            },
          }}
        >
          <TableCell sx={getCategoryStyle(item.category)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 'inherit',
                fontSize: 'inherit',
              }}>
                {item.label}
              </Typography>
              {item.category !== 'total' && getCategoryLabel(item.category) && (
                <Chip
                  label={getCategoryLabel(item.category)}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    backgroundColor: item.category === 'operating' ? '#dcfce7' : 
                                    item.category === 'investing' ? '#fee2e2' : '#dbeafe',
                    color: item.category === 'operating' ? '#166534' : 
                           item.category === 'investing' ? '#991b1b' : '#1e40af',
                  }}
                />
              )}
            </Box>
          </TableCell>
          
          <TableCell align="right" sx={getCategoryStyle(item.category)}>
            <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
              {formatCurrency(item.currentAmount)}
            </Typography>
          </TableCell>
          
          <TableCell align="right" sx={getCategoryStyle(item.category)}>
            <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
              {formatCurrency(item.priorAmount)}
            </Typography>
          </TableCell>
          
          <TableCell align="right" sx={getCategoryStyle(item.category)}>
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
            Cash Flow Statement
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
                Cash Flow Activity
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
            {renderSection(operatingData, 'OPERATING ACTIVITIES')}
            {renderSection(investingData, 'INVESTING ACTIVITIES')}
            {renderSection(financingData, 'FINANCING ACTIVITIES')}
            {renderSection(summaryData, 'NET CHANGE IN CASH')}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}