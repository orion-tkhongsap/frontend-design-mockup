'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Lightbulb,
  Analytics,
  Refresh,
  MoreVert,
  Visibility,
  ThumbUp,
  ThumbDown,
  Share,
  Info,
  Timeline,
  Insights,
} from '@mui/icons-material'

interface ForecastFactor {
  name: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

interface AIForecast {
  id: string
  category: string
  title: string
  currentValue: number
  forecastValue: number
  confidence: number
  timeframe: string
  trend: 'increasing' | 'decreasing' | 'stable'
  accuracy: number
  factors: ForecastFactor[]
  insights: string[]
  recommendations: string[]
  lastUpdated: Date
  dataQuality: 'high' | 'medium' | 'low'
  modelVersion: string
}

const mockForecasts: AIForecast[] = [
  {
    id: '1',
    category: 'Revenue',
    title: 'Q4 Marketing Revenue Impact',
    currentValue: 2450000,
    forecastValue: 2680000,
    confidence: 87,
    timeframe: 'Q4 2025',
    trend: 'increasing',
    accuracy: 92,
    dataQuality: 'high',
    modelVersion: 'v2.4',
    lastUpdated: new Date('2025-09-06T14:30:00'),
    factors: [
      {
        name: 'Seasonal Holiday Boost',
        impact: 'positive',
        weight: 35,
        description: 'Historical Q4 revenue increase due to holiday shopping patterns',
      },
      {
        name: 'New Product Launch',
        impact: 'positive',
        weight: 28,
        description: 'AI-powered analytics product launching in October',
      },
      {
        name: 'Market Competition',
        impact: 'negative',
        weight: 15,
        description: 'Increased competitive pressure from new market entrants',
      },
      {
        name: 'Economic Conditions',
        impact: 'neutral',
        weight: 22,
        description: 'Stable economic environment with moderate growth',
      },
    ],
    insights: [
      'Revenue growth driven primarily by seasonal trends and product innovation',
      'Digital marketing channels showing 23% higher conversion rates',
      'Customer acquisition costs have decreased 12% quarter-over-quarter',
    ],
    recommendations: [
      'Increase digital advertising budget by 15% for Q4 campaigns',
      'Focus marketing spend on high-converting customer segments',
      'Prepare inventory for 40% higher demand in November-December',
    ],
  },
  {
    id: '2',
    category: 'Expenses',
    title: 'Personnel Cost Projection',
    currentValue: 750000,
    forecastValue: 795000,
    confidence: 94,
    timeframe: 'Next 6 months',
    trend: 'increasing',
    accuracy: 96,
    dataQuality: 'high',
    modelVersion: 'v2.4',
    lastUpdated: new Date('2025-09-06T10:15:00'),
    factors: [
      {
        name: 'Planned New Hires',
        impact: 'positive',
        weight: 45,
        description: '3 new marketing specialists starting in Q4',
      },
      {
        name: 'Annual Salary Review',
        impact: 'positive',
        weight: 30,
        description: '3% average salary increase effective January 2026',
      },
      {
        name: 'Performance Bonuses',
        impact: 'positive',
        weight: 25,
        description: 'Q4 performance bonuses based on revenue targets',
      },
    ],
    insights: [
      'Personnel costs trending within normal growth parameters',
      'New hire productivity typically reaches 80% by month 3',
      'Performance bonus liability increasing due to strong Q3 results',
    ],
    recommendations: [
      'Budget additional $15K for onboarding and training costs',
      'Consider staggered start dates to optimize budget impact',
      'Review performance bonus criteria for alignment with company goals',
    ],
  },
  {
    id: '3',
    category: 'Technology',
    title: 'Software Licensing Optimization',
    currentValue: 65000,
    forecastValue: 58000,
    confidence: 76,
    timeframe: 'Next quarter',
    trend: 'decreasing',
    accuracy: 84,
    dataQuality: 'medium',
    modelVersion: 'v2.4',
    lastUpdated: new Date('2025-09-05T16:45:00'),
    factors: [
      {
        name: 'License Consolidation',
        impact: 'negative',
        weight: 40,
        description: 'Opportunity to consolidate overlapping software licenses',
      },
      {
        name: 'Usage Analytics',
        impact: 'negative',
        weight: 35,
        description: 'AI analysis shows 20% of licenses are underutilized',
      },
      {
        name: 'New Tool Requirements',
        impact: 'positive',
        weight: 25,
        description: 'Need for additional automation tools for new campaigns',
      },
    ],
    insights: [
      'Significant cost savings possible through license optimization',
      '15 software tools have less than 50% utilization rates',
      'ROI analysis suggests consolidating to 3 primary platforms',
    ],
    recommendations: [
      'Conduct comprehensive software audit by October 15',
      'Negotiate enterprise deals for heavily-used platforms',
      'Implement usage monitoring for all software licenses',
    ],
  },
  {
    id: '4',
    category: 'Marketing ROI',
    title: 'Campaign Performance Forecast',
    currentValue: 3.2,
    forecastValue: 3.8,
    confidence: 82,
    timeframe: 'Q4 2025',
    trend: 'increasing',
    accuracy: 88,
    dataQuality: 'high',
    modelVersion: 'v2.4',
    lastUpdated: new Date('2025-09-06T12:00:00'),
    factors: [
      {
        name: 'AI-Driven Targeting',
        impact: 'positive',
        weight: 40,
        description: 'Machine learning optimization improving ad targeting by 25%',
      },
      {
        name: 'Creative Refresh',
        impact: 'positive',
        weight: 30,
        description: 'New creative assets showing 18% higher engagement rates',
      },
      {
        name: 'Market Saturation',
        impact: 'negative',
        weight: 30,
        description: 'Increasing cost per acquisition in primary demographics',
      },
    ],
    insights: [
      'Marketing ROI improving due to AI optimization and creative innovation',
      'Email marketing showing highest ROI at 4.2x return',
      'Paid social performance varies significantly by platform',
    ],
    recommendations: [
      'Shift 20% of budget from traditional to digital channels',
      'Invest in advanced attribution modeling for better tracking',
      'Test micro-targeting strategies for premium segments',
    ],
  },
]

interface AIForecastCardsProps {
  forecasts?: AIForecast[]
  onRefresh?: () => void
  onFeedback?: (forecastId: string, feedback: 'positive' | 'negative') => void
  className?: string
}

export function AIForecastCards({ 
  forecasts = mockForecasts,
  onRefresh,
  onFeedback,
  className 
}: AIForecastCardsProps) {
  const [selectedForecast, setSelectedForecast] = useState<AIForecast | null>(null)
  const [detailDialog, setDetailDialog] = useState(false)

  const formatValue = (value: number, category: string) => {
    if (category === 'Marketing ROI') {
      return `${value.toFixed(1)}x`
    }
    
    const absValue = Math.abs(value)
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`
    }
    return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#22c55e'
    if (confidence >= 75) return '#f59e0b'
    return '#ef4444'
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return '#22c55e'
      case 'decreasing': return '#ef4444'
      case 'stable': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp />
      case 'decreasing': return <TrendingDown />
      case 'stable': return <Timeline />
      default: return <Timeline />
    }
  }

  const getDataQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return '#22c55e'
      case 'medium': return '#f59e0b'
      case 'low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const calculateChange = (current: number, forecast: number) => {
    const change = forecast - current
    const changePercent = (change / current) * 100
    return { change, changePercent }
  }

  const handleDetailView = (forecast: AIForecast) => {
    setSelectedForecast(forecast)
    setDetailDialog(true)
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              AI Financial Forecasts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Machine learning-powered predictions with confidence scores and insights
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={onRefresh}
              sx={{ textTransform: 'none' }}
            >
              Refresh Forecasts
            </Button>
            <Button
              variant="outlined"
              startIcon={<Analytics />}
              sx={{ textTransform: 'none' }}
            >
              Model Performance
            </Button>
          </Box>
        </Box>

        <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 1 }} />
          <Typography variant="body2">
            Forecasts are updated daily using the latest financial data and market indicators. 
            Model accuracy: <strong>89.2%</strong> • Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Alert>
      </Paper>

      {/* Forecast Cards */}
      <Grid container spacing={3}>
        {forecasts.map((forecast) => {
          const { change, changePercent } = calculateChange(forecast.currentValue, forecast.forecastValue)
          
          return (
            <Grid item xs={12} md={6} lg={4} key={forecast.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${getTrendColor(forecast.trend)}20`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: `0 8px 25px ${getTrendColor(forecast.trend)}20`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        label={forecast.category}
                        size="small"
                        sx={{
                          backgroundColor: '#f0f4f8',
                          color: '#374151',
                          fontSize: '0.7rem',
                          mb: 1,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 1 }}>
                        {forecast.title}
                      </Typography>
                    </Box>
                    
                    <IconButton size="small" sx={{ color: getTrendColor(forecast.trend) }}>
                      {getTrendIcon(forecast.trend)}
                    </IconButton>
                  </Box>

                  {/* Current vs Forecast */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Current</Typography>
                      <Typography variant="caption" color="text.secondary">Forecast</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatValue(forecast.currentValue, forecast.category)}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          color: getTrendColor(forecast.trend),
                        }}
                      >
                        {formatValue(forecast.forecastValue, forecast.category)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Chip
                        label={`${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}% (${formatValue(change, forecast.category)})`}
                        size="small"
                        sx={{
                          backgroundColor: changePercent >= 0 ? '#dcfce7' : '#fee2e2',
                          color: changePercent >= 0 ? '#166534' : '#991b1b',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Confidence & Accuracy */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        AI Confidence
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: getConfidenceColor(forecast.confidence) }}>
                        {forecast.confidence}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={forecast.confidence}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getConfidenceColor(forecast.confidence),
                        },
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Historical Accuracy: {forecast.accuracy}%
                      </Typography>
                      <Chip
                        label={forecast.dataQuality.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getDataQualityColor(forecast.dataQuality)}20`,
                          color: getDataQualityColor(forecast.dataQuality),
                          fontSize: '0.65rem',
                          height: 18,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Key Factors */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Key Factors ({forecast.timeframe})
                    </Typography>
                    {forecast.factors.slice(0, 2).map((factor, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%',
                          backgroundColor: factor.impact === 'positive' ? '#22c55e' : 
                                          factor.impact === 'negative' ? '#ef4444' : '#6b7280',
                        }} />
                        <Typography variant="caption" sx={{ flex: 1 }}>
                          {factor.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {factor.weight}%
                        </Typography>
                      </Box>
                    ))}
                    {forecast.factors.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{forecast.factors.length - 2} more factors
                      </Typography>
                    )}
                  </Box>

                  {/* Insights Preview */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Key Insight
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4, color: '#374151' }}>
                      {forecast.insights[0]}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleDetailView(forecast)}
                      sx={{ textTransform: 'none', flex: 1 }}
                    >
                      View Details
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => onFeedback?.(forecast.id, 'positive')}
                      sx={{ color: '#22c55e' }}
                    >
                      <ThumbUp sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onFeedback?.(forecast.id, 'negative')}
                      sx={{ color: '#ef4444' }}
                    >
                      <ThumbDown sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Detail Dialog */}
      {selectedForecast && (
        <Dialog
          open={detailDialog}
          onClose={() => setDetailDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '12px' } }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedForecast.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Model: {selectedForecast.modelVersion} • Updated: {selectedForecast.lastUpdated.toLocaleDateString()}
                </Typography>
              </Box>
              <Chip
                label={`${selectedForecast.confidence}% Confidence`}
                sx={{
                  backgroundColor: `${getConfidenceColor(selectedForecast.confidence)}20`,
                  color: getConfidenceColor(selectedForecast.confidence),
                  fontWeight: 600,
                }}
              />
            </Box>
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Contributing Factors
                </Typography>
                <List dense>
                  {selectedForecast.factors.map((factor, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Box sx={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%',
                          backgroundColor: factor.impact === 'positive' ? '#22c55e' : 
                                          factor.impact === 'negative' ? '#ef4444' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {factor.weight}%
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={factor.name}
                        secondary={factor.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  AI Insights
                </Typography>
                <List dense>
                  {selectedForecast.insights.map((insight, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Lightbulb sx={{ color: '#f59e0b' }} />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                  Recommendations
                </Typography>
                <List dense>
                  {selectedForecast.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: '#22c55e' }} />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDetailDialog(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Share />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Share Forecast
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}