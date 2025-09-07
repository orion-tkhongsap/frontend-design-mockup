'use client'

import React, { useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
  Tooltip,
} from '@mui/material'
import {
  DragIndicator,
  MoreVert,
  Edit,
  Delete,
  Fullscreen,
  Add,
  Settings,
  Refresh,
} from '@mui/icons-material'

export interface DashboardWidget {
  id: string
  title: string
  type: string
  size: { width: number; height: number }
  position: { x: number; y: number }
  config: Record<string, any>
  data?: any
}

interface DashboardGridProps {
  widgets: DashboardWidget[]
  onWidgetUpdate: (widgets: DashboardWidget[]) => void
  onAddWidget: () => void
  editMode?: boolean
  cols?: number
}

export function DashboardGrid({ 
  widgets, 
  onWidgetUpdate, 
  onAddWidget,
  editMode = false,
  cols = 12 
}: DashboardGridProps) {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [widgetMenuAnchor, setWidgetMenuAnchor] = useState<null | HTMLElement>(null)
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null)
  
  const handleWidgetMenuClick = (event: React.MouseEvent<HTMLElement>, widgetId: string) => {
    event.stopPropagation()
    setSelectedWidget(widgetId)
    setWidgetMenuAnchor(event.currentTarget)
  }

  const handleWidgetMenuClose = () => {
    setWidgetMenuAnchor(null)
    setSelectedWidget(null)
  }

  const handleDeleteWidget = () => {
    if (selectedWidget) {
      onWidgetUpdate(widgets.filter(w => w.id !== selectedWidget))
    }
    handleWidgetMenuClose()
  }

  const handleFullscreenWidget = () => {
    setFullscreenWidget(selectedWidget)
    handleWidgetMenuClose()
  }

  const handleRefreshWidget = () => {
    // Mock refresh action
    console.log('Refreshing widget:', selectedWidget)
    handleWidgetMenuClose()
  }

  const renderWidget = (widget: DashboardWidget) => {
    return (
      <Grid 
        item 
        xs={widget.size.width} 
        key={widget.id}
        sx={{ 
          minHeight: widget.size.height * 100,
          position: 'relative',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            height: '100%',
            position: 'relative',
            borderRadius: '12px',
            border: editMode ? '2px dashed #e0e0e0' : '1px solid #e0e0e0',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: editMode 
                ? '0 8px 25px rgba(72, 101, 129, 0.15)' 
                : '0 4px 20px rgba(0, 0, 0, 0.08)',
              transform: editMode ? 'scale(1.02)' : 'none',
            },
          }}
        >
          {/* Widget Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              pb: 1,
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {editMode && (
                <DragIndicator 
                  sx={{ 
                    color: '#6c757d', 
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                  }} 
                />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {widget.title}
              </Typography>
            </Box>
            
            <IconButton
              size="small"
              onClick={(e) => handleWidgetMenuClick(e, widget.id)}
              sx={{ color: '#6c757d' }}
            >
              <MoreVert />
            </IconButton>
          </Box>

          {/* Widget Content */}
          <Box sx={{ p: 2, height: 'calc(100% - 64px)' }}>
            {renderWidgetContent(widget)}
          </Box>

          {/* Edit Mode Overlay */}
          {editMode && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(72, 101, 129, 0.05)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'move',
              }}
            >
              <Typography variant="body2" sx={{ color: '#486581', fontWeight: 600 }}>
                Drag to reposition
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    )
  }

  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'kpi':
        return <KPIWidget config={widget.config} data={widget.data} />
      case 'chart':
        return <ChartWidget config={widget.config} data={widget.data} />
      case 'table':
        return <TableWidget config={widget.config} data={widget.data} />
      case 'alert':
        return <AlertWidget config={widget.config} data={widget.data} />
      default:
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: '#6c757d',
          }}>
            <Typography variant="body2">Widget type: {widget.type}</Typography>
          </Box>
        )
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Grid container spacing={3}>
        {widgets.map(renderWidget)}
        
        {/* Add Widget Placeholder */}
        {editMode && (
          <Grid item xs={6} md={4} lg={3}>
            <Paper
              elevation={0}
              onClick={onAddWidget}
              sx={{
                height: 200,
                border: '2px dashed #bbb',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#486581',
                  backgroundColor: 'rgba(72, 101, 129, 0.02)',
                },
              }}
            >
              <Add sx={{ fontSize: 48, color: '#6c757d', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Add Widget
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add Widget FAB */}
      {!editMode && (
        <Tooltip title="Add Widget">
          <Fab
            color="primary"
            onClick={onAddWidget}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: '#486581',
              '&:hover': {
                backgroundColor: '#334e68',
              },
            }}
          >
            <Add />
          </Fab>
        </Tooltip>
      )}

      {/* Widget Menu */}
      <Menu
        anchorEl={widgetMenuAnchor}
        open={Boolean(widgetMenuAnchor)}
        onClose={handleWidgetMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 160,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          },
        }}
      >
        <MenuItem onClick={handleRefreshWidget}>
          <Refresh sx={{ mr: 1, fontSize: 18 }} />
          Refresh
        </MenuItem>
        
        <MenuItem onClick={handleFullscreenWidget}>
          <Fullscreen sx={{ mr: 1, fontSize: 18 }} />
          Full Screen
        </MenuItem>
        
        <MenuItem>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Configure
        </MenuItem>
        
        <MenuItem onClick={handleDeleteWidget}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Remove
        </MenuItem>
      </Menu>

      {/* Fullscreen Dialog */}
      <Dialog
        open={Boolean(fullscreenWidget)}
        onClose={() => setFullscreenWidget(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' },
        }}
      >
        {fullscreenWidget && (
          <>
            <DialogTitle>
              {widgets.find(w => w.id === fullscreenWidget)?.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ minHeight: 400 }}>
                {renderWidgetContent(widgets.find(w => w.id === fullscreenWidget)!)}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFullscreenWidget(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

// Sample widget components
function KPIWidget({ config, data }: { config: any; data: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#486581', mb: 1 }}>
        $2.4M
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Total Revenue (Q3)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
          +8.2%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          vs last quarter
        </Typography>
      </Box>
    </Box>
  )
}

function ChartWidget({ config, data }: { config: any; data: any }) {
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
    }}>
      <Typography variant="body2" color="text.secondary">
        Chart Component Placeholder
      </Typography>
    </Box>
  )
}

function TableWidget({ config, data }: { config: any; data: any }) {
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="body2" color="text.secondary">
        Data Table Placeholder
      </Typography>
    </Box>
  )
}

function AlertWidget({ config, data }: { config: any; data: any }) {
  return (
    <Box sx={{ 
      height: '100%', 
      p: 2, 
      backgroundColor: '#fef3cd',
      borderRadius: '8px',
      border: '1px solid #fbbf24',
    }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>
        Budget Alert
      </Typography>
      <Typography variant="caption" sx={{ color: '#92400e' }}>
        Marketing dept. 15% over budget
      </Typography>
    </Box>
  )
}