'use client'

import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  Person,
  DarkMode,
  LightMode,
  Help,
  Feedback,
} from '@mui/icons-material'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface TopBarProps {
  onMenuToggle: () => void
  sidebarOpen: boolean
  sidebarWidth: number
  sidebarCollapsedWidth: number
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Budget Variance Alert',
    message: 'Marketing department exceeded budget by 15%',
    time: '5 minutes ago',
    type: 'warning',
    read: false,
  },
  {
    id: '2',
    title: 'Report Generated',
    message: 'Q3 P&L statement is ready for review',
    time: '1 hour ago',
    type: 'success',
    read: false,
  },
  {
    id: '3',
    title: 'AI Insight Available',
    message: 'Revenue forecast updated with new data',
    time: '2 hours ago',
    type: 'info',
    read: true,
  },
]

export function TopBar({ 
  onMenuToggle, 
  sidebarOpen, 
  sidebarWidth, 
  sidebarCollapsedWidth 
}: TopBarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null)
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null)

  const unreadCount = mockNotifications.filter(n => !n.read).length

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setUserMenuAnchor(null)
    setNotificationsAnchor(null)
    setSettingsAnchor(null)
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'success': return '#10b981'
      default: return '#3b82f6'
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile 
          ? '100%' 
          : `calc(100% - ${sidebarOpen ? sidebarWidth : sidebarCollapsedWidth}px)`,
        ml: isMobile 
          ? 0 
          : `${sidebarOpen ? sidebarWidth : sidebarCollapsedWidth}px`,
        backgroundColor: '#ffffff',
        color: '#0d1b2a',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #e0e0e0',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onMenuToggle}
              sx={{ color: '#486581' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#0d1b2a',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Financial Dashboard
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search */}
          <IconButton
            size="large"
            sx={{ 
              color: '#486581',
              '&:hover': { backgroundColor: 'rgba(72, 101, 129, 0.04)' },
            }}
          >
            <Search />
          </IconButton>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <IconButton
            size="large"
            onClick={handleNotificationsClick}
            sx={{ 
              color: '#486581',
              '&:hover': { backgroundColor: 'rgba(72, 101, 129, 0.04)' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton
            size="large"
            onClick={handleSettingsClick}
            sx={{ 
              color: '#486581',
              '&:hover': { backgroundColor: 'rgba(72, 101, 129, 0.04)' },
            }}
          >
            <Settings />
          </IconButton>

          {/* User Profile */}
          <IconButton
            size="large"
            onClick={handleUserMenuClick}
            sx={{ 
              color: '#486581',
              '&:hover': { backgroundColor: 'rgba(72, 101, 129, 0.04)' },
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                backgroundColor: '#486581',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              JD
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 280,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            John Doe
          </Typography>
          <Typography variant="body2" color="text.secondary">
            john.doe@company.com
          </Typography>
          <Chip 
            label="Finance Manager" 
            size="small" 
            sx={{ mt: 1, backgroundColor: '#f0f4f8', color: '#486581' }}
          />
        </Box>
        
        <Divider />
        
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile Settings</ListItemText>
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help & Support</ListItemText>
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <Feedback fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Feedback</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 360,
            maxWidth: 400,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {unreadCount} unread notifications
            </Typography>
          )}
        </Box>
        
        {mockNotifications.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{
              borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
              backgroundColor: notification.read ? 'transparent' : 'rgba(72, 101, 129, 0.02)',
              '&:hover': {
                backgroundColor: 'rgba(72, 101, 129, 0.04)',
              },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {notification.time}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {notification.message}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        <Divider />
        <MenuItem sx={{ justifyContent: 'center', py: 1 }}>
          <Typography variant="body2" color="primary">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Account Settings</ListItemText>
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <Notifications fontSize="small" />
          </ListItemIcon>
          <ListItemText>Notification Preferences</ListItemText>
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>General Settings</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  )
}