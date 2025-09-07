'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  CheckCircle,
  Warning,
  Add,
  Delete,
  Calculate,
  Save,
  Send,
  Preview,
  AttachMoney,
  TrendingUp,
  People,
} from '@mui/icons-material'

interface BudgetLineItem {
  id: string
  category: string
  subcategory: string
  description: string
  q1Amount: number
  q2Amount: number
  q3Amount: number
  q4Amount: number
  totalAmount: number
  notes: string
  confidence: 'high' | 'medium' | 'low'
}

interface BudgetFormData {
  department: string
  budgetYear: number
  budgetType: 'operating' | 'capital' | 'revenue'
  currency: string
  lineItems: BudgetLineItem[]
  assumptions: string
  risks: string
  opportunities: string
}

const budgetCategories = {
  operating: ['Personnel', 'Technology', 'Marketing', 'Operations', 'Professional Services'],
  capital: ['Equipment', 'Software', 'Infrastructure', 'Facilities', 'Vehicles'],
  revenue: ['Product Sales', 'Service Revenue', 'Licensing', 'Partnerships', 'Other Revenue'],
}

const mockBudgetData: BudgetFormData = {
  department: 'Marketing',
  budgetYear: 2026,
  budgetType: 'operating',
  currency: 'USD',
  lineItems: [
    {
      id: '1',
      category: 'Personnel',
      subcategory: 'Salaries',
      description: 'Marketing team salaries and benefits',
      q1Amount: 180000,
      q2Amount: 185000,
      q3Amount: 190000,
      q4Amount: 195000,
      totalAmount: 750000,
      notes: 'Includes 3% annual increase and new hire in Q2',
      confidence: 'high',
    },
    {
      id: '2',
      category: 'Marketing',
      subcategory: 'Digital Advertising',
      description: 'Online advertising campaigns and paid media',
      q1Amount: 50000,
      q2Amount: 60000,
      q3Amount: 55000,
      q4Amount: 65000,
      totalAmount: 230000,
      notes: 'Increased spend for Q2 product launch and Q4 holiday campaign',
      confidence: 'medium',
    },
  ],
  assumptions: 'Inflation rate of 3%, no major market disruptions, continued growth in digital channels',
  risks: 'Economic downturn could reduce marketing budget by 15-20%, competition may increase ad costs',
  opportunities: 'New AI tools may reduce costs by 10%, potential partnership deals could provide additional budget',
}

interface BudgetInputFormProps {
  onSubmit?: (data: BudgetFormData) => void
  onSaveDraft?: (data: BudgetFormData) => void
  className?: string
}

export function BudgetInputForm({ onSubmit, onSaveDraft, className }: BudgetInputFormProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<BudgetFormData>(mockBudgetData)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewDialog, setPreviewDialog] = useState(false)

  const steps = [
    'Budget Setup',
    'Line Items',
    'Assumptions & Risks',
    'Review & Submit',
  ]

  const handleNext = () => {
    const errors = validateCurrentStep()
    if (errors.length === 0) {
      setActiveStep(prev => prev + 1)
      setValidationErrors([])
    } else {
      setValidationErrors(errors)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
    setValidationErrors([])
  }

  const validateCurrentStep = (): string[] => {
    const errors: string[] = []
    
    switch (activeStep) {
      case 0:
        if (!formData.department) errors.push('Department is required')
        if (!formData.budgetYear) errors.push('Budget year is required')
        if (!formData.budgetType) errors.push('Budget type is required')
        break
      case 1:
        if (formData.lineItems.length === 0) errors.push('At least one line item is required')
        formData.lineItems.forEach((item, index) => {
          if (!item.category) errors.push(`Line item ${index + 1}: Category is required`)
          if (!item.description) errors.push(`Line item ${index + 1}: Description is required`)
          if (item.totalAmount <= 0) errors.push(`Line item ${index + 1}: Amount must be greater than 0`)
        })
        break
      case 2:
        if (!formData.assumptions.trim()) errors.push('Budget assumptions are required')
        break
    }
    
    return errors
  }

  const addLineItem = () => {
    const newItem: BudgetLineItem = {
      id: Date.now().toString(),
      category: '',
      subcategory: '',
      description: '',
      q1Amount: 0,
      q2Amount: 0,
      q3Amount: 0,
      q4Amount: 0,
      totalAmount: 0,
      notes: '',
      confidence: 'medium',
    }
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }))
  }

  const updateLineItem = (id: string, field: keyof BudgetLineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (['q1Amount', 'q2Amount', 'q3Amount', 'q4Amount'].includes(field)) {
            updated.totalAmount = updated.q1Amount + updated.q2Amount + updated.q3Amount + updated.q4Amount
          }
          return updated
        }
        return item
      }),
    }))
  }

  const removeLineItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit?.(formData)
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#22c55e'
      case 'medium': return '#f59e0b'
      case 'low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const totalBudget = formData.lineItems.reduce((sum, item) => sum + item.totalAmount, 0)
  const progressPercent = ((activeStep + 1) / steps.length) * 100

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Budget Year"
                type="number"
                value={formData.budgetYear}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetYear: parseInt(e.target.value) || 0 }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Budget Type</InputLabel>
                <Select
                  value={formData.budgetType}
                  label="Budget Type"
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetType: e.target.value as any }))}
                >
                  <MenuItem value="operating">Operating Budget</MenuItem>
                  <MenuItem value="capital">Capital Budget</MenuItem>
                  <MenuItem value="revenue">Revenue Budget</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  Select your department and budget type to get started. This information will determine
                  the available categories and templates for your budget.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Budget Line Items
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={addLineItem}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#486581',
                  '&:hover': { backgroundColor: '#334e68' },
                }}
              >
                Add Line Item
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Q1</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Q2</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Q3</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Q4</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={item.category}
                            onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="">Select...</MenuItem>
                            {budgetCategories[formData.budgetType].map(cat => (
                              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Enter description..."
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.q1Amount}
                          onChange={(e) => updateLineItem(item.id, 'q1Amount', parseFloat(e.target.value) || 0)}
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{ startAdornment: '$' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.q2Amount}
                          onChange={(e) => updateLineItem(item.id, 'q2Amount', parseFloat(e.target.value) || 0)}
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{ startAdornment: '$' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.q3Amount}
                          onChange={(e) => updateLineItem(item.id, 'q3Amount', parseFloat(e.target.value) || 0)}
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{ startAdornment: '$' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.q4Amount}
                          onChange={(e) => updateLineItem(item.id, 'q4Amount', parseFloat(e.target.value) || 0)}
                          size="small"
                          sx={{ width: 100 }}
                          InputProps={{ startAdornment: '$' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {formatCurrency(item.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small">
                          <Select
                            value={item.confidence}
                            onChange={(e) => updateLineItem(item.id, 'confidence', e.target.value)}
                          >
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Remove">
                          <IconButton
                            size="small"
                            onClick={() => removeLineItem(item.id)}
                            sx={{ color: '#ef4444' }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Total Row */}
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell colSpan={6} sx={{ fontWeight: 700, textAlign: 'right' }}>
                      Total Budget:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'monospace' }}>
                      {formatCurrency(totalBudget)}
                    </TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="success" sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>{formData.lineItems.length}</strong> line items totaling <strong>{formatCurrency(totalBudget)}</strong>
              </Typography>
            </Alert>
          </Box>
        )

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Budget Assumptions"
                value={formData.assumptions}
                onChange={(e) => setFormData(prev => ({ ...prev, assumptions: e.target.value }))}
                multiline
                rows={4}
                fullWidth
                required
                placeholder="Key assumptions underlying this budget (inflation rates, growth projections, market conditions, etc.)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Risks & Challenges"
                value={formData.risks}
                onChange={(e) => setFormData(prev => ({ ...prev, risks: e.target.value }))}
                multiline
                rows={4}
                fullWidth
                placeholder="Potential risks that could impact this budget negatively"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Opportunities"
                value={formData.opportunities}
                onChange={(e) => setFormData(prev => ({ ...prev, opportunities: e.target.value }))}
                multiline
                rows={4}
                fullWidth
                placeholder="Potential opportunities for cost savings or revenue increases"
              />
            </Grid>
          </Grid>
        )

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Budget Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581', mb: 1 }}>
                      {formatCurrency(totalBudget)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Annual Budget
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mb: 1 }}>
                      {formData.lineItems.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Line Items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>
                      {formData.budgetYear}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Budget Year
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Ready to Submit
              </Typography>
              <Typography variant="body2">
                Review all information above. Once submitted, this budget will enter the approval workflow
                and cannot be modified without supervisor approval.
              </Typography>
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Budget Input Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.department} • {formData.budgetType} Budget • {formData.budgetYear}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={() => setPreviewDialog(true)}
              sx={{ textTransform: 'none' }}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={() => onSaveDraft?.(formData)}
              sx={{ textTransform: 'none' }}
            >
              Save Draft
            </Button>
          </Box>
        </Box>

        {/* Progress Indicator */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progressPercent)}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#486581',
              },
            }}
          />
        </Box>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Please correct the following errors:
            </Typography>
            <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
              {validationErrors.map((error, index) => (
                <li key={index}>
                  <Typography variant="body2">{error}</Typography>
                </li>
              ))}
            </Box>
          </Alert>
        )}
      </Paper>

      {/* Stepper */}
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: completed ? '#22c55e' : active ? '#486581' : '#e0e0e0',
                      color: completed || active ? 'white' : '#6b7280',
                      fontWeight: 600,
                    }}
                  >
                    {completed ? <CheckCircle sx={{ fontSize: 18 }} /> : index + 1}
                  </Box>
                )}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mt: 2, mb: 3 }}>
                  {renderStepContent(index)}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, pb: 3 }}>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ textTransform: 'none' }}
                  >
                    Back
                  </Button>
                  {index === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <Calculate /> : <Send />}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: '#486581',
                        '&:hover': { backgroundColor: '#334e68' },
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Budget'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: '#486581',
                        '&:hover': { backgroundColor: '#334e68' },
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Budget Preview</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {formData.department} {formData.budgetType} Budget - {formData.budgetYear}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {formatCurrency(item.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.confidence.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getConfidenceColor(item.confidence)}20`,
                          color: getConfidenceColor(item.confidence),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}