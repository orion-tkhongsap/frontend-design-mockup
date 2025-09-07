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
  IconButton,
  Collapse,
  Typography,
  Box,
  Chip,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material'
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  Remove,
  FilterList,
  GetApp,
  Refresh,
  MoreVert,
} from '@mui/icons-material'

interface PLLineItem {
  id: string
  label: string
  level: number
  amount: number
  previousAmount: number
  variance: number
  variancePercent: number
  hasChildren: boolean
  children?: PLLineItem[]
  category: 'revenue' | 'expense' | 'subtotal' | 'total'
}

const mockPLData: PLLineItem[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    level: 0,
    amount: 2450000,
    previousAmount: 2280000,
    variance: 170000,
    variancePercent: 7.46,
    hasChildren: true,
    category: 'revenue',
    children: [
      {
        id: 'product-revenue',
        label: 'Product Revenue',
        level: 1,
        amount: 1850000,
        previousAmount: 1720000,
        variance: 130000,
        variancePercent: 7.56,
        hasChildren: true,
        category: 'revenue',
        children: [
          {
            id: 'software-licenses',
            label: 'Software Licenses',
            level: 2,
            amount: 1200000,
            previousAmount: 1150000,
            variance: 50000,
            variancePercent: 4.35,
            hasChildren: false,
            category: 'revenue',
          },
          {
            id: 'subscriptions',
            label: 'Subscriptions',
            level: 2,
            amount: 650000,
            previousAmount: 570000,
            variance: 80000,
            variancePercent: 14.04,
            hasChildren: false,
            category: 'revenue',
          },
        ],
      },
      {
        id: 'service-revenue',
        label: 'Service Revenue',
        level: 1,
        amount: 600000,
        previousAmount: 560000,
        variance: 40000,
        variancePercent: 7.14,
        hasChildren: false,
        category: 'revenue',
      },
    ],
  },
  {
    id: 'cogs',
    label: 'Cost of Goods Sold',
    level: 0,
    amount: -980000,
    previousAmount: -912000,
    variance: -68000,
    variancePercent: 7.46,
    hasChildren: true,
    category: 'expense',
    children: [
      {
        id: 'direct-costs',
        label: 'Direct Costs',
        level: 1,
        amount: -520000,
        previousAmount: -480000,
        variance: -40000,
        variancePercent: 8.33,
        hasChildren: false,
        category: 'expense',
      },
      {
        id: 'overhead',
        label: 'Manufacturing Overhead',
        level: 1,
        amount: -460000,
        previousAmount: -432000,
        variance: -28000,
        variancePercent: 6.48,
        hasChildren: false,
        category: 'expense',
      },
    ],
  },
  {
    id: 'gross-profit',
    label: 'Gross Profit',
    level: 0,
    amount: 1470000,
    previousAmount: 1368000,
    variance: 102000,
    variancePercent: 7.46,
    hasChildren: false,
    category: 'subtotal',
  },
  {
    id: 'operating-expenses',
    label: 'Operating Expenses',
    level: 0,
    amount: -890000,
    previousAmount: -820000,
    variance: -70000,
    variancePercent: 8.54,
    hasChildren: true,
    category: 'expense',
    children: [
      {
        id: 'sales-marketing',
        label: 'Sales & Marketing',
        level: 1,
        amount: -450000,
        previousAmount: -410000,
        variance: -40000,
        variancePercent: 9.76,
        hasChildren: false,
        category: 'expense',
      },
      {
        id: 'rd',
        label: 'Research & Development',
        level: 1,
        amount: -280000,
        previousAmount: -260000,
        variance: -20000,
        variancePercent: 7.69,
        hasChildren: false,
        category: 'expense',
      },
      {
        id: 'general-admin',
        label: 'General & Administrative',
        level: 1,
        amount: -160000,
        previousAmount: -150000,
        variance: -10000,
        variancePercent: 6.67,
        hasChildren: false,
        category: 'expense',
      },
    ],
  },
  {
    id: 'operating-income',
    label: 'Operating Income (EBIT)',
    level: 0,
    amount: 580000,
    previousAmount: 548000,
    variance: 32000,
    variancePercent: 5.84,
    hasChildren: false,
    category: 'subtotal',
  },
  {
    id: 'net-income',
    label: 'Net Income',
    level: 0,
    amount: 435000,
    previousAmount: 411000,
    variance: 24000,
    variancePercent: 5.84,
    hasChildren: false,
    category: 'total',
  },
]

interface PLStatementProps {
  data?: PLLineItem[]
  period?: string
  comparisonPeriod?: string
}

export function PLStatement({ 
  data = mockPLData, 
  period = 'Q3 2025',
  comparisonPeriod = 'Q2 2025' 
}: PLStatementProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['revenue', 'cogs', 'operating-expenses'])
  const [loading, setLoading] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

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
      case 'subtotal':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(72, 101, 129, 0.04)',
          fontWeight: 600,
        }
      default:
        return baseStyle
    }
  }

  const renderRow = (item: PLLineItem): React.ReactNode[] => {
    const isExpanded = expandedItems.includes(item.id)
    const rows: React.ReactNode[] = []

    // Main row
    rows.push(
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {item.hasChildren && (
              <IconButton
                size="small"
                onClick={() => handleToggleExpand(item.id)}
                sx={{ mr: 1, p: 0.5 }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            <Typography variant="body2" sx={{ 
              fontWeight: 'inherit',
              fontSize: 'inherit',
              ml: !item.hasChildren ? 4 : 0,
            }}>
              {item.label}
            </Typography>
          </Box>
        </TableCell>
        
        <TableCell align="right" sx={getCategoryStyle(item.category, item.level)}>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
            {formatCurrency(item.amount)}
          </Typography>
        </TableCell>
        
        <TableCell align="right" sx={getCategoryStyle(item.category, item.level)}>
          <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>
            {formatCurrency(item.previousAmount)}
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
          </Box>
        </TableCell>
        
        <TableCell align="right" sx={getCategoryStyle(item.category, item.level)}>
          <Chip
            label={formatPercent(item.variancePercent)}
            size="small"
            sx={{
              backgroundColor: item.variancePercent >= 0 ? '#dcfce7' : '#fee2e2',
              color: item.variancePercent >= 0 ? '#166534' : '#991b1b',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </TableCell>
      </TableRow>
    )

    // Children rows (if expanded)
    if (isExpanded && item.children) {
      item.children.forEach(child => {
        rows.push(...renderRow(child))
      })
    }

    return rows
  }

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
            Profit & Loss Statement
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
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVert />
          </IconButton>
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
              <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>
                Variance %
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => renderRow(item)).flat()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem>Configure Columns</MenuItem>
        <MenuItem>Save as Template</MenuItem>
        <MenuItem>Schedule Report</MenuItem>
      </Menu>
    </Paper>
  )
}