'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  Fade,
  Zoom,
  LinearProgress,
  Button,
  Alert,
} from '@mui/material'
import {
  Mic,
  MicOff,
  Stop,
  VolumeUp,
  VolumeOff,
  Settings,
  Close,
} from '@mui/icons-material'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
}

interface AudioVisualizerProps {
  isActive: boolean
  amplitude: number
}

function AudioVisualizer({ isActive, amplitude }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      
      ctx.clearRect(0, 0, width, height)
      
      if (isActive) {
        const bars = 20
        const barWidth = width / bars
        const centerY = height / 2
        
        for (let i = 0; i < bars; i++) {
          const x = i * barWidth
          const barHeight = (Math.random() * amplitude + 10) * (height / 100)
          
          const gradient = ctx.createLinearGradient(0, centerY - barHeight/2, 0, centerY + barHeight/2)
          gradient.addColorStop(0, '#486581')
          gradient.addColorStop(1, '#334e68')
          
          ctx.fillStyle = gradient
          ctx.fillRect(x + 1, centerY - barHeight/2, barWidth - 2, barHeight)
        }
      }
      
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, amplitude])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      style={{ borderRadius: '8px', backgroundColor: '#f8fafc' }}
    />
  )
}

export function VoiceInput({ onTranscript, onError, disabled = false, className }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [error, setError] = useState<string>('')
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout>()
  const amplitudeRef = useRef(0)

  // Simulate microphone audio levels
  useEffect(() => {
    if (isListening) {
      intervalRef.current = setInterval(() => {
        // Simulate varying audio levels
        const baseLevel = 20 + Math.random() * 30
        const spike = Math.random() > 0.8 ? 30 : 0
        const newLevel = Math.min(100, baseLevel + spike)
        setAudioLevel(newLevel)
        amplitudeRef.current = newLevel
      }, 100)
      
      // Duration counter
      const startTime = Date.now()
      const durationInterval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        clearInterval(durationInterval)
      }
    } else {
      setAudioLevel(0)
      setDuration(0)
      amplitudeRef.current = 0
    }
  }, [isListening])

  const startListening = async () => {
    try {
      // Check for microphone permission (simulated)
      if (!navigator.mediaDevices) {
        throw new Error('Microphone not supported in this browser')
      }

      setError('')
      setIsListening(true)
      setShowPanel(true)
      setTranscript('')

      // Simulate speech recognition delay
      setTimeout(() => {
        setIsProcessing(true)
      }, 2000)

      // Simulate transcript generation
      setTimeout(() => {
        const mockTranscripts = [
          'Show me revenue trends for Q3',
          'What is the budget variance for marketing department',
          'Generate cash flow forecast for next quarter',
          'Compare actual versus budget for all departments',
          'Why is IT spending above target this month',
          'Create expense breakdown by category',
          'Show sales performance by region',
          'Analyze cost allocation efficiency'
        ]
        
        const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
        setTranscript(randomTranscript)
        setIsProcessing(false)
        
        // Auto-submit after showing transcript
        setTimeout(() => {
          stopListening(randomTranscript)
        }, 1500)
      }, 4000)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start voice input'
      setError(errorMessage)
      onError?.(errorMessage)
      setIsListening(false)
      setShowPanel(false)
    }
  }

  const stopListening = (finalTranscript?: string) => {
    setIsListening(false)
    setIsProcessing(false)
    
    const textToSubmit = finalTranscript || transcript
    if (textToSubmit.trim()) {
      onTranscript(textToSubmit)
    }
    
    // Delay hiding panel to show final result
    setTimeout(() => {
      setShowPanel(false)
      setTranscript('')
      setDuration(0)
    }, 1000)
  }

  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box className={className}>
      {/* Voice Input Button */}
      <Tooltip title={isListening ? 'Stop recording' : 'Start voice input'}>
        <span>
          <IconButton
            onClick={handleToggleListening}
            disabled={disabled}
            sx={{
              color: isListening ? '#ef4444' : '#6b7280',
              backgroundColor: isListening ? '#fef2f2' : 'transparent',
              animation: isListening ? 'pulse 2s ease-in-out infinite' : 'none',
              '&:hover': {
                color: isListening ? '#dc2626' : '#486581',
                backgroundColor: isListening ? '#fee2e2' : '#f8fafc',
              },
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
                },
              },
            }}
          >
            {isListening ? <MicOff /> : <Mic />}
          </IconButton>
        </span>
      </Tooltip>

      {/* Voice Input Panel */}
      <Fade in={showPanel}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            borderRadius: '16px',
            minWidth: 400,
            maxWidth: 500,
            zIndex: 1400,
            border: '2px solid #486581',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: isListening ? '#ef4444' : '#22c55e',
                  color: 'white',
                  animation: isListening ? 'pulse 2s ease-in-out infinite' : 'none',
                }}
              >
                {isListening ? <Mic /> : <MicOff />}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isListening ? 'Listening...' : 'Voice Input'}
                </Typography>
                {isListening && (
                  <Typography variant="caption" color="text.secondary">
                    Duration: {formatDuration(duration)}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => setIsMuted(!isMuted)}
                sx={{ color: isMuted ? '#ef4444' : '#6b7280' }}
              >
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              <IconButton size="small" sx={{ color: '#6b7280' }}>
                <Settings />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setShowPanel(false)}
                sx={{ color: '#6b7280' }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Audio Visualizer */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <AudioVisualizer isActive={isListening} amplitude={amplitudeRef.current} />
          </Box>

          {/* Audio Level Indicator */}
          {isListening && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Audio Level
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {audioLevel.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={audioLevel}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: audioLevel > 70 ? '#22c55e' : audioLevel > 30 ? '#f59e0b' : '#ef4444',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <Zoom in={isProcessing}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Processing speech...
                </Typography>
                <LinearProgress sx={{ borderRadius: 1 }} />
              </Box>
            </Zoom>
          )}

          {/* Transcript Display */}
          {transcript && (
            <Fade in={!!transcript}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f0f9ff', 
                borderRadius: '8px', 
                border: '1px solid #bfdbfe',
                mb: 3 
              }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  Transcript:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{transcript}"
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Status Message */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {isListening && !isProcessing && (
              <Typography variant="body2" color="text.secondary">
                Speak clearly into your microphone...
              </Typography>
            )}
            {!isListening && !transcript && (
              <Typography variant="body2" color="text.secondary">
                Click the microphone button to start voice input
              </Typography>
            )}
            {transcript && !isListening && (
              <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                Transcript ready! Processing your query...
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {isListening ? (
              <Button
                variant="contained"
                onClick={stopListening}
                startIcon={<Stop />}
                sx={{
                  backgroundColor: '#ef4444',
                  '&:hover': { backgroundColor: '#dc2626' },
                  textTransform: 'none',
                }}
              >
                Stop Recording
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={startListening}
                startIcon={<Mic />}
                disabled={disabled}
                sx={{
                  backgroundColor: '#486581',
                  '&:hover': { backgroundColor: '#334e68' },
                  textTransform: 'none',
                }}
              >
                Start Recording
              </Button>
            )}
          </Box>

          {/* Tips */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f0f0f0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              💡 Try: "Show revenue trends", "Compare budget vs actual", "Generate expense report"
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Backdrop */}
      {showPanel && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
          }}
          onClick={() => setShowPanel(false)}
        />
      )}
    </Box>
  )
}