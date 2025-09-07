'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Chip,
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
  Avatar,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  CompareArrows,
  History,
  Restore,
  GetApp,
  Visibility,
  Close,
  Check,
  Remove,
  Add,
  Edit,
  SwapHoriz,
  Timeline,
  Schedule,
} from '@mui/icons-material'

interface VersionData {
  id: string
  version: string
  timestamp: Date
  user: {
    name: string
    avatar: string
  }
  description: string
  changes: Change[]
  metadata: {
    fileSize: number
    recordCount: number
    formula: string
  }
}

interface Change {
  type: 'added' | 'removed' | 'modified'
  field: string
  oldValue?: any
  newValue?: any
  path: string
  description: string
}

const mockVersions: VersionData[] = [
  {
    id: 'v1.3',
    version: '1.3 (Current)',
    timestamp: new Date('2025-09-06T14:30:00'),
    user: { name: 'Sarah Johnson', avatar: 'SJ' },
    description: 'Updated Q3 forecast with revised market projections',
    changes: [
      {
        type: 'modified',
        field: 'Q3 Revenue',
        oldValue: 4800000,
        newValue: 5200000,
        path: 'revenue.q3',
        description: 'Increased Q3 revenue forecast by 8.3%',
      },
      {
        type: 'added',
        field: 'New Product Line',
        newValue: 850000,
        path: 'revenue.newProduct',
        description: 'Added revenue projection for new AI product line',
      },
      {
        type: 'modified',
        field: 'Marketing Budget',
        oldValue: 320000,
        newValue: 380000,
        path: 'expenses.marketing',
        description: 'Increased marketing spend to support product launch',
      },
    ],
    metadata: {
      fileSize: 1024,
      recordCount: 156,
      formula: 'SUM(Q1:Q3) * 1.15',
    },
  },
  {
    id: 'v1.2',
    version: '1.2',
    timestamp: new Date('2025-09-05T11:15:00'),
    user: { name: 'David Rodriguez', avatar: 'DR' },
    description: 'Allocation methodology update for cost centers',
    changes: [
      {
        type: 'modified',
        field: 'IT Allocation Rate',
        oldValue: 12.5,
        newValue: 15.0,
        path: 'allocation.it',
        description: 'Updated IT cost allocation percentage',
      },
      {
        type: 'removed',
        field: 'Legacy System Costs',
        oldValue: 45000,
        path: 'expenses.legacy',
        description: 'Removed deprecated legacy system costs',
      },
    ],
    metadata: {
      fileSize: 982,
      recordCount: 148,
      formula: 'SUM(Q1:Q3) * 1.12',
    },
  },
  {
    id: 'v1.1',
    version: '1.1',
    timestamp: new Date('2025-09-04T16:45:00'),
    user: { name: 'Priya Patel', avatar: 'PP' },
    description: 'Initial Q3 budget baseline with historical data',
    changes: [
      {
        type: 'added',
        field: 'Q3 Budget Framework',
        newValue: 'Initial setup',
        path: 'budget.framework',
        description: 'Established Q3 budget structure and categories',
      },
    ],
    metadata: {
      fileSize: 845,
      recordCount: 132,
      formula: 'SUM(Q1:Q3) * 1.10',
    },
  },
]

interface VersionComparisonProps {
  versions?: VersionData[]
  onRestore?: (versionId: string) => void
  onExport?: (comparison: any) => void
  className?: string
}

export function VersionComparison({
  versions = mockVersions,
  onRestore,
  onExport,
  className,
}: VersionComparisonProps) {
  const [selectedVersions, setSelectedVersions] = useState<[string, string]>(['v1.3', 'v1.2'])
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified' | 'changes-only'>('side-by-side')
  const [filterType, setFilterType] = useState<'all' | 'added' | 'modified' | 'removed'>('all')

  const [leftVersion, rightVersion] = selectedVersions
  const leftData = versions.find(v => v.id === leftVersion)
  const rightData = versions.find(v => v.id === rightVersion)

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString()
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Add sx={{ color: '#22c55e', fontSize: 16 }} />
      case 'removed': return <Remove sx={{ color: '#ef4444', fontSize: 16 }} />
      case 'modified': return <Edit sx={{ color: '#f59e0b', fontSize: 16 }} />
      default: return <Check sx={{ color: '#6b7280', fontSize: 16 }} />
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return '#dcfce7'
      case 'removed': return '#fee2e2'
      case 'modified': return '#fef3c7'
      default: return '#f8fafc'
    }
  }

  const getChangeBorderColor = (type: string) => {
    switch (type) {
      case 'added': return '#22c55e'
      case 'removed': return '#ef4444'
      case 'modified': return '#f59e0b'
      default: return '#e0e0e0'
    }
  }

  const getAllChanges = () => {
    const changes = [...(leftData?.changes || []), ...(rightData?.changes || [])]
    if (filterType === 'all') return changes
    return changes.filter(change => change.type === filterType)
  }

  const renderVersionHeader = (version: VersionData | undefined, side: 'left' | 'right') => {
    if (!version) return null

    return (
      <Card sx={{ mb: 2, border: side === 'left' ? '2px solid #3b82f6' : '2px solid #8b5cf6' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#486581' }}>
                {version.user.avatar}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Version {version.version}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(version.timestamp)}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={side === 'left' ? 'Base' : 'Compare'}
              size="small"
              sx={{
                backgroundColor: side === 'left' ? '#dbeafe' : '#ede9fe',
                color: side === 'left' ? '#1e40af' : '#7c3aed',
                fontWeight: 600,
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {version.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Records: {version.metadata.recordCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Size: {version.metadata.fileSize}KB
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Changes: {version.changes.length}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const renderSideBySide = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        {renderVersionHeader(leftData, 'left')}
        <Paper elevation={1} sx={{ p: 2, minHeight: 400 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Version {leftData?.version} Changes
          </Typography>
          {leftData?.changes.map((change, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 1,
                backgroundColor: getChangeColor(change.type),
                border: `1px solid ${getChangeBorderColor(change.type)}`,
                borderRadius: '8px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {getChangeIcon(change.type)}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {change.field}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {change.description}
              </Typography>
              {change.oldValue !== undefined && (
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Old: {typeof change.oldValue === 'number' ? formatCurrency(change.oldValue) : change.oldValue}
                </Typography>
              )}
              {change.newValue !== undefined && (
                <Typography variant="caption" sx={{ display: 'block' }}>
                  New: {typeof change.newValue === 'number' ? formatCurrency(change.newValue) : change.newValue}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        {renderVersionHeader(rightData, 'right')}
        <Paper elevation={1} sx={{ p: 2, minHeight: 400 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Version {rightData?.version} Changes
          </Typography>
          {rightData?.changes.map((change, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 1,
                backgroundColor: getChangeColor(change.type),
                border: `1px solid ${getChangeBorderColor(change.type)}`,
                borderRadius: '8px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {getChangeIcon(change.type)}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {change.field}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {change.description}
              </Typography>
              {change.oldValue !== undefined && (
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Old: {typeof change.oldValue === 'number' ? formatCurrency(change.oldValue) : change.oldValue}
                </Typography>
              )}
              {change.newValue !== undefined && (
                <Typography variant="caption" sx={{ display: 'block' }}>
                  New: {typeof change.newValue === 'number' ? formatCurrency(change.newValue) : change.newValue}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  )

  const renderUnified = () => (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Unified Change History
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600 }}>Change Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Old Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>New Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getAllChanges().map((change, index) => {
              const version = versions.find(v => v.changes.includes(change))
              return (
                <TableRow key={index} sx={{ backgroundColor: getChangeColor(change.type) }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getChangeIcon(change.type)}
                      <Chip
                        label={change.type.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${getChangeBorderColor(change.type)}`,
                          color: getChangeBorderColor(change.type),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{change.field}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    {change.oldValue !== undefined 
                      ? (typeof change.oldValue === 'number' ? formatCurrency(change.oldValue) : change.oldValue)
                      : '—'
                    }
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    {change.newValue !== undefined 
                      ? (typeof change.newValue === 'number' ? formatCurrency(change.newValue) : change.newValue)
                      : '—'
                    }
                  </TableCell>
                  <TableCell>{version?.version}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                        {version?.user.avatar}
                      </Avatar>
                      {version?.user.name}
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Version Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compare different versions and track changes over time
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => onExport?.(getAllChanges())}
              sx={{ textTransform: 'none' }}
            >
              Export Diff
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Restore />}
              onClick={() => onRestore?.(rightVersion)}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Restore Version
            </Button>
          </Box>
        </Box>

        {/* Version Selection */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Base Version</InputLabel>
              <Select
                value={leftVersion}
                label="Base Version"
                onChange={(e) => setSelectedVersions([e.target.value, rightVersion])}
              >
                {versions.map((version) => (
                  <MenuItem key={version.id} value={version.id}>
                    Version {version.version} - {formatTimestamp(version.timestamp)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              onClick={() => setSelectedVersions([rightVersion, leftVersion])}
              sx={{ color: '#486581' }}
            >
              <SwapHoriz />
            </IconButton>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Compare Version</InputLabel>
              <Select
                value={rightVersion}
                label="Compare Version"
                onChange={(e) => setSelectedVersions([leftVersion, e.target.value])}
              >
                {versions.map((version) => (
                  <MenuItem key={version.id} value={version.id}>
                    Version {version.version} - {formatTimestamp(version.timestamp)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Changes</InputLabel>
              <Select
                value={filterType}
                label="Filter Changes"
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <MenuItem value="all">All Changes</MenuItem>
                <MenuItem value="added">Added Only</MenuItem>
                <MenuItem value="modified">Modified Only</MenuItem>
                <MenuItem value="removed">Removed Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* View Mode Toggle */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'side-by-side' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('side-by-side')}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Side by Side
          </Button>
          <Button
            variant={viewMode === 'unified' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('unified')}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Unified View
          </Button>
          <Button
            variant={viewMode === 'changes-only' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('changes-only')}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Changes Only
          </Button>
        </Box>
      </Paper>

      {/* Change Summary */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Comparing {getAllChanges().length} changes between versions {leftData?.version} and {rightData?.version}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip label={`${getAllChanges().filter(c => c.type === 'added').length} Added`} size="small" sx={{ backgroundColor: '#dcfce7', color: '#16a34a' }} />
            <Chip label={`${getAllChanges().filter(c => c.type === 'modified').length} Modified`} size="small" sx={{ backgroundColor: '#fef3c7', color: '#d97706' }} />
            <Chip label={`${getAllChanges().filter(c => c.type === 'removed').length} Removed`} size="small" sx={{ backgroundColor: '#fee2e2', color: '#dc2626' }} />
          </Box>
        </Box>
      </Alert>

      {/* Comparison Content */}
      {viewMode === 'side-by-side' && renderSideBySide()}
      {(viewMode === 'unified' || viewMode === 'changes-only') && renderUnified()}
    </Box>
  )
}

// Demo component
export function VersionComparisonDemo() {
  const handleRestore = (versionId: string) => {
    alert(`Restore to version ${versionId}`)
  }

  const handleExport = (changes: any[]) => {
    console.log('Exporting changes:', changes)
    alert('Version comparison exported!')
  }

  return (
    <Box sx={{ p: 3 }}>
      <VersionComparison
        onRestore={handleRestore}
        onExport={handleExport}
      />
    </Box>
  )
}