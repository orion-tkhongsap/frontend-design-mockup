'use client'

import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'
import { styled, keyframes } from '@mui/material/styles'

export interface LoadingSpinnerProps {
  size?: number | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  text?: string
  variant?: 'circular' | 'dots' | 'pulse'
  fullHeight?: boolean
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
`

const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => !['fullHeight'].includes(prop as string),
})<{ fullHeight?: boolean }>(({ fullHeight }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  padding: '32px',
  animation: `${fadeIn} 0.3s ease-out`,
  ...(fullHeight && {
    minHeight: '200px',
  }),
}))

const DotsContainer = styled(Box)({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
})

const Dot = styled(Box, {
  shouldForwardProp: (prop) => !['delay'].includes(prop as string),
})<{ delay: number; color: string }>(({ delay, color }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color,
  animation: `${pulse} 1.4s infinite ease-in-out`,
  animationDelay: `${delay}s`,
}))

const PulseBox = styled(Box, {
  shouldForwardProp: (prop) => !['size', 'color'].includes(prop as string),
})<{ size: number; color: string }>(({ size, color }) => ({
  width: size,
  height: size,
  borderRadius: '12px',
  backgroundColor: color,
  animation: `${pulse} 2s infinite ease-in-out`,
}))

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text, 
  variant = 'circular',
  fullHeight = false 
}: LoadingSpinnerProps) {
  const getSize = () => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'sm': return 24
      case 'md': return 40
      case 'lg': return 56
      default: return 40
    }
  }

  const getColor = () => {
    switch (color) {
      case 'primary': return '#486581'
      case 'secondary': return '#6c757d'
      case 'success': return '#2f855a'
      case 'warning': return '#d97706'
      case 'danger': return '#dc2626'
      default: return '#486581'
    }
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'circular':
        return (
          <CircularProgress 
            size={getSize()} 
            sx={{ color: getColor() }}
          />
        )
      
      case 'dots':
        return (
          <DotsContainer>
            <Dot delay={0} color={getColor()} />
            <Dot delay={0.2} color={getColor()} />
            <Dot delay={0.4} color={getColor()} />
          </DotsContainer>
        )
      
      case 'pulse':
        return (
          <PulseBox 
            size={getSize()} 
            color={getColor()}
          />
        )
      
      default:
        return (
          <CircularProgress 
            size={getSize()} 
            sx={{ color: getColor() }}
          />
        )
    }
  }

  return (
    <LoadingContainer fullHeight={fullHeight}>
      {renderSpinner()}
      {text && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6c757d',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {text}
        </Typography>
      )}
    </LoadingContainer>
  )
}

// Skeleton loading component for content placeholders
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const SkeletonBox = styled(Box, {
  shouldForwardProp: (prop) => !['width', 'height'].includes(prop as string),
})<{ width?: string | number; height?: string | number }>(({ width = '100%', height = '20px' }) => ({
  width,
  height,
  backgroundColor: '#f0f0f0',
  backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
  '.dark &': {
    backgroundColor: '#2a2a2a',
    backgroundImage: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)',
  },
}))

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rectangular' | 'circular'
  className?: string
}

export function Skeleton({ 
  width, 
  height, 
  variant = 'text',
  className 
}: SkeletonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return { 
          height: height || '20px',
          width: width || '100%',
          borderRadius: '4px',
        }
      case 'circular':
        return {
          height: height || '40px',
          width: width || '40px',
          borderRadius: '50%',
        }
      case 'rectangular':
        return {
          height: height || '140px',
          width: width || '100%',
          borderRadius: '8px',
        }
      default:
        return {}
    }
  }

  return (
    <SkeletonBox
      className={className}
      sx={getVariantStyles()}
    />
  )
}