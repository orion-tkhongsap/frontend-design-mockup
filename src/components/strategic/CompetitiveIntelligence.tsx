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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
} from '@mui/material'
import {
  CompareArrows,
  TrendingUp,
  TrendingDown,
  Assessment,
  Star,
  StarBorder,
  Visibility,
  GetApp,
  Refresh,
  BusinessCenter,
  AttachMoney,
  People,
  Speed,
} from '@mui/icons-material'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts'

interface Competitor {
  id: string
  name: string
  logo: string
  industry: string
  marketCap: number
  revenue: number
  employees: number
  foundedYear: number
  headquarters: string
  isPublic: boolean
  tier: 'direct' | 'indirect' | 'emerging'
  threatLevel: 'high' | 'medium' | 'low'
  trackingStatus: 'active' | 'watching' | 'archived'
}

interface CompetitiveMetric {
  category: string
  ourScore: number
  competitors: { [key: string]: number }
  weight: number
  trend: 'improving' | 'declining' | 'stable'
}

interface MarketPositioning {
  name: string
  marketShare: number
  revenue: number
  growthRate: number
  customerSatisfaction: number
  innovationScore: number
}

const mockCompetitors: Competitor[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    logo: 'TF',
    industry: 'Financial Technology',
    marketCap: 2800000000,
    revenue: 485000000,
    employees: 2100,
    foundedYear: 2018,
    headquarters: 'San Francisco, CA',
    isPublic: true,
    tier: 'direct',
    threatLevel: 'high',
    trackingStatus: 'active',
  },
  {
    id: '2',
    name: 'DataVantage Corp',
    logo: 'DV',
    industry: 'Business Intelligence',
    marketCap: 1250000000,
    revenue: 285000000,
    employees: 1450,
    foundedYear: 2020,
    headquarters: 'Austin, TX',
    isPublic: false,
    tier: 'direct',
    threatLevel: 'medium',
    trackingStatus: 'active',
  },
  {
    id: '3',
    name: 'AnalyticsPro',
    logo: 'AP',
    industry: 'Financial Analytics',
    marketCap: 850000000,
    revenue: 125000000,
    employees: 680,
    foundedYear: 2019,
    headquarters: 'Boston, MA',
    isPublic: true,
    tier: 'indirect',
    threatLevel: 'medium',
    trackingStatus: 'watching',
  },
  {
    id: '4',
    name: 'NextGen Finance',
    logo: 'NF',
    industry: 'Financial Software',
    marketCap: 450000000,
    revenue: 85000000,
    employees: 420,
    foundedYear: 2021,
    headquarters: 'Seattle, WA',
    isPublic: false,
    tier: 'emerging',
    threatLevel: 'low',
    trackingStatus: 'watching',
  },
]

const mockCompetitiveMetrics: CompetitiveMetric[] = [
  {
    category: 'Product Features',
    ourScore: 85,
    competitors: { 'TechFlow': 90, 'DataVantage': 75, 'AnalyticsPro': 70, 'NextGen': 65 },
    weight: 25,
    trend: 'improving',
  },
  {
    category: 'Market Presence',
    ourScore: 70,
    competitors: { 'TechFlow': 95, 'DataVantage': 80, 'AnalyticsPro': 60, 'NextGen': 45 },
    weight: 20,
    trend: 'stable',
  },
  {
    category: 'Customer Satisfaction',
    ourScore: 88,
    competitors: { 'TechFlow': 82, 'DataVantage': 86, 'AnalyticsPro': 78, 'NextGen': 85 },
    weight: 20,
    trend: 'improving',
  },
  {
    category: 'Innovation',
    ourScore: 92,
    competitors: { 'TechFlow': 85, 'DataVantage': 88, 'AnalyticsPro': 70, 'NextGen': 90 },
    weight: 15,
    trend: 'improving',
  },
  {
    category: 'Pricing',
    ourScore: 75,
    competitors: { 'TechFlow': 70, 'DataVantage': 80, 'AnalyticsPro': 85, 'NextGen': 90 },
    weight: 10,
    trend: 'declining',
  },
  {
    category: 'Support Quality',
    ourScore: 89,
    competitors: { 'TechFlow': 78, 'DataVantage': 82, 'AnalyticsPro': 75, 'NextGen': 80 },
    weight: 10,
    trend: 'stable',
  },
]

const mockMarketPositioning: MarketPositioning[] = [
  { name: 'Our Company', marketShare: 12.5, revenue: 48.5, growthRate: 23.5, customerSatisfaction: 88, innovationScore: 92 },
  { name: 'TechFlow', marketShare: 28.3, revenue: 485, growthRate: 18.2, customerSatisfaction: 82, innovationScore: 85 },
  { name: 'DataVantage', marketShare: 15.7, revenue: 285, growthRate: 32.1, customerSatisfaction: 86, innovationScore: 88 },
  { name: 'AnalyticsPro', marketShare: 8.9, revenue: 125, growthRate: 15.4, customerSatisfaction: 78, innovationScore: 70 },
  { name: 'NextGen', marketShare: 4.2, revenue: 85, growthRate: 45.8, customerSatisfaction: 85, innovationScore: 90 },
]

interface CompetitiveIntelligenceProps {
  competitors?: Competitor[]
  className?: string
}

export function CompetitiveIntelligence({ 
  competitors = mockCompetitors,
  className 
}: CompetitiveIntelligenceProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all')
  const [selectedMetric, setSelectedMetric] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'positioning'>('overview')

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`
    return `$${amount.toLocaleString()}`
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'direct': return '#ef4444'
      case 'indirect': return '#f59e0b'
      case 'emerging': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
      case 'declining': return <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
      case 'stable': return <Assessment sx={{ color: '#6b7280', fontSize: 16 }} />
      default: return <Assessment sx={{ color: '#6b7280', fontSize: 16 }} />
    }
  }

  const radarData = mockCompetitiveMetrics.map(metric => ({
    category: metric.category,
    'Our Company': metric.ourScore,
    'TechFlow': metric.competitors['TechFlow'],
    'DataVantage': metric.competitors['DataVantage'],
    'AnalyticsPro': metric.competitors['AnalyticsPro'],
  }))

  const competitiveScoreData = competitors.map(comp => {
    const avgScore = mockCompetitiveMetrics.reduce((sum, metric) => {
      const competitorName = comp.name.split(' ')[0]
      return sum + (metric.competitors[competitorName] || 0)
    }, 0) / mockCompetitiveMetrics.length

    return {
      name: comp.name,
      score: avgScore,
      threat: comp.threatLevel,
    }
  })

  const overallScore = mockCompetitiveMetrics.reduce((sum, metric) => {
    return sum + (metric.ourScore * metric.weight / 100)
  }, 0)

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Competitive Intelligence Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor competitors, analyze market positioning, and track competitive metrics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>View Mode</InputLabel>
              <Select
                value={viewMode}
                label="View Mode"
                onChange={(e) => setViewMode(e.target.value as any)}
              >
                <MenuItem value="overview">Overview</MenuItem>
                <MenuItem value="detailed">Detailed Analysis</MenuItem>
                <MenuItem value="positioning">Market Positioning</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ textTransform: 'none' }}
            >
              Update Data
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581', mb: 0.5 }}>
                {competitors.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tracked Competitors
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mb: 0.5 }}>
                {overallScore.toFixed(0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Our Competitive Score
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444', mb: 0.5 }}>
                {competitors.filter(c => c.threatLevel === 'high').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                High Threat Level
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mb: 0.5 }}>
                12.5%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Market Share
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      {viewMode === 'overview' && (
        <>
          {/* Competitor Cards */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Key Competitors Overview
            </Typography>
            
            <Grid container spacing={3}>
              {competitors.map((competitor) => (
                <Grid item xs={12} md={6} lg={3} key={competitor.id}>
                  <Card sx={{ 
                    height: '100%',
                    border: `2px solid ${getTierColor(competitor.tier)}20`,
                    borderRadius: '12px',
                  }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: getTierColor(competitor.tier),
                            fontWeight: 700,
                          }}
                        >
                          {competitor.logo}
                        </Avatar>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small">
                            <StarBorder sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton size="small">
                            <Visibility sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {competitor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {competitor.industry}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={competitor.tier.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: `${getTierColor(competitor.tier)}20`,
                            color: getTierColor(competitor.tier),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        <Chip
                          label={`${competitor.threatLevel.toUpperCase()} THREAT`}
                          size="small"
                          sx={{
                            backgroundColor: `${getThreatColor(competitor.threatLevel)}20`,
                            color: getThreatColor(competitor.threatLevel),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Revenue: {formatCurrency(competitor.revenue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Employees: {competitor.employees.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Founded: {competitor.foundedYear}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {competitor.headquarters}
                        </Typography>
                        <Chip
                          label={competitor.isPublic ? 'PUBLIC' : 'PRIVATE'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 18 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Competitive Radar Chart */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Competitive Analysis Radar
            </Typography>
            
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Our Company"
                  dataKey="Our Company"
                  stroke="#486581"
                  fill="#486581"
                  fillOpacity={0.1}
                  strokeWidth={3}
                />
                <Radar
                  name="TechFlow"
                  dataKey="TechFlow"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="DataVantage"
                  dataKey="DataVantage"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      {viewMode === 'detailed' && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Detailed Competitive Metrics
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Our Score</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>TechFlow</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>DataVantage</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>AnalyticsPro</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>NextGen</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Weight</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCompetitiveMetrics.map((metric) => (
                  <TableRow key={metric.category}>
                    <TableCell sx={{ fontWeight: 600 }}>{metric.category}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ 
                        backgroundColor: '#486581', 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}>
                        {metric.ourScore}
                      </Box>
                    </TableCell>
                    {Object.entries(metric.competitors).map(([name, score]) => (
                      <TableCell key={name} align="center" sx={{ fontWeight: 600 }}>
                        {score}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <LinearProgress
                        variant="determinate"
                        value={metric.weight * 4} // Scale to 100
                        sx={{ width: 40, height: 6 }}
                      />
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {metric.weight}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {getTrendIcon(metric.trend)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {viewMode === 'positioning' && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Market Positioning Analysis
          </Typography>
          
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={mockMarketPositioning}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="marketShare" 
                stroke="#6b7280"
                label={{ value: 'Market Share (%)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="growthRate" 
                stroke="#6b7280"
                label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <RechartsTooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
              />
              <Scatter name="Companies" dataKey="revenue" fill="#486581">
                {mockMarketPositioning.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Our Company' ? '#486581' : '#e0e0e0'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* Strategic Insights */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Alert severity="info">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Competitive Advantage: Leading in Innovation and Customer Satisfaction
            </Typography>
          </Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <Alert severity="warning">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Watch TechFlow: Significant market presence and growing threat level
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  )
}