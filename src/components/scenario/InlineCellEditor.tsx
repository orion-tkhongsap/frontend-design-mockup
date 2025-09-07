'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Check,
  Close,
  Calculate,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'

interface CellValue {
  original: number
  current: number
  formula?: string
  isModified: boolean
  isCalculating: boolean
  dependentCells?: string[]
}

interface InlineCellEditorProps {
  cellId: string
  value: CellValue
  onValueChange: (cellId: string, newValue: number) => void
  onFormulaChange?: (cellId: string, formula: string) => void
  disabled?: boolean
  formatType?: 'currency' | 'percentage' | 'number'
  label?: string
}

export function InlineCellEditor({
  cellId,
  value,
  onValueChange,
  onFormulaChange,
  disabled = false,
  formatType = 'currency',
  label,
}: InlineCellEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const formatValue = (val: number) => {
    switch (formatType) {
      case 'currency':
        if (Math.abs(val) >= 1000000) {
          return `$${(val / 1000000).toFixed(1)}M`
        } else if (Math.abs(val) >= 1000) {
          return `$${(val / 1000).toFixed(0)}K`
        }
        return `$${val.toLocaleString()}`
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`
      case 'number':
        return val.toLocaleString()
      default:
        return val.toString()
    }
  }

  const parseValue = (str: string): number => {
    // Remove currency symbols and formatting
    const cleanStr = str.replace(/[$,%\s]/g, '')
    
    // Handle M/K suffixes
    if (cleanStr.includes('M')) {
      return parseFloat(cleanStr.replace('M', '')) * 1000000
    } else if (cleanStr.includes('K')) {
      return parseFloat(cleanStr.replace('K', '')) * 1000
    }
    
    return parseFloat(cleanStr) || 0
  }

  const handleStartEdit = () => {
    if (disabled) return
    setIsEditing(true)
    setEditValue(value.formula || formatValue(value.current))
  }

  const handleSave = async () => {
    const newValue = parseValue(editValue)
    
    setIsCalculating(true)
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    onValueChange(cellId, newValue)
    
    // If it's a formula, handle formula change
    if (editValue.startsWith('=') && onFormulaChange) {
      onFormulaChange(cellId, editValue)
    }
    
    setIsCalculating(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue('')
    setIsEditing(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave()
    } else if (event.key === 'Escape') {
      handleCancel()
    }
  }

  const getVarianceIndicator = () => {
    if (value.current === value.original) return null
    
    const variance = ((value.current - value.original) / Math.abs(value.original)) * 100
    const isPositive = variance > 0
    
    return (
      <Tooltip title={`${isPositive ? '+' : ''}${variance.toFixed(1)}% vs original`}>
        <Chip
          icon={isPositive ? <TrendingUp /> : <TrendingDown />}
          label={`${isPositive ? '+' : ''}${variance.toFixed(1)}%`}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
            color: isPositive ? '#166534' : '#991b1b',
            ml: 1,
          }}
        />
      </Tooltip>
    )
  }

  if (isEditing) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        minWidth: 200,
        p: 1,
        border: '2px solid #486581',
        borderRadius: '4px',
        backgroundColor: 'white',
      }}>
        <TextField
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="standard"
          size="small"
          fullWidth
          placeholder={value.formula ? 'Enter formula (=A1+B1)' : 'Enter value'}
          InputProps={{
            disableUnderline: true,
            startAdornment: editValue.startsWith('=') ? (
              <Calculate sx={{ fontSize: 16, color: '#486581', mr: 0.5 }} />
            ) : null,
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              py: 0.5,
            },
          }}
        />
        
        <IconButton
          size="small"
          onClick={handleSave}
          disabled={isCalculating}
          sx={{ color: '#22c55e' }}
        >
          {isCalculating ? (
            <CircularProgress size={16} />
          ) : (
            <Check sx={{ fontSize: 16 }} />
          )}
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleCancel}
          disabled={isCalculating}
          sx={{ color: '#ef4444' }}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box
      onClick={handleStartEdit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'default' : 'pointer',
        p: 1,
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        backgroundColor: value.isModified ? 'rgba(72, 101, 129, 0.04)' : 'transparent',
        '&:hover': disabled ? {} : {
          backgroundColor: 'rgba(72, 101, 129, 0.08)',
          transform: 'scale(1.02)',
        },
        border: value.isModified ? '1px solid rgba(72, 101, 129, 0.2)' : '1px solid transparent',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
        {label && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {label}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {value.formula && (
            <Tooltip title={`Formula: ${value.formula}`}>
              <Calculate sx={{ fontSize: 14, color: '#486581', mr: 0.5 }} />
            </Tooltip>
          )}
          
          <Typography
            variant="body2"
            sx={{
              fontWeight: value.isModified ? 600 : 400,
              color: value.isModified ? '#486581' : 'inherit',
              fontFamily: formatType === 'currency' ? 'monospace' : 'inherit',
            }}
          >
            {formatValue(value.current)}
          </Typography>
          
          {value.isCalculating && (
            <CircularProgress size={12} sx={{ ml: 1, color: '#486581' }} />
          )}
        </Box>
      </Box>

      {getVarianceIndicator()}
    </Box>
  )
}