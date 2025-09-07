'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Collapse,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Info,
  Psychology,
  ExpandMore,
  ExpandLess,
  ThumbUp,
  ThumbDown,
  Share,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  Timeline,
  Assessment,
  Speed,
  AttachMoney,
  PieChart,
  ShowChart,
} from '@mui/icons-material'

interface AIInsight {
  id: string
  title: string
  description: string
  type: 'trend' | 'anomaly' | 'recommendation' | 'forecast' | 'optimization'
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  impact: 'positive' | 'negative' | 'neutral'
  value?: number
  trend?: 'up' | 'down' | 'stable'
  dateGenerated: Date
  source: string
  category: string
  isBookmarked: boolean
  isExpanded: boolean
  details: {
    analysis: string
    recommendations: string[]
    dataPoints: { label: string; value: string }[]
    relatedMetrics: string[]
  }
  feedback?: 'positive' | 'negative'
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Marketing ROI Significantly Above Target',
    description: 'Digital marketing campaigns are delivering 3.8x ROI, 27% above the target of 3.0x. This represents a $340K positive variance for Q3.',
    type: 'trend',
    severity: 'high',
    confidence: 94,
    impact: 'positive',
    value: 340000,
    trend: 'up',
    dateGenerated: new Date('2025-09-06T14:30:00'),
    source: 'Marketing Analytics Engine',
    category: 'Revenue',
    isBookmarked: true,
    isExpanded: false,
    details: {
      analysis: 'AI analysis reveals that the strong ROI performance is driven by three key factors: improved targeting algorithms (contributing 40% of the uplift), creative refresh in August (30% of uplift), and seasonal demand patterns (30% of uplift). The trend is expected to continue through Q4 based on current pipeline data.',
      recommendations: [
        'Increase digital marketing budget by 15% for Q4 to capitalize on strong performance',
        'Replicate successful campaign elements across underperforming channels',
        'Allocate additional resources to top-performing customer segments',
        'Consider expanding to similar target demographics'
      ],
      dataPoints: [
        { label: 'Current ROI', value: '3.8x' },
        { label: 'Target ROI', value: '3.0x' },
        { label: 'Variance', value: '+27%' },
        { label: 'Q3 Impact', value: '$340K' },
        { label: 'Confidence Level', value: '94%' }
      ],
      relatedMetrics: ['Customer Acquisition Cost', 'Conversion Rate', 'Average Order Value', 'Customer Lifetime Value']
    },
  },
  {
    id: '2',
    title: 'Unusual Spike in IT Operating Costs',
    description: 'IT department costs increased 23% MoM in September, primarily due to unplanned software licenses and infrastructure upgrades.',
    type: 'anomaly',
    severity: 'medium',
    confidence: 87,
    impact: 'negative',
    value: 45000,
    trend: 'up',
    dateGenerated: new Date('2025-09-06T12:15:00'),
    source: 'Cost Analytics AI',
    category: 'Expenses',
    isBookmarked: false,
    isExpanded: false,
    details: {
      analysis: 'The cost spike is attributed to emergency software license purchases ($28K) and unexpected server hardware replacement ($17K). Historical patterns show this type of spike occurs annually during budget cycles, but this instance is 3 months earlier than typical.',
      recommendations: [
        'Implement predictive maintenance for server infrastructure',
        'Negotiate enterprise licensing agreements to reduce ad-hoc purchases',
        'Establish emergency IT budget allocation for unplanned expenses',
        'Review procurement processes to identify early warning indicators'
      ],
      dataPoints: [
        { label: 'September Increase', value: '23%' },
        { label: 'Cost Impact', value: '$45K' },
        { label: 'Software Licenses', value: '$28K' },
        { label: 'Hardware', value: '$17K' },
        { label: 'Budget Variance', value: '+12%' }
      ],
      relatedMetrics: ['Technology Budget', 'Software Utilization', 'Hardware Lifecycle', 'Vendor Spend']
    },
  },
  {
    id: '3',
    title: 'Q4 Revenue Forecast Revision Recommended',
    description: 'Based on Q3 performance and pipeline analysis, AI recommends increasing Q4 revenue forecast by 8% to $2.68M.',
    type: 'forecast',
    severity: 'high',
    confidence: 91,
    impact: 'positive',
    value: 200000,
    trend: 'up',
    dateGenerated: new Date('2025-09-06T10:45:00'),
    source: 'Predictive Analytics Engine',
    category: 'Forecast',
    isBookmarked: true,
    isExpanded: false,
    details: {
      analysis: 'Machine learning models incorporating Q3 actuals, sales pipeline data, and historical seasonal patterns indicate strong Q4 performance. Key drivers include accelerated enterprise deal closure, improved conversion rates, and favorable market conditions.',
      recommendations: [
        'Update Q4 revenue target to $2.68M (+8% from current forecast)',
        'Adjust resource allocation to support higher sales volume',
        'Prepare operations for increased demand',
        'Communicate revised expectations to stakeholders'
      ],
      dataPoints: [
        { label: 'Current Forecast', value: '$2.48M' },
        { label: 'Recommended', value: '$2.68M' },
        { label: 'Increase', value: '+8%' },
        { label: 'Value Impact', value: '$200K' },
        { label: 'Model Accuracy', value: '91%' }
      ],
      relatedMetrics: ['Sales Pipeline', 'Conversion Rate', 'Deal Velocity', 'Market Trends']
    },
  },
  {
    id: '4',
    title: 'Cost Allocation Optimization Opportunity',
    description: 'AI identified potential savings of $85K annually through optimized cost allocation rules and elimination of redundant allocations.',
    type: 'optimization',
    severity: 'medium',
    confidence: 83,
    impact: 'positive',
    value: 85000,
    trend: 'stable',
    dateGenerated: new Date('2025-09-05T16:20:00'),
    source: 'Allocation Optimization AI',
    category: 'Cost Management',
    isBookmarked: false,
    isExpanded: false,
    details: {
      analysis: 'Analysis of current allocation rules reveals overlapping cost assignments, inefficient driver usage, and opportunities for automation. The optimization would streamline 15 allocation rules into 8 while maintaining accuracy.',
      recommendations: [
        'Consolidate similar cost allocation rules',
        'Implement automated driver updates',
        'Eliminate redundant manual allocations',
        'Standardize allocation methodologies across departments'
      ],
      dataPoints: [
        { label: 'Annual Savings', value: '$85K' },
        { label: 'Rules Optimized', value: '15 → 8' },
        { label: 'Efficiency Gain', value: '35%' },
        { label: 'Implementation Time', value: '2 weeks' },
        { label: 'Risk Level', value: 'Low' }
      ],
      relatedMetrics: ['Allocation Accuracy', 'Processing Time', 'Manual Effort', 'Rule Complexity']
    },
  },
]

interface InsightCardsProps {
  insights?: AIInsight[]
  onInsightAction?: (insightId: string, action: string) => void
  onFeedback?: (insightId: string, feedback: 'positive' | 'negative') => void
  className?: string
}

export function InsightCards({ 
  insights = mockInsights,
  onInsightAction,
  onFeedback,
  className 
}: InsightCardsProps) {
  const [expandedCard, setExpandedCard] = useState<string>('')
  const [bookmarkedInsights, setBookmarkedInsights] = useState<string[]>(
    insights.filter(insight => insight.isBookmarked).map(insight => insight.id)
  )
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedInsight, setSelectedInsight] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'high' | 'bookmarked'>('all')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp />
      case 'anomaly': return <Warning />
      case 'recommendation': return <Lightbulb />
      case 'forecast': return <Timeline />
      case 'optimization': return <Speed />
      default: return <Info />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trend': return '#22c55e'
      case 'anomaly': return '#f59e0b'
      case 'recommendation': return '#3b82f6'
      case 'forecast': return '#8b5cf6'
      case 'optimization': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#65a30d'
      default: return '#6b7280'
    }
  }

  const getImpactIcon = (impact: string, trend?: string) => {
    if (impact === 'positive') return <TrendingUp sx={{ color: '#22c55e' }} />
    if (impact === 'negative') return <TrendingDown sx={{ color: '#ef4444' }} />
    return <ShowChart sx={{ color: '#6b7280' }} />
  }

  const formatValue = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`
    }
    return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`
  }

  const handleExpandToggle = (insightId: string) => {
    setExpandedCard(expandedCard === insightId ? '' : insightId)
  }

  const handleBookmarkToggle = (insightId: string) => {
    setBookmarkedInsights(prev => 
      prev.includes(insightId) 
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    )
  }

  const handleFeedback = (insightId: string, feedback: 'positive' | 'negative') => {
    onFeedback?.(insightId, feedback)
  }

  const filteredInsights = insights.filter(insight => {
    if (filter === 'high') return insight.severity === 'high' || insight.severity === 'critical'
    if (filter === 'bookmarked') return bookmarkedInsights.includes(insight.id)
    return true
  })

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return 'Just now'
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              AI Financial Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time AI analysis of your financial data with actionable recommendations
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('all')}
              sx={{ textTransform: 'none' }}
            >
              All Insights
            </Button>
            <Button
              variant={filter === 'high' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('high')}
              sx={{ textTransform: 'none' }}
            >
              High Priority
            </Button>
            <Button
              variant={filter === 'bookmarked' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilter('bookmarked')}
              sx={{ textTransform: 'none' }}
            >
              Bookmarked
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<Psychology />}
            label={`${filteredInsights.length} Active Insights`}
            sx={{ backgroundColor: '#e0f2fe', color: '#0277bd', fontWeight: 600 }}
          />
          <Chip
            icon={<TrendingUp />}
            label={`${filteredInsights.filter(i => i.impact === 'positive').length} Opportunities`}
            sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}
          />
          <Chip
            icon={<Warning />}
            label={`${filteredInsights.filter(i => i.severity === 'high' || i.severity === 'critical').length} High Priority`}
            sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* Insight Cards */}
      <Grid container spacing={3}>
        {filteredInsights.map((insight) => (
          <Grid item xs={12} md={6} lg={4} key={insight.id}>
            <Card
              sx={{
                height: 'fit-content',
                border: `2px solid ${getTypeColor(insight.type)}20`,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: `0 8px 25px ${getTypeColor(insight.type)}20`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: `${getTypeColor(insight.type)}20`,
                        color: getTypeColor(insight.type),
                      }}
                    >
                      {getTypeIcon(insight.type)}
                    </Avatar>
                    <Box>
                      <Chip
                        label={insight.type.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getTypeColor(insight.type)}20`,
                          color: getTypeColor(insight.type),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          mb: 0.5,
                        }}
                      />
                      <Chip
                        label={insight.severity.toUpperCase()}
                        size="small"
                        sx={{
                          ml: 0.5,
                          backgroundColor: `${getSeverityColor(insight.severity)}20`,
                          color: getSeverityColor(insight.severity),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleBookmarkToggle(insight.id)}
                      sx={{ color: bookmarkedInsights.includes(insight.id) ? '#f59e0b' : '#6b7280' }}
                    >
                      {bookmarkedInsights.includes(insight.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setMenuAnchor(e.currentTarget)
                        setSelectedInsight(insight.id)
                      }}
                      sx={{ color: '#6b7280' }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                {/* Title and Description */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
                  {insight.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                  {insight.description}
                </Typography>

                {/* Value and Impact */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  {insight.value && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getImpactIcon(insight.impact)}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: getTypeColor(insight.type) }}>
                        {formatValue(insight.value)}
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(insight.dateGenerated)}
                  </Typography>
                </Box>

                {/* Confidence Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      AI Confidence
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {insight.confidence}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={insight.confidence}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: insight.confidence >= 90 ? '#22c55e' : 
                                        insight.confidence >= 75 ? '#f59e0b' : '#ef4444',
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                {/* Metadata */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Source: {insight.source}
                  </Typography>
                  <Chip
                    label={insight.category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 18 }}
                  />
                </Box>

                {/* Expandable Details */}
                <Collapse in={expandedCard === insight.id}>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {insight.details.analysis}
                    </Typography>

                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Key Data Points:
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {insight.details.dataPoints.map((point, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {point.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {point.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Recommendations:
                    </Typography>
                    <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                      {insight.details.recommendations.slice(0, 3).map((rec, index) => (
                        <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                          {rec}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2.5, pb: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleFeedback(insight.id, 'positive')}
                    sx={{ color: insight.feedback === 'positive' ? '#22c55e' : '#6b7280' }}
                  >
                    <ThumbUp sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleFeedback(insight.id, 'negative')}
                    sx={{ color: insight.feedback === 'negative' ? '#ef4444' : '#6b7280' }}
                  >
                    <ThumbDown sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                <Button
                  size="small"
                  startIcon={expandedCard === insight.id ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => handleExpandToggle(insight.id)}
                  sx={{ textTransform: 'none' }}
                >
                  {expandedCard === insight.id ? 'Less' : 'Details'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <Share sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Share Insight</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <Assessment sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Generate Report</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <Timeline sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>View Trend</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}