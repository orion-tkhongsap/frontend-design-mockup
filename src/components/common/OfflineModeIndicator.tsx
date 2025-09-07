'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Alert,
  Snackbar,
  Typography,
  Button,
  IconButton,
  Slide,
  Collapse,
  LinearProgress,
} from '@mui/material'
import {
  CloudOff,
  Wifi,
  Sync,
  Refresh,
  Close,
  Warning,
  CheckCircle,
} from '@mui/icons-material'

interface OfflineData {
  lastSync: Date
  pendingChanges: number
  cachedPages: string[]
  offlineCapabilities: string[]
}

interface OfflineModeIndicatorProps {
  isOnline?: boolean
  onRetry?: () => void
  className?: string
}

export function OfflineModeIndicator({ 
  isOnline: initialOnline = true, 
  onRetry,
  className 
}: OfflineModeIndicatorProps) {
  const [isOnline, setIsOnline] = useState(initialOnline)
  const [showBanner, setShowBanner] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [offlineData, setOfflineData] = useState<OfflineData>({
    lastSync: new Date(),
    pendingChanges: 0,
    cachedPages: ['Dashboard', 'Reports', 'Budget Forms'],
    offlineCapabilities: ['View cached data', 'Draft budget entries', 'View reports'],
  })

  // Simulate network status changes (for demo purposes)
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setIsRetrying(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Simulate offline mode for demo
  useEffect(() => {
    if (!initialOnline) {
      setIsOnline(false)
      setShowBanner(true)
    }
  }, [initialOnline])

  const handleRetry = async () => {
    setIsRetrying(true)
    
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Randomly succeed or fail for demo
      const success = Math.random() > 0.3
      
      if (success) {
        setIsOnline(true)
        setShowBanner(false)
        setOfflineData(prev => ({
          ...prev,
          lastSync: new Date(),
          pendingChanges: 0,
        }))
      }
      
      onRetry?.()
    } finally {
      setIsRetrying(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  if (isOnline && showBanner) {
    return (
      <Snackbar
        open={true}
        autoHideDuration={5000}
        onClose={() => setShowBanner(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setShowBanner(false)}
          icon={<CheckCircle />}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          Connection restored! All data synced successfully.
        </Alert>
      </Snackbar>
    )
  }

  if (!isOnline) {
    return (
      <Box className={className}>
        {/* Persistent Banner */}
        <Collapse in={showBanner}>
          <Alert
            severity="warning"
            icon={<CloudOff />}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2000,
              borderRadius: 0,
              backgroundColor: '#fef3c7',
              borderBottom: '2px solid #f59e0b',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="small"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  startIcon={isRetrying ? <Sync className="animate-spin" /> : <Refresh />}
                  sx={{ 
                    textTransform: 'none',
                    color: '#92400e',
                    fontWeight: 600,
                  }}
                >
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setShowBanner(false)}
                  sx={{ color: '#92400e' }}
                >
                  <Close sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            }
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                You're currently offline
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last synced: {formatTimeAgo(offlineData.lastSync)}
                {offlineData.pendingChanges > 0 && (
                  <> • {offlineData.pendingChanges} pending changes</>
                )}
              </Typography>
            </Box>
          </Alert>
        </Collapse>

        {/* Detailed Offline Status */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1500,
            maxWidth: 350,
          }}
        >
          <Alert
            severity="info"
            icon={<CloudOff />}
            sx={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bfdbfe',
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Working Offline
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Available offline features:
              </Typography>
              
              <Box component="ul" sx={{ margin: 0, paddingLeft: 2, mb: 2 }}>
                {offlineData.offlineCapabilities.map((capability, index) => (
                  <Typography key={index} component="li" variant="caption" color="text.secondary">
                    {capability}
                  </Typography>
                ))}
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Cached pages: {offlineData.cachedPages.join(', ')}
              </Typography>
              
              {isRetrying && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Attempting to reconnect...
                  </Typography>
                  <LinearProgress 
                    sx={{ 
                      borderRadius: 1,
                      backgroundColor: '#e0f2fe',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#0284c7',
                      },
                    }} 
                  />
                </Box>
              )}
              
              <Button
                size="small"
                onClick={handleRetry}
                disabled={isRetrying}
                startIcon={<Refresh />}
                fullWidth
                sx={{ 
                  textTransform: 'none',
                  mt: 1,
                  backgroundColor: '#0284c7',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0369a1',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                  },
                }}
              >
                Try to Reconnect
              </Button>
            </Box>
          </Alert>
        </Box>
      </Box>
    )
  }

  return null
}

// Demo component for testing offline indicator
export function OfflineModeDemo() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  const simulateOffline = () => {
    setIsOnline(false)
    setShowIndicator(true)
  }

  const simulateOnline = () => {
    setIsOnline(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Offline Mode Indicator Demo
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={simulateOffline}
          startIcon={<CloudOff />}
          sx={{ textTransform: 'none' }}
        >
          Simulate Offline
        </Button>
        <Button
          variant="outlined"
          onClick={simulateOnline}
          startIcon={<Wifi />}
          sx={{ textTransform: 'none' }}
        >
          Simulate Online
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Current status: {isOnline ? 'Online' : 'Offline'}
      </Typography>

      {showIndicator && (
        <OfflineModeIndicator
          isOnline={isOnline}
          onRetry={() => console.log('Retry attempted')}
        />
      )}
    </Box>
  )
}