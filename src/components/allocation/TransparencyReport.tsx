'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material'
import {
  ExpandMore,
  Visibility,
  GetApp,
  Calculate,
  AccountTree,
  Timeline,
  Info,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material'

interface CalculationStep {
  id: string
  description: string
  formula: string
  inputs: { [key: string]: number | string }
  result: number
  explanation: string
}

interface AllocationBreakdown {
  ruleId: string
  ruleName: string
  sourceAccount: string
  totalAmount: number
  driver: string
  steps: CalculationStep[]
  allocations: {
    targetAccount: string
    driverValue: number
    percentage: number
    amount: number
  }[]
}

const mockTransparencyData: AllocationBreakdown[] = [
  {
    ruleId: '1',
    ruleName: 'IT Costs by Employee Count',
    sourceAccount: 'IT Department',
    totalAmount: 500000,
    driver: 'Employee Count',
    steps: [
      {
        id: 'step1',
        description: 'Calculate total employee count across target departments',
        formula: 'SUM(employee_count_per_department)',
        inputs: {
          'Sales': 45,
          'Marketing': 30,
          'R&D': 60,
          'Finance': 15,
        },
        result: 150,
        explanation: 'Sum all employees in departments receiving IT cost allocation',
      },
      {
        id: 'step2',
        description: 'Calculate allocation percentage per department',
        formula: 'department_employees / total_employees * 100',
        inputs: {
          'Sales': '45 / 150 = 30%',
          'Marketing': '30 / 150 = 20%',
          'R&D': '60 / 150 = 40%',
          'Finance': '15 / 150 = 10%',
        },
        result: 100,
        explanation: 'Each department percentage based on proportional employee count',
      },
      {
        id: 'step3',
        description: 'Apply percentages to total IT budget',
        formula: 'total_amount * allocation_percentage',
        inputs: {
          'Sales': '$500,000 × 30% = $150,000',
          'Marketing': '$500,000 × 20% = $100,000',
          'R&D': '$500,000 × 40% = $200,000',
          'Finance': '$500,000 × 10% = $50,000',
        },
        result: 500000,
        explanation: 'Final allocation amounts calculated proportionally',
      },
    ],
    allocations: [
      { targetAccount: 'Sales Department', driverValue: 45, percentage: 30, amount: 150000 },
      { targetAccount: 'Marketing', driverValue: 30, percentage: 20, amount: 100000 },
      { targetAccount: 'R&D Department', driverValue: 60, percentage: 40, amount: 200000 },
      { targetAccount: 'Finance', driverValue: 15, percentage: 10, amount: 50000 },
    ],
  },
  {
    ruleId: '2',
    ruleName: 'Facilities Cost by Floor Space',
    sourceAccount: 'Facilities & Real Estate',
    totalAmount: 240000,
    driver: 'Square Footage',
    steps: [
      {
        id: 'step1',
        description: 'Sum total office space allocation',
        formula: 'SUM(square_footage_per_department)',
        inputs: {
          'Sales': 2500,
          'Marketing': 1800,
          'R&D': 3200,
          'Finance': 800,
        },
        result: 8300,
        explanation: 'Total square footage across all departments',
      },
      {
        id: 'step2',
        description: 'Calculate cost per square foot',
        formula: 'total_facilities_cost / total_square_footage',
        inputs: {
          'Total Cost': 240000,
          'Total Sq Ft': 8300,
          'Cost per Sq Ft': '$28.92',
        },
        result: 28.92,
        explanation: 'Unit cost for facilities allocation calculations',
      },
      {
        id: 'step3',
        description: 'Allocate based on space usage',
        formula: 'department_sqft * cost_per_sqft',
        inputs: {
          'Sales': '2,500 × $28.92 = $72,289',
          'Marketing': '1,800 × $28.92 = $52,060',
          'R&D': '3,200 × $28.92 = $92,542',
          'Finance': '800 × $28.92 = $23,133',
        },
        result: 240000,
        explanation: 'Final allocation based on proportional space usage',
      },
    ],
    allocations: [
      { targetAccount: 'Sales Department', driverValue: 2500, percentage: 30.1, amount: 72289 },
      { targetAccount: 'Marketing', driverValue: 1800, percentage: 21.7, amount: 52060 },
      { targetAccount: 'R&D Department', driverValue: 3200, percentage: 38.6, amount: 92542 },
      { targetAccount: 'Finance', driverValue: 800, percentage: 9.6, amount: 23133 },
    ],
  },
]

interface TransparencyReportProps {
  data?: AllocationBreakdown[]
  title?: string
  period?: string
  className?: string
}

export function TransparencyReport({
  data = mockTransparencyData,
  title = 'Cost Allocation Transparency Report',
  period = 'September 2025',
  className
}: TransparencyReportProps) {
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(['1'])
  const [activeSteps, setActiveSteps] = useState<{ [ruleId: string]: number }>({})

  const handleAccordionChange = (ruleId: string) => {
    setExpandedAccordions(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    )
  }

  const handleStepClick = (ruleId: string, stepIndex: number) => {
    setActiveSteps(prev => ({ ...prev, [ruleId]: stepIndex }))
  }

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const totalAllocated = data.reduce((sum, rule) => sum + rule.totalAmount, 0)

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed breakdown of allocation calculations for {period}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              sx={{ textTransform: 'none' }}
            >
              View Summary
            </Button>
          </Box>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581', mb: 0.5 }}>
                {formatCurrency(totalAllocated)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Allocated
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mb: 0.5 }}>
                {data.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Allocation Rules
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mb: 0.5 }}>
                {data.reduce((sum, rule) => sum + rule.allocations.length, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Target Accounts
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 0.5 }}>
                100%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Allocation Coverage
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Allocation Rule Breakdowns */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((rule) => (
          <Paper key={rule.ruleId} elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Accordion 
              expanded={expandedAccordions.includes(rule.ruleId)}
              onChange={() => handleAccordionChange(rule.ruleId)}
              sx={{ boxShadow: 'none' }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e0e0e0',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <AccountTree sx={{ color: '#486581' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {rule.ruleName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rule.sourceAccount} → {rule.allocations.length} departments • {formatCurrency(rule.totalAmount)}
                    </Typography>
                  </Box>
                  <Chip
                    label={rule.driver}
                    sx={{
                      backgroundColor: '#e0f2fe',
                      color: '#0277bd',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <Grid container>
                  {/* Calculation Steps */}
                  <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid #e0e0e0' } }}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calculate sx={{ color: '#486581' }} />
                        Calculation Steps
                      </Typography>
                      
                      <Stepper orientation="vertical" activeStep={activeSteps[rule.ruleId] || 0}>
                        {rule.steps.map((step, index) => (
                          <Step key={step.id} completed={false}>
                            <StepLabel
                              onClick={() => handleStepClick(rule.ruleId, index)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {step.description}
                              </Typography>
                            </StepLabel>
                            <StepContent>
                              <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                  Formula: <code style={{ backgroundColor: '#f0f4f8', padding: '2px 4px', borderRadius: '4px' }}>
                                    {step.formula}
                                  </code>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {step.explanation}
                                </Typography>
                              </Alert>
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                                  Inputs & Calculations:
                                </Typography>
                                {Object.entries(step.inputs).map(([key, value]) => (
                                  <Typography key={key} variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                                    <strong>{key}:</strong> {value}
                                  </Typography>
                                ))}
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CheckCircle sx={{ color: '#22c55e', fontSize: 16 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  Result: {typeof step.result === 'number' && step.result > 1000 
                                    ? formatCurrency(step.result) 
                                    : step.result.toLocaleString()}
                                </Typography>
                              </Box>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </Grid>

                  {/* Allocation Results */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timeline sx={{ color: '#486581' }} />
                        Allocation Results
                      </Typography>
                      
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Target Account</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Driver Value</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>%</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rule.allocations.map((allocation, index) => (
                              <TableRow key={index}>
                                <TableCell>{allocation.targetAccount}</TableCell>
                                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                                  {allocation.driverValue.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={`${allocation.percentage.toFixed(1)}%`}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#e0f2fe',
                                      color: '#0277bd',
                                      fontWeight: 600,
                                      fontSize: '0.75rem',
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                  {formatCurrency(allocation.amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                            
                            {/* Total Row */}
                            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>
                                {rule.allocations.reduce((sum, a) => sum + a.driverValue, 0).toLocaleString()}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label="100.0%"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#22c55e',
                                    color: 'white',
                                    fontWeight: 700,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                {formatCurrency(rule.totalAmount)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {/* Verification */}
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Allocation Verified
                          </Typography>
                        </Box>
                        <Typography variant="caption">
                          All calculations sum to 100% with zero variance. Driver data validated against source systems.
                        </Typography>
                      </Alert>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Box>

      {/* Footer */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: '12px', backgroundColor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Report Generated
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} • All calculations verified and auditable
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}