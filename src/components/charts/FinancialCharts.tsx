'use client'

import React from 'react'
import {
  Box,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts'

// Mock data for financial charts
const revenueData = [
  { month: 'Jan', actual: 2100000, budget: 2000000, forecast: 2150000 },
  { month: 'Feb', actual: 2250000, budget: 2100000, forecast: 2200000 },
  { month: 'Mar', actual: 2400000, budget: 2200000, forecast: 2350000 },
  { month: 'Apr', actual: 2150000, budget: 2300000, forecast: 2180000 },
  { month: 'May', actual: 2300000, budget: 2250000, forecast: 2320000 },
  { month: 'Jun', actual: 2450000, budget: 2350000, forecast: 2400000 },
  { month: 'Jul', actual: 2380000, budget: 2400000, forecast: 2420000 },
  { month: 'Aug', actual: 2520000, budget: 2450000, forecast: 2480000 },
  { month: 'Sep', actual: 2650000, budget: 2500000, forecast: 2600000 },
]

const expenseBreakdown = [
  { name: 'Sales & Marketing', value: 450000, color: '#ef4444' },
  { name: 'R&D', value: 280000, color: '#3b82f6' },
  { name: 'General & Admin', value: 160000, color: '#f59e0b' },
  { name: 'Cost of Goods Sold', value: 980000, color: '#8b5cf6' },
]

const cashFlowData = [
  { period: 'Q1', operating: 515000, investing: -150000, financing: 15000, net: 380000 },
  { period: 'Q2', operating: 496000, investing: -135000, financing: -30000, net: 331000 },
  { period: 'Q3', operating: 515000, investing: -350000, financing: 15000, net: 180000 },
  { period: 'Q4', operating: 540000, investing: -200000, financing: 50000, net: 390000 },
]

const varianceData = [
  { account: 'Revenue', budgetVar: 7.5, forecastVar: 2.1 },
  { account: 'COGS', budgetVar: -5.2, forecastVar: -1.8 },
  { account: 'OpEx', budgetVar: -8.5, forecastVar: -3.2 },
  { account: 'EBIT', budgetVar: 5.8, forecastVar: 1.4 },
]

interface ChartProps {
  title: string
  subtitle?: string
  height?: number
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

const formatPercent = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function RevenueActualVsBudgetChart({ title, subtitle, height = 300 }: ChartProps) {
  const theme = useTheme()

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), '']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          
          <Bar dataKey="budget" fill="#e0e7ff" name="Budget" radius={[2, 2, 0, 0]} />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#486581" 
            strokeWidth={3}
            name="Actual"
            dot={{ fill: '#486581', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            stroke="#22c55e" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Forecast"
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export function ExpenseBreakdownChart({ title, subtitle, height = 300 }: ChartProps) {
  const total = expenseBreakdown.reduce((sum, item) => sum + item.value, 0)

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={expenseBreakdown}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {expenseBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Summary */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Total Expenses: <strong>{formatCurrency(total)}</strong>
        </Typography>
      </Box>
    </Paper>
  )
}

export function CashFlowWaterfallChart({ title, subtitle, height = 300 }: ChartProps) {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={cashFlowData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          
          <Bar dataKey="operating" stackId="a" fill="#22c55e" name="Operating" radius={[2, 2, 0, 0]} />
          <Bar dataKey="investing" stackId="a" fill="#ef4444" name="Investing" />
          <Bar dataKey="financing" stackId="a" fill="#3b82f6" name="Financing" />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="#486581" 
            strokeWidth={3}
            name="Net Cash Flow"
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export function VarianceAnalysisChart({ title, subtitle, height = 250 }: ChartProps) {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={varianceData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            type="number"
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatPercent}
          />
          <YAxis 
            type="category"
            dataKey="account"
            stroke="#6b7280"
            fontSize={12}
            width={80}
          />
          <Tooltip 
            formatter={(value: number) => [formatPercent(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          
          <Bar 
            dataKey="budgetVar" 
            fill="#486581" 
            name="vs Budget"
            radius={[0, 2, 2, 0]}
          />
          <Bar 
            dataKey="forecastVar" 
            fill="#22c55e" 
            name="vs Forecast"
            radius={[0, 2, 2, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export function ProfitabilityTrendChart({ title, subtitle, height = 300 }: ChartProps) {
  const profitData = revenueData.map(item => ({
    ...item,
    grossProfit: item.actual * 0.6,
    operatingProfit: item.actual * 0.24,
    netProfit: item.actual * 0.18,
  }))

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={profitData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          
          <Area 
            type="monotone" 
            dataKey="grossProfit" 
            stackId="1"
            stroke="#22c55e" 
            fill="#22c55e"
            fillOpacity={0.6}
            name="Gross Profit"
          />
          <Area 
            type="monotone" 
            dataKey="operatingProfit" 
            stackId="2"
            stroke="#3b82f6" 
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Operating Profit"
          />
          <Area 
            type="monotone" 
            dataKey="netProfit" 
            stackId="3"
            stroke="#486581" 
            fill="#486581"
            fillOpacity={0.8}
            name="Net Profit"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  )
}