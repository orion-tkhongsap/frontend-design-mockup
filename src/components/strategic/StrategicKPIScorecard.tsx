'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  Remove,
  Warning,
  CheckCircle,
  Error,
  Speed,
  Timeline,
  Flag,
  Edit,
  Refresh,
  FilterList,
  GetApp,
  BarChart,
} from '@mui/icons-material'

interface KPIMetric {
  id: string
  name: string
  category: 'financial' | 'operational' | 'customer' | 'growth' | 'efficiency'
  currentValue: number
  targetValue: number
  previousValue: number
  unit: 'currency' | 'percentage' | 'number' | 'ratio'
  trend: 'up' | 'down' | 'stable'
  status: 'excellent' | 'good' | 'warning' | 'critical'
  description: string
  owner: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  lastUpdated: Date
}

interface ScoreCardPerspective {
  id: string
  name: string
  description: string
  weight: number
  score: number
  kpis: KPIMetric[]
  color: string
}

const mockKPIMetrics: KPIMetric[] = [
  {
    id: '1',
    name: 'Revenue Growth Rate',
    category: 'financial',
    currentValue: 23.5,
    targetValue: 20.0,
    previousValue: 18.2,
    unit: 'percentage',
    trend: 'up',
    status: 'excellent',
    description: 'Year-over-year revenue growth percentage',
    owner: 'CFO',
    frequency: 'quarterly',
    lastUpdated: new Date('2025-09-06T14:30:00'),
  },
  {
    id: '2',
    name: 'Gross Margin',
    category: 'financial',
    currentValue: 68.5,
    targetValue: 65.0,
    previousValue: 64.2,
    unit: 'percentage',
    trend: 'up',
    status: 'excellent',
    description: 'Gross profit margin percentage',
    owner: 'CFO',
    frequency: 'monthly',
    lastUpdated: new Date('2025-09-06T14:30:00'),
  },
  {
    id: '3',
    name: 'Customer Acquisition Cost',
    category: 'customer',
    currentValue: 850,
    targetValue: 1000,
    previousValue: 920,
    unit: 'currency',
    trend: 'down',
    status: 'excellent',
    description: 'Average cost to acquire a new customer',
    owner: 'CMO',
    frequency: 'monthly',
    lastUpdated: new Date('2025-09-06T12:15:00'),
  },
  {
    id: '4',
    name: 'Customer Lifetime Value',
    category: 'customer',
    currentValue: 12500,
    targetValue: 10000,
    previousValue: 11800,
    unit: 'currency',
    trend: 'up',
    status: 'excellent',
    description: 'Average lifetime value per customer',
    owner: 'CMO',
    frequency: 'quarterly',
    lastUpdated: new Date('2025-09-06T12:15:00'),
  },
  {
    id: '5',
    name: 'Employee Productivity',
    category: 'operational',
    currentValue: 285000,
    targetValue: 275000,
    previousValue: 268000,
    unit: 'currency',
    trend: 'up',
    status: 'good',
    description: 'Revenue per employee',
    owner: 'COO',
    frequency: 'quarterly',
    lastUpdated: new Date('2025-09-06T10:45:00'),
  },
  {
    id: '6',
    name: 'Operational Efficiency',
    category: 'operational',
    currentValue: 87.2,
    targetValue: 85.0,
    previousValue: 84.1,
    unit: 'percentage',
    trend: 'up',
    status: 'good',
    description: 'Overall operational efficiency score',
    owner: 'COO',
    frequency: 'monthly',
    lastUpdated: new Date('2025-09-06T10:45:00'),
  },
  {
    id: '7',
    name: 'Market Share',
    category: 'growth',
    currentValue: 15.8,
    targetValue: 18.0,
    previousValue: 14.5,
    unit: 'percentage',
    trend: 'up',
    status: 'warning',
    description: 'Percentage of total addressable market',
    owner: 'CEO',
    frequency: 'quarterly',
    lastUpdated: new Date('2025-09-05T16:20:00'),
  },
  {
    id: '8',
    name: 'Innovation Pipeline',
    category: 'growth',
    currentValue: 12,
    targetValue: 15,
    previousValue: 10,
    unit: 'number',
    trend: 'up',
    status: 'warning',
    description: 'Number of active innovation projects',
    owner: 'CTO',
    frequency: 'monthly',
    lastUpdated: new Date('2025-09-05T16:20:00'),
  },
  {
    id: '9',
    name: 'Cash Flow Ratio',
    category: 'financial',
    currentValue: 1.45,
    targetValue: 1.25,
    previousValue: 1.32,
    unit: 'ratio',
    trend: 'up',
    status: 'excellent',
    description: 'Operating cash flow to net income ratio',
    owner: 'CFO',
    frequency: 'monthly',
    lastUpdated: new Date('2025-09-06T14:30:00'),
  },
  {
    id: '10',
    name: 'IT Infrastructure Uptime',
    category: 'operational',
    currentValue: 98.2,
    targetValue: 99.0,
    previousValue: 97.8,
    unit: 'percentage',
    trend: 'up',
    status: 'warning',
    description: 'System availability percentage',
    owner: 'CTO',
    frequency: 'daily',
    lastUpdated: new Date('2025-09-06T08:00:00'),
  },
]

const perspectives: ScoreCardPerspective[] = [
  {
    id: '1',
    name: 'Financial Performance',
    description: 'Revenue, profitability, and financial health metrics',
    weight: 35,
    score: 92,
    color: '#22c55e',
    kpis: mockKPIMetrics.filter(kpi => kpi.category === 'financial'),
  },
  {
    id: '2',
    name: 'Customer Success',
    description: 'Customer satisfaction, retention, and value metrics',
    weight: 25,
    score: 88,
    color: '#3b82f6',
    kpis: mockKPIMetrics.filter(kpi => kpi.category === 'customer'),
  },
  {
    id: '3',
    name: 'Operational Excellence',
    description: 'Process efficiency, productivity, and quality metrics',
    weight: 25,
    score: 85,
    color: '#f59e0b',
    kpis: mockKPIMetrics.filter(kpi => kpi.category === 'operational'),
  },
  {
    id: '4',
    name: 'Growth & Innovation',
    description: 'Market expansion, product development, and strategic metrics',
    weight: 15,
    score: 78,
    color: '#8b5cf6',
    kpis: mockKPIMetrics.filter(kpi => kpi.category === 'growth'),
  },
]

interface StrategicKPIScorecardProps {
  perspectives?: ScoreCardPerspective[]
  onKPIUpdate?: (kpiId: string, newValue: number) => void
  className?: string
}

export function StrategicKPIScorecard({
  perspectives: scorecardPerspectives = perspectives,
  onKPIUpdate,
  className
}: StrategicKPIScorecardProps) {
  const [selectedPerspective, setSelectedPerspective] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState('current')

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
        return `$${value.toLocaleString()}`
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'ratio':
        return `${value.toFixed(2)}x`
      case 'number':
        return value.toString()
      default:
        return value.toString()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle sx={{ color: '#22c55e' }} />
      case 'good': return <CheckCircle sx={{ color: '#3b82f6' }} />
      case 'warning': return <Warning sx={{ color: '#f59e0b' }} />
      case 'critical': return <Error sx={{ color: '#ef4444' }} />
      default: return <Remove sx={{ color: '#6b7280' }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#22c55e'
      case 'good': return '#3b82f6'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
      case 'down': return <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
      case 'stable': return <Remove sx={{ color: '#6b7280', fontSize: 16 }} />
      default: return <Remove sx={{ color: '#6b7280', fontSize: 16 }} />
    }
  }

  const calculateOverallScore = () => {
    return scorecardPerspectives.reduce((total, perspective) => {
      return total + (perspective.score * perspective.weight / 100)
    }, 0)
  }

  const filteredPerspectives = selectedPerspective === 'all' 
    ? scorecardPerspectives 
    : scorecardPerspectives.filter(p => p.id === selectedPerspective)

  const overallScore = calculateOverallScore()

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Strategic KPI Scorecard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Balanced scorecard with traffic light indicators and performance tracking
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Perspective</InputLabel>
              <Select
                value={selectedPerspective}
                label="Perspective"
                onChange={(e) => setSelectedPerspective(e.target.value)}
              >
                <MenuItem value="all">All Perspectives</MenuItem>
                {scorecardPerspectives.map(perspective => (
                  <MenuItem key={perspective.id} value={perspective.id}>
                    {perspective.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="current">Current</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="ytd">Year to Date</MenuItem>
                <MenuItem value="annual">Annual</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ textTransform: 'none' }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Overall Score */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
            <CircularProgress
              variant="determinate"
              value={overallScore}
              size={120}
              thickness={8}
              sx={{
                color: overallScore >= 90 ? '#22c55e' : overallScore >= 75 ? '#f59e0b' : '#ef4444',
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {overallScore.toFixed(0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Overall Score
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Strategic Performance Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Weighted score across all strategic perspectives
          </Typography>
        </Box>

        {/* Perspective Overview */}
        <Grid container spacing={2}>
          {scorecardPerspectives.map((perspective) => (
            <Grid item xs={6} md={3} key={perspective.id}>
              <Card sx={{ 
                textAlign: 'center', 
                p: 2,
                border: `2px solid ${perspective.color}20`,
                '&:hover': {
                  borderColor: `${perspective.color}40`,
                },
              }}>
                <Avatar
                  sx={{
                    backgroundColor: perspective.color,
                    mx: 'auto',
                    mb: 1,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Dashboard sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: perspective.color, mb: 0.5 }}>
                  {perspective.score}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                  {perspective.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {perspective.weight}% weight
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Detailed KPI Cards */}
      {filteredPerspectives.map((perspective) => (
        <Paper key={perspective.id} elevation={2} sx={{ mb: 3, borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid #e0e0e0', 
            backgroundColor: `${perspective.color}10`,
            borderLeft: `4px solid ${perspective.color}`,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {perspective.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {perspective.description}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: perspective.color }}>
                    {perspective.score}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Score
                  </Typography>
                </Box>
                <IconButton size="small">
                  <Edit />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {perspective.kpis.map((kpi) => {
                const achievementRate = (kpi.currentValue / kpi.targetValue) * 100
                const previousChange = ((kpi.currentValue - kpi.previousValue) / kpi.previousValue) * 100

                return (
                  <Grid item xs={12} md={6} lg={4} key={kpi.id}>
                    <Card sx={{ 
                      height: '100%',
                      border: `1px solid ${getStatusColor(kpi.status)}40`,
                      borderRadius: '8px',
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.2 }}>
                              {kpi.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {kpi.description}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getStatusIcon(kpi.status)}
                            {getTrendIcon(kpi.trend)}
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: getStatusColor(kpi.status) }}>
                              {formatValue(kpi.currentValue, kpi.unit)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Target: {formatValue(kpi.targetValue, kpi.unit)}
                            </Typography>
                          </Box>
                          
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(achievementRate, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getStatusColor(kpi.status),
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {achievementRate.toFixed(0)}% of target
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Previous</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatValue(kpi.previousValue, kpi.unit)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">Change</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                color: previousChange >= 0 ? '#22c55e' : '#ef4444',
                              }}
                            >
                              {previousChange >= 0 ? '+' : ''}{previousChange.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Owner: {kpi.owner}
                          </Typography>
                          <Chip
                            label={kpi.frequency.toUpperCase()}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 18,
                              backgroundColor: '#f0f4f8',
                              color: '#374151',
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        </Paper>
      ))}

      {/* Summary Alerts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="success" icon={<CheckCircle />}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Strong Performance: Financial and Customer perspectives exceeding targets
          </Typography>
        </Alert>
        <Alert severity="warning" icon={<Warning />}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Attention Needed: Market Share and Innovation Pipeline below targets
          </Typography>
        </Alert>
      </Box>
    </Box>
  )
}