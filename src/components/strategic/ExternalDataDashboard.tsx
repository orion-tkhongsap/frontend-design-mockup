'use client'

import React, { useState, useEffect } from 'react'
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
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Public,
  Refresh,
  Warning,
  CheckCircle,
  Schedule,
  Assessment,
  ShowChart,
  CloudDownload,
  Sync,
  Error,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

interface ExternalDataSource {
  id: string
  name: string
  type: 'market' | 'economic' | 'industry' | 'social'
  status: 'connected' | 'syncing' | 'error' | 'inactive'
  lastSync: Date
  refreshFrequency: string
  provider: string
  description: string
  dataPoints: number
}

interface MarketIndicator {
  id: string
  name: string
  value: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
  significance: 'high' | 'medium' | 'low'
  unit: string
  source: string
  lastUpdated: Date
}

interface EconomicData {
  period: string
  gdpGrowth: number
  inflationRate: number
  unemploymentRate: number
  interestRate: number
  consumerConfidence: number
  stockMarketIndex: number
}

const mockDataSources: ExternalDataSource[] = [
  {
    id: '1',
    name: 'Bloomberg Market Data',
    type: 'market',
    status: 'connected',
    lastSync: new Date('2025-09-06T14:30:00'),
    refreshFrequency: 'Real-time',
    provider: 'Bloomberg',
    description: 'Real-time financial market data and indices',
    dataPoints: 1250,
  },
  {
    id: '2',
    name: 'Federal Reserve Economic Data',
    type: 'economic',
    status: 'connected',
    lastSync: new Date('2025-09-06T12:00:00'),
    refreshFrequency: 'Daily',
    provider: 'FRED',
    description: 'US economic indicators and monetary policy data',
    dataPoints: 850,
  },
  {
    id: '3',
    name: 'Industry Research Reports',
    type: 'industry',
    status: 'syncing',
    lastSync: new Date('2025-09-06T08:15:00'),
    refreshFrequency: 'Weekly',
    provider: 'Gartner',
    description: 'Technology industry analysis and forecasts',
    dataPoints: 420,
  },
  {
    id: '4',
    name: 'Social Media Sentiment',
    type: 'social',
    status: 'error',
    lastSync: new Date('2025-09-05T18:45:00'),
    refreshFrequency: 'Hourly',
    provider: 'Social Analytics',
    description: 'Brand sentiment and market perception data',
    dataPoints: 2100,
  },
]

const mockMarketIndicators: MarketIndicator[] = [
  {
    id: '1',
    name: 'S&P 500 Index',
    value: 4825.75,
    change: 28.40,
    changePercent: 0.59,
    trend: 'up',
    significance: 'high',
    unit: 'points',
    source: 'Bloomberg',
    lastUpdated: new Date('2025-09-06T15:30:00'),
  },
  {
    id: '2',
    name: 'Technology Sector ETF',
    value: 142.85,
    change: -1.20,
    changePercent: -0.83,
    trend: 'down',
    significance: 'medium',
    unit: 'USD',
    source: 'Bloomberg',
    lastUpdated: new Date('2025-09-06T15:30:00'),
  },
  {
    id: '3',
    name: 'Dollar Index (DXY)',
    value: 103.45,
    change: 0.15,
    changePercent: 0.15,
    trend: 'up',
    significance: 'medium',
    unit: 'index',
    source: 'Bloomberg',
    lastUpdated: new Date('2025-09-06T15:30:00'),
  },
  {
    id: '4',
    name: 'VIX Volatility Index',
    value: 18.25,
    change: -2.10,
    changePercent: -10.34,
    trend: 'down',
    significance: 'high',
    unit: 'index',
    source: 'Bloomberg',
    lastUpdated: new Date('2025-09-06T15:30:00'),
  },
]

const mockEconomicData: EconomicData[] = [
  { period: '2025-Q1', gdpGrowth: 2.1, inflationRate: 3.2, unemploymentRate: 3.8, interestRate: 5.25, consumerConfidence: 108.2, stockMarketIndex: 4650 },
  { period: '2025-Q2', gdpGrowth: 2.4, inflationRate: 2.9, unemploymentRate: 3.6, interestRate: 5.50, consumerConfidence: 112.5, stockMarketIndex: 4750 },
  { period: '2025-Q3', gdpGrowth: 2.8, inflationRate: 2.6, unemploymentRate: 3.4, interestRate: 5.25, consumerConfidence: 115.8, stockMarketIndex: 4825 },
]

interface ExternalDataDashboardProps {
  dataSources?: ExternalDataSource[]
  marketIndicators?: MarketIndicator[]
  className?: string
}

export function ExternalDataDashboard({
  dataSources = mockDataSources,
  marketIndicators = mockMarketIndicators,
  className
}: ExternalDataDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [syncingStatus, setSyncingStatus] = useState<{ [key: string]: boolean }>({})

  // Simulate real-time updates
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate data refresh
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#22c55e'
      case 'syncing': return '#3b82f6'
      case 'error': return '#ef4444'
      case 'inactive': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle />
      case 'syncing': return <Sync />
      case 'error': return <Error />
      case 'inactive': return <Schedule />
      default: return <Schedule />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
      case 'down': return <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
      default: return <ShowChart sx={{ color: '#6b7280', fontSize: 16 }} />
    }
  }

  const getSignificanceChip = (significance: string) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e',
    }
    
    return (
      <Chip
        label={significance.toUpperCase()}
        size="small"
        sx={{
          backgroundColor: `${colors[significance as keyof typeof colors]}20`,
          color: colors[significance as keyof typeof colors],
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    )
  }

  const handleManualSync = (sourceId: string) => {
    setSyncingStatus(prev => ({ ...prev, [sourceId]: true }))
    setTimeout(() => {
      setSyncingStatus(prev => ({ ...prev, [sourceId]: false }))
    }, 3000)
  }

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : ''
    const color = change >= 0 ? '#22c55e' : '#ef4444'
    
    return (
      <Box sx={{ color, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {sign}{change.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ({sign}{changePercent.toFixed(2)}%)
        </Typography>
      </Box>
    )
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              External Data Integration Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time market data, economic indicators, and industry insights
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={selectedTimeframe}
                label="Timeframe"
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <MenuItem value="1D">1 Day</MenuItem>
                <MenuItem value="1W">1 Week</MenuItem>
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant={autoRefresh ? 'contained' : 'outlined'}
              startIcon={<Sync />}
              onClick={() => setAutoRefresh(!autoRefresh)}
              sx={{ textTransform: 'none' }}
            >
              Auto Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              sx={{ textTransform: 'none' }}
            >
              Export Data
            </Button>
          </Box>
        </Box>

        {/* Data Source Status */}
        <Grid container spacing={2}>
          {dataSources.map((source) => (
            <Grid item xs={6} md={3} key={source.id}>
              <Card sx={{ 
                border: `2px solid ${getStatusColor(source.status)}20`,
                '&:hover': { borderColor: `${getStatusColor(source.status)}40` },
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Avatar
                      sx={{
                        backgroundColor: getStatusColor(source.status),
                        width: 24,
                        height: 24,
                      }}
                    >
                      <Public sx={{ fontSize: 14 }} />
                    </Avatar>
                    <IconButton
                      size="small"
                      onClick={() => handleManualSync(source.id)}
                      disabled={syncingStatus[source.id]}
                    >
                      <Refresh sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                    {source.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {source.provider}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Box sx={{ color: getStatusColor(source.status) }}>
                      {getStatusIcon(source.status)}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {source.status.toUpperCase()}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {source.dataPoints.toLocaleString()} data points
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {source.lastSync.toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Market Indicators */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Real-Time Market Indicators
        </Typography>
        
        <Grid container spacing={3}>
          {marketIndicators.map((indicator) => (
            <Grid item xs={12} md={6} lg={3} key={indicator.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {indicator.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getTrendIcon(indicator.trend)}
                      {getSignificanceChip(indicator.significance)}
                    </Box>
                  </Box>
                  
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {indicator.value.toLocaleString()}
                  </Typography>
                  
                  {formatChange(indicator.change, indicator.changePercent)}
                  
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Source: {indicator.source}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Updated: {indicator.lastUpdated.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Economic Trends */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Economic Indicators Trend
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockEconomicData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="period" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="gdpGrowth"
              stroke="#22c55e"
              strokeWidth={2}
              name="GDP Growth %"
            />
            <Line
              type="monotone"
              dataKey="inflationRate"
              stroke="#ef4444"
              strokeWidth={2}
              name="Inflation Rate %"
            />
            <Line
              type="monotone"
              dataKey="unemploymentRate"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Unemployment %"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Data Quality Alerts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Alert severity="success" icon={<CheckCircle />}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Market Data: All sources synchronized and up-to-date
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <Alert severity="warning" icon={<Warning />}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Social Analytics: Connection error - attempting retry
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  )
}