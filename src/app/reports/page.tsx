'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { LoadingPage } from '@/components/ui/LoadingPage'

export default function ReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Reports
      </Typography>
      <LoadingPage 
        title="Building Financial Reports"
        subtitle="Loading P&L, Balance Sheet, and Cash Flow statements..."
        showProgress
        progress={75}
      />
    </Box>
  )
}