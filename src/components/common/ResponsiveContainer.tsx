'use client'

import React from 'react'
import {
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'

interface ResponsiveContainerProps {
  children: React.ReactNode
  mobileView?: React.ReactNode
  tabletView?: React.ReactNode
  desktopView?: React.ReactNode
  mobileBreakpoint?: 'xs' | 'sm' | 'md'
  tabletBreakpoint?: 'md' | 'lg'
  className?: string
  sx?: any
}

export function ResponsiveContainer({
  children,
  mobileView,
  tabletView,
  desktopView,
  mobileBreakpoint = 'md',
  tabletBreakpoint = 'lg',
  className,
  sx,
}: ResponsiveContainerProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(mobileBreakpoint))
  const isTablet = useMediaQuery(theme.breakpoints.between(mobileBreakpoint, tabletBreakpoint))
  const isDesktop = useMediaQuery(theme.breakpoints.up(tabletBreakpoint))

  const getContent = () => {
    if (isMobile && mobileView) {
      return mobileView
    }
    if (isTablet && tabletView) {
      return tabletView
    }
    if (isDesktop && desktopView) {
      return desktopView
    }
    return children
  }

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // Mobile-first responsive padding
        px: {
          xs: 1, // 8px on mobile
          sm: 2, // 16px on small screens
          md: 3, // 24px on medium screens
          lg: 3, // 24px on large screens
        },
        py: {
          xs: 1,
          sm: 2,
          md: 2,
        },
        // Responsive grid layouts
        '& .responsive-grid': {
          display: 'grid',
          gap: {
            xs: 1,
            sm: 2,
            md: 3,
          },
          gridTemplateColumns: {
            xs: '1fr', // Single column on mobile
            sm: 'repeat(2, 1fr)', // Two columns on small screens
            md: 'repeat(3, 1fr)', // Three columns on medium screens
            lg: 'repeat(4, 1fr)', // Four columns on large screens
          },
        },
        // Responsive card layouts
        '& .responsive-cards': {
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          flexWrap: 'wrap',
          gap: {
            xs: 1,
            sm: 2,
            md: 3,
          },
          '& > *': {
            flex: {
              xs: '1 1 100%', // Full width on mobile
              sm: '1 1 calc(50% - 8px)', // Half width on small screens
              md: '1 1 calc(33.333% - 16px)', // Third width on medium screens
              lg: '1 1 calc(25% - 18px)', // Quarter width on large screens
            },
          },
        },
        // Responsive text sizes
        '& .responsive-text': {
          fontSize: {
            xs: '0.875rem', // 14px on mobile
            sm: '1rem', // 16px on small screens
            md: '1.125rem', // 18px on medium+ screens
          },
        },
        // Responsive headings
        '& .responsive-heading': {
          fontSize: {
            xs: '1.25rem', // 20px on mobile
            sm: '1.5rem', // 24px on small screens
            md: '1.875rem', // 30px on medium+ screens
          },
          fontWeight: 700,
        },
        // Touch-friendly interactive elements
        '& .touch-target': {
          minHeight: {
            xs: 44, // 44px minimum touch target on mobile
            md: 36, // Can be smaller on desktop with mouse
          },
          minWidth: {
            xs: 44,
            md: 36,
          },
        },
        // Responsive spacing utilities
        '& .responsive-margin': {
          margin: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        },
        '& .responsive-padding': {
          padding: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        },
        // Hide elements on specific breakpoints
        '& .hide-mobile': {
          display: {
            xs: 'none',
            md: 'block',
          },
        },
        '& .hide-desktop': {
          display: {
            xs: 'block',
            md: 'none',
          },
        },
        '& .show-tablet-up': {
          display: {
            xs: 'none',
            sm: 'block',
          },
        },
        ...sx,
      }}
    >
      {getContent()}
    </Box>
  )
}

// Utility component for responsive grid layouts
export function ResponsiveGrid({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = { xs: 1, sm: 2, md: 3 },
  className,
  sx,
}: {
  children: React.ReactNode
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  gap?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  className?: string
  sx?: any
}) {
  return (
    <Box
      className={className}
      sx={{
        display: 'grid',
        gap,
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || columns.xs || 1}, 1fr)`,
          md: `repeat(${columns.md || columns.sm || columns.xs || 1}, 1fr)`,
          lg: `repeat(${columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
          xl: `repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.xs || 1}, 1fr)`,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

// Utility component for responsive flex layouts
export function ResponsiveFlex({
  children,
  direction = { xs: 'column', sm: 'row' },
  gap = { xs: 1, sm: 2 },
  align = 'stretch',
  justify = 'flex-start',
  wrap = 'wrap',
  className,
  sx,
}: {
  children: React.ReactNode
  direction?: { xs?: 'row' | 'column'; sm?: 'row' | 'column'; md?: 'row' | 'column'; lg?: 'row' | 'column' }
  gap?: { xs?: number; sm?: number; md?: number; lg?: number }
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  className?: string
  sx?: any
}) {
  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isMd = useMediaQuery(theme.breakpoints.only('md'))
  const isLg = useMediaQuery(theme.breakpoints.only('lg'))
  const isXl = useMediaQuery(theme.breakpoints.up('xl'))

  if (isXl && values.xl !== undefined) return values.xl
  if (isLg && values.lg !== undefined) return values.lg
  if (isMd && values.md !== undefined) return values.md
  if (isSm && values.sm !== undefined) return values.sm
  if (isXs && values.xs !== undefined) return values.xs

  // Fallback to largest available value
  return values.xl || values.lg || values.md || values.sm || values.xs
}