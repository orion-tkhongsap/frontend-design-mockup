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
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  Assessment,
  Psychology,
  Speed,
  Flag,
  AttachMoney,
  People,
  Schedule,
  Visibility,
  Refresh,
  GetApp,
  Share,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ExecutiveMetric {
  id: string
  name: string
  value: number
  target?: number
  previousValue: number
  unit: 'currency' | 'percentage' | 'number' | 'ratio'
  trend: 'up' | 'down' | 'stable'
  status: 'excellent' | 'good' | 'warning' | 'critical'
  category: 'financial' | 'operational' | 'strategic' | 'customer'
  priority: 'high' | 'medium' | 'low'
}

interface StrategicAlert {
  id: string
  title: string
  description: string
  severity: 'success' | 'warning' | 'error' | 'info'
  category: string
  actionRequired: boolean
  dueDate?: Date
}

interface BoardSummary {
  id: string
  title: string
  content: string
  category: 'achievements' | 'challenges' | 'opportunities' | 'risks'
  priority: number
}

const mockExecutiveMetrics: ExecutiveMetric[] = [
  {
    id: '1',
    name: 'Total Revenue',
    value: 48500000,
    target: 45000000,
    previousValue: 42300000,
    unit: 'currency',
    trend: 'up',
    status: 'excellent',
    category: 'financial',
    priority: 'high',
  },
  {
    id: '2',
    name: 'EBITDA Margin',
    value: 28.5,
    target: 25.0,
    previousValue: 24.8,
    unit: 'percentage',
    trend: 'up',
    status: 'excellent',
    category: 'financial',
    priority: 'high',
  },
  {
    id: '3',
    name: 'Customer Satisfaction',
    value: 88,
    target: 85,
    previousValue: 86,
    unit: 'percentage',
    trend: 'up',
    status: 'good',
    category: 'customer',
    priority: 'medium',
  },
  {
    id: '4',
    name: 'Market Share',
    value: 12.5,
    target: 15.0,
    previousValue: 11.8,
    unit: 'percentage',
    trend: 'up',
    status: 'warning',
    category: 'strategic',
    priority: 'high',
  },
  {
    id: '5',
    name: 'Employee Engagement',
    value: 82,
    previousValue: 79,
    unit: 'percentage',
    trend: 'up',
    status: 'good',
    category: 'operational',
    priority: 'medium',
  },
  {
    id: '6',
    name: 'Cash Flow Ratio',
    value: 1.45,
    target: 1.25,
    previousValue: 1.32,
    unit: 'ratio',
    trend: 'up',
    status: 'excellent',
    category: 'financial',
    priority: 'high',
  },
]

const mockStrategicAlerts: StrategicAlert[] = [
  {
    id: '1',
    title: 'Q4 Revenue Forecast Revision',
    description: 'AI models suggest increasing Q4 revenue forecast by 8% based on strong pipeline',
    severity: 'info',
    category: 'Financial Planning',
    actionRequired: true,
    dueDate: new Date('2025-10-15'),
  },
  {
    id: '2',
    title: 'Competitive Threat Analysis',
    description: 'TechFlow Solutions announced new product launch - requires response strategy',
    severity: 'warning',
    category: 'Competitive Intelligence',
    actionRequired: true,
    dueDate: new Date('2025-09-20'),
  },
  {
    id: '3',
    title: 'IT Infrastructure Investment',
    description: 'Critical infrastructure upgrade required to support 40% growth projection',
    severity: 'error',
    category: 'Operations',
    actionRequired: true,
    dueDate: new Date('2025-09-30'),
  },
]

const mockBoardSummary: BoardSummary[] = [
  {
    id: '1',
    title: 'Strong Q3 Financial Performance',
    content: 'Revenue exceeded targets by 8% with EBITDA margin expansion to 28.5%. Digital transformation initiatives contributing significantly to profitability.',
    category: 'achievements',
    priority: 1,
  },
  {
    id: '2',
    title: 'AI Platform Development Progress',
    content: 'Next-generation AI analytics platform on track for Q1 2026 launch. Beta testing with key customers showing promising results.',
    category: 'achievements',
    priority: 2,
  },
  {
    id: '3',
    title: 'Market Share Growth Opportunity',
    content: 'Current 12.5% market share below 15% target. Recommend increased marketing investment and accelerated product development.',
    category: 'opportunities',
    priority: 3,
  },
  {
    id: '4',
    title: 'Competitive Landscape Intensifying',
    content: 'New entrants and expanded competitor offerings require enhanced differentiation strategy and competitive response.',
    category: 'challenges',
    priority: 4,
  },
]

const revenueData = [
  { month: 'Jan', current: 3800, previous: 3500, target: 3600 },
  { month: 'Feb', current: 4100, previous: 3700, target: 3800 },
  { month: 'Mar', current: 4300, previous: 3900, target: 4000 },
  { month: 'Apr', current: 4500, previous: 4100, target: 4200 },
  { month: 'May', current: 4200, previous: 3800, target: 4000 },
  { month: 'Jun', current: 4600, previous: 4200, target: 4400 },
  { month: 'Jul', current: 4800, previous: 4400, target: 4600 },
  { month: 'Aug', current: 4900, previous: 4500, target: 4700 },
  { month: 'Sep', current: 5100, previous: 4600, target: 4800 },
]

const categoryData = [
  { name: 'Product Sales', value: 68, color: '#22c55e' },
  { name: 'Service Revenue', value: 22, color: '#3b82f6' },
  { name: 'Licensing', value: 7, color: '#f59e0b' },
  { name: 'Other', value: 3, color: '#6b7280' },
]

interface ExecutiveSummaryDashboardProps {
  metrics?: ExecutiveMetric[]
  className?: string
}

export function ExecutiveSummaryDashboard({
  metrics = mockExecutiveMetrics,
  className
}: ExecutiveSummaryDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2025')
  const [selectedView, setSelectedView] = useState('overview')

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
        return value.toLocaleString()
      default:
        return value.toString()
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
      case 'up': return <TrendingUp sx={{ color: '#22c55e', fontSize: 20 }} />
      case 'down': return <TrendingDown sx={{ color: '#ef4444', fontSize: 20 }} />
      case 'stable': return <Assessment sx={{ color: '#6b7280', fontSize: 20 }} />
      default: return <Assessment sx={{ color: '#6b7280', fontSize: 20 }} />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return <AttachMoney />
      case 'operational': return <Speed />
      case 'strategic': return <Flag />
      case 'customer': return <People />
      default: return <Dashboard />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return '#22c55e'
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  const overallScore = metrics.reduce((acc, metric) => {
    let score = 0
    if (metric.status === 'excellent') score = 100
    else if (metric.status === 'good') score = 75
    else if (metric.status === 'warning') score = 50
    else if (metric.status === 'critical') score = 25
    return acc + score
  }, 0) / metrics.length

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Executive Summary Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Key metrics, alerts, and insights for executive decision making
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="Q3 2025">Q3 2025</MenuItem>
                <MenuItem value="YTD 2025">YTD 2025</MenuItem>
                <MenuItem value="Last 12M">Last 12 Months</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ textTransform: 'none' }}
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Share />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Board Report
            </Button>
          </Box>
        </Box>

        {/* Overall Performance Score */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={overallScore}
              size={100}
              thickness={6}
              sx={{
                color: overallScore >= 80 ? '#22c55e' : overallScore >= 60 ? '#f59e0b' : '#ef4444',
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
        </Box>

        <Alert 
          severity={overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'error'}
          sx={{ textAlign: 'center' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {overallScore >= 80 
              ? 'Exceptional performance across key metrics - continue current strategy'
              : overallScore >= 60 
              ? 'Good performance with areas for improvement - monitor critical metrics'
              : 'Performance below expectations - immediate action required'
            }
          </Typography>
        </Alert>
      </Paper>

      {/* Key Metrics Grid */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Key Performance Indicators
        </Typography>
        
        <Grid container spacing={3}>
          {metrics.map((metric) => {
            const change = calculateChange(metric.value, metric.previousValue)
            const achievementRate = metric.target ? (metric.value / metric.target) * 100 : 100
            
            return (
              <Grid item xs={12} md={6} lg={4} key={metric.id}>
                <Card sx={{ 
                  height: '100%',
                  border: `2px solid ${getStatusColor(metric.status)}20`,
                  borderRadius: '8px',
                }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: `${getStatusColor(metric.status)}20`,
                          color: getStatusColor(metric.status),
                          width: 32,
                          height: 32,
                        }}
                      >
                        {getCategoryIcon(metric.category)}
                      </Avatar>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getTrendIcon(metric.trend)}
                        <Chip
                          label={metric.priority.toUpperCase()}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            backgroundColor: metric.priority === 'high' ? '#fee2e2' : '#f0f4f8',
                            color: metric.priority === 'high' ? '#991b1b' : '#374151',
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.2 }}>
                      {metric.name}
                    </Typography>
                    
                    <Typography variant="h4" sx={{ fontWeight: 700, color: getStatusColor(metric.status), mb: 1 }}>
                      {formatValue(metric.value, metric.unit)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ 
                        color: change >= 0 ? '#22c55e' : '#ef4444',
                        fontWeight: 600,
                      }}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        vs previous
                      </Typography>
                    </Box>
                    
                    {metric.target && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Target: {formatValue(metric.target, metric.unit)}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {achievementRate.toFixed(0)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(achievementRate, 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getStatusColor(metric.status),
                            },
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Revenue Trend */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Revenue Performance Trend
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}K`} />
                <RechartsTooltip
                  formatter={(value: number) => [`$${value}K`, '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#486581"
                  fill="#486581"
                  fillOpacity={0.1}
                  strokeWidth={3}
                  name="Current Year"
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  stroke="#e0e0e0"
                  fill="#e0e0e0"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Previous Year"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue Mix */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Revenue Mix
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            
            <Box sx={{ mt: 2 }}>
              {categoryData.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, borderRadius: '2px' }} />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {entry.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {entry.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Strategic Alerts */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Strategic Alerts
            </Typography>
            
            {mockStrategicAlerts.map((alert) => (
              <Alert 
                key={alert.id}
                severity={alert.severity}
                sx={{ mb: 2 }}
                action={
                  alert.actionRequired && (
                    <Button size="small" sx={{ textTransform: 'none' }}>
                      Action
                    </Button>
                  )
                }
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {alert.title}
                </Typography>
                <Typography variant="body2">
                  {alert.description}
                </Typography>
                {alert.dueDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Due: {alert.dueDate.toLocaleDateString()}
                  </Typography>
                )}
              </Alert>
            ))}
          </Paper>
        </Grid>

        {/* Board Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Board Meeting Summary
            </Typography>
            
            {mockBoardSummary.map((item) => (
              <Box key={item.id} sx={{ mb: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.content}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}