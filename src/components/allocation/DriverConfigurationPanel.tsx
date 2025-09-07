'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Refresh,
  Upload,
  Download,
  TrendingUp,
  TrendingDown,
  Remove,
  Warning,
  CheckCircle,
} from '@mui/icons-material'

interface Driver {
  id: string
  name: string
  description: string
  type: 'percentage' | 'absolute' | 'ratio' | 'formula'
  source: 'manual' | 'system' | 'imported'
  unit: string
  values: { [entityId: string]: number }
  total: number
  lastUpdated: Date
  active: boolean
  formula?: string
  validationRule?: string
}

interface Entity {
  id: string
  name: string
  department: string
  type: 'cost-center' | 'department' | 'product-line'
}

const mockEntities: Entity[] = [
  { id: '1', name: 'Sales Team', department: 'Sales', type: 'department' },
  { id: '2', name: 'Marketing', department: 'Marketing', type: 'department' },
  { id: '3', name: 'R&D', department: 'Engineering', type: 'department' },
  { id: '4', name: 'Finance', department: 'Finance', type: 'department' },
  { id: '5', name: 'Product A', department: 'Products', type: 'product-line' },
  { id: '6', name: 'Product B', department: 'Products', type: 'product-line' },
]

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Employee Count',
    description: 'Number of full-time employees by department',
    type: 'absolute',
    source: 'system',
    unit: 'employees',
    values: { '1': 45, '2': 30, '3': 60, '4': 15 },
    total: 150,
    lastUpdated: new Date('2025-09-06T10:00:00'),
    active: true,
  },
  {
    id: '2',
    name: 'Revenue Share',
    description: 'Revenue contribution percentage by product line',
    type: 'percentage',
    source: 'imported',
    unit: '%',
    values: { '5': 65, '6': 35 },
    total: 100,
    lastUpdated: new Date('2025-09-05T14:30:00'),
    active: true,
  },
  {
    id: '3',
    name: 'Floor Space',
    description: 'Office space occupied in square feet',
    type: 'absolute',
    source: 'manual',
    unit: 'sq ft',
    values: { '1': 2500, '2': 1800, '3': 3200, '4': 800 },
    total: 8300,
    lastUpdated: new Date('2025-09-01T09:15:00'),
    active: true,
  },
  {
    id: '4',
    name: 'IT Usage Score',
    description: 'Calculated IT resource utilization score',
    type: 'formula',
    source: 'system',
    unit: 'score',
    values: { '1': 85, '2': 70, '3': 95, '4': 45 },
    total: 295,
    lastUpdated: new Date('2025-09-06T12:00:00'),
    active: true,
    formula: '(licenses_used * 0.4) + (support_tickets * 0.3) + (storage_gb * 0.3)',
  },
]

interface DriverConfigurationPanelProps {
  onDriverUpdate?: (driver: Driver) => void
  onDriverCreate?: (driver: Driver) => void
  onDriverDelete?: (driverId: string) => void
  className?: string
}

export function DriverConfigurationPanel({
  onDriverUpdate,
  onDriverCreate,
  onDriverDelete,
  className
}: DriverConfigurationPanelProps) {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [entities] = useState<Entity[]>(mockEntities)
  const [selectedDriver, setSelectedDriver] = useState<string>('')
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState<string>('')

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId)
    const driver = drivers.find(d => d.id === driverId)
    if (driver) {
      setEditingDriver({ ...driver })
    }
  }

  const handleValueChange = (entityId: string, value: number) => {
    if (!editingDriver) return

    const newValues = { ...editingDriver.values, [entityId]: value }
    const newTotal = Object.values(newValues).reduce((sum, val) => sum + val, 0)

    setEditingDriver({
      ...editingDriver,
      values: newValues,
      total: newTotal,
      lastUpdated: new Date(),
    })
  }

  const handleSaveDriver = () => {
    if (!editingDriver) return

    setDrivers(prev => prev.map(d => d.id === editingDriver.id ? editingDriver : d))
    onDriverUpdate?.(editingDriver)
    setSelectedDriver('')
    setEditingDriver(null)
  }

  const handleRefreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      // Simulate data refresh
      setDrivers(prev => prev.map(driver => ({
        ...driver,
        lastUpdated: new Date(),
      })))
      setIsRefreshing(false)
    }, 2000)
  }

  const handleToggleDriver = (driverId: string) => {
    setDrivers(prev => prev.map(d => 
      d.id === driverId ? { ...d, active: !d.active } : d
    ))
  }

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case '%':
        return `${value.toFixed(1)}%`
      case 'employees':
        return `${value} emp`
      case 'sq ft':
        return `${value.toLocaleString()} sq ft`
      case 'score':
        return `${value} pts`
      default:
        return value.toLocaleString()
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'system': return '#22c55e'
      case 'imported': return '#3b82f6'
      case 'manual': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getVarianceColor = (current: number, expected: number) => {
    const variance = ((current - expected) / expected) * 100
    if (Math.abs(variance) < 5) return '#6b7280'
    return variance > 0 ? '#22c55e' : '#ef4444'
  }

  const getVarianceIcon = (current: number, expected: number) => {
    const variance = ((current - expected) / expected) * 100
    if (Math.abs(variance) < 5) return <Remove sx={{ fontSize: 16 }} />
    return variance > 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Driver Configuration Panel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure and manage allocation drivers and their values across entities
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              sx={{ textTransform: 'none' }}
            >
              Import Data
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefreshData}
              disabled={isRefreshing}
              sx={{ textTransform: 'none' }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': {
                  backgroundColor: '#334e68',
                },
              }}
            >
              New Driver
            </Button>
          </Box>
        </Box>

        {isRefreshing && <LinearProgress sx={{ borderRadius: 1 }} />}
      </Paper>

      <Grid container spacing={3}>
        {/* Driver Selection Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ borderRadius: '12px', height: 'fit-content' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Available Drivers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {drivers.filter(d => d.active).length} active • {drivers.length} total
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {drivers.map((driver) => (
                <Card
                  key={driver.id}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: selectedDriver === driver.id ? '2px solid #486581' : '1px solid #e0e0e0',
                    opacity: driver.active ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(72, 101, 129, 0.15)',
                    },
                  }}
                  onClick={() => handleDriverSelect(driver.id)}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                        {driver.name}
                      </Typography>
                      <Switch
                        checked={driver.active}
                        onChange={() => handleToggleDriver(driver.id)}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {driver.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={driver.type.toUpperCase()}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 18,
                          backgroundColor: '#f0f4f8',
                          color: '#374151',
                        }}
                      />
                      <Chip
                        label={driver.source.toUpperCase()}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 18,
                          backgroundColor: `${getSourceColor(driver.source)}20`,
                          color: getSourceColor(driver.source),
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Total: {formatValue(driver.total, driver.unit)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {driver.lastUpdated.toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Driver Configuration Details */}
        <Grid item xs={12} md={8}>
          {editingDriver ? (
            <Paper elevation={2} sx={{ borderRadius: '12px' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {editingDriver.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {editingDriver.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedDriver('')
                        setEditingDriver(null)
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveDriver}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: '#486581',
                        '&:hover': {
                          backgroundColor: '#334e68',
                        },
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>

                {editingDriver.formula && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Formula:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: '#f8fafc', p: 1, borderRadius: '4px' }}>
                      {editingDriver.formula}
                    </Typography>
                  </Alert>
                )}
              </Box>

              {/* Driver Values Table */}
              <Box sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Entity Values
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Current Value</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Percentage</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {entities
                        .filter(entity => editingDriver.values[entity.id] !== undefined)
                        .map((entity) => {
                          const currentValue = editingDriver.values[entity.id] || 0
                          const percentage = editingDriver.total > 0 ? (currentValue / editingDriver.total) * 100 : 0
                          const expectedValue = editingDriver.total / Object.keys(editingDriver.values).length // Simple average for demo

                          return (
                            <TableRow key={entity.id}>
                              <TableCell>{entity.name}</TableCell>
                              <TableCell>{entity.department}</TableCell>
                              <TableCell>
                                <Chip
                                  label={entity.type.replace('-', ' ')}
                                  size="small"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: 18,
                                    backgroundColor: '#f0f4f8',
                                    color: '#374151',
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {editingDriver.source === 'manual' ? (
                                  <TextField
                                    type="number"
                                    value={currentValue}
                                    onChange={(e) => handleValueChange(entity.id, parseFloat(e.target.value) || 0)}
                                    size="small"
                                    sx={{ width: 100 }}
                                    InputProps={{
                                      endAdornment: editingDriver.unit,
                                    }}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                    {formatValue(currentValue, editingDriver.unit)}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {percentage.toFixed(1)}%
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                  <Box sx={{ color: getVarianceColor(currentValue, expectedValue) }}>
                                    {getVarianceIcon(currentValue, expectedValue)}
                                  </Box>
                                  {Math.abs(((currentValue - expectedValue) / expectedValue) * 100) > 20 && (
                                    <Tooltip title="Significant variance from expected value">
                                      <Warning sx={{ fontSize: 16, color: '#f59e0b' }} />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Summary Statistics */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Summary Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatValue(editingDriver.total, editingDriver.unit)}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Entities</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {Object.keys(editingDriver.values).length}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Average</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatValue(editingDriver.total / Object.keys(editingDriver.values).length, editingDriver.unit)}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {editingDriver.lastUpdated.toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                borderRadius: '12px',
                border: '2px dashed #e0e0e0',
              }}
            >
              <Box sx={{ textAlign: 'center', color: '#6b7280' }}>
                <TrendingUp sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No Driver Selected
                </Typography>
                <Typography variant="body2">
                  Select a driver from the left panel to configure its values
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}