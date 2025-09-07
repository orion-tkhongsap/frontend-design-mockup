'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material'
import {
  ShowChart,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline,
  TrendingUp,
  GetApp,
  Fullscreen,
  Settings,
  Refresh,
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
  ComposedChart,
  Sankey,
  Treemap,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts'

// Sample financial data
const revenueData = [
  { quarter: 'Q1 2024', revenue: 4200, target: 4000, growth: 8.5 },
  { quarter: 'Q2 2024', revenue: 4800, target: 4300, growth: 14.3 },
  { quarter: 'Q3 2024', revenue: 5100, target: 4600, growth: 6.3 },
  { quarter: 'Q4 2024', revenue: 5400, target: 4900, growth: 5.9 },
  { quarter: 'Q1 2025', revenue: 4550, target: 4400, growth: 8.3 },
  { quarter: 'Q2 2025', revenue: 5200, target: 4800, growth: 14.3 },
  { quarter: 'Q3 2025', revenue: 5850, target: 5200, growth: 14.7 },
]

const waterfallData = [
  { name: 'Starting Revenue', value: 4200, type: 'start' },
  { name: 'New Customers', value: 800, type: 'positive' },
  { name: 'Upsells', value: 400, type: 'positive' },
  { name: 'Churn', value: -200, type: 'negative' },
  { name: 'Price Changes', value: 150, type: 'positive' },
  { name: 'Other', value: -50, type: 'negative' },
  { name: 'Ending Revenue', value: 5300, type: 'end' },
]

const expenseBreakdown = [
  { name: 'Personnel', value: 2400, percentage: 48, color: '#486581' },
  { name: 'Marketing', value: 800, percentage: 16, color: '#22c55e' },
  { name: 'Technology', value: 600, percentage: 12, color: '#3b82f6' },
  { name: 'Operations', value: 500, percentage: 10, color: '#f59e0b' },
  { name: 'Other', value: 700, percentage: 14, color: '#8b5cf6' },
]

const kpiData = [
  { metric: 'Revenue Growth', current: 85, target: 100, category: 'Revenue' },
  { metric: 'Gross Margin', current: 92, target: 100, category: 'Profitability' },
  { metric: 'Customer Satisfaction', current: 78, target: 100, category: 'Customer' },
  { metric: 'Market Share', current: 65, target: 100, category: 'Growth' },
]

const cohortData = [
  { month: 'Jan', cohort1: 100, cohort2: 95, cohort3: 88, cohort4: 82 },
  { month: 'Feb', cohort1: 95, cohort2: 90, cohort3: 83, cohort4: 78 },
  { month: 'Mar', cohort1: 88, cohort2: 85, cohort3: 78, cohort4: 73 },
  { month: 'Apr', cohort1: 82, cohort2: 80, cohort3: 73, cohort4: 68 },
  { month: 'May', cohort1: 78, cohort2: 75, cohort3: 68, cohort4: 63 },
  { month: 'Jun', cohort1: 73, cohort2: 70, cohort3: 63, cohort4: 58 },
]

interface ChartWrapperProps {
  title: string
  children: React.ReactNode
  type: string
  onExport?: () => void
  onFullscreen?: () => void
  className?: string
}

function ChartWrapper({ title, children, type, onExport, onFullscreen, className }: ChartWrapperProps) {
  return (
    <Card className={className} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            <Chip
              label={type}
              size="small"
              sx={{
                backgroundColor: '#f0f4f8',
                color: '#374151',
                fontSize: '0.7rem',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Export Chart">
              <IconButton size="small" onClick={onExport}>
                <GetApp sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton size="small" onClick={onFullscreen}>
                <Fullscreen sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chart Settings">
              <IconButton size="small">
                <Settings sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ height: 300 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  )
}

interface FinancialChartLibraryProps {
  className?: string
}

export function FinancialChartLibrary({ className }: FinancialChartLibraryProps) {
  const [selectedChart, setSelectedChart] = useState('all')

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getBarColor = (value: number, target: number) => {
    if (value >= target) return '#22c55e'
    if (value >= target * 0.9) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Financial Chart Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Professional financial visualizations with interactive features
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={selectedChart}
                label="Chart Type"
                onChange={(e) => setSelectedChart(e.target.value)}
              >
                <MenuItem value="all">All Charts</MenuItem>
                <MenuItem value="line">Line Charts</MenuItem>
                <MenuItem value="bar">Bar Charts</MenuItem>
                <MenuItem value="pie">Pie Charts</MenuItem>
                <MenuItem value="waterfall">Waterfall</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ textTransform: 'none' }}
            >
              Refresh Data
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Chart Grid */}
      <Grid container spacing={3}>
        {/* Revenue Trend Line Chart */}
        {(selectedChart === 'all' || selectedChart === 'line') && (
          <Grid item xs={12} lg={6}>
            <ChartWrapper title="Revenue Growth Trend" type="Line Chart">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="quarter" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} />
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [
                      name === 'growth' ? formatPercentage(value) : formatCurrency(value),
                      name === 'revenue' ? 'Revenue' : name === 'target' ? 'Target' : 'Growth %'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#486581" radius={[2, 2, 0, 0]} name="Actual Revenue" />
                  <Bar dataKey="target" fill="#e0e7ff" radius={[2, 2, 0, 0]} name="Target Revenue" />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    name="Growth %"
                    yAxisId="right"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}

        {/* KPI Performance Bars */}
        {(selectedChart === 'all' || selectedChart === 'bar') && (
          <Grid item xs={12} lg={6}>
            <ChartWrapper title="KPI Performance Dashboard" type="Horizontal Bar">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                  <YAxis dataKey="metric" type="category" stroke="#6b7280" fontSize={11} width={100} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, 'Achievement']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="current" radius={[0, 4, 4, 0]}>
                    {kpiData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(entry.current, entry.target)} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}

        {/* Expense Breakdown Pie Chart */}
        {(selectedChart === 'all' || selectedChart === 'pie') && (
          <Grid item xs={12} lg={6}>
            <ChartWrapper title="Expense Category Breakdown" type="Donut Chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(value),
                      props.payload.name
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>
                        {value} ({entry.payload.percentage}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}

        {/* Customer Cohort Analysis */}
        {(selectedChart === 'all' || selectedChart === 'advanced') && (
          <Grid item xs={12} lg={6}>
            <ChartWrapper title="Customer Retention Cohorts" type="Area Chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, 'Retention']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="cohort1" 
                    stackId="1" 
                    stroke="#486581" 
                    fill="#486581"
                    fillOpacity={0.8}
                    name="Cohort 1"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cohort2" 
                    stackId="1" 
                    stroke="#22c55e" 
                    fill="#22c55e"
                    fillOpacity={0.8}
                    name="Cohort 2"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cohort3" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.8}
                    name="Cohort 3"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cohort4" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="#f59e0b"
                    fillOpacity={0.8}
                    name="Cohort 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}

        {/* Revenue Waterfall Chart */}
        {(selectedChart === 'all' || selectedChart === 'waterfall') && (
          <Grid item xs={12}>
            <ChartWrapper title="Revenue Waterfall Analysis" type="Waterfall Chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={formatCurrency} />
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(Math.abs(value)), 'Amount']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.type === 'start' || entry.type === 'end' ? '#486581' :
                          entry.type === 'positive' ? '#22c55e' : '#ef4444'
                        } 
                      />
                    ))}
                    <LabelList dataKey="value" position="top" formatter={formatCurrency} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}

        {/* Budget Utilization Gauge */}
        {(selectedChart === 'all' || selectedChart === 'advanced') && (
          <Grid item xs={12} md={6}>
            <ChartWrapper title="Budget Utilization" type="Radial Chart">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={[{ value: 78 }]}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="#486581"
                    background={{ fill: '#e0e7ff' }}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-0.5em" fontSize="32" fontWeight="700" fill="#486581">
                      78%
                    </tspan>
                    <tspan x="50%" dy="1.5em" fontSize="14" fill="#6b7280">
                      Budget Used
                    </tspan>
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}

        {/* ROI Scatter Plot */}
        {(selectedChart === 'all' || selectedChart === 'advanced') && (
          <Grid item xs={12} md={6}>
            <ChartWrapper title="Marketing ROI Analysis" type="Scatter Plot">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={[
                  { campaign: 'Digital', spend: 50, roi: 380, size: 120 },
                  { campaign: 'Social', spend: 30, roi: 250, size: 80 },
                  { campaign: 'Email', spend: 15, roi: 420, size: 60 },
                  { campaign: 'Content', spend: 25, roi: 180, size: 45 },
                  { campaign: 'Events', spend: 40, roi: 150, size: 90 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="spend" 
                    stroke="#6b7280" 
                    fontSize={12} 
                    label={{ value: 'Spend ($K)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="roi" 
                    stroke="#6b7280" 
                    fontSize={12}
                    label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [
                      name === 'spend' ? `$${value}K` : `${value}%`,
                      name === 'spend' ? 'Spend' : 'ROI'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Scatter dataKey="roi" fill="#486581" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}