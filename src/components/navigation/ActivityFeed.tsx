'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Button,
  Divider,
  Tooltip,
  ButtonGroup,
} from '@mui/material'
import {
  Assessment,
  TrendingUp,
  PieChart,
  People,
  Schedule,
  Refresh,
  FilterList,
  Add,
  PlayArrow,
  Edit,
  Share,
} from '@mui/icons-material'

interface Activity {
  id: string
  type: 'report' | 'analysis' | 'budget' | 'collaboration' | 'system'
  title: string
  description: string
  user: string
  userAvatar?: string
  timestamp: Date
  status: 'completed' | 'in-progress' | 'pending'
  quickAction?: string
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'report',
    title: 'Q3 P&L Statement Generated',
    description: 'Financial report for Q3 2025 has been compiled with variance analysis',
    user: 'Sarah Johnson',
    userAvatar: 'SJ',
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'completed',
    quickAction: 'View Report',
  },
  {
    id: '2',
    type: 'analysis',
    title: 'Budget Variance Analysis',
    description: 'AI-generated insights on department spending patterns',
    user: 'John Doe',
    userAvatar: 'JD',
    timestamp: new Date(Date.now() - 45 * 60000),
    status: 'completed',
    quickAction: 'Review Analysis',
  },
  {
    id: '3',
    type: 'budget',
    title: 'Marketing Budget Update',
    description: 'Q4 marketing budget submitted for approval',
    user: 'Emily Chen',
    userAvatar: 'EC',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    status: 'pending',
    quickAction: 'Approve',
  },
  {
    id: '4',
    type: 'collaboration',
    title: 'Cost Allocation Review',
    description: 'Shared allocation model for IT department costs',
    user: 'Michael Rodriguez',
    userAvatar: 'MR',
    timestamp: new Date(Date.now() - 4 * 60 * 60000),
    status: 'in-progress',
    quickAction: 'Join Review',
  },
  {
    id: '5',
    type: 'system',
    title: 'Data Refresh Completed',
    description: 'Financial data sync from ERP systems completed successfully',
    user: 'System',
    timestamp: new Date(Date.now() - 6 * 60 * 60000),
    status: 'completed',
  },
]

const quickActions = [
  { id: 'create-report', label: 'Create Report', icon: <Assessment /> },
  { id: 'new-analysis', label: 'New Analysis', icon: <TrendingUp /> },
  { id: 'budget-scenario', label: 'Budget Scenario', icon: <PieChart /> },
  { id: 'share-data', label: 'Share Data', icon: <Share /> },
]

interface ActivityFeedProps {
  className?: string
  compact?: boolean
  showQuickActions?: boolean
}

export function ActivityFeed({ 
  className, 
  compact = false, 
  showQuickActions = true 
}: ActivityFeedProps) {
  const [activities, setActivities] = useState(mockActivities)
  const [filter, setFilter] = useState<string>('all')

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report': return <Assessment sx={{ color: '#3b82f6' }} />
      case 'analysis': return <TrendingUp sx={{ color: '#10b981' }} />
      case 'budget': return <PieChart sx={{ color: '#f59e0b' }} />
      case 'collaboration': return <People sx={{ color: '#8b5cf6' }} />
      case 'system': return <Schedule sx={{ color: '#6b7280' }} />
      default: return <Schedule sx={{ color: '#6b7280' }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'pending': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action:', actionId)
    // Mock action implementation
  }

  const handleActivityAction = (activityId: string, action: string) => {
    console.log('Activity action:', activityId, action)
    // Mock action implementation
  }

  const handleRefresh = () => {
    // Mock refresh
    console.log('Refreshing activities...')
  }

  return (
    <Paper
      className={className}
      elevation={2}
      sx={{
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        maxHeight: compact ? 500 : '100%',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafbfc',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent Activity
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Filter activities">
            <IconButton size="small">
              <FilterList />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Actions */}
      {showQuickActions && (
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#6c757d' }}>
            Quick Actions
          </Typography>
          <ButtonGroup variant="outlined" size="small" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {quickActions.map((action) => (
              <Button
                key={action.id}
                startIcon={action.icon}
                onClick={() => handleQuickAction(action.id)}
                sx={{
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  color: '#486581',
                  '&:hover': {
                    borderColor: '#486581',
                    backgroundColor: 'rgba(72, 101, 129, 0.04)',
                  },
                }}
              >
                {action.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      )}

      {/* Activities List */}
      <Box sx={{ maxHeight: compact ? 300 : 400, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem
                sx={{
                  alignItems: 'flex-start',
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(72, 101, 129, 0.02)',
                  },
                }}
              >
                <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                  {getActivityIcon(activity.type)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                        {activity.title}
                      </Typography>
                      
                      <Chip
                        label={activity.status}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          backgroundColor: getStatusColor(activity.status),
                          color: 'white',
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {activity.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {activity.user !== 'System' ? (
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                fontSize: '0.75rem',
                                backgroundColor: '#486581',
                              }}
                            >
                              {activity.userAvatar}
                            </Avatar>
                          ) : (
                            <Schedule sx={{ fontSize: 16, color: '#6c757d' }} />
                          )}
                          
                          <Typography variant="caption" color="text.secondary">
                            {activity.user} • {formatTimestamp(activity.timestamp)}
                          </Typography>
                        </Box>
                        
                        {activity.quickAction && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PlayArrow />}
                            onClick={() => handleActivityAction(activity.id, activity.quickAction!)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              height: 24,
                              borderColor: '#486581',
                              color: '#486581',
                              '&:hover': {
                                backgroundColor: 'rgba(72, 101, 129, 0.04)',
                              },
                            }}
                          >
                            {activity.quickAction}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              
              {index < activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  )
}