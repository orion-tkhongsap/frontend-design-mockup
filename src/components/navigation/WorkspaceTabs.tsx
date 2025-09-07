'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Tab,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material'
import {
  Close,
  Add,
  MoreHoriz,
  DragIndicator,
  PushPin,
  ContentCopy,
  Refresh,
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'

interface WorkspaceTab {
  id: string
  label: string
  path: string
  icon?: React.ReactNode
  closable?: boolean
  pinned?: boolean
  modified?: boolean
  badge?: number
}

interface WorkspaceTabsProps {
  maxTabs?: number
  allowReorder?: boolean
  className?: string
}

export function WorkspaceTabs({ 
  maxTabs = 8, 
  allowReorder = true,
  className 
}: WorkspaceTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [tabs, setTabs] = useState<WorkspaceTab[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      closable: false,
      pinned: true,
    },
    {
      id: 'reports-pl',
      label: 'P&L Statement',
      path: '/reports/pl',
      closable: true,
      modified: true,
    },
    {
      id: 'scenarios-builder',
      label: 'Scenario Builder',
      path: '/scenarios/builder',
      closable: true,
      badge: 3,
    },
  ])
  
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [tabMenuAnchor, setTabMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedTabForMenu, setSelectedTabForMenu] = useState<string | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  // Find active tab
  const activeTabId = tabs.find(tab => tab.path === pathname)?.id || tabs[0]?.id

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    const tab = tabs.find(t => t.id === newValue)
    if (tab) {
      router.push(tab.path)
    }
  }

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const tab = tabs.find(t => t.id === tabId)
    if (tab && tab.closable) {
      setTabs(prev => prev.filter(t => t.id !== tabId))
      
      // Navigate to another tab if closing active tab
      if (tabId === activeTabId) {
        const remainingTabs = tabs.filter(t => t.id !== tabId)
        if (remainingTabs.length > 0) {
          router.push(remainingTabs[0].path)
        }
      }
    }
  }

  const handleTabContextMenu = (event: React.MouseEvent, tabId: string) => {
    event.preventDefault()
    setSelectedTabForMenu(tabId)
    setTabMenuAnchor(event.currentTarget as HTMLElement)
  }

  const handleMenuClose = () => {
    setTabMenuAnchor(null)
    setSelectedTabForMenu(null)
  }

  const handlePinTab = () => {
    if (selectedTabForMenu) {
      setTabs(prev => prev.map(tab => 
        tab.id === selectedTabForMenu 
          ? { ...tab, pinned: !tab.pinned, closable: tab.pinned }
          : tab
      ))
    }
    handleMenuClose()
  }

  const handleDuplicateTab = () => {
    if (selectedTabForMenu) {
      const tab = tabs.find(t => t.id === selectedTabForMenu)
      if (tab) {
        const newTab: WorkspaceTab = {
          ...tab,
          id: `${tab.id}-${Date.now()}`,
          label: `${tab.label} (Copy)`,
          pinned: false,
          closable: true,
          modified: false,
        }
        setTabs(prev => [...prev, newTab])
      }
    }
    handleMenuClose()
  }

  const handleCloseOthers = () => {
    if (selectedTabForMenu) {
      setTabs(prev => prev.filter(tab => 
        tab.id === selectedTabForMenu || !tab.closable || tab.pinned
      ))
    }
    handleMenuClose()
  }

  const handleCloseToRight = () => {
    if (selectedTabForMenu) {
      const selectedIndex = tabs.findIndex(tab => tab.id === selectedTabForMenu)
      setTabs(prev => prev.filter((tab, index) => 
        index <= selectedIndex || !tab.closable || tab.pinned
      ))
    }
    handleMenuClose()
  }

  // Drag and drop handlers
  const handleDragStart = (event: React.DragEvent, tabId: string) => {
    if (allowReorder) {
      setDraggedTab(tabId)
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    if (allowReorder && draggedTab) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }
  }

  const handleDrop = (event: React.DragEvent, targetTabId: string) => {
    if (allowReorder && draggedTab && draggedTab !== targetTabId) {
      event.preventDefault()
      
      const draggedIndex = tabs.findIndex(tab => tab.id === draggedTab)
      const targetIndex = tabs.findIndex(tab => tab.id === targetTabId)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newTabs = [...tabs]
        const [movedTab] = newTabs.splice(draggedIndex, 1)
        newTabs.splice(targetIndex, 0, movedTab)
        setTabs(newTabs)
      }
    }
    setDraggedTab(null)
  }

  const selectedTab = selectedTabForMenu ? tabs.find(t => t.id === selectedTabForMenu) : null

  return (
    <Box 
      className={className}
      sx={{ 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafbfc',
      }}
    >
      <Box
        ref={tabsRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 48,
          px: 2,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTabId}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flex: 1,
            minHeight: 48,
            '& .MuiTabs-flexContainer': {
              gap: 0,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120,
              maxWidth: 200,
              minHeight: 48,
              padding: '8px 12px',
              borderRadius: '8px 8px 0 0',
              marginRight: '2px',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              borderBottom: 'none',
              '&.Mui-selected': {
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderBottom: '1px solid #ffffff',
                zIndex: 1,
              },
              '&:hover': {
                backgroundColor: 'rgba(72, 101, 129, 0.04)',
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              draggable={allowReorder}
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tab.id)}
              onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  width: '100%',
                  minWidth: 0,
                }}>
                  {allowReorder && (
                    <DragIndicator 
                      sx={{ 
                        fontSize: 16, 
                        color: '#6c757d',
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                      }} 
                    />
                  )}
                  
                  {tab.pinned && (
                    <PushPin sx={{ fontSize: 14, color: '#486581' }} />
                  )}
                  
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: tab.id === activeTabId ? 600 : 400,
                      color: tab.modified ? '#d97706' : 'inherit',
                    }}
                  >
                    {tab.label}
                    {tab.modified && '*'}
                  </Typography>
                  
                  {tab.badge && (
                    <Chip
                      label={tab.badge}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.65rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 0.5,
                        },
                      }}
                    />
                  )}
                  
                  {tab.closable && (
                    <Tooltip title="Close tab">
                      <IconButton
                        size="small"
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        sx={{
                          ml: 'auto',
                          p: 0.25,
                          color: '#6c757d',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                          },
                        }}
                      >
                        <Close sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>

        {/* Add new tab button */}
        <Tooltip title="New tab">
          <IconButton
            size="small"
            sx={{
              ml: 1,
              color: '#6c757d',
              '&:hover': {
                backgroundColor: 'rgba(72, 101, 129, 0.04)',
                color: '#486581',
              },
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>

        {/* Tab options menu */}
        <Tooltip title="Tab options">
          <IconButton
            size="small"
            onClick={(e) => setTabMenuAnchor(e.currentTarget)}
            sx={{
              ml: 0.5,
              color: '#6c757d',
              '&:hover': {
                backgroundColor: 'rgba(72, 101, 129, 0.04)',
                color: '#486581',
              },
            }}
          >
            <MoreHoriz />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={tabMenuAnchor}
        open={Boolean(tabMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          },
        }}
      >
        {selectedTab && (
          <>
            <MenuItem onClick={handlePinTab}>
              <PushPin sx={{ mr: 1, fontSize: 18 }} />
              {selectedTab.pinned ? 'Unpin Tab' : 'Pin Tab'}
            </MenuItem>
            
            <MenuItem onClick={handleDuplicateTab}>
              <ContentCopy sx={{ mr: 1, fontSize: 18 }} />
              Duplicate Tab
            </MenuItem>
            
            <MenuItem>
              <Refresh sx={{ mr: 1, fontSize: 18 }} />
              Refresh Tab
            </MenuItem>
            
            <Divider />
            
            <MenuItem 
              onClick={handleCloseOthers}
              disabled={tabs.filter(t => t.closable && t.id !== selectedTabForMenu).length === 0}
            >
              Close Others
            </MenuItem>
            
            <MenuItem 
              onClick={handleCloseToRight}
              disabled={tabs.findIndex(t => t.id === selectedTabForMenu) === tabs.length - 1}
            >
              Close to Right
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  )
}