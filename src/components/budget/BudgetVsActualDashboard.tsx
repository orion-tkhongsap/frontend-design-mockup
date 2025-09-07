'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  GetApp,
  FilterList,
} from '@mui/icons-material'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts'

interface BudgetData {
  category: string
  department: string
  budgetAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
  monthlyData: {
    month: string
    budget: number
    actual: number
  }[]
  status: 'on-track' | 'over-budget' | 'under-budget' | 'at-risk'
}

const mockBudgetData: BudgetData[] = [
  {
    category: 'Personnel',
    department: 'Marketing',
    budgetAmount: 750000,
    actualAmount: 720000,
    variance: -30000,
    variancePercent: -4.0,
    status: 'under-budget',
    monthlyData: [
      { month: 'Jan', budget: 62500, actual: 60000 },
      { month: 'Feb', budget: 62500, actual: 62000 },
      { month: 'Mar', budget: 62500, actual: 61500 },
      { month: 'Apr', budget: 62500, actual: 59000 },
      { month: 'May', budget: 62500, actual: 60500 },
      { month: 'Jun', budget: 62500, actual: 61000 },
      { month: 'Jul', budget: 62500, actual: 58000 },
      { month: 'Aug', budget: 62500, actual: 60000 },
      { month: 'Sep', budget: 62500, actual: 58000 },
    ],
  },
  {
    category: 'Marketing Campaigns',
    department: 'Marketing',
    budgetAmount: 230000,
    actualAmount: 248000,
    variance: 18000,
    variancePercent: 7.8,
    status: 'over-budget',
    monthlyData: [
      { month: 'Jan', budget: 25556, actual: 24000 },
      { month: 'Feb', budget: 25556, actual: 26000 },
      { month: 'Mar', budget: 25556, actual: 28000 },
      { month: 'Apr', budget: 25556, actual: 27000 },
      { month: 'May', budget: 25556, actual: 29000 },
      { month: 'Jun', budget: 25556, actual: 31000 },
      { month: 'Jul', budget: 25556, actual: 28000 },
      { month: 'Aug', budget: 25556, actual: 27500 },
      { month: 'Sep', budget: 25556, actual: 28500 },
    ],
  },
  {
    category: 'Technology',
    department: 'Marketing',
    budgetAmount: 65000,
    actualAmount: 62000,
    variance: -3000,
    variancePercent: -4.6,
    status: 'on-track',
    monthlyData: [
      { month: 'Jan', budget: 7222, actual: 7000 },
      { month: 'Feb', budget: 7222, actual: 7100 },
      { month: 'Mar', budget: 7222, actual: 6900 },
      { month: 'Apr', budget: 7222, actual: 6800 },
      { month: 'May', budget: 7222, actual: 7000 },
      { month: 'Jun', budget: 7222, actual: 7200 },
      { month: 'Jul', budget: 7222, actual: 6900 },
      { month: 'Aug', budget: 7222, actual: 6800 },
      { month: 'Sep', budget: 7222, actual: 6300 },
    ],
  },
  {
    category: 'Professional Services',
    department: 'Marketing',
    budgetAmount: 85000,
    actualAmount: 95000,
    variance: 10000,
    variancePercent: 11.8,
    status: 'at-risk',
    monthlyData: [
      { month: 'Jan', budget: 9444, actual: 8000 },
      { month: 'Feb', budget: 9444, actual: 9500 },
      { month: 'Mar', budget: 9444, actual: 11000 },
      { month: 'Apr', budget: 9444, actual: 10500 },
      { month: 'May', budget: 9444, actual: 12000 },
      { month: 'Jun', budget: 9444, actual: 11500 },
      { month: 'Jul', budget: 9444, actual: 10000 },
      { month: 'Aug', budget: 9444, actual: 11000 },
      { month: 'Sep', budget: 9444, actual: 12000 },
    ],
  },
]

interface BudgetVsActualDashboardProps {
  data?: BudgetData[]
  department?: string
  period?: string
  className?: string
}

export function BudgetVsActualDashboard({
  data = mockBudgetData,
  department = 'Marketing',
  period = 'YTD 2025',
  className
}: BudgetVsActualDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary')

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    if (absAmount >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000).toFixed(0)}K`
    }
    return `${amount < 0 ? '-' : ''}$${absAmount.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return '#22c55e'
      case 'under-budget': return '#3b82f6'
      case 'over-budget': return '#ef4444'
      case 'at-risk': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle sx={{ fontSize: 16 }} />
      case 'under-budget': return <TrendingDown sx={{ fontSize: 16 }} />
      case 'over-budget': return <TrendingUp sx={{ fontSize: 16 }} />
      case 'at-risk': return <Warning sx={{ fontSize: 16 }} />
      default: return <Remove sx={{ fontSize: 16 }} />
    }
  }

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 1000) return '#6b7280'
    if (variance > 0) return '#ef4444'
    return '#22c55e'
  }

  const getVarianceIcon = (variance: number) => {
    if (Math.abs(variance) < 1000) return <Remove sx={{ fontSize: 16 }} />
    if (variance > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    return <TrendingDown sx={{ fontSize: 16 }} />
  }

  const filteredData = selectedCategory === 'all' 
    ? data 
    : data.filter(item => item.category === selectedCategory)

  const totalBudget = data.reduce((sum, item) => sum + item.budgetAmount, 0)
  const totalActual = data.reduce((sum, item) => sum + item.actualAmount, 0)
  const totalVariance = totalActual - totalBudget
  const totalVariancePercent = (totalVariance / totalBudget) * 100

  const utilizationData = data.map(item => ({
    name: item.category,
    utilization: (item.actualAmount / item.budgetAmount) * 100,
    budget: item.budgetAmount,
    actual: item.actualAmount,
    color: getStatusColor(item.status),
  }))

  const monthlyTrendData = mockBudgetData[0].monthlyData.map((month, index) => ({
    month: month.month,
    totalBudget: data.reduce((sum, item) => sum + item.monthlyData[index].budget, 0),
    totalActual: data.reduce((sum, item) => sum + item.monthlyData[index].actual, 0),
  }))

  const gaugeData = [
    {
      name: 'Budget Utilization',
      value: (totalActual / totalBudget) * 100,
      fill: totalVariancePercent > 10 ? '#ef4444' : totalVariancePercent > 5 ? '#f59e0b' : '#22c55e',
    },
  ]

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Budget vs Actual Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {department} Department • {period}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {data.map(item => (
                  <MenuItem key={item.category} value={item.category}>
                    {item.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ textTransform: 'none' }}
            >
              Filter
            </Button>
            
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

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581', mb: 0.5 }}>
                {formatCurrency(totalBudget)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Budget
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mb: 0.5 }}>
                {formatCurrency(totalActual)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Actual Spend
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: getVarianceColor(totalVariance), 
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                {getVarianceIcon(totalVariance)}
                {formatCurrency(totalVariance)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Variance
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: getVarianceColor(totalVariance), 
                  mb: 0.5,
                }}
              >
                {totalVariancePercent > 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Variance %
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Budget Utilization Gauge */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Budget Utilization
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" data={gaugeData}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={gaugeData[0].fill}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-0.5em" fontSize="32" fontWeight="700" fill="#374151">
                      {gaugeData[0].value.toFixed(1)}%
                    </tspan>
                    <tspan x="50%" dy="1.5em" fontSize="14" fill="#6b7280">
                      Budget Used
                    </tspan>
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Chip
                label={totalVariancePercent > 10 ? 'Over Budget' : totalVariancePercent > 5 ? 'At Risk' : 'On Track'}
                sx={{
                  backgroundColor: totalVariancePercent > 10 ? '#fee2e2' : totalVariancePercent > 5 ? '#fef3c7' : '#dcfce7',
                  color: totalVariancePercent > 10 ? '#991b1b' : totalVariancePercent > 5 ? '#92400e' : '#166534',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Category Breakdown
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}\n${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="utilization"
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)}%`,
                    'Utilization'
                  ]}
                  labelFormatter={(label) => label}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Monthly Trend */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Monthly Budget vs Actual Trend
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} />
                <RechartsTooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="totalBudget" fill="#e0e7ff" name="Budget" radius={[2, 2, 0, 0]} />
                <Bar dataKey="totalActual" fill="#486581" name="Actual" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detailed Table */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafbfc' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Category Performance Details
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Budget</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actual</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Variance</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Utilization</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item, index) => {
                    const utilization = (item.actualAmount / item.budgetAmount) * 100
                    
                    return (
                      <TableRow 
                        key={index}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(72, 101, 129, 0.02)',
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.category}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(item.budgetAmount)}
                        </TableCell>
                        
                        <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {formatCurrency(item.actualAmount)}
                        </TableCell>
                        
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Box sx={{ color: getVarianceColor(item.variance) }}>
                              {getVarianceIcon(item.variance)}
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: getVarianceColor(item.variance),
                                fontWeight: 600,
                                fontFamily: 'monospace',
                              }}
                            >
                              {formatCurrency(item.variance)}
                            </Typography>
                            <Chip
                              label={`${item.variancePercent > 0 ? '+' : ''}${item.variancePercent.toFixed(1)}%`}
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: item.variancePercent >= 0 ? '#fee2e2' : '#dcfce7',
                                color: item.variancePercent >= 0 ? '#991b1b' : '#166534',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(utilization, 100)}
                              sx={{
                                width: 60,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getStatusColor(item.status),
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 45 }}>
                              {utilization.toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(item.status)}
                            label={item.status.replace('-', ' ').toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(item.status)}20`,
                              color: getStatusColor(item.status),
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}