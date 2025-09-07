'use client'

import React from 'react'
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Grid,
  Typography,
  keyframes,
} from '@mui/material'

// Shimmer effect keyframes
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

interface LoadingSkeletonProps {
  className?: string
  children?: React.ReactNode
}

// Dashboard Loading Skeleton
export function DashboardSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <Box className={className} sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="rectangular" width={20} height={20} />
                </Box>
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart Skeletons */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Skeleton variant="text" width="30%" height={28} />
                <Skeleton variant="rectangular" width={100} height={32} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={300} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="50%" height={28} sx={{ mb: 3 }} />
              <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Table Loading Skeleton
export function TableSkeleton({ rows = 5, columns = 4, className }: LoadingSkeletonProps & { rows?: number; columns?: number }) {
  return (
    <Card className={className}>
      <CardContent sx={{ p: 0 }}>
        {/* Table Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} variant="text" width={`${80 + Math.random() * 40}px`} height={20} />
            ))}
          </Box>
        </Box>
        
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant="text" 
                  width={colIndex === 0 ? '120px' : `${60 + Math.random() * 80}px`} 
                  height={16} 
                />
              ))}
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

// Chart Loading Skeleton
export function ChartSkeleton({ title, className }: LoadingSkeletonProps & { title?: string }) {
  return (
    <Card className={className}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={title ? `${title.length * 8}px` : '40%'} height={28} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={32} height={32} />
            <Skeleton variant="rectangular" width={32} height={32} />
            <Skeleton variant="rectangular" width={32} height={32} />
          </Box>
        </Box>
        
        {/* Chart Area */}
        <Box sx={{ 
          height: 300, 
          background: `linear-gradient(90deg, #f0f0f0 0px, rgba(229, 229, 229, 0.8) 40px, #f0f0f0 80px)`,
          backgroundSize: '300px',
          animation: `${shimmer} 1.5s ease-in-out infinite`,
          borderRadius: '8px',
        }} />
        
        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="rectangular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

// Form Loading Skeleton
export function FormSkeleton({ fields = 6, className }: LoadingSkeletonProps & { fields?: number }) {
  return (
    <Card className={className}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="50%" height={32} sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {Array.from({ length: fields }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} />
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Skeleton variant="rectangular" width={100} height={40} />
          <Skeleton variant="rectangular" width={80} height={40} />
        </Box>
      </CardContent>
    </Card>
  )
}

// List Loading Skeleton
export function ListSkeleton({ items = 5, className }: LoadingSkeletonProps & { items?: number }) {
  return (
    <Card className={className}>
      <CardContent sx={{ p: 0 }}>
        {Array.from({ length: items }).map((_, i) => (
          <Box key={i} sx={{ p: 3, borderBottom: i < items - 1 ? '1px solid #f0f0f0' : 'none' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={16} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="50%" height={14} />
              </Box>
              <Skeleton variant="rectangular" width={24} height={24} />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

// Card Grid Loading Skeleton
export function CardGridSkeleton({ cards = 6, className }: LoadingSkeletonProps & { cards?: number }) {
  return (
    <Grid container spacing={3} className={className}>
      {Array.from({ length: cards }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={60} height={20} />
              </Box>
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={16} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={24} />
                <Skeleton variant="rectangular" width={80} height={24} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

// Progressive Loading Component
export function ProgressiveLoader({ 
  isLoading, 
  children, 
  skeleton, 
  delay = 0,
  className 
}: {
  isLoading: boolean
  children: React.ReactNode
  skeleton: React.ReactNode
  delay?: number
  className?: string
}) {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading)

  React.useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setShowSkeleton(true)
    }
  }, [isLoading, delay])

  return (
    <Box className={className}>
      {showSkeleton ? skeleton : children}
    </Box>
  )
}

// Demo component
export function LoadingSkeletonsDemo() {
  const [loading, setLoading] = React.useState(true)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Loading Skeletons Demo
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <button onClick={() => setLoading(true)}>Show Loading</button>
          <button onClick={() => setLoading(false)}>Show Content</button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Dashboard Skeleton</Typography>
          <ProgressiveLoader
            isLoading={loading}
            skeleton={<DashboardSkeleton />}
            delay={300}
          >
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Typography>Dashboard content loaded!</Typography>
            </Box>
          </ProgressiveLoader>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Table Skeleton</Typography>
          <ProgressiveLoader
            isLoading={loading}
            skeleton={<TableSkeleton rows={3} columns={3} />}
          >
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Typography>Table content loaded!</Typography>
            </Box>
          </ProgressiveLoader>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>Chart Skeleton</Typography>
          <ProgressiveLoader
            isLoading={loading}
            skeleton={<ChartSkeleton title="Revenue Chart" />}
          >
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Typography>Chart content loaded!</Typography>
            </Box>
          </ProgressiveLoader>
        </Grid>
      </Grid>
    </Box>
  )
}