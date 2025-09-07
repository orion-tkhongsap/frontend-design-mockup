'use client'

import React from 'react'
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material'

interface LoadingSkeletonProps {
  type?: 'dashboard' | 'table' | 'chart' | 'form' | 'list'
  rows?: number
  height?: number
}

export function LoadingSkeleton({ 
  type = 'dashboard', 
  rows = 3, 
  height = 200 
}: LoadingSkeletonProps) {
  
  const renderDashboardSkeleton = () => (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={32} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={32} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
      
      {/* Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2, borderRadius: 2 }} />
          </CardContent>
        </Card>
      </Grid>
      
      {/* Side Panel */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={24} />
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={16} />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderTableSkeleton = () => (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="30%" height={32} />
        <Box sx={{ mt: 2 }}>
          {/* Table Header */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="text" width="20%" height={24} />
            ))}
          </Box>
          
          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} variant="text" width="20%" height={20} />
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )

  const renderChartSkeleton = () => (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="rectangular" height={height} sx={{ mt: 2, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="rectangular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )

  const renderFormSkeleton = () => (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="50%" height={32} sx={{ mb: 3 }} />
        {Array.from({ length: rows }).map((_, i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  )

  const renderListSkeleton = () => (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        {Array.from({ length: rows }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
      </CardContent>
    </Card>
  )

  switch (type) {
    case 'dashboard':
      return renderDashboardSkeleton()
    case 'table':
      return renderTableSkeleton()
    case 'chart':
      return renderChartSkeleton()
    case 'form':
      return renderFormSkeleton()
    case 'list':
      return renderListSkeleton()
    default:
      return renderDashboardSkeleton()
  }
}