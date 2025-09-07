'use client'

import React from 'react'
import { Box, Typography, Paper, Grid, Chip } from '@mui/material'
import { PLStatement } from '@/components/reports/PLStatement'
import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material'

export default function PLStatementPage() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Profit & Loss Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive financial performance analysis with period comparisons
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              $2.45M
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Revenue
            </Typography>
            <Chip
              label="+7.5% vs Q2"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
            }}
          >
            <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              $1.47M
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Gross Profit
            </Typography>
            <Chip
              label="60% Margin"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              $580K
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Operating Income
            </Typography>
            <Chip
              label="+5.8% vs Q2"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
            }}
          >
            <TrendingDown sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              $890K
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Operating Expenses
            </Typography>
            <Chip
              label="+8.5% vs Q2"
              size="small"
              sx={{
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* P&L Statement Component */}
      <PLStatement />
    </Box>
  )
}