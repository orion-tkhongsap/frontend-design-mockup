'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Badge,
  Divider,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Warning,
  Info,
  CheckCircle,
  Error,
  NotificationsActive,
  NotificationsOff,
  Close,
  Schedule,
} from '@mui/icons-material'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
  category: string
  priority: 'low' | 'medium' | 'high'
  actionable?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Budget Variance Alert',
    message: 'Marketing department exceeded budget by 15% this month',
    type: 'warning',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    category: 'Budget',
    priority: 'high',
    actionable: true,
  },
  {
    id: '2',
    title: 'Q3 Report Ready',
    message: 'Your quarterly financial report has been generated and is ready for review',
    type: 'success',
    timestamp: new Date(Date.now() - 60 * 60000),
    read: false,
    category: 'Reports',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'AI Insight Available',
    message: 'New revenue forecast model completed with 94% confidence',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    read: true,
    category: 'AI Assistant',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight 11 PM - 1 AM EST',
    type: 'info',
    timestamp: new Date(Date.now() - 4 * 60 * 60000),
    read: true,
    category: 'System',
    priority: 'low',
  },
]

interface NotificationPanelProps {
  className?: string
  compact?: boolean
}

export function NotificationPanel({ className, compact = false }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)

  // Simulate real-time notifications
  useEffect(() => {
    if (!realTimeEnabled) return

    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() < 0.1) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'Real-time Update',
          message: 'Live data refresh completed',
          type: 'info',
          timestamp: new Date(),
          read: false,
          category: 'System',
          priority: 'low',
        }
        setNotifications(prev => [newNotification, ...prev].slice(0, 20))
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [realTimeEnabled])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Warning sx={{ color: '#f59e0b' }} />
      case 'error': return <Error sx={{ color: '#ef4444' }} />
      case 'success': return <CheckCircle sx={{ color: '#10b981' }} />
      default: return <Info sx={{ color: '#3b82f6' }} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#6b7280'
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

  return (
    <Paper
      className={className}
      elevation={2}
      sx={{
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        maxHeight: compact ? 400 : '100%',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={realTimeEnabled}
                onChange={(e) => setRealTimeEnabled(e.target.checked)}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {realTimeEnabled ? <NotificationsActive /> : <NotificationsOff />}
                <Typography variant="caption">Live</Typography>
              </Box>
            }
            sx={{ mr: 1 }}
          />
          
          {unreadCount > 0 && (
            <Typography
              variant="caption"
              onClick={markAllAsRead}
              sx={{
                color: '#486581',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Mark all read
            </Typography>
          )}
        </Box>
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: compact ? 320 : 400, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                No notifications
              </Typography>
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'rgba(72, 101, 129, 0.02)',
                    borderLeft: `4px solid ${notification.read ? 'transparent' : getPriorityColor(notification.priority)}`,
                    '&:hover': {
                      backgroundColor: 'rgba(72, 101, 129, 0.04)',
                    },
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                            flex: 1,
                          }}
                        >
                          {notification.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule sx={{ fontSize: 12, color: '#6c757d' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={notification.category}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              borderColor: getPriorityColor(notification.priority),
                              color: getPriorityColor(notification.priority),
                            }}
                          />
                          
                          {notification.priority === 'high' && (
                            <Chip
                              label="HIGH"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                              }}
                            />
                          )}
                          
                          {notification.actionable && (
                            <Chip
                              label="Action Required"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                    sx={{ ml: 1 }}
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </ListItem>
                
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Box>
    </Paper>
  )
}