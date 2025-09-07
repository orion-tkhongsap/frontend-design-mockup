'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Divider,
  Slider,
} from '@mui/material'
import {
  SwapHoriz,
  TrendingUp,
  TrendingDown,
  Remove,
  Visibility,
  VisibilityOff,
  CompareArrows,
  GetApp,
} from '@mui/icons-material'

interface ScenarioData {
  id: string
  name: string
  type: 'budget' | 'forecast' | 'whatif' | 'stress-test'
  accounts: {
    [key: string]: number
  }
}

const mockScenarioData: ScenarioData[] = [
  {
    id: '1',
    name: 'Q4 2025 Budget Plan',
    type: 'budget',
    accounts: {
      'Total Revenue': 2800000,
      'Product Revenue': 2100000,
      'Service Revenue': 700000,
      'Cost of Goods Sold': -1120000,
      'Gross Profit': 1680000,
      'Sales & Marketing': -560000,
      'R&D': -350000,
      'General & Admin': -200000,
      'Operating Income': 570000,
      'Net Income': 428000,
    },
  },
  {
    id: '2',
    name: 'Conservative Scenario',
    type: 'whatif',
    accounts: {
      'Total Revenue': 2100000,
      'Product Revenue': 1575000,
      'Service Revenue': 525000,
      'Cost of Goods Sold': -840000,
      'Gross Profit': 1260000,
      'Sales & Marketing': -420000,
      'R&D': -262500,
      'General & Admin': -150000,
      'Operating Income': 427500,
      'Net Income': 321000,
    },
  },
  {
    id: '3',
    name: 'New Product Launch',
    type: 'forecast',
    accounts: {
      'Total Revenue': 3200000,
      'Product Revenue': 2560000,
      'Service Revenue': 640000,
      'Cost of Goods Sold': -1280000,
      'Gross Profit': 1920000,
      'Sales & Marketing': -800000,
      'R&D': -480000,
      'General & Admin': -240000,
      'Operating Income': 400000,
      'Net Income': 300000,
    },
  },
]

interface ScenarioComparisonProps {
  scenarios?: ScenarioData[]
  syncScroll?: boolean
}

export function ScenarioComparison({ 
  scenarios = mockScenarioData, 
  syncScroll = true 
}: ScenarioComparisonProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(scenarios.map(s => s.id))
  const [baseScenario, setBaseScenario] = useState<string>(scenarios[0]?.id || '')
  const [highlightDifferences, setHighlightDifferences] = useState(true)
  const tableRef = useRef<HTMLDivElement>(null)

  // Get all unique account names
  const allAccounts = Array.from(
    new Set(scenarios.flatMap(s => Object.keys(s.accounts)))
  )

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    if (absAmount >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000).toFixed(0)}K`
    }
    return `${amount < 0 ? '-' : ''}$${absAmount.toLocaleString()}`
  }

  const getVariance = (current: number, base: number) => {
    if (base === 0) return 0
    return ((current - base) / Math.abs(base)) * 100
  }

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 1) return '#6b7280'
    if (variance > 0) return '#22c55e'
    return '#ef4444'
  }

  const getVarianceIcon = (variance: number) => {
    if (Math.abs(variance) < 1) return <Remove sx={{ fontSize: 16 }} />
    if (variance > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    return <TrendingDown sx={{ fontSize: 16 }} />
  }

  const toggleColumnVisibility = (scenarioId: string) => {
    setVisibleColumns(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    )
  }

  const getScenarioTypeColor = (type: string) => {
    switch (type) {
      case 'budget': return '#22c55e'
      case 'forecast': return '#3b82f6'
      case 'whatif': return '#f59e0b'
      case 'stress-test': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const baseScenarioData = scenarios.find(s => s.id === baseScenario)
  const visibleScenarios = scenarios.filter(s => visibleColumns.includes(s.id))

  return (
    <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafbfc',
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Scenario Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Side-by-side analysis of {scenarios.length} scenarios
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant={highlightDifferences ? 'contained' : 'outlined'}
            size="small"
            startIcon={<CompareArrows />}
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            sx={{ textTransform: 'none' }}
          >
            Highlight Differences
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<GetApp />}
            sx={{ textTransform: 'none' }}
          >
            Export Comparison
          </Button>
        </Box>
      </Box>

      {/* Column Controls */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8fafc' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Visible Scenarios
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {scenarios.map((scenario) => (
            <Chip
              key={scenario.id}
              label={scenario.name}
              icon={visibleColumns.includes(scenario.id) ? <Visibility /> : <VisibilityOff />}
              onClick={() => toggleColumnVisibility(scenario.id)}
              sx={{
                backgroundColor: visibleColumns.includes(scenario.id) 
                  ? getScenarioTypeColor(scenario.type) + '20'
                  : '#e0e0e0',
                color: visibleColumns.includes(scenario.id) 
                  ? getScenarioTypeColor(scenario.type)
                  : '#6b7280',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: visibleColumns.includes(scenario.id) 
                    ? getScenarioTypeColor(scenario.type) + '30'
                    : '#d1d5db',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Comparison Table */}
      <TableContainer 
        ref={tableRef}
        sx={{ 
          maxHeight: 600,
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#486581',
            borderRadius: 4,
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, backgroundColor: '#fafbfc', minWidth: 200 }}>
                Account
              </TableCell>
              {visibleScenarios.map((scenario) => (
                <TableCell 
                  key={scenario.id} 
                  align="right" 
                  sx={{ 
                    fontWeight: 600, 
                    backgroundColor: '#fafbfc',
                    minWidth: 150,
                    borderLeft: '1px solid #e0e0e0',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {scenario.name}
                    </Typography>
                    <Chip
                      label={scenario.type.toUpperCase()}
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 18,
                        fontSize: '0.7rem',
                        backgroundColor: getScenarioTypeColor(scenario.type) + '20',
                        color: getScenarioTypeColor(scenario.type),
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {allAccounts.map((account, index) => {
              const baseValue = baseScenarioData?.accounts[account] || 0
              
              return (
                <TableRow 
                  key={account}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(72, 101, 129, 0.02)',
                    },
                    backgroundColor: index % 2 === 0 ? 'transparent' : '#fafbfc',
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>
                    {account}
                  </TableCell>
                  
                  {visibleScenarios.map((scenario) => {
                    const value = scenario.accounts[account] || 0
                    const variance = getVariance(value, baseValue)
                    const isSignificantDiff = Math.abs(variance) > 5
                    
                    return (
                      <TableCell 
                        key={scenario.id} 
                        align="right"
                        sx={{ 
                          borderLeft: '1px solid #e0e0e0',
                          backgroundColor: highlightDifferences && isSignificantDiff && scenario.id !== baseScenario
                            ? variance > 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                            : 'inherit',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: scenario.id === baseScenario ? 700 : 500,
                              fontFamily: 'monospace',
                            }}
                          >
                            {formatCurrency(value)}
                          </Typography>
                          
                          {scenario.id !== baseScenario && baseValue !== 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <Box sx={{ color: getVarianceColor(variance) }}>
                                {getVarianceIcon(variance)}
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: getVarianceColor(variance),
                                  fontWeight: 600,
                                }}
                              >
                                {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                          
                          {scenario.id === baseScenario && (
                            <Chip
                              label="BASE"
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 16,
                                fontSize: '0.6rem',
                                backgroundColor: '#486581',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Stats */}
      <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', backgroundColor: '#fafbfc' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Scenario Summary
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {visibleScenarios.map((scenario) => {
            const netIncome = scenario.accounts['Net Income'] || 0
            const revenue = scenario.accounts['Total Revenue'] || 0
            const margin = revenue ? (netIncome / revenue) * 100 : 0
            
            return (
              <Box key={scenario.id} sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {scenario.name}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: getScenarioTypeColor(scenario.type) }}>
                  {formatCurrency(netIncome)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {margin.toFixed(1)}% margin
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Paper>
  )
}