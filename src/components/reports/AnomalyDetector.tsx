'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Chip,
  Tooltip,
  Badge,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  Warning,
  Error,
  Info,
  TrendingUp,
  TrendingDown,
  Psychology,
  ExpandMore,
  ExpandLess,
  Refresh,
  Close,
} from '@mui/icons-material'

interface Anomaly {
  id: string
  type: 'variance' | 'trend' | 'pattern' | 'outlier'
  severity: 'low' | 'medium' | 'high' | 'critical'
  account: string
  message: string
  description: string
  confidence: number
  value: number
  expectedValue: number
  variance: number
  recommendations: string[]
  timestamp: Date
}

const mockAnomalies: Anomaly[] = [
  {
    id: '1',
    type: 'variance',
    severity: 'high',
    account: 'Marketing Expenses',
    message: 'Unusual budget variance detected',
    description: 'Marketing expenses exceeded budget by 15.2%, which is 3x higher than historical average',
    confidence: 94,
    value: 520000,
    expectedValue: 451000,
    variance: 15.2,
    recommendations: [
      'Review marketing campaign spending',
      'Check for unplanned advertising purchases',
      'Validate expense categorization',
    ],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'trend',
    severity: 'medium',
    account: 'R&D Costs',
    message: 'Declining trend identified',
    description: 'R&D spending has decreased 8% month-over-month for 3 consecutive months',
    confidence: 87,
    value: 280000,
    expectedValue: 305000,
    variance: -8.2,
    recommendations: [
      'Assess impact on product development',
      'Review resource allocation',
      'Consider budget reallocation',
    ],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'outlier',
    severity: 'critical',
    account: 'Software Licenses',
    message: 'Significant outlier detected',
    description: 'Single transaction of $150K is 5x larger than typical software license purchases',
    confidence: 99,
    value: 150000,
    expectedValue: 30000,
    variance: 400,
    recommendations: [
      'Verify transaction authenticity',
      'Check for bulk license purchase',
      'Review approval documentation',
    ],
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '4',
    type: 'pattern',
    severity: 'low',
    account: 'Travel Expenses',
    message: 'Seasonal pattern anomaly',
    description: 'Travel expenses are 25% higher than expected for this time of year',
    confidence: 76,
    value: 45000,
    expectedValue: 36000,
    variance: 25,
    recommendations: [
      'Review travel policies',
      'Check for conference attendance',
      'Validate expense timing',
    ],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
]

interface AnomalyIndicatorProps {
  anomaly: Anomaly
  compact?: boolean
}

export function AnomalyIndicator({ anomaly, compact = false }: AnomalyIndicatorProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#2563eb'
      default: return '#6b7280'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <Error sx={{ fontSize: 16 }} />
      case 'medium':
        return <Warning sx={{ fontSize: 16 }} />
      case 'low':
        return <Info sx={{ fontSize: 16 }} />
      default:
        return <Info sx={{ fontSize: 16 }} />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'variance': return <TrendingUp sx={{ fontSize: 14 }} />
      case 'trend': return <TrendingDown sx={{ fontSize: 14 }} />
      case 'pattern': return <Psychology sx={{ fontSize: 14 }} />
      case 'outlier': return <Warning sx={{ fontSize: 14 }} />
      default: return <Info sx={{ fontSize: 14 }} />
    }
  }

  if (compact) {
    return (
      <Tooltip 
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {anomaly.message}
            </Typography>
            <Typography variant="caption">
              {anomaly.description}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Confidence: {anomaly.confidence}%
              </Typography>
            </Box>
          </Box>
        }
        arrow
      >
        <Badge
          badgeContent={
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: getSeverityColor(anomaly.severity),
              borderRadius: '50%',
              width: 16,
              height: 16,
              justifyContent: 'center',
            }}>
              {getSeverityIcon(anomaly.severity)}
            </Box>
          }
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'transparent',
              color: 'white',
              right: -2,
              top: -2,
            },
          }}
        >
          <Chip
            icon={getTypeIcon(anomaly.type)}
            label={anomaly.severity.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: `${getSeverityColor(anomaly.severity)}20`,
              color: getSeverityColor(anomaly.severity),
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        </Badge>
      </Tooltip>
    )
  }

  return (
    <Alert
      severity={anomaly.severity === 'critical' || anomaly.severity === 'high' ? 'error' : 
               anomaly.severity === 'medium' ? 'warning' : 'info'}
      sx={{
        borderRadius: '8px',
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {anomaly.message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {anomaly.description}
          </Typography>
        </Box>
        <Chip
          label={`${anomaly.confidence}% confidence`}
          size="small"
          sx={{
            ml: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 600,
          }}
        />
      </Box>
    </Alert>
  )
}

interface AnomalyDetectorPanelProps {
  anomalies?: Anomaly[]
  onDismiss?: (anomalyId: string) => void
  className?: string
}

export function AnomalyDetectorPanel({ 
  anomalies = mockAnomalies, 
  onDismiss,
  className 
}: AnomalyDetectorPanelProps) {
  const [expandedAnomalies, setExpandedAnomalies] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const handleToggleExpand = (anomalyId: string) => {
    setExpandedAnomalies(prev => 
      prev.includes(anomalyId) 
        ? prev.filter(id => id !== anomalyId)
        : [...prev, anomalyId]
    )
  }

  const handleScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const criticalCount = anomalies.filter(a => a.severity === 'critical').length
  const highCount = anomalies.filter(a => a.severity === 'high').length
  const totalCount = anomalies.length

  return (
    <Paper 
      elevation={2} 
      className={className}
      sx={{ 
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          pb: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafbfc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Psychology sx={{ color: '#486581' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Anomaly Detection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalCount} anomalies detected • {criticalCount + highCount} require attention
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={handleScan} disabled={isScanning}>
          <Refresh sx={{ color: isScanning ? '#6b7280' : '#486581' }} />
        </IconButton>
      </Box>

      {/* Scanning Progress */}
      {isScanning && (
        <Box sx={{ p: 2, backgroundColor: '#f8fafc' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Scanning financial data for anomalies...
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={scanProgress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#486581',
              },
            }}
          />
        </Box>
      )}

      {/* Anomaly Summary */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {criticalCount > 0 && (
            <Chip
              icon={<Error sx={{ fontSize: 14 }} />}
              label={`${criticalCount} Critical`}
              size="small"
              sx={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                fontWeight: 600,
              }}
            />
          )}
          {highCount > 0 && (
            <Chip
              icon={<Warning sx={{ fontSize: 14 }} />}
              label={`${highCount} High`}
              size="small"
              sx={{
                backgroundColor: '#fed7aa',
                color: '#ea580c',
                fontWeight: 600,
              }}
            />
          )}
          <Chip
            label={`${totalCount} Total`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#486581',
              color: '#486581',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Anomaly List */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {anomalies.map((anomaly, index) => {
            const isExpanded = expandedAnomalies.includes(anomaly.id)
            
            return (
              <React.Fragment key={anomaly.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(72, 101, 129, 0.02)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box sx={{ 
                        color: getSeverityColor(anomaly.severity),
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        {getSeverityIcon(anomaly.severity)}
                      </Box>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                            {anomaly.account}: {anomaly.message}
                          </Typography>
                          <Chip
                            label={anomaly.type}
                            size="small"
                            sx={{
                              backgroundColor: '#f0f4f8',
                              color: '#374151',
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {anomaly.timestamp.toLocaleString()} • {anomaly.confidence}% confidence
                        </Typography>
                      }
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {onDismiss && (
                        <IconButton
                          size="small"
                          onClick={() => onDismiss(anomaly.id)}
                          sx={{ color: '#6b7280' }}
                        >
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleToggleExpand(anomaly.id)}
                        sx={{ color: '#486581' }}
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 5, pr: 2 }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {anomaly.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Actual Value
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${anomaly.value.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Expected Value
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${anomaly.expectedValue.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Variance
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              color: anomaly.variance > 0 ? '#dc2626' : '#22c55e',
                            }}
                          >
                            {anomaly.variance > 0 ? '+' : ''}{anomaly.variance.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                        AI Recommendations:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {anomaly.recommendations.map((rec, i) => (
                          <Typography key={i} variant="caption" color="text.secondary">
                            • {rec}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                </ListItem>
                
                {index < anomalies.length - 1 && <Divider />}
              </React.Fragment>
            )
          })}
        </List>
      </Box>
    </Paper>
  )
}

// Helper functions for AnomalyIndicator component  
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return '#dc2626'
    case 'high': return '#ea580c'
    case 'medium': return '#d97706'
    case 'low': return '#2563eb'
    default: return '#6b7280'
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return <Error sx={{ fontSize: 16, color: 'white' }} />
    case 'medium':
      return <Warning sx={{ fontSize: 16, color: 'white' }} />
    case 'low':
      return <Info sx={{ fontSize: 16, color: 'white' }} />
    default:
      return <Info sx={{ fontSize: 16, color: 'white' }} />
  }
}