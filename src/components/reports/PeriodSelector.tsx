'use client'

import React, { useState } from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Chip,
  DatePicker,
  LocalizationProvider,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  CalendarToday,
  Compare,
  Refresh,
} from '@mui/icons-material'

interface PeriodOption {
  id: string
  label: string
  value: string
  type: 'quarter' | 'month' | 'year' | 'custom'
}

interface ComparisonOption {
  id: string
  label: string
  description: string
}

const periodOptions: PeriodOption[] = [
  { id: 'q3-2025', label: 'Q3 2025', value: '2025-Q3', type: 'quarter' },
  { id: 'q2-2025', label: 'Q2 2025', value: '2025-Q2', type: 'quarter' },
  { id: 'q1-2025', label: 'Q1 2025', value: '2025-Q1', type: 'quarter' },
  { id: 'q4-2024', label: 'Q4 2024', value: '2024-Q4', type: 'quarter' },
  { id: 'sep-2025', label: 'Sep 2025', value: '2025-09', type: 'month' },
  { id: 'aug-2025', label: 'Aug 2025', value: '2025-08', type: 'month' },
  { id: 'jul-2025', label: 'Jul 2025', value: '2025-07', type: 'month' },
  { id: '2025', label: '2025 YTD', value: '2025', type: 'year' },
  { id: '2024', label: '2024', value: '2024', type: 'year' },
]

const comparisonOptions: ComparisonOption[] = [
  { id: 'mom', label: 'MoM', description: 'Month over Month' },
  { id: 'qoq', label: 'QoQ', description: 'Quarter over Quarter' },
  { id: 'yoy', label: 'YoY', description: 'Year over Year' },
  { id: 'budget', label: 'vs Budget', description: 'Actual vs Budget' },
  { id: 'forecast', label: 'vs Forecast', description: 'Actual vs Forecast' },
  { id: 'custom', label: 'Custom', description: 'Custom Period' },
]

interface PeriodSelectorProps {
  currentPeriod?: string
  comparisonPeriod?: string
  comparisonType?: string
  onPeriodChange?: (period: string, comparison: string, type: string) => void
  className?: string
}

export function PeriodSelector({ 
  currentPeriod = 'q3-2025',
  comparisonPeriod = 'q2-2025',
  comparisonType = 'qoq',
  onPeriodChange,
  className 
}: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod)
  const [selectedComparison, setSelectedComparison] = useState(comparisonType)
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null)
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null)
  const [isCustomMode, setIsCustomMode] = useState(false)

  const getCurrentPeriodLabel = () => {
    const period = periodOptions.find(p => p.id === selectedPeriod)
    return period?.label || selectedPeriod
  }

  const getComparisonPeriodLabel = () => {
    const current = periodOptions.find(p => p.id === selectedPeriod)
    if (!current) return comparisonPeriod

    switch (selectedComparison) {
      case 'mom':
        // Get previous month
        const monthMatch = current.value.match(/(\d{4})-(\d{2})/)
        if (monthMatch) {
          const year = parseInt(monthMatch[1])
          const month = parseInt(monthMatch[2])
          const prevMonth = month === 1 ? 12 : month - 1
          const prevYear = month === 1 ? year - 1 : year
          return `${new Date(prevYear, prevMonth - 1).toLocaleDateString('en-US', { month: 'short' })} ${prevYear}`
        }
        break
      
      case 'qoq':
        // Get previous quarter
        const qMatch = current.value.match(/(\d{4})-Q(\d)/)
        if (qMatch) {
          const year = parseInt(qMatch[1])
          const quarter = parseInt(qMatch[2])
          const prevQuarter = quarter === 1 ? 4 : quarter - 1
          const prevYear = quarter === 1 ? year - 1 : year
          return `Q${prevQuarter} ${prevYear}`
        }
        break
      
      case 'yoy':
        // Get same period previous year
        if (current.type === 'quarter') {
          const qMatch = current.value.match(/(\d{4})-Q(\d)/)
          if (qMatch) {
            const year = parseInt(qMatch[1]) - 1
            const quarter = qMatch[2]
            return `Q${quarter} ${year}`
          }
        } else if (current.type === 'month') {
          const mMatch = current.value.match(/(\d{4})-(\d{2})/)
          if (mMatch) {
            const year = parseInt(mMatch[1]) - 1
            const month = parseInt(mMatch[2])
            return `${new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short' })} ${year}`
          }
        }
        break
      
      case 'budget':
        return `${getCurrentPeriodLabel()} Budget`
      
      case 'forecast':
        return `${getCurrentPeriodLabel()} Forecast`
      
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${customStartDate.toLocaleDateString()} - ${customEndDate.toLocaleDateString()}`
        }
        return 'Custom Period'
    }

    return comparisonPeriod
  }

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod)
    if (onPeriodChange) {
      onPeriodChange(newPeriod, getComparisonPeriodLabel(), selectedComparison)
    }
  }

  const handleComparisonChange = (newComparison: string) => {
    setSelectedComparison(newComparison)
    setIsCustomMode(newComparison === 'custom')
    if (onPeriodChange) {
      onPeriodChange(selectedPeriod, getComparisonPeriodLabel(), newComparison)
    }
  }

  const handleRefresh = () => {
    // Simulate data refresh
    console.log('Refreshing data for period:', selectedPeriod, 'vs', getComparisonPeriodLabel())
  }

  return (
    <Paper 
      elevation={1} 
      className={className}
      sx={{ 
        p: 3, 
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday sx={{ fontSize: 20 }} />
          Period Selection
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          sx={{ textTransform: 'none' }}
        >
          Refresh
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Current Period Selection */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Current Period</InputLabel>
          <Select
            value={selectedPeriod}
            label="Current Period"
            onChange={(e) => handlePeriodChange(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          >
            <MenuItem disabled>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#6b7280' }}>
                QUARTERS
              </Typography>
            </MenuItem>
            {periodOptions.filter(p => p.type === 'quarter').map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
            
            <MenuItem disabled>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#6b7280' }}>
                MONTHS
              </Typography>
            </MenuItem>
            {periodOptions.filter(p => p.type === 'month').map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
            
            <MenuItem disabled>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#6b7280' }}>
                YEARS
              </Typography>
            </MenuItem>
            {periodOptions.filter(p => p.type === 'year').map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Comparison Type Selection */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#374151' }}>
            Comparison Type
          </Typography>
          <ButtonGroup variant="outlined" sx={{ backgroundColor: 'white' }}>
            {comparisonOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedComparison === option.id ? 'contained' : 'outlined'}
                onClick={() => handleComparisonChange(option.id)}
                sx={{
                  textTransform: 'none',
                  minWidth: 80,
                  backgroundColor: selectedComparison === option.id ? '#486581' : 'white',
                  '&:hover': {
                    backgroundColor: selectedComparison === option.id ? '#334e68' : 'rgba(72, 101, 129, 0.04)',
                  },
                }}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* Custom Date Range (if custom is selected) */}
        {isCustomMode && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <DatePicker
                label="Start Date"
                value={customStartDate}
                onChange={(newValue) => setCustomStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { backgroundColor: 'white' }
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary">to</Typography>
              <DatePicker
                label="End Date"
                value={customEndDate}
                onChange={(newValue) => setCustomEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { backgroundColor: 'white' }
                  }
                }}
              />
            </Box>
          </LocalizationProvider>
        )}
      </Box>

      {/* Selected Period Summary */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mt: 3, 
        p: 2, 
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}>
        <Compare sx={{ color: '#486581' }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Comparing
        </Typography>
        <Chip
          label={getCurrentPeriodLabel()}
          sx={{
            backgroundColor: '#486581',
            color: 'white',
            fontWeight: 600,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          vs
        </Typography>
        <Chip
          label={getComparisonPeriodLabel()}
          variant="outlined"
          sx={{
            borderColor: '#486581',
            color: '#486581',
            fontWeight: 600,
          }}
        />
        
        {selectedComparison !== 'custom' && (
          <Chip
            label={comparisonOptions.find(c => c.id === selectedComparison)?.description}
            size="small"
            sx={{
              backgroundColor: '#f0f4f8',
              color: '#374151',
            }}
          />
        )}
      </Box>
    </Paper>
  )
}