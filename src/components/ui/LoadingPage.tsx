'use client'

import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import { LoadingSpinner } from './LoadingSpinner'

interface LoadingPageProps {
  title?: string
  subtitle?: string
  progress?: number
  showProgress?: boolean
}

export function LoadingPage({ 
  title = 'Loading...', 
  subtitle, 
  progress,
  showProgress = false 
}: LoadingPageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 3,
      }}
    >
      <LoadingSpinner size="lg" />
      
      <Box sx={{ maxWidth: 400 }}>
        <Typography 
          variant="h5" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              mb: showProgress ? 2 : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {showProgress && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress 
              variant={progress !== undefined ? 'determinate' : 'indeterminate'}
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: '#486581',
                },
              }}
            />
            {progress !== undefined && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  mt: 1,
                  display: 'block',
                }}
              >
                {Math.round(progress)}% complete
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}