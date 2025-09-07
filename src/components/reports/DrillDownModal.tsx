'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Slide,
  Breadcrumbs,
  Link,
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import {
  Close,
  NavigateNext,
  TrendingUp,
  TrendingDown,
  GetApp,
} from '@mui/icons-material'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface DrillDownData {
  id: string
  label: string
  amount: number
  variance: number
  variancePercent: number
  category: string
  date: string
  reference?: string
}

interface DrillDownModalProps {
  open: boolean
  onClose: () => void
  accountName: string
  period: string
  data: DrillDownData[]
  breadcrumbs?: string[]
}

const mockDrillDownData: DrillDownData[] = [
  {
    id: '1',
    label: 'Product License Sales - Enterprise',
    amount: 750000,
    variance: 50000,
    variancePercent: 7.14,
    category: 'Software Licenses',
    date: '2025-09-15',
    reference: 'INV-2025-001234',
  },
  {
    id: '2',
    label: 'Product License Sales - Professional',
    amount: 350000,
    variance: -15000,
    variancePercent: -4.11,
    category: 'Software Licenses',
    date: '2025-09-20',
    reference: 'INV-2025-001235',
  },
  {
    id: '3',
    label: 'Product License Sales - Starter',
    amount: 100000,
    variance: 15000,
    variancePercent: 17.65,
    category: 'Software Licenses',
    date: '2025-09-25',
    reference: 'INV-2025-001236',
  },
  {
    id: '4',
    label: 'Maintenance & Support Renewals',
    amount: 150000,
    variance: 8000,
    variancePercent: 5.63,
    category: 'Software Licenses',
    date: '2025-09-30',
    reference: 'INV-2025-001237',
  },
]

export function DrillDownModal({ 
  open, 
  onClose, 
  accountName, 
  period,
  data = mockDrillDownData,
  breadcrumbs = ['P&L Statement', 'Total Revenue', 'Product Revenue']
}: DrillDownModalProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return '#22c55e'
    if (variance < 0) return '#ef4444'
    return '#6b7280'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    if (variance < 0) return <TrendingDown sx={{ fontSize: 16 }} />
    return null
  }

  const handleRowClick = (rowId: string) => {
    setSelectedRow(selectedRow === rowId ? null : rowId)
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0)
  const totalVariance = data.reduce((sum, item) => sum + item.variance, 0)
  const totalVariancePercent = totalVariance / (total - totalVariance) * 100

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        pb: 2,
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {accountName} - Detail Analysis
          </Typography>
          
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ 
              fontSize: '0.875rem',
              '& .MuiBreadcrumbs-ol': {
                flexWrap: 'nowrap',
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                underline="hover"
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                }}
              >
                {crumb}
              </Link>
            ))}
          </Breadcrumbs>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Period: {period} • {data.length} transactions
          </Typography>
        </Box>
        
        <IconButton onClick={onClose} sx={{ color: '#6b7280' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Summary Cards */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          p: 3, 
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <Box sx={{ 
            flex: 1, 
            textAlign: 'center',
            p: 2,
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581', mb: 0.5 }}>
              {formatCurrency(total)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            textAlign: 'center',
            p: 2,
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: getVarianceColor(totalVariance), 
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              {getVarianceIcon(totalVariance)}
              {formatCurrency(totalVariance)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Variance
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            textAlign: 'center',
            p: 2,
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}>
            <Chip
              label={formatPercent(totalVariancePercent)}
              sx={{
                height: 32,
                fontSize: '1.25rem',
                fontWeight: 700,
                backgroundColor: totalVariancePercent >= 0 ? '#dcfce7' : '#fee2e2',
                color: totalVariancePercent >= 0 ? '#166534' : '#991b1b',
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Variance %
            </Typography>
          </Box>
        </Box>

        {/* Detail Table */}
        <TableContainer sx={{ maxHeight: '400px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>
                  Transaction
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>
                  Category
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>
                  Amount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#374151' }}>
                  Variance
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>
                  Reference
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedRow === row.id ? 'rgba(72, 101, 129, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(72, 101, 129, 0.02)',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.label}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={row.category}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        borderColor: '#486581',
                        color: '#486581',
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(row.amount)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Box sx={{ color: getVarianceColor(row.variance) }}>
                        {getVarianceIcon(row.variance)}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: getVarianceColor(row.variance),
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(row.variance)}
                      </Typography>
                      <Chip
                        label={formatPercent(row.variancePercent)}
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: row.variancePercent >= 0 ? '#dcfce7' : '#fee2e2',
                          color: row.variancePercent >= 0 ? '#166534' : '#991b1b',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(row.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {row.reference}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafbfc',
      }}>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          sx={{ textTransform: 'none' }}
        >
          Export Detail
        </Button>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            textTransform: 'none',
            backgroundColor: '#486581',
            '&:hover': {
              backgroundColor: '#334e68',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}