'use client'

import React, { useState } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Dashboard,
  Assessment,
  PieChart,
  AccountBalance,
  Psychology,
  TrendingUp,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Analytics,
  Calculate,
  RequestQuote,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: MenuItem[]
  badge?: number
}

const navigationItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    id: 'reports',
    label: 'Financial Reports',
    icon: <Assessment />,
    children: [
      { id: 'pl', label: 'P&L Statement', icon: <Analytics />, path: '/reports/pl' },
      { id: 'balance', label: 'Balance Sheet', icon: <AccountBalance />, path: '/reports/balance' },
      { id: 'cashflow', label: 'Cash Flow', icon: <TrendingUp />, path: '/reports/cashflow' },
    ],
  },
  {
    id: 'scenarios',
    label: 'Scenario Planning',
    icon: <PieChart />,
    children: [
      { id: 'builder', label: 'Scenario Builder', icon: <Calculate />, path: '/scenarios/builder' },
      { id: 'comparison', label: 'Compare Scenarios', icon: <Analytics />, path: '/scenarios/compare' },
    ],
  },
  {
    id: 'allocations',
    label: 'Cost Allocation',
    icon: <RequestQuote />,
    path: '/allocations',
  },
  {
    id: 'budgets',
    label: 'Budgeting',
    icon: <AccountBalance />,
    children: [
      { id: 'input', label: 'Budget Input', icon: <RequestQuote />, path: '/budgets/input' },
      { id: 'review', label: 'Budget Review', icon: <Assessment />, path: '/budgets/review' },
      { id: 'approval', label: 'Approval Workflow', icon: <TrendingUp />, path: '/budgets/approval' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    icon: <Psychology />,
    path: '/ai',
    badge: 3,
  },
  {
    id: 'planning',
    label: 'Strategic Planning',
    icon: <TrendingUp />,
    path: '/planning',
  },
]

interface SidebarProps {
  open: boolean
  onToggle: () => void
  width?: number
  collapsedWidth?: number
}

export function Sidebar({ 
  open, 
  onToggle, 
  width = 280, 
  collapsedWidth = 64 
}: SidebarProps) {
  const theme = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [expandedItems, setExpandedItems] = useState<string[]>(['reports'])

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      )
    } else if (item.path) {
      router.push(item.path)
      if (isMobile) {
        onToggle()
      }
    }
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = item.path ? isActive(item.path) : false

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              py: 1,
              pl: level > 0 ? 4 + level * 2 : 2.5,
              backgroundColor: active 
                ? 'rgba(72, 101, 129, 0.1)' 
                : 'transparent',
              borderRight: active ? '3px solid #486581' : 'none',
              '&:hover': {
                backgroundColor: 'rgba(72, 101, 129, 0.05)',
              },
              transition: theme.transitions.create(['background-color', 'padding'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.short,
              }),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: active ? '#486581' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            
            <ListItemText 
              primary={item.label}
              sx={{ 
                opacity: open ? 1 : 0,
                color: active ? '#486581' : 'inherit',
                fontWeight: active ? 600 : 400,
              }}
            />
            
            {open && item.badge && (
              <Box
                sx={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  mr: hasChildren ? 1 : 0,
                }}
              >
                {item.badge}
              </Box>
            )}
            
            {open && hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: open ? width : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? width : collapsedWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: '#0d1b2a',
          color: '#f0f4f8',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          minHeight: 64,
          borderBottom: '1px solid rgba(240, 244, 248, 0.1)',
        }}
      >
        {open && (
          <Typography 
            variant="h6" 
            noWrap 
            sx={{ 
              fontWeight: 700,
              color: '#f0f4f8',
              letterSpacing: '-0.025em',
            }}
          >
            Orion
          </Typography>
        )}
        
        {!isMobile && (
          <IconButton 
            onClick={onToggle}
            sx={{ 
              color: '#f0f4f8',
              '&:hover': {
                backgroundColor: 'rgba(240, 244, 248, 0.1)',
              },
            }}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(240, 244, 248, 0.1)' }} />

      {/* Navigation Items */}
      <List sx={{ pt: 1 }}>
        {navigationItems.map(item => renderMenuItem(item))}
      </List>

      {/* User Section at Bottom */}
      {open && (
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(240, 244, 248, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#486581',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              JD
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f0f4f8' }}>
                John Doe
              </Typography>
              <Typography variant="caption" sx={{ color: '#bcccdc' }}>
                Finance Manager
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}