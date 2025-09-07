'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material'
import {
  Compare,
  TrendingUp,
  TrendingDown,
  Remove,
  CheckCircle,
  Warning,
  GetApp,
  Refresh,
  Close,
} from '@mui/icons-material'

interface AllocationData {
  account: string
  department: string
  currentAmount: number
  proposedAmount: number
  variance: number
  variancePercent: number
  driver: string
  driverValue: string
}

interface AllocationPreviewModalProps {
  open: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  ruleName: string
  totalAmount: number
  effectiveDate: string
}

const mockAllocationData: AllocationData[] = [
  {
    account: 'Sales Department',
    department: 'Sales',
    currentAmount: 120000,
    proposedAmount: 150000,
    variance: 30000,
    variancePercent: 25.0,
    driver: 'Employee Count',
    driverValue: '45 employees',
  },
  {
    account: 'Marketing',
    department: 'Marketing', 
    currentAmount: 90000,
    proposedAmount: 100000,
    variance: 10000,
    variancePercent: 11.1,
    driver: 'Employee Count',
    driverValue: '30 employees',
  },
  {
    account: 'R&D Department',
    department: 'Engineering',
    currentAmount: 180000,
    proposedAmount: 200000,
    variance: 20000,
    variancePercent: 11.1,
    driver: 'Employee Count',
    driverValue: '60 employees',
  },
  {
    account: 'Finance',
    department: 'Finance',
    currentAmount: 60000,
    proposedAmount: 50000,
    variance: -10000,
    variancePercent: -16.7,
    driver: 'Employee Count',
    driverValue: '15 employees',
  },
]

export function AllocationPreviewModal({
  open,
  onClose,
  onApprove,
  onReject,
  ruleName = 'IT Costs by Headcount',
  totalAmount = 500000,
  effectiveDate = 'October 1, 2025'
}: AllocationPreviewModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onApprove()
      onClose()
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    if (absAmount >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000).toFixed(0)}K`
    }
    return `${amount < 0 ? '-' : ''}$${absAmount.toLocaleString()}`
  }

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 5000) return '#6b7280'
    if (variance > 0) return '#ef4444'
    return '#22c55e'
  }

  const getVarianceIcon = (variance: number) => {
    if (Math.abs(variance) < 5000) return <Remove sx={{ fontSize: 16 }} />
    if (variance > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    return <TrendingDown sx={{ fontSize: 16 }} />
  }

  const totalVariance = mockAllocationData.reduce((sum, item) => sum + item.variance, 0)
  const significantChanges = mockAllocationData.filter(item => Math.abs(item.variancePercent) > 15).length

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px', maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Compare sx={{ color: '#486581' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Allocation Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ruleName} • {formatCurrency(totalAmount)} total
            </Typography>
          </Box>
        </Box>
        
        <IconButton onClick={onClose} sx={{ color: '#6b7280' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Summary Cards */}
        <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderBottom: '1px solid #e0e0e0' }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581', mb: 0.5 }}>
                  {formatCurrency(totalAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Amount
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
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
                <Typography variant="caption" color="text.secondary">
                  Net Change
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 0.5 }}>
                  {significantChanges}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Significant Changes
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mb: 0.5 }}>
                  {mockAllocationData.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Affected Departments
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Before vs After Comparison" />
            <Tab label="Impact Analysis" />
            <Tab label="Validation Results" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Current Amount</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Proposed Amount</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Change</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Driver</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAllocationData.map((row, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(72, 101, 129, 0.02)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {row.account}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.department}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(row.currentAmount)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {formatCurrency(row.proposedAmount)}
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
                              fontFamily: 'monospace',
                            }}
                          >
                            {formatCurrency(row.variance)}
                          </Typography>
                          <Chip
                            label={`${row.variancePercent > 0 ? '+' : ''}${row.variancePercent.toFixed(1)}%`}
                            size="small"
                            sx={{
                              ml: 1,
                              backgroundColor: row.variancePercent >= 0 ? '#fee2e2' : '#dcfce7',
                              color: row.variancePercent >= 0 ? '#991b1b' : '#166534',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{row.driver}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.driverValue}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Department Impact
                    </Typography>
                    {mockAllocationData.map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.department}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              color: getVarianceColor(item.variance),
                            }}
                          >
                            {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(Math.abs(item.variancePercent), 100)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getVarianceColor(item.variance),
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Key Changes
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Alert severity="warning">
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Large Increase - Sales Department
                        </Typography>
                        <Typography variant="caption">
                          25% increase ({formatCurrency(30000)}) due to recent headcount growth
                        </Typography>
                      </Alert>
                      
                      <Alert severity="info">
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Reduction - Finance Department
                        </Typography>
                        <Typography variant="caption">
                          16.7% decrease ({formatCurrency(-10000)}) reflecting smaller team size
                        </Typography>
                      </Alert>
                      
                      <Alert severity="success">
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Balanced Allocation
                        </Typography>
                        <Typography variant="caption">
                          R&D and Marketing changes are proportional to driver values
                        </Typography>
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Validation Checks
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                        <Typography variant="body2">
                          Total allocation equals source amount ({formatCurrency(totalAmount)})
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                        <Typography variant="body2">
                          All target departments have valid driver values
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning sx={{ color: '#f59e0b', fontSize: 20 }} />
                        <Typography variant="body2">
                          {significantChanges} departments have changes > 15% (review recommended)
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                        <Typography variant="body2">
                          No negative allocations detected
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                        <Typography variant="body2">
                          Allocation rule conditions satisfied
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Execution Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Effective Date</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {effectiveDate}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">Rule Priority</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          High (1)
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">Processing Time</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ~2-3 seconds
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">Affected Entries</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {mockAllocationData.length} journal entries
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>

        {isProcessing && (
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', backgroundColor: '#f8fafc' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Processing allocation...
              </Typography>
            </Box>
            <LinearProgress sx={{ borderRadius: 1 }} />
          </Box>
        )}
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
          Export Preview
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        <Button
          onClick={onReject}
          disabled={isProcessing}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleApprove}
          variant="contained"
          disabled={isProcessing}
          sx={{
            textTransform: 'none',
            backgroundColor: '#486581',
            '&:hover': {
              backgroundColor: '#334e68',
            },
          }}
        >
          {isProcessing ? 'Processing...' : 'Approve & Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}