'use client'

import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TrendingUp, Assessment, AccountBalance, PieChart } from '@mui/icons-material'

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your financial overview. Monitor key metrics and access critical insights.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card hover>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TrendingUp sx={{ color: '#2f855a', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="div">
                  $12.4M
                </Typography>
                <Typography color="text.secondary">
                  Revenue YTD
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#2f855a' }}>
              +8.2% vs last year
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card hover>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Assessment sx={{ color: '#486581', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="div">
                  $9.8M
                </Typography>
                <Typography color="text.secondary">
                  Expenses YTD
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#d97706' }}>
              +3.1% vs budget
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card hover>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AccountBalance sx={{ color: '#7c3aed', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="div">
                  $2.6M
                </Typography>
                <Typography color="text.secondary">
                  Net Income
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#2f855a' }}>
              +18.5% vs last year
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card hover>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PieChart sx={{ color: '#ca8a04', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="div">
                  21%
                </Typography>
                <Typography color="text.secondary">
                  Profit Margin
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#2f855a' }}>
              +2.1pp vs target
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="primary">
            Generate Report
          </Button>
          <Button variant="secondary">
            Create Scenario
          </Button>
          <Button variant="secondary">
            Review Budget
          </Button>
        </Box>
      </Box>
    </Box>
  )
}