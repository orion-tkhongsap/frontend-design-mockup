'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
} from '@mui/material'
import {
  Edit,
  Delete,
  ContentCopy,
  MoreVert,
  Save,
  Cancel,
  Calculate,
  Percent,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Visibility,
  VisibilityOff,
  FilterList,
  GetApp,
  Add,
} from '@mui/icons-material'

interface BudgetItem {
  id: string
  category: string
  subcategory: string
  description: string
  department: string
  q1Amount: number
  q2Amount: number
  q3Amount: number
  q4Amount: number
  totalAmount: number
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  owner: string
  lastModified: Date
  confidence: 'high' | 'medium' | 'low'
  notes: string
}

interface BulkOperation {
  type: 'increase' | 'decrease' | 'set' | 'copy' | 'delete' | 'status' | 'category'
  value?: number | string
  field?: keyof BudgetItem
  percentage?: boolean
}

const mockBudgetItems: BudgetItem[] = [
  {
    id: '1',
    category: 'Personnel',
    subcategory: 'Salaries',
    description: 'Marketing team salaries',
    department: 'Marketing',
    q1Amount: 180000,
    q2Amount: 185000,
    q3Amount: 190000,
    q4Amount: 195000,
    totalAmount: 750000,
    status: 'draft',
    owner: 'John Doe',
    lastModified: new Date('2025-09-05T14:30:00'),
    confidence: 'high',
    notes: 'Includes annual increase',
  },
  {
    id: '2',
    category: 'Marketing',
    subcategory: 'Digital Advertising',
    description: 'Online advertising campaigns',
    department: 'Marketing',
    q1Amount: 50000,
    q2Amount: 60000,
    q3Amount: 55000,
    q4Amount: 65000,
    totalAmount: 230000,
    status: 'submitted',
    owner: 'Jane Smith',
    lastModified: new Date('2025-09-04T11:15:00'),
    confidence: 'medium',
    notes: 'Q2 spike for product launch',
  },
  {
    id: '3',
    category: 'Technology',
    subcategory: 'Software Licenses',
    description: 'Marketing automation tools',
    department: 'Marketing',
    q1Amount: 15000,
    q2Amount: 15000,
    q3Amount: 15000,
    q4Amount: 20000,
    totalAmount: 65000,
    status: 'approved',
    owner: 'Bob Wilson',
    lastModified: new Date('2025-09-03T09:45:00'),
    confidence: 'high',
    notes: 'Q4 increase for new tools',
  },
  {
    id: '4',
    category: 'Operations',
    subcategory: 'Office Supplies',
    description: 'General office supplies',
    department: 'Marketing',
    q1Amount: 5000,
    q2Amount: 5000,
    q3Amount: 5000,
    q4Amount: 7000,
    totalAmount: 22000,
    status: 'draft',
    owner: 'Alice Brown',
    lastModified: new Date('2025-09-02T16:20:00'),
    confidence: 'low',
    notes: 'Estimate based on last year',
  },
]

interface BulkEditInterfaceProps {
  items?: BudgetItem[]
  onBulkUpdate?: (itemIds: string[], operation: BulkOperation) => void
  onItemUpdate?: (item: BudgetItem) => void
  className?: string
}

export function BulkEditInterface({ 
  items = mockBudgetItems,
  onBulkUpdate,
  onItemUpdate,
  className 
}: BulkEditInterfaceProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [bulkOperationDialog, setBulkOperationDialog] = useState(false)
  const [bulkOperation, setBulkOperation] = useState<BulkOperation>({ type: 'increase' })
  const [editingItem, setEditingItem] = useState<string>('')
  const [editedValues, setEditedValues] = useState<Partial<BudgetItem>>({})
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    }
  }

  const handleStartEdit = (item: BudgetItem) => {
    setEditingItem(item.id)
    setEditedValues(item)
  }

  const handleSaveEdit = () => {
    if (editingItem && editedValues) {
      // Recalculate total
      const total = (editedValues.q1Amount || 0) + 
                   (editedValues.q2Amount || 0) + 
                   (editedValues.q3Amount || 0) + 
                   (editedValues.q4Amount || 0)
      
      const updatedItem = {
        ...editedValues as BudgetItem,
        totalAmount: total,
        lastModified: new Date(),
      }
      
      onItemUpdate?.(updatedItem)
      setEditingItem('')
      setEditedValues({})
    }
  }

  const handleCancelEdit = () => {
    setEditingItem('')
    setEditedValues({})
  }

  const handleBulkOperation = async () => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    onBulkUpdate?.(selectedItems, bulkOperation)
    
    setIsProcessing(false)
    setBulkOperationDialog(false)
    setSelectedItems([])
    setBulkOperation({ type: 'increase' })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e'
      case 'submitted': return '#3b82f6'
      case 'rejected': return '#ef4444'
      case 'draft': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#22c55e'
      case 'medium': return '#f59e0b'
      case 'low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const filteredItems = items.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory
    const statusMatch = filterStatus === 'all' || item.status === filterStatus
    return categoryMatch && statusMatch
  })

  const allSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0
  const someSelected = selectedItems.length > 0 && selectedItems.length < filteredItems.length

  const categories = Array.from(new Set(items.map(item => item.category)))
  const statuses = Array.from(new Set(items.map(item => item.status)))

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Bulk Edit Budget Items
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select multiple items to perform batch operations
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                label="Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Alert severity="info" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              <strong>{selectedItems.length}</strong> item{selectedItems.length > 1 ? 's' : ''} selected
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={() => setBulkOperationDialog(true)}
                sx={{ textTransform: 'none' }}
              >
                Bulk Edit
              </Button>
              <Button
                size="small"
                startIcon={<ContentCopy />}
                sx={{ textTransform: 'none' }}
              >
                Duplicate
              </Button>
              <Button
                size="small"
                startIcon={<Delete />}
                sx={{ textTransform: 'none', color: '#ef4444' }}
              >
                Delete
              </Button>
            </Box>
          </Alert>
        )}
      </Paper>

      {/* Data Table */}
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Q1</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Q2</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Q3</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Q4</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => {
                const isSelected = selectedItems.includes(item.id)
                const isEditing = editingItem === item.id
                
                return (
                  <TableRow 
                    key={item.id}
                    selected={isSelected}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(72, 101, 129, 0.02)',
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.category}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.subcategory}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          value={editedValues.description || ''}
                          onChange={(e) => setEditedValues(prev => ({ ...prev, description: e.target.value }))}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body2">{item.description}</Typography>
                      )}
                    </TableCell>
                    
                    {['q1Amount', 'q2Amount', 'q3Amount', 'q4Amount'].map((field) => (
                      <TableCell key={field} align="right">
                        {isEditing ? (
                          <TextField
                            type="number"
                            value={editedValues[field as keyof BudgetItem] || 0}
                            onChange={(e) => setEditedValues(prev => ({ 
                              ...prev, 
                              [field]: parseFloat(e.target.value) || 0 
                            }))}
                            size="small"
                            sx={{ width: 100 }}
                            InputProps={{ startAdornment: '$' }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {formatCurrency(item[field as keyof BudgetItem] as number)}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                    
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {formatCurrency(isEditing ? 
                          (editedValues.q1Amount || 0) + (editedValues.q2Amount || 0) + 
                          (editedValues.q3Amount || 0) + (editedValues.q4Amount || 0) :
                          item.totalAmount
                        )}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={item.status.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={item.confidence.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getConfidenceColor(item.confidence)}20`,
                          color: getConfidenceColor(item.confidence),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      {isEditing ? (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={handleSaveEdit} sx={{ color: '#22c55e' }}>
                            <Save sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton size="small" onClick={handleCancelEdit} sx={{ color: '#ef4444' }}>
                            <Cancel sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleStartEdit(item)}>
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Options">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setMenuAnchor(e.currentTarget)
                                setSelectedItem(item.id)
                              }}
                            >
                              <MoreVert sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bulk Operation Dialog */}
      <Dialog
        open={bulkOperationDialog}
        onClose={() => setBulkOperationDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Bulk Edit {selectedItems.length} Items</DialogTitle>
        <DialogContent>
          {isProcessing ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Processing Changes...
              </Typography>
              <LinearProgress sx={{ borderRadius: 1 }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Operation Type</InputLabel>
                <Select
                  value={bulkOperation.type}
                  label="Operation Type"
                  onChange={(e) => setBulkOperation(prev => ({ ...prev, type: e.target.value as BulkOperation['type'] }))}
                >
                  <MenuItem value="increase">Increase Amount</MenuItem>
                  <MenuItem value="decrease">Decrease Amount</MenuItem>
                  <MenuItem value="set">Set Amount</MenuItem>
                  <MenuItem value="status">Change Status</MenuItem>
                  <MenuItem value="category">Change Category</MenuItem>
                  <MenuItem value="copy">Copy Values</MenuItem>
                  <MenuItem value="delete">Delete Items</MenuItem>
                </Select>
              </FormControl>

              {['increase', 'decrease', 'set'].includes(bulkOperation.type) && (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Target Field</InputLabel>
                    <Select
                      value={bulkOperation.field || 'totalAmount'}
                      label="Target Field"
                      onChange={(e) => setBulkOperation(prev => ({ ...prev, field: e.target.value as keyof BudgetItem }))}
                    >
                      <MenuItem value="q1Amount">Q1 Amount</MenuItem>
                      <MenuItem value="q2Amount">Q2 Amount</MenuItem>
                      <MenuItem value="q3Amount">Q3 Amount</MenuItem>
                      <MenuItem value="q4Amount">Q4 Amount</MenuItem>
                      <MenuItem value="totalAmount">Total Amount</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    label="Value"
                    type="number"
                    value={bulkOperation.value || ''}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    InputProps={{
                      startAdornment: bulkOperation.percentage ? '%' : '$',
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={() => setBulkOperation(prev => ({ ...prev, percentage: !prev.percentage }))}
                        >
                          {bulkOperation.percentage ? <Percent /> : <AttachMoney />}
                        </IconButton>
                      ),
                    }}
                    fullWidth
                  />
                </>
              )}

              {bulkOperation.type === 'status' && (
                <FormControl fullWidth>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={bulkOperation.value || 'draft'}
                    label="New Status"
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, value: e.target.value }))}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="submitted">Submitted</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              )}

              {bulkOperation.type === 'category' && (
                <FormControl fullWidth>
                  <InputLabel>New Category</InputLabel>
                  <Select
                    value={bulkOperation.value || ''}
                    label="New Category"
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, value: e.target.value }))}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {bulkOperation.type === 'delete' && (
                <Alert severity="warning">
                  <Typography variant="body2">
                    This will permanently delete {selectedItems.length} budget items. This action cannot be undone.
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkOperationDialog(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkOperation}
            variant="contained"
            disabled={isProcessing}
            sx={{
              backgroundColor: bulkOperation.type === 'delete' ? '#ef4444' : '#486581',
              '&:hover': {
                backgroundColor: bulkOperation.type === 'delete' ? '#dc2626' : '#334e68',
              },
            }}
          >
            {isProcessing ? 'Processing...' : `Apply to ${selectedItems.length} Items`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Item Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <ContentCopy sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemIcon>
            <Visibility sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText>View History</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <Delete sx={{ fontSize: 18, color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}