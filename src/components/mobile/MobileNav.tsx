'use client'

import React, { useState } from 'react'
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Badge,
  Typography,
  Divider,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Dashboard,
  Assessment,
  Psychology,
  Flag,
  AccountBalance,
  Notifications,
  Settings,
  Person,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Close,
  Search,
  TrendingUp,
  BarChart,
  PieChart,
  Timeline,
  Calculate,
} from '@mui/icons-material'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <Assessment />,
    path: '/reports',
    children: [
      { id: 'financial', label: 'Financial Statements', icon: <TrendingUp />, path: '/reports/financial' },
      { id: 'variance', label: 'Variance Analysis', icon: <BarChart />, path: '/reports/variance' },
      { id: 'budget', label: 'Budget Reports', icon: <PieChart />, path: '/reports/budget' },
    ],
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: <Psychology />,
    path: '/ai',
    badge: 3,
  },
  {
    id: 'strategic',
    label: 'Strategic',
    icon: <Flag />,
    path: '/strategic',
    children: [
      { id: 'planning', label: 'Long-Range Planning', icon: <Timeline />, path: '/strategic/planning' },
      { id: 'kpis', label: 'KPI Scorecard', icon: <Dashboard />, path: '/strategic/kpis' },
      { id: 'competitive', label: 'Competitive Intel', icon: <Assessment />, path: '/strategic/competitive' },
    ],
  },
  {
    id: 'budgeting',
    label: 'Budgeting',
    icon: <Calculate />,
    path: '/budgeting',
  },
]

interface MobileNavProps {
  currentPath?: string
  onNavigate?: (path: string) => void
  className?: string
}

export function MobileNav({ currentPath = '/dashboard', onNavigate, className }: MobileNavProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [bottomNavValue, setBottomNavValue] = useState(0)

  const handleItemExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleNavigate = (path: string) => {
    onNavigate?.(path)
    setDrawerOpen(false)
  }

  const renderNavItem = (item: NavItem, depth: number = 0) => (
    <Box key={item.id}>
      <ListItem
        button
        onClick={() => {
          if (item.children) {
            handleItemExpand(item.id)
          } else {
            handleNavigate(item.path)
          }
        }}
        sx={{
          pl: 2 + depth * 2,
          borderRadius: '8px',
          mx: 1,
          mb: 0.5,
          backgroundColor: currentPath === item.path ? 'rgba(72, 101, 129, 0.1)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(72, 101, 129, 0.05)',
          },
        }}
      >
        <ListItemIcon sx={{ color: currentPath === item.path ? '#486581' : 'inherit', minWidth: 40 }}>
          <Badge badgeContent={item.badge} color="error">
            {item.icon}
          </Badge>
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: currentPath === item.path ? 600 : 400,
            color: currentPath === item.path ? '#486581' : 'inherit',
          }}
        />
        {item.children && (
          expandedItems.includes(item.id) ? <ExpandLess /> : <ExpandMore />
        )}
      </ListItem>
      {item.children && (
        <Collapse in={expandedItems.includes(item.id)} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </List>
        </Collapse>
      )}
    </Box>
  )

  const getActiveBottomNavIndex = () => {
    if (currentPath.includes('/reports')) return 1
    if (currentPath.includes('/ai')) return 2
    if (currentPath.includes('/strategic')) return 3
    if (currentPath.includes('/budgeting')) return 4
    return 0 // dashboard
  }

  if (!isMobile) {
    return null // Don't render mobile nav on desktop
  }

  return (
    <Box className={className}>
      {/* Mobile Top Bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          zIndex: 1200,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ color: '#486581' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#486581' }}>
            Orion
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: '#486581' }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: '#486581' }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: '#486581', fontSize: '0.8rem' }}>
            U
          </Avatar>
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        value={getActiveBottomNavIndex()}
        onChange={(event, newValue) => {
          setBottomNavValue(newValue)
          const paths = ['/dashboard', '/reports', '/ai', '/strategic', '/budgeting']
          handleNavigate(paths[newValue])
        }}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white',
          zIndex: 1200,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            padding: '8px',
            '&.Mui-selected': {
              color: '#486581',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<Dashboard />}
        />
        <BottomNavigationAction
          label="Reports"
          icon={<Assessment />}
        />
        <BottomNavigationAction
          label="AI Chat"
          icon={
            <Badge badgeContent={3} color="error">
              <Psychology />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Strategic"
          icon={<Flag />}
        />
        <BottomNavigationAction
          label="Budget"
          icon={<Calculate />}
        />
      </BottomNavigation>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: '#fafbfc',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ backgroundColor: '#486581', width: 40, height: 40 }}>
              <AccountBalance />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#486581' }}>
                Orion FP&A
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Financial Planning
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        {/* User Profile */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'white', borderRadius: '8px' }}>
            <Avatar sx={{ backgroundColor: '#486581' }}>U</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                John Doe
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Marketing Manager
              </Typography>
            </Box>
            <IconButton size="small">
              <Settings />
            </IconButton>
          </Box>
        </Box>

        {/* Navigation Items */}
        <List sx={{ flex: 1, px: 1 }}>
          {navigationItems.map(item => renderNavItem(item))}
        </List>

        <Divider />

        {/* Footer Actions */}
        <Box sx={{ p: 2 }}>
          <ListItem
            button
            sx={{
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(72, 101, 129, 0.05)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Box>
      </Drawer>

      {/* Content Spacer */}
      <Box sx={{ height: 64 }} /> {/* Top bar spacer */}
      <Box sx={{ height: 56 }} /> {/* Bottom nav spacer */}
    </Box>
  )
}