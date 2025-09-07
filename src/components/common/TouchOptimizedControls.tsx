'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  IconButton,
  Fab,
  Switch,
  Slider,
  Chip,
  TextField,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  TouchApp,
  SwipeLeft,
  SwipeRight,
  SwipeUp,
  SwipeDown,
  PinchOutMap,
  PinchInMap,
  RotateLeft,
  RotateRight,
} from '@mui/icons-material'

interface TouchOptimizedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  className?: string
  hapticFeedback?: boolean
}

export function TouchOptimizedButton({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  startIcon,
  endIcon,
  className,
  hapticFeedback = true,
}: TouchOptimizedButtonProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10) // Subtle haptic feedback
    }
    onClick?.()
  }

  const buttonSizes = {
    small: isMobile ? 40 : 32,
    medium: isMobile ? 48 : 36,
    large: isMobile ? 56 : 44,
  }

  return (
    <Button
      className={className}
      variant={variant}
      color={color}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={handleClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      sx={{
        minHeight: buttonSizes[size],
        minWidth: buttonSizes[size],
        borderRadius: isMobile ? '12px' : '8px',
        fontSize: isMobile ? '1rem' : '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        boxShadow: pressed ? 'none' : undefined,
        // Touch-friendly padding
        px: isMobile ? 3 : 2,
        py: isMobile ? 1.5 : 1,
        // Enhanced contrast for better visibility
        ...(variant === 'contained' && {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }),
      }}
    >
      {children}
    </Button>
  )
}

interface TouchOptimizedIconButtonProps {
  children: React.ReactNode
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
  hapticFeedback?: boolean
  tooltip?: string
}

export function TouchOptimizedIconButton({
  children,
  onClick,
  size = 'medium',
  disabled = false,
  className,
  hapticFeedback = true,
  tooltip,
}: TouchOptimizedIconButtonProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
    onClick?.()
  }

  const buttonSizes = {
    small: isMobile ? 40 : 32,
    medium: isMobile ? 48 : 40,
    large: isMobile ? 56 : 48,
  }

  const iconSizes = {
    small: isMobile ? 20 : 16,
    medium: isMobile ? 24 : 20,
    large: isMobile ? 28 : 24,
  }

  const button = (
    <IconButton
      className={className}
      disabled={disabled}
      onClick={handleClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      sx={{
        width: buttonSizes[size],
        height: buttonSizes[size],
        borderRadius: isMobile ? '12px' : '50%',
        transition: 'all 0.15s ease',
        transform: pressed ? 'scale(0.9)' : 'scale(1)',
        backgroundColor: pressed ? 'rgba(72, 101, 129, 0.1)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(72, 101, 129, 0.08)',
        },
        '& .MuiSvgIcon-root': {
          fontSize: iconSizes[size],
        },
      }}
    >
      {children}
    </IconButton>
  )

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {button}
    </Tooltip>
  ) : (
    button
  )
}

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  swipeThreshold?: number
  className?: string
  disabled?: boolean
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  className,
  disabled = false,
}: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [swipeAction, setSwipeAction] = useState<string>('')

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return
    const touch = e.touches[0]
    setStartPos({ x: touch.clientX, y: touch.clientY })
    setCurrentPos({ x: 0, y: 0 })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y
    setCurrentPos({ x: deltaX, y: deltaY })

    // Show swipe hint
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeAction(deltaX > 0 ? 'swipe-right' : 'swipe-left')
    } else {
      setSwipeAction(deltaY > 0 ? 'swipe-down' : 'swipe-up')
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || disabled) return
    
    const { x, y } = currentPos
    
    // Determine swipe direction and execute callback
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe
      if (Math.abs(x) > swipeThreshold) {
        if (x > 0 && onSwipeRight) {
          onSwipeRight()
          if ('vibrate' in navigator) navigator.vibrate(20)
        } else if (x < 0 && onSwipeLeft) {
          onSwipeLeft()
          if ('vibrate' in navigator) navigator.vibrate(20)
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(y) > swipeThreshold) {
        if (y > 0 && onSwipeDown) {
          onSwipeDown()
          if ('vibrate' in navigator) navigator.vibrate(20)
        } else if (y < 0 && onSwipeUp) {
          onSwipeUp()
          if ('vibrate' in navigator) navigator.vibrate(20)
        }
      }
    }

    // Reset state
    setIsDragging(false)
    setCurrentPos({ x: 0, y: 0 })
    setSwipeAction('')
  }

  return (
    <Card
      ref={cardRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        transform: isDragging 
          ? `translate(${currentPos.x * 0.1}px, ${currentPos.y * 0.1}px) scale(${1 - Math.abs(currentPos.x + currentPos.y) * 0.0001})`
          : 'translate(0px, 0px) scale(1)',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
        overflow: 'visible',
        userSelect: 'none',
        touchAction: disabled ? 'auto' : 'none',
        // Swipe indicators
        '&::before': swipeAction ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 
            swipeAction === 'swipe-left' ? 'rgba(239, 68, 68, 0.1)' :
            swipeAction === 'swipe-right' ? 'rgba(34, 197, 94, 0.1)' :
            swipeAction === 'swipe-up' ? 'rgba(59, 130, 246, 0.1)' :
            swipeAction === 'swipe-down' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
          borderRadius: 'inherit',
          zIndex: 1,
          pointerEvents: 'none',
        } : {},
      }}
    >
      {children}
    </Card>
  )
}

interface TouchOptimizedSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  formatValue?: (value: number) => string
  disabled?: boolean
  className?: string
}

export function TouchOptimizedSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue = (v) => v.toString(),
  disabled = false,
  className,
}: TouchOptimizedSliderProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (event: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue
    setLocalValue(val)
    if (!isDragging) {
      onChange(val)
    }
  }

  const handleChangeCommitted = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue
    onChange(val)
    setIsDragging(false)
    if ('vibrate' in navigator) {
      navigator.vibrate(5)
    }
  }

  return (
    <Box className={className} sx={{ px: isMobile ? 2 : 1 }}>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          {label}: {formatValue(localValue)}
        </Typography>
      )}
      <Slider
        value={localValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        sx={{
          // Larger touch targets on mobile
          '& .MuiSlider-thumb': {
            width: isMobile ? 24 : 20,
            height: isMobile ? 24 : 20,
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0 0 0 ${isMobile ? 12 : 8}px rgba(72, 101, 129, 0.16)`,
            },
          },
          '& .MuiSlider-track': {
            height: isMobile ? 6 : 4,
          },
          '& .MuiSlider-rail': {
            height: isMobile ? 6 : 4,
          },
        }}
      />
    </Box>
  )
}

interface TouchOptimizedSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function TouchOptimizedSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: TouchOptimizedSwitchProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  return (
    <Box 
      className={className}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        minHeight: isMobile ? 48 : 32, // Touch-friendly height
      }}
    >
      <Switch
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        sx={{
          // Larger switch on mobile
          '& .MuiSwitch-switchBase': {
            padding: isMobile ? 1.5 : 1,
          },
          '& .MuiSwitch-thumb': {
            width: isMobile ? 24 : 20,
            height: isMobile ? 24 : 20,
          },
          '& .MuiSwitch-track': {
            borderRadius: isMobile ? 14 : 12,
            height: isMobile ? 28 : 24,
          },
        }}
      />
      {label && (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      )}
    </Box>
  )
}

// Demo component showing all touch-optimized controls
export function TouchControlsDemo() {
  const [sliderValue, setSliderValue] = useState(50)
  const [switchValue, setSwitchValue] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const showMessage = (message: string) => {
    setSnackbarMessage(message)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Touch-Optimized Controls Demo
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Buttons */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Touch-Optimized Buttons</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TouchOptimizedButton onClick={() => showMessage('Primary button pressed')}>
              Primary
            </TouchOptimizedButton>
            <TouchOptimizedButton 
              variant="outlined" 
              onClick={() => showMessage('Secondary button pressed')}
            >
              Secondary
            </TouchOptimizedButton>
            <TouchOptimizedIconButton 
              tooltip="Settings"
              onClick={() => showMessage('Settings pressed')}
            >
              <TouchApp />
            </TouchOptimizedIconButton>
          </Box>
        </Box>

        {/* Slider */}
        <TouchOptimizedSlider
          label="Volume"
          value={sliderValue}
          onChange={setSliderValue}
          formatValue={(v) => `${v}%`}
        />

        {/* Switch */}
        <TouchOptimizedSwitch
          label="Enable notifications"
          checked={switchValue}
          onChange={setSwitchValue}
        />

        {/* Swipeable Card */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Swipeable Card</Typography>
          <SwipeableCard
            onSwipeLeft={() => showMessage('Swiped left!')}
            onSwipeRight={() => showMessage('Swiped right!')}
            onSwipeUp={() => showMessage('Swiped up!')}
            onSwipeDown={() => showMessage('Swiped down!')}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Swipe me!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try swiping in any direction to trigger actions
              </Typography>
            </CardContent>
          </SwipeableCard>
        </Box>
      </Box>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarMessage('')} 
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}