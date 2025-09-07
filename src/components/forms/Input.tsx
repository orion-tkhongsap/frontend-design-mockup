'use client'

import React, { forwardRef, ReactNode, useState } from 'react'
import { 
  TextField, 
  InputAdornment, 
  FormHelperText, 
  Box, 
  Typography,
  IconButton 
} from '@mui/material'
import { Visibility, VisibilityOff, Error, CheckCircle } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

export interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'standard'
  required?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  prefix?: string
  suffix?: string
  multiline?: boolean
  rows?: number
  maxRows?: number
  autoFocus?: boolean
  fullWidth?: boolean
  loading?: boolean
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    customValidator?: (value: string) => string | null
  }
  formatValue?: (value: string) => string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  className?: string
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 250ms cubic-bezier(0, 0, 0.2, 1)',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#486581',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#486581',
      borderWidth: '2px',
    },
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#dc2626',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6c757d',
    '&.Mui-focused': {
      color: '#486581',
    },
    '&.Mui-error': {
      color: '#dc2626',
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: '6px',
    fontSize: '0.875rem',
    '&.Mui-error': {
      color: '#dc2626',
    },
  },
}))

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    placeholder,
    value,
    defaultValue,
    type = 'text',
    size = 'md',
    variant = 'outlined',
    required = false,
    disabled = false,
    error = false,
    helperText,
    leftIcon,
    rightIcon,
    prefix,
    suffix,
    multiline = false,
    rows,
    maxRows,
    autoFocus = false,
    fullWidth = true,
    loading = false,
    validation,
    formatValue,
    onChange,
    onBlur,
    onFocus,
    className,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue || '')
    const [validationError, setValidationError] = useState<string | null>(null)
    const [touched, setTouched] = useState(false)

    const currentValue = value !== undefined ? value : internalValue
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const getSizeProps = () => {
      switch (size) {
        case 'sm':
          return { size: 'small' as const }
        case 'lg':
          return { 
            size: 'medium' as const,
            InputProps: { 
              style: { 
                fontSize: '1.125rem',
                padding: '16px 14px',
              }
            }
          }
        default:
          return { size: 'medium' as const }
      }
    }

    const validateValue = (val: string): string | null => {
      if (!validation) return null

      if (validation.minLength && val.length < validation.minLength) {
        return `Minimum ${validation.minLength} characters required`
      }

      if (validation.maxLength && val.length > validation.maxLength) {
        return `Maximum ${validation.maxLength} characters allowed`
      }

      if (validation.pattern && !validation.pattern.test(val)) {
        return 'Invalid format'
      }

      if (validation.customValidator) {
        return validation.customValidator(val)
      }

      return null
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value

      if (formatValue) {
        newValue = formatValue(newValue)
      }

      if (value === undefined) {
        setInternalValue(newValue)
      }

      // Validate on change if touched
      if (touched && validation) {
        const errorMsg = validateValue(newValue)
        setValidationError(errorMsg)
      }

      if (onChange) {
        const modifiedEvent = {
          ...event,
          target: { ...event.target, value: newValue }
        }
        onChange(modifiedEvent)
      }
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      
      if (validation) {
        const errorMsg = validateValue(event.target.value)
        setValidationError(errorMsg)
      }

      if (onBlur) {
        onBlur(event)
      }
    }

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(event)
      }
    }

    const getStartAdornment = () => {
      const elements = []
      
      if (prefix) {
        elements.push(
          <Typography 
            key="prefix"
            variant="body1" 
            sx={{ color: '#6c757d', mr: 1 }}
          >
            {prefix}
          </Typography>
        )
      }
      
      if (leftIcon) {
        elements.push(
          <Box key="leftIcon" sx={{ color: '#6c757d', mr: 1 }}>
            {leftIcon}
          </Box>
        )
      }

      return elements.length > 0 ? <InputAdornment position="start">{elements}</InputAdornment> : undefined
    }

    const getEndAdornment = () => {
      const elements = []

      if (suffix) {
        elements.push(
          <Typography 
            key="suffix"
            variant="body1" 
            sx={{ color: '#6c757d', ml: 1 }}
          >
            {suffix}
          </Typography>
        )
      }

      if (rightIcon && !isPassword) {
        elements.push(
          <Box key="rightIcon" sx={{ color: '#6c757d', ml: 1 }}>
            {rightIcon}
          </Box>
        )
      }

      if (touched && validation && !validationError) {
        elements.push(
          <CheckCircle 
            key="success"
            sx={{ color: '#2f855a', ml: 1, fontSize: '20px' }} 
          />
        )
      }

      if ((error || validationError) && touched) {
        elements.push(
          <Error 
            key="error"
            sx={{ color: '#dc2626', ml: 1, fontSize: '20px' }} 
          />
        )
      }

      if (isPassword) {
        elements.push(
          <IconButton
            key="passwordToggle"
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            size="small"
            sx={{ ml: 1 }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )
      }

      return elements.length > 0 ? <InputAdornment position="end">{elements}</InputAdornment> : undefined
    }

    const displayError = Boolean(error || (touched && validationError))
    const displayHelperText = validationError || helperText

    return (
      <StyledTextField
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={currentValue}
        type={inputType}
        variant={variant}
        required={required}
        disabled={disabled || loading}
        error={displayError}
        helperText={displayHelperText}
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        className={className}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        InputProps={{
          startAdornment: getStartAdornment(),
          endAdornment: getEndAdornment(),
          ...getSizeProps().InputProps,
        }}
        {...getSizeProps()}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'