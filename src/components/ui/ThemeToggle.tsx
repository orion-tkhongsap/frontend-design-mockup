'use client'

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { LightMode, DarkMode } from '@mui/icons-material'
import { useTheme } from '@/lib/theme/ThemeProvider'

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          transition: 'all 0.25s cubic-bezier(0, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        {mode === 'light' ? (
          <DarkMode sx={{ color: '#486581' }} />
        ) : (
          <LightMode sx={{ color: '#fde047' }} />
        )}
      </IconButton>
    </Tooltip>
  )
}