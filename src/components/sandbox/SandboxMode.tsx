'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Alert,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Fade,
  Zoom,
  LinearProgress,
} from '@mui/material'
import {
  Science,
  ExitToApp,
  Refresh,
  Save,
  Warning,
  PlayArrow,
  Pause,
  Settings,
  Lightbulb,
  Timeline,
} from '@mui/icons-material'

interface SandboxModeProps {
  isActive: boolean
  onToggle: (active: boolean) => void
  onExitSandbox?: () => void
  children: React.ReactNode
}

export function SandboxMode({ isActive, onToggle, onExitSandbox, children }: SandboxModeProps) {
  const [sessionTime, setSessionTime] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [experiments, setExperiments] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleExperiment = () => {
    setIsSimulating(true)
    setExperiments(prev => prev + 1)
    
    setTimeout(() => {
      setIsSimulating(false)
    }, 2000)
  }

  if (!isActive) {
    return (
      <Box>
        {/* Sandbox Activation Banner */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            border: '2px solid #5a67d8',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Science sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Sandbox Mode Available
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create and test scenarios without affecting live data
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => onToggle(true)}
              startIcon={<Science />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Enter Sandbox
            </Button>
          </Box>
        </Paper>
        
        {children}
      </Box>
    )
  }

  return (
    <Box>
      {/* Sandbox Header Banner */}
      <Fade in={isActive}>
        <Paper
          elevation={4}
          sx={{
            p: 2,
            mb: 3,
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
            border: '3px solid #ff6b9d',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #ff6b9d, #ff9a9e, #fecfef, #ff6b9d)',
              backgroundSize: '200% 100%',
              animation: 'gradient-flow 3s ease infinite',
            },
            '@keyframes gradient-flow': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Zoom in={isActive}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 107, 157, 0.7)' },
                    '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(255, 107, 157, 0)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 107, 157, 0)' },
                  },
                }}>
                  <Science sx={{ fontSize: 24, color: '#ff6b9d' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b9d' }}>
                    SANDBOX MODE
                  </Typography>
                </Box>
              </Zoom>
              
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                  Experimental Environment Active
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Chip
                    icon={<Timeline />}
                    label={`Session: ${formatTime(sessionTime)}`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      color: '#333',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<Lightbulb />}
                    label={`${experiments} experiments`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      color: '#333',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ff6b9d',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ff6b9d',
                      },
                    }}
                  />
                }
                label="Auto-save"
                sx={{ 
                  fontSize: '0.875rem',
                  color: '#333',
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 600,
                  },
                }}
              />
              
              <Tooltip title="Run Experiment">
                <IconButton
                  onClick={handleExperiment}
                  disabled={isSimulating}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#ff6b9d',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  {isSimulating ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Save Experiment">
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#ff6b9d',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Save />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Sandbox Settings">
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#ff6b9d',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  onToggle(false)
                  onExitSandbox?.()
                }}
                startIcon={<ExitToApp />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#ff6b9d',
                  fontWeight: 600,
                  textTransform: 'none',
                  border: '1px solid rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                Exit Sandbox
              </Button>
            </Box>
          </Box>
          
          {isSimulating && (
            <LinearProgress
              sx={{
                mt: 2,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ff6b9d',
                },
              }}
            />
          )}
        </Paper>
      </Fade>

      {/* Sandbox Safety Notice */}
      <Fade in={isActive}>
        <Alert
          severity="info"
          icon={<Warning />}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 243, 224, 0.8)',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            '& .MuiAlert-icon': {
              color: '#f59e0b',
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Safe Testing Environment
          </Typography>
          <Typography variant="caption">
            All changes are isolated and won't affect production data. Experiment freely with scenarios, 
            drivers, and calculations. Exit anytime to return to normal mode.
          </Typography>
        </Alert>
      </Fade>

      {/* Enhanced Children with Sandbox Styling */}
      <Box
        sx={{
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            background: 'linear-gradient(45deg, #ff6b9d, #ff9a9e, #fecfef, #ff6b9d)',
            backgroundSize: '400% 400%',
            animation: 'gradient-border 4s ease infinite',
            borderRadius: '16px',
            zIndex: -2,
            opacity: 0.3,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            backgroundColor: 'white',
            borderRadius: '12px',
            zIndex: -1,
          },
          '@keyframes gradient-border': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          '& .MuiPaper-root': {
            border: '2px solid rgba(255, 107, 157, 0.2)',
            boxShadow: '0 4px 20px rgba(255, 107, 157, 0.1)',
          },
          '& .MuiButton-contained': {
            background: isActive ? 'linear-gradient(135deg, #ff6b9d, #ff9a9e)' : undefined,
            '&:hover': {
              background: isActive ? 'linear-gradient(135deg, #ff5a8a, #ff8a8e)' : undefined,
            },
          },
        }}
      >
        {children}
      </Box>

      {/* Floating Sandbox Indicator */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
          backgroundColor: 'rgba(255, 107, 157, 0.95)',
          color: 'white',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)',
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
        }}
      >
        <Science sx={{ fontSize: 20, animation: 'spin 4s linear infinite' }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Sandbox Active
        </Typography>
        <Chip
          label={formatTime(sessionTime)}
          size="small"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 600,
            fontFamily: 'monospace',
          }}
        />
      </Box>
    </Box>
  )
}