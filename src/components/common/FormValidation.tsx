'use client'

import React, { useState, useCallback } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  Alert,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Switch,
  Slider,
  DatePicker,
  TimePicker,
} from '@mui/material'
import {
  CheckCircle,
  Error,
  Warning,
  AttachMoney,
  Percent,
  CalendarToday,
  Schedule,
  Email,
  Phone,
  AccountBalance,
} from '@mui/icons-material'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  email?: boolean
  phone?: boolean
  currency?: boolean
  percentage?: boolean
  date?: boolean
}

interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'number' | 'currency' | 'percentage' | 'date' | 'time' | 'select' | 'checkbox' | 'switch' | 'slider'
  validation?: ValidationRule
  options?: { value: any; label: string }[]
  placeholder?: string
  helperText?: string
  disabled?: boolean
  multiline?: boolean
  rows?: number
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

interface FormValidationProps {
  fields: FieldConfig[]
  onSubmit: (data: any) => void
  onAutoSave?: (data: any) => void
  autoSaveDelay?: number
  submitLabel?: string
  resetLabel?: string
  className?: string
}

export function FormValidation({
  fields,
  onSubmit,
  onAutoSave,
  autoSaveDelay = 2000,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  className,
}: FormValidationProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Auto-save functionality
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>()

  const validateField = useCallback((name: string, value: any, rules?: ValidationRule): string | null => {
    if (!rules) return null

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required'
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return null

    // String length validation
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Must be no more than ${rules.maxLength} characters`
      }
    }

    // Number range validation
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `Must be at least ${rules.min}`
      }
      if (rules.max !== undefined && value > rules.max) {
        return `Must be no more than ${rules.max}`
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format'
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Phone validation
    if (rules.phone) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number'
      }
    }

    // Currency validation
    if (rules.currency) {
      const currencyRegex = /^\$?[\d,]+\.?\d{0,2}$/
      if (!currencyRegex.test(value.toString())) {
        return 'Please enter a valid currency amount'
      }
    }

    // Percentage validation
    if (rules.percentage) {
      const numValue = parseFloat(value)
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        return 'Please enter a percentage between 0 and 100'
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }, [])

  const handleFieldChange = useCallback((name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Auto-save logic
    if (onAutoSave) {
      setAutoSaveStatus('saving')
      
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          onAutoSave({ ...formData, [name]: value })
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus('idle'), 2000)
        } catch (error) {
          setAutoSaveStatus('error')
          setTimeout(() => setAutoSaveStatus('idle'), 3000)
        }
      }, autoSaveDelay)
    }
  }, [formData, errors, onAutoSave, autoSaveDelay])

  const handleFieldBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const field = fields.find(f => f.name === name)
    if (field?.validation) {
      const error = validateField(name, formData[name], field.validation)
      setErrors(prev => ({ ...prev, [name]: error || '' }))
    }
  }, [fields, formData, validateField])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      if (field.validation) {
        const error = validateField(field.name, formData[field.name], field.validation)
        if (error) {
          newErrors[field.name] = error
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [fields, formData, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouched(allTouched)

    if (validateForm()) {
      try {
        await onSubmit(formData)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
    
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setTouched({})
    setAutoSaveStatus('idle')
  }

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'email': return <Email />
      case 'phone': return <Phone />
      case 'currency': return <AttachMoney />
      case 'percentage': return <Percent />
      case 'date': return <CalendarToday />
      case 'time': return <Schedule />
      default: return null
    }
  }

  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">Saving...</Typography>
          </Alert>
        )
      case 'saved':
        return (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">All changes saved</Typography>
          </Alert>
        )
      case 'error':
        return (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">Error saving changes</Typography>
          </Alert>
        )
      default:
        return null
    }
  }

  const renderField = (field: FieldConfig) => {
    const hasError = touched[field.name] && !!errors[field.name]
    const fieldValue = formData[field.name] || ''

    const commonProps = {
      name: field.name,
      label: field.label,
      disabled: field.disabled,
      error: hasError,
      helperText: hasError ? errors[field.name] : field.helperText,
      onBlur: () => handleFieldBlur(field.name),
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <TextField
            {...commonProps}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            multiline={field.multiline}
            rows={field.rows}
            fullWidth
            InputProps={{
              startAdornment: (field.startAdornment || getFieldIcon(field.type)) && (
                <InputAdornment position="start">
                  {field.startAdornment || getFieldIcon(field.type)}
                </InputAdornment>
              ),
              endAdornment: field.endAdornment && (
                <InputAdornment position="end">
                  {field.endAdornment}
                </InputAdornment>
              ),
            }}
          />
        )

      case 'number':
      case 'currency':
      case 'percentage':
        return (
          <TextField
            {...commonProps}
            type="number"
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getFieldIcon(field.type)}
                </InputAdornment>
              ),
              endAdornment: field.type === 'percentage' && (
                <InputAdornment position="end">%</InputAdornment>
              ),
            }}
          />
        )

      case 'select':
        return (
          <FormControl fullWidth error={hasError}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              label={field.label}
              disabled={field.disabled}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(hasError || field.helperText) && (
              <FormHelperText>
                {hasError ? errors[field.name] : field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        )

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!fieldValue}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                disabled={field.disabled}
                color="primary"
              />
            }
            label={field.label}
          />
        )

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!fieldValue}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                disabled={field.disabled}
                color="primary"
              />
            }
            label={field.label}
          />
        )

      case 'slider':
        return (
          <FormControl fullWidth>
            <FormLabel>{field.label}</FormLabel>
            <Slider
              value={fieldValue || 0}
              onChange={(_, value) => handleFieldChange(field.name, value)}
              disabled={field.disabled}
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
            {(hasError || field.helperText) && (
              <FormHelperText error={hasError}>
                {hasError ? errors[field.name] : field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        )

      default:
        return (
          <TextField
            {...commonProps}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            fullWidth
          />
        )
    }
  }

  return (
    <Box className={className}>
      {onAutoSave && getAutoSaveIndicator()}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} sm={field.type === 'checkbox' || field.type === 'switch' ? 12 : 6} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#486581',
              '&:hover': { backgroundColor: '#334e68' },
              textTransform: 'none',
            }}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
          
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
            disabled={isSubmitting}
            sx={{ textTransform: 'none' }}
          >
            {resetLabel}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

// Demo component
export function FormValidationDemo() {
  const demoFields: FieldConfig[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      validation: { required: true, minLength: 2 },
      placeholder: 'Enter your first name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      validation: { required: true, minLength: 2 },
      placeholder: 'Enter your last name',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      validation: { required: true, email: true },
      placeholder: 'name@company.com',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'phone',
      validation: { phone: true },
      placeholder: '+1 (555) 123-4567',
    },
    {
      name: 'budget',
      label: 'Annual Budget',
      type: 'currency',
      validation: { required: true, currency: true, min: 1000 },
      placeholder: '100000',
    },
    {
      name: 'growthRate',
      label: 'Expected Growth Rate',
      type: 'percentage',
      validation: { percentage: true, min: 0, max: 100 },
      placeholder: '15',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      validation: { required: true },
      options: [
        { value: 'finance', label: 'Finance' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'engineering', label: 'Engineering' },
      ],
    },
    {
      name: 'priority',
      label: 'Priority Level',
      type: 'slider',
      validation: { min: 1, max: 10 },
      helperText: 'Scale from 1 (low) to 10 (high)',
    },
    {
      name: 'newsletter',
      label: 'Subscribe to newsletter',
      type: 'checkbox',
    },
    {
      name: 'notifications',
      label: 'Enable notifications',
      type: 'switch',
    },
  ]

  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Form submitted successfully!')
  }

  const handleAutoSave = (data: any) => {
    console.log('Auto-saving:', data)
  }

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Form Validation Demo
        </Typography>
        
        <FormValidation
          fields={demoFields}
          onSubmit={handleSubmit}
          onAutoSave={handleAutoSave}
          submitLabel="Create Account"
          resetLabel="Clear Form"
        />
      </CardContent>
    </Card>
  )
}