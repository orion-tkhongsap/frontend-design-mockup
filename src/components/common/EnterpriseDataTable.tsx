'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Chip,
  Typography,
  Skeleton,
  LinearProgress,
  FormControl,
  Select,
  InputLabel,
  Badge,
} from '@mui/material'
import {
  Search,
  FilterList,
  GetApp,
  MoreVert,
  Visibility,
  VisibilityOff,
  TrendingUp,
  TrendingDown,
  Remove,
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  PushPin,
} from '@mui/icons-material'
import { FixedSizeList as List } from 'react-window'

interface ColumnConfig {
  id: string
  label: string
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'status' | 'trend'
  width?: number
  minWidth?: number
  sortable?: boolean
  filterable?: boolean
  frozen?: boolean
  align?: 'left' | 'center' | 'right'
  format?: (value: any) => string
  render?: (value: any, row: any) => React.ReactNode
}

interface FilterState {
  column: string
  operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between'
  value: any
  value2?: any // For 'between' operator
}

interface SortState {
  column: string
  direction: 'asc' | 'desc'
}

interface DataTableProps {
  data: any[]
  columns: ColumnConfig[]
  loading?: boolean
  selectable?: boolean
  virtualScrolling?: boolean
  stickyHeader?: boolean
  frozenColumns?: number
  pageSize?: number
  onSelectionChange?: (selectedRows: any[]) => void
  onRowClick?: (row: any) => void
  onExport?: () => void
  className?: string
}

// Sample financial data
const mockFinancialData = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  account: `Account ${1000 + index}`,
  description: `Description for account ${1000 + index}`,
  currentPeriod: Math.floor(Math.random() * 1000000) - 500000,
  priorPeriod: Math.floor(Math.random() * 900000) - 450000,
  budget: Math.floor(Math.random() * 800000) - 400000,
  variance: Math.floor(Math.random() * 200000) - 100000,
  variancePercent: (Math.random() - 0.5) * 50,
  category: ['Revenue', 'Expense', 'Asset', 'Liability'][Math.floor(Math.random() * 4)],
  status: ['Active', 'Inactive', 'Pending', 'Closed'][Math.floor(Math.random() * 4)],
  lastUpdated: new Date(2025, 8, Math.floor(Math.random() * 30) + 1),
  trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
}))

const defaultColumns: ColumnConfig[] = [
  {
    id: 'account',
    label: 'Account',
    type: 'text',
    width: 120,
    sortable: true,
    filterable: true,
    frozen: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: 'text',
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    id: 'currentPeriod',
    label: 'Current Period',
    type: 'currency',
    width: 140,
    sortable: true,
    align: 'right',
    format: (value) => formatCurrency(value),
    render: (value) => (
      <Box sx={{ fontFamily: 'monospace', color: value < 0 ? '#ef4444' : '#22c55e' }}>
        {formatCurrency(value)}
      </Box>
    ),
  },
  {
    id: 'priorPeriod',
    label: 'Prior Period',
    type: 'currency',
    width: 140,
    sortable: true,
    align: 'right',
    format: (value) => formatCurrency(value),
    render: (value) => (
      <Box sx={{ fontFamily: 'monospace', color: value < 0 ? '#ef4444' : '#22c55e' }}>
        {formatCurrency(value)}
      </Box>
    ),
  },
  {
    id: 'budget',
    label: 'Budget',
    type: 'currency',
    width: 140,
    sortable: true,
    align: 'right',
    format: (value) => formatCurrency(value),
    render: (value) => (
      <Box sx={{ fontFamily: 'monospace' }}>
        {formatCurrency(value)}
      </Box>
    ),
  },
  {
    id: 'variance',
    label: 'Variance',
    type: 'currency',
    width: 140,
    sortable: true,
    align: 'right',
    render: (value, row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ fontFamily: 'monospace', color: value < 0 ? '#ef4444' : '#22c55e' }}>
          {formatCurrency(value)}
        </Box>
        {row.trend === 'up' && <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />}
        {row.trend === 'down' && <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />}
        {row.trend === 'stable' && <Remove sx={{ color: '#6b7280', fontSize: 16 }} />}
      </Box>
    ),
  },
  {
    id: 'variancePercent',
    label: 'Variance %',
    type: 'percentage',
    width: 100,
    sortable: true,
    align: 'right',
    render: (value) => (
      <Box sx={{ 
        fontFamily: 'monospace', 
        color: value < 0 ? '#ef4444' : '#22c55e',
        fontWeight: Math.abs(value) > 10 ? 600 : 400,
      }}>
        {value >= 0 ? '+' : ''}{value.toFixed(1)}%
      </Box>
    ),
  },
  {
    id: 'category',
    label: 'Category',
    type: 'text',
    width: 100,
    sortable: true,
    filterable: true,
    render: (value) => (
      <Chip
        label={value}
        size="small"
        sx={{
          backgroundColor: getCategoryColor(value),
          color: 'white',
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    ),
  },
  {
    id: 'status',
    label: 'Status',
    type: 'status',
    width: 100,
    sortable: true,
    filterable: true,
    render: (value) => (
      <Chip
        label={value}
        size="small"
        variant="outlined"
        sx={{
          borderColor: getStatusColor(value),
          color: getStatusColor(value),
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    ),
  },
  {
    id: 'lastUpdated',
    label: 'Last Updated',
    type: 'date',
    width: 120,
    sortable: true,
    format: (value) => value.toLocaleDateString(),
  },
]

function formatCurrency(value: number) {
  const absValue = Math.abs(value)
  if (absValue >= 1000000) {
    return `${value < 0 ? '-' : ''}$${(absValue / 1000000).toFixed(1)}M`
  } else if (absValue >= 1000) {
    return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(0)}K`
  }
  return `${value < 0 ? '-' : ''}$${absValue.toLocaleString()}`
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'Revenue': return '#22c55e'
    case 'Expense': return '#ef4444'
    case 'Asset': return '#3b82f6'
    case 'Liability': return '#f59e0b'
    default: return '#6b7280'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Active': return '#22c55e'
    case 'Inactive': return '#6b7280'
    case 'Pending': return '#f59e0b'
    case 'Closed': return '#ef4444'
    default: return '#6b7280'
  }
}

export function EnterpriseDataTable({
  data = mockFinancialData,
  columns = defaultColumns,
  loading = false,
  selectable = true,
  virtualScrolling = true,
  stickyHeader = true,
  frozenColumns = 1,
  pageSize = 50,
  onSelectionChange,
  onRowClick,
  onExport,
  className,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState[]>([])
  const [sort, setSort] = useState<SortState>({ column: 'account', direction: 'asc' })
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.id))
  )
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedRowData, setSelectedRowData] = useState<any>(null)

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchTerm) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply filters
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.column]
        switch (filter.operator) {
          case 'equals':
            return value === filter.value
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())
          case 'greaterThan':
            return Number(value) > Number(filter.value)
          case 'lessThan':
            return Number(value) < Number(filter.value)
          case 'between':
            return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2)
          default:
            return true
        }
      })
    })

    // Apply sort
    if (sort.column) {
      result.sort((a, b) => {
        const aVal = a[sort.column]
        const bVal = b[sort.column]
        
        let comparison = 0
        if (aVal < bVal) comparison = -1
        else if (aVal > bVal) comparison = 1
        
        return sort.direction === 'desc' ? -comparison : comparison
      })
    }

    return result
  }, [data, searchTerm, filters, sort])

  const handleSort = (column: string) => {
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(new Set(processedData.map((_, index) => index)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
    
    const selectedData = Array.from(newSelected).map(i => processedData[i])
    onSelectionChange?.(selectedData)
  }

  const handleColumnVisibility = (columnId: string) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(columnId)) {
      newVisible.delete(columnId)
    } else {
      newVisible.add(columnId)
    }
    setVisibleColumns(newVisible)
  }

  const visibleColumnConfigs = columns.filter(col => visibleColumns.has(col.id))

  // Row renderer for virtual scrolling
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = processedData[index]
    const isSelected = selectedRows.has(index)

    return (
      <div style={style}>
        <TableRow
          hover
          selected={isSelected}
          onClick={() => onRowClick?.(row)}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(72, 101, 129, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(72, 101, 129, 0.08)',
            },
          }}
        >
          {selectable && (
            <TableCell padding="checkbox" sx={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
              <Checkbox
                checked={isSelected}
                onChange={() => handleSelectRow(index)}
                color="primary"
              />
            </TableCell>
          )}
          
          {visibleColumnConfigs.map((column, colIndex) => {
            const value = row[column.id]
            const isFreezed = colIndex < frozenColumns
            
            return (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  minWidth: column.minWidth || column.width,
                  width: column.width,
                  fontFamily: column.type === 'currency' ? 'monospace' : 'inherit',
                  ...(isFreezed && {
                    position: 'sticky',
                    left: selectable ? 58 + (colIndex * (column.width || 100)) : colIndex * (column.width || 100),
                    backgroundColor: 'white',
                    zIndex: 1,
                    borderRight: '1px solid #e0e0e0',
                  }),
                }}
              >
                {column.render ? column.render(value, row) : column.format ? column.format(value) : value}
              </TableCell>
            )
          })}
          
          <TableCell sx={{ width: 60 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setRowMenuAnchor(e.currentTarget)
                setSelectedRowData(row)
              }}
            >
              <MoreVert sx={{ fontSize: 16 }} />
            </IconButton>
          </TableCell>
        </TableRow>
      </div>
    )
  }

  return (
    <Box className={className}>
      {/* Toolbar */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <TextField
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#6b7280' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            
            <Button
              startIcon={<FilterList />}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Filters {filters.length > 0 && `(${filters.length})`}
            </Button>
            
            <Button
              startIcon={<Visibility />}
              variant="outlined"
              size="small"
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
              sx={{ textTransform: 'none' }}
            >
              Columns
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {processedData.length.toLocaleString()} rows
              {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
            </Typography>
            
            <Button
              startIcon={<GetApp />}
              variant="contained"
              size="small"
              onClick={onExport}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Data Table */}
      <Paper elevation={2} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        
        <TableContainer sx={{ maxHeight: virtualScrolling ? 600 : undefined }}>
          <Table stickyHeader={stickyHeader} size="small">
            {/* Table Header */}
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell 
                    padding="checkbox" 
                    sx={{ 
                      position: 'sticky', 
                      left: 0, 
                      backgroundColor: '#f8fafc', 
                      zIndex: 3,
                      borderBottom: '2px solid #e0e0e0',
                    }}
                  >
                    <Checkbox
                      indeterminate={selectedRows.size > 0 && selectedRows.size < processedData.length}
                      checked={processedData.length > 0 && selectedRows.size === processedData.length}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                )}
                
                {visibleColumnConfigs.map((column, index) => {
                  const isFreezed = index < frozenColumns
                  
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        fontWeight: 700,
                        backgroundColor: '#f8fafc',
                        borderBottom: '2px solid #e0e0e0',
                        minWidth: column.minWidth || column.width,
                        width: column.width,
                        ...(isFreezed && {
                          position: 'sticky',
                          left: selectable ? 58 + (index * (column.width || 100)) : index * (column.width || 100),
                          zIndex: 2,
                          borderRight: '1px solid #e0e0e0',
                        }),
                      }}
                    >
                      {column.sortable ? (
                        <TableSortLabel
                          active={sort.column === column.id}
                          direction={sort.column === column.id ? sort.direction : 'asc'}
                          onClick={() => handleSort(column.id)}
                          sx={{ fontWeight: 700 }}
                        >
                          {column.label}
                          {column.frozen && (
                            <PushPin sx={{ ml: 0.5, fontSize: 14, color: '#486581' }} />
                          )}
                        </TableSortLabel>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {column.label}
                          {column.frozen && (
                            <PushPin sx={{ ml: 0.5, fontSize: 14, color: '#486581' }} />
                          )}
                        </Box>
                      )}
                    </TableCell>
                  )
                })}
                
                <TableCell sx={{ width: 60, backgroundColor: '#f8fafc', borderBottom: '2px solid #e0e0e0' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    {selectable && <TableCell><Skeleton width={20} height={20} /></TableCell>}
                    {visibleColumnConfigs.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton width="80%" height={20} />
                      </TableCell>
                    ))}
                    <TableCell><Skeleton width={20} height={20} /></TableCell>
                  </TableRow>
                ))
              ) : virtualScrolling && processedData.length > 100 ? (
                // Virtual scrolling for large datasets
                <TableRow>
                  <TableCell colSpan={visibleColumnConfigs.length + (selectable ? 2 : 1)} sx={{ p: 0 }}>
                    <List
                      height={400}
                      itemCount={processedData.length}
                      itemSize={48}
                      itemData={processedData}
                    >
                      {Row}
                    </List>
                  </TableCell>
                </TableRow>
              ) : (
                // Standard rendering for smaller datasets
                processedData.slice(0, pageSize).map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover
                    selected={selectedRows.has(index)}
                    onClick={() => onRowClick?.(row)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(72, 101, 129, 0.04)',
                      },
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox" sx={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
                        <Checkbox
                          checked={selectedRows.has(index)}
                          onChange={() => handleSelectRow(index)}
                          color="primary"
                        />
                      </TableCell>
                    )}
                    
                    {visibleColumnConfigs.map((column, colIndex) => {
                      const value = row[column.id]
                      const isFreezed = colIndex < frozenColumns
                      
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{
                            minWidth: column.minWidth || column.width,
                            width: column.width,
                            fontFamily: column.type === 'currency' ? 'monospace' : 'inherit',
                            ...(isFreezed && {
                              position: 'sticky',
                              left: selectable ? 58 + (colIndex * (column.width || 100)) : colIndex * (column.width || 100),
                              backgroundColor: 'white',
                              zIndex: 1,
                              borderRight: '1px solid #e0e0e0',
                            }),
                          }}
                        >
                          {column.render ? column.render(value, row) : column.format ? column.format(value) : value}
                        </TableCell>
                      )
                    })}
                    
                    <TableCell sx={{ width: 60 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRowMenuAnchor(e.currentTarget)
                          setSelectedRowData(row)
                        }}
                      >
                        <MoreVert sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Column Visibility Menu */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      >
        {columns.map((column) => (
          <MenuItem key={column.id} onClick={() => handleColumnVisibility(column.id)}>
            <Checkbox
              checked={visibleColumns.has(column.id)}
              onChange={() => handleColumnVisibility(column.id)}
              size="small"
            />
            {column.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={() => setRowMenuAnchor(null)}
      >
        <MenuItem onClick={() => setRowMenuAnchor(null)}>
          <Edit sx={{ mr: 1, fontSize: 16 }} />
          Edit Row
        </MenuItem>
        <MenuItem onClick={() => setRowMenuAnchor(null)}>
          <Visibility sx={{ mr: 1, fontSize: 16 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => setRowMenuAnchor(null)}>
          <Delete sx={{ mr: 1, fontSize: 16 }} />
          Delete Row
        </MenuItem>
      </Menu>
    </Box>
  )
}