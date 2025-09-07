'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  PlayArrow,
  Pause,
} from '@mui/icons-material'

interface Driver {
  id: string
  name: string
  description: string
  category: 'revenue' | 'expense' | 'operational'
  currentValue: number
  originalValue: number
  minValue: number
  maxValue: number
  unit: '%' | '$' | 'units' | 'ratio'
  locked: boolean
  impact: {
    revenue: number
    expenses: number
    netIncome: number
  }
}

interface DriverAdjustmentsProps {
  onDriverChange?: (driverId: string, newValue: number) => void
  onScenarioRun?: () => void
  realTimeUpdates?: boolean
}

const mockDrivers: Driver[] = [
  {
    id: 'revenue-growth',
    name: 'Revenue Growth Rate',
    description: 'Annual revenue growth percentage',
    category: 'revenue',
    currentValue: 15,
    originalValue: 12,
    minValue: -20,
    maxValue: 50,
    unit: '%',
    locked: false,
    impact: {
      revenue: 420000,
      expenses: 0,
      netIncome: 420000,
    },
  },
  {
    id: 'pricing-increase',
    name: 'Product Pricing Adjustment',
    description: 'Price increase across product portfolio',
    category: 'revenue',
    currentValue: 8,
    originalValue: 5,
    minValue: -15,
    maxValue: 25,
    unit: '%',
    locked: false,
    impact: {
      revenue: 180000,
      expenses: 0,
      netIncome: 180000,
    },
  },
  {
    id: 'marketing-spend',
    name: 'Marketing Spend Efficiency',
    description: 'Marketing cost as percentage of revenue',
    category: 'expense',
    currentValue: 18,
    originalValue: 20,
    minValue: 10,
    maxValue: 35,
    unit: '%',
    locked: false,
    impact: {
      revenue: 0,
      expenses: -56000,
      netIncome: 56000,
    },
  },
  {
    id: 'cost-reduction',
    name: 'Operational Cost Reduction',
    description: 'Cost optimization across operations',
    category: 'expense',
    currentValue: 12,
    originalValue: 8,
    minValue: 0,
    maxValue: 25,
    unit: '%',
    locked: false,
    impact: {
      revenue: 0,
      expenses: -120000,
      netIncome: 120000,
    },
  },
  {
    id: 'headcount',
    name: 'Team Size Adjustment',
    description: 'Full-time employee count changes',
    category: 'operational',
    currentValue: 5,
    originalValue: 0,
    minValue: -20,
    maxValue: 30,
    unit: '%',
    locked: false,
    impact: {
      revenue: 0,
      expenses: 180000,
      netIncome: -180000,
    },
  },
  {
    id: 'churn-rate',
    name: 'Customer Retention',
    description: 'Monthly customer churn rate',
    category: 'operational',
    currentValue: 3.5,
    originalValue: 4.2,
    minValue: 1,
    maxValue: 10,
    unit: '%',
    locked: true,
    impact: {
      revenue: 84000,
      expenses: 0,
      netIncome: 84000,
    },
  },
]

export function DriverAdjustments({ 
  onDriverChange, 
  onScenarioRun,
  realTimeUpdates = true 
}: DriverAdjustmentsProps) {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [isSimulating, setIsSimulating] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(realTimeUpdates)
  const [visibleCategories, setVisibleCategories] = useState<string[]>(['revenue', 'expense', 'operational'])

  const handleDriverChange = (driverId: string, newValue: number) => {
    setDrivers(prev => prev.map(driver => {
      if (driver.id === driverId) {
        // Simulate impact calculation
        const changeFactor = (newValue - driver.originalValue) / 100
        const newImpact = {
          revenue: driver.category === 'revenue' ? changeFactor * 500000 : 0,
          expenses: driver.category === 'expense' ? -changeFactor * 300000 : 0,
          netIncome: changeFactor * (driver.category === 'revenue' ? 500000 : -300000),
        }
        
        return {
          ...driver,
          currentValue: newValue,
          impact: newImpact,
        }
      }
      return driver
    }))

    if (autoUpdate && onDriverChange) {
      onDriverChange(driverId, newValue)
    }
  }

  const handleLockToggle = (driverId: string) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId ? { ...driver, locked: !driver.locked } : driver
    ))
  }

  const handleReset = () => {
    setDrivers(prev => prev.map(driver => ({
      ...driver,
      currentValue: driver.originalValue,
      impact: { revenue: 0, expenses: 0, netIncome: 0 },
    })))
  }

  const handleRunScenario = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      onScenarioRun?.()
    }, 2000)
  }

  const toggleCategoryVisibility = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case '%': return `${value.toFixed(1)}%`
      case '$': return `$${value.toLocaleString()}`
      case 'units': return value.toLocaleString()
      case 'ratio': return value.toFixed(2)
      default: return value.toString()
    }
  }

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${(Math.abs(amount) / 1000000).toFixed(1)}M`
    } else if (Math.abs(amount) >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(Math.abs(amount) / 1000).toFixed(0)}K`
    }
    return `${amount < 0 ? '-' : ''}$${Math.abs(amount).toLocaleString()}`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return '#22c55e'
      case 'expense': return '#ef4444'
      case 'operational': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const totalImpact = drivers.reduce((acc, driver) => ({
    revenue: acc.revenue + driver.impact.revenue,
    expenses: acc.expenses + driver.impact.expenses,
    netIncome: acc.netIncome + driver.impact.netIncome,
  }), { revenue: 0, expenses: 0, netIncome: 0 })

  const categorizedDrivers = {
    revenue: drivers.filter(d => d.category === 'revenue'),
    expense: drivers.filter(d => d.category === 'expense'),
    operational: drivers.filter(d => d.category === 'operational'),
  }

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Driver Adjustments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adjust key business drivers to see real-time impact on financial outcomes
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  size="small"
                />
              }
              label="Auto Update"
              sx={{ fontSize: '0.875rem' }}
            />
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<Refresh />}
              onClick={handleReset}
              sx={{ textTransform: 'none' }}
            >
              Reset
            </Button>
            
            <Button
              variant="contained"
              startIcon={isSimulating ? <Pause /> : <PlayArrow />}
              onClick={handleRunScenario}
              disabled={isSimulating}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': {
                  backgroundColor: '#334e68',
                },
              }}
            >
              {isSimulating ? 'Simulating...' : 'Run Scenario'}
            </Button>
          </Box>
        </Box>

        {/* Impact Summary */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          p: 2, 
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Total Revenue Impact</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
              {formatCurrency(totalImpact.revenue)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Total Expense Impact</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
              {formatCurrency(totalImpact.expenses)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Net Income Impact</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#486581' }}>
              {formatCurrency(totalImpact.netIncome)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Category Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Driver Categories
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Object.keys(categorizedDrivers).map((category) => (
            <Chip
              key={category}
              label={`${category.charAt(0).toUpperCase() + category.slice(1)} (${categorizedDrivers[category as keyof typeof categorizedDrivers].length})`}
              icon={visibleCategories.includes(category) ? <Visibility /> : <VisibilityOff />}
              onClick={() => toggleCategoryVisibility(category)}
              sx={{
                backgroundColor: visibleCategories.includes(category) 
                  ? getCategoryColor(category) + '20'
                  : '#e0e0e0',
                color: visibleCategories.includes(category) 
                  ? getCategoryColor(category)
                  : '#6b7280',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: visibleCategories.includes(category) 
                    ? getCategoryColor(category) + '30'
                    : '#d1d5db',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Driver Controls */}
      <Grid container spacing={3}>
        {Object.entries(categorizedDrivers).map(([category, categoryDrivers]) => {
          if (!visibleCategories.includes(category)) return null

          return (
            <React.Fragment key={category}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: getCategoryColor(category),
                  textTransform: 'capitalize',
                  mb: 2,
                }}>
                  {category} Drivers
                </Typography>
              </Grid>
              
              {categoryDrivers.map((driver) => (
                <Grid item xs={12} md={6} lg={4} key={driver.id}>
                  <Card sx={{ 
                    borderRadius: '12px',
                    border: `2px solid ${driver.locked ? '#f59e0b' : 'transparent'}`,
                    opacity: driver.locked ? 0.7 : 1,
                  }}>
                    <CardContent>
                      {/* Driver Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {driver.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {driver.description}
                          </Typography>
                        </Box>
                        
                        <Tooltip title={driver.locked ? 'Unlock driver' : 'Lock driver'}>
                          <IconButton
                            size="small"
                            onClick={() => handleLockToggle(driver.id)}
                            sx={{ color: driver.locked ? '#f59e0b' : '#6b7280' }}
                          >
                            {driver.locked ? <Lock /> : <LockOpen />}
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Current Value Display */}
                      <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: getCategoryColor(category) }}>
                          {formatValue(driver.currentValue, driver.unit)}
                        </Typography>
                        {driver.currentValue !== driver.originalValue && (
                          <Chip
                            label={`${driver.currentValue > driver.originalValue ? '+' : ''}${(driver.currentValue - driver.originalValue).toFixed(1)}${driver.unit}`}
                            size="small"
                            sx={{
                              backgroundColor: driver.currentValue > driver.originalValue ? '#dcfce7' : '#fee2e2',
                              color: driver.currentValue > driver.originalValue ? '#166534' : '#991b1b',
                              fontWeight: 600,
                              mt: 0.5,
                            }}
                          />
                        )}
                      </Box>

                      {/* Slider */}
                      <Box sx={{ mb: 2 }}>
                        <Slider
                          value={driver.currentValue}
                          onChange={(_, value) => handleDriverChange(driver.id, value as number)}
                          min={driver.minValue}
                          max={driver.maxValue}
                          step={0.1}
                          disabled={driver.locked}
                          marks={[
                            { value: driver.originalValue, label: 'Original' },
                          ]}
                          sx={{
                            color: getCategoryColor(category),
                            '& .MuiSlider-thumb': {
                              backgroundColor: getCategoryColor(category),
                            },
                            '& .MuiSlider-track': {
                              backgroundColor: getCategoryColor(category),
                            },
                            '& .MuiSlider-mark': {
                              backgroundColor: '#6b7280',
                            },
                            '& .MuiSlider-markLabel': {
                              fontSize: '0.7rem',
                              color: '#6b7280',
                            },
                          }}
                        />
                      </Box>

                      {/* Range Input */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          label="Min"
                          value={driver.minValue}
                          size="small"
                          disabled
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Max"
                          value={driver.maxValue}
                          size="small"
                          disabled
                          sx={{ flex: 1 }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Impact Summary */}
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'block' }}>
                        Financial Impact
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Revenue</Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: driver.impact.revenue >= 0 ? '#22c55e' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            {driver.impact.revenue > 0 ? <TrendingUp sx={{ fontSize: 14 }} /> : 
                             driver.impact.revenue < 0 ? <TrendingDown sx={{ fontSize: 14 }} /> : null}
                            {formatCurrency(driver.impact.revenue)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Expenses</Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: driver.impact.expenses <= 0 ? '#22c55e' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            {driver.impact.expenses > 0 ? <TrendingUp sx={{ fontSize: 14 }} /> : 
                             driver.impact.expenses < 0 ? <TrendingDown sx={{ fontSize: 14 }} /> : null}
                            {formatCurrency(driver.impact.expenses)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Net Impact</Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: driver.impact.netIncome >= 0 ? '#22c55e' : '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            {driver.impact.netIncome > 0 ? <TrendingUp sx={{ fontSize: 14 }} /> : 
                             driver.impact.netIncome < 0 ? <TrendingDown sx={{ fontSize: 14 }} /> : null}
                            {formatCurrency(driver.impact.netIncome)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </React.Fragment>
          )
        })}
      </Grid>
    </Box>
  )
}