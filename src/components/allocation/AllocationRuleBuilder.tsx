'use client'

import React, { useState, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
} from '@mui/material'
import {
  Add,
  DragIndicator,
  Delete,
  Edit,
  ContentCopy,
  PlayArrow,
  SaveAlt,
  Functions,
  AccountTree,
  Speed,
} from '@mui/icons-material'

interface AllocationRule {
  id: string
  name: string
  type: 'percentage' | 'driver-based' | 'formula' | 'fixed-amount'
  source: string
  targets: string[]
  driver?: string
  formula?: string
  percentage?: number
  amount?: number
  conditions: string[]
  priority: number
  active: boolean
}

interface RuleBlock {
  id: string
  rule: AllocationRule
  position: { x: number; y: number }
}

const mockAllocationRules: AllocationRule[] = [
  {
    id: '1',
    name: 'IT Costs by Headcount',
    type: 'driver-based',
    source: 'IT Department',
    targets: ['Sales', 'Marketing', 'R&D', 'Finance'],
    driver: 'Employee Count',
    conditions: ['Active Employee', 'Full-time'],
    priority: 1,
    active: true,
  },
  {
    id: '2',
    name: 'Office Rent Split',
    type: 'percentage',
    source: 'Facilities',
    targets: ['Sales', 'Marketing', 'R&D'],
    percentage: 100,
    conditions: ['Floor Space Occupied'],
    priority: 2,
    active: true,
  },
  {
    id: '3',
    name: 'Marketing Attribution',
    type: 'formula',
    source: 'Marketing Budget',
    targets: ['Product Lines'],
    formula: '(Revenue_Share * Campaign_Weight) / Total_Revenue',
    conditions: ['Active Campaign', 'Revenue > 0'],
    priority: 3,
    active: true,
  },
]

interface AllocationRuleBuilderProps {
  onRuleCreate?: (rule: AllocationRule) => void
  onRuleUpdate?: (rule: AllocationRule) => void
  onRuleDelete?: (ruleId: string) => void
  className?: string
}

export function AllocationRuleBuilder({
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete,
  className
}: AllocationRuleBuilderProps) {
  const [rules, setRules] = useState<AllocationRule[]>(mockAllocationRules)
  const [ruleBlocks, setRuleBlocks] = useState<RuleBlock[]>(
    mockAllocationRules.map((rule, index) => ({
      id: rule.id,
      rule,
      position: { x: 50 + (index % 3) * 300, y: 50 + Math.floor(index / 3) * 200 }
    }))
  )
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AllocationRule | null>(null)
  const [isNewRule, setIsNewRule] = useState(false)

  const handleDragStart = useCallback((blockId: string) => {
    setDraggedBlock(blockId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedBlock(null)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent, blockId: string) => {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const newPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setRuleBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, position: newPosition }
        : block
    ))
  }, [])

  const openEditDialog = (rule?: AllocationRule) => {
    if (rule) {
      setEditingRule(rule)
      setIsNewRule(false)
    } else {
      setEditingRule({
        id: Date.now().toString(),
        name: '',
        type: 'percentage',
        source: '',
        targets: [],
        conditions: [],
        priority: rules.length + 1,
        active: true,
      })
      setIsNewRule(true)
    }
    setEditDialogOpen(true)
  }

  const handleRuleSave = () => {
    if (!editingRule) return

    if (isNewRule) {
      const newRuleBlock: RuleBlock = {
        id: editingRule.id,
        rule: editingRule,
        position: { x: 50, y: 50 + rules.length * 200 }
      }
      setRules(prev => [...prev, editingRule])
      setRuleBlocks(prev => [...prev, newRuleBlock])
      onRuleCreate?.(editingRule)
    } else {
      setRules(prev => prev.map(r => r.id === editingRule.id ? editingRule : r))
      setRuleBlocks(prev => prev.map(block => 
        block.id === editingRule.id 
          ? { ...block, rule: editingRule }
          : block
      ))
      onRuleUpdate?.(editingRule)
    }

    setEditDialogOpen(false)
    setEditingRule(null)
  }

  const handleRuleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId))
    setRuleBlocks(prev => prev.filter(block => block.id !== ruleId))
    onRuleDelete?.(ruleId)
  }

  const handleRuleDuplicate = (rule: AllocationRule) => {
    const duplicatedRule: AllocationRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copy)`,
      priority: rules.length + 1,
    }
    
    const newRuleBlock: RuleBlock = {
      id: duplicatedRule.id,
      rule: duplicatedRule,
      position: { x: 100, y: 50 + rules.length * 200 }
    }
    
    setRules(prev => [...prev, duplicatedRule])
    setRuleBlocks(prev => [...prev, newRuleBlock])
  }

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return '#22c55e'
      case 'driver-based': return '#3b82f6'
      case 'formula': return '#f59e0b'
      case 'fixed-amount': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Speed />
      case 'driver-based': return <AccountTree />
      case 'formula': return <Functions />
      case 'fixed-amount': return <SaveAlt />
      default: return <Functions />
    }
  }

  const renderRuleBlock = (ruleBlock: RuleBlock) => {
    const { rule, position } = ruleBlock
    
    return (
      <Card
        key={rule.id}
        sx={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: 280,
          cursor: draggedBlock === rule.id ? 'grabbing' : 'grab',
          opacity: draggedBlock === rule.id ? 0.5 : 1,
          border: `2px solid ${getRuleTypeColor(rule.type)}`,
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: `0 8px 25px ${getRuleTypeColor(rule.type)}20`,
            transform: 'translateY(-2px)',
          },
        }}
        draggable
        onDragStart={() => handleDragStart(rule.id)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, rule.id)}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Rule Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
              <DragIndicator sx={{ color: '#6b7280', cursor: 'grab' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }} noWrap>
                  {rule.name}
                </Typography>
                <Chip
                  icon={getRuleTypeIcon(rule.type)}
                  label={rule.type.replace('-', ' ').toUpperCase()}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 20,
                    fontSize: '0.7rem',
                    backgroundColor: `${getRuleTypeColor(rule.type)}20`,
                    color: getRuleTypeColor(rule.type),
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Edit Rule">
                <IconButton size="small" onClick={() => openEditDialog(rule)}>
                  <Edit sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Duplicate Rule">
                <IconButton size="small" onClick={() => handleRuleDuplicate(rule)}>
                  <ContentCopy sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Rule">
                <IconButton size="small" onClick={() => handleRuleDelete(rule.id)} sx={{ color: '#ef4444' }}>
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Rule Details */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Source → Targets
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              {rule.source}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {rule.targets.map((target, index) => (
                <Chip
                  key={index}
                  label={target}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 18,
                    borderColor: getRuleTypeColor(rule.type),
                    color: getRuleTypeColor(rule.type),
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Rule Logic */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              Allocation Logic
            </Typography>
            {rule.type === 'percentage' && rule.percentage && (
              <Typography variant="body2">Percentage: {rule.percentage}%</Typography>
            )}
            {rule.type === 'driver-based' && rule.driver && (
              <Typography variant="body2">Driver: {rule.driver}</Typography>
            )}
            {rule.type === 'formula' && rule.formula && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#f8fafc', p: 1, borderRadius: '4px' }}>
                {rule.formula}
              </Typography>
            )}
            {rule.type === 'fixed-amount' && rule.amount && (
              <Typography variant="body2">Amount: ${rule.amount.toLocaleString()}</Typography>
            )}
          </Box>

          {/* Conditions */}
          {rule.conditions.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Conditions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {rule.conditions.map((condition, index) => (
                  <Chip
                    key={index}
                    label={condition}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 18,
                      backgroundColor: '#f0f4f8',
                      color: '#374151',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Status and Priority */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
            <Chip
              label={rule.active ? 'Active' : 'Inactive'}
              size="small"
              sx={{
                backgroundColor: rule.active ? '#dcfce7' : '#fee2e2',
                color: rule.active ? '#166534' : '#991b1b',
                fontWeight: 600,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Priority: {rule.priority}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Allocation Rule Builder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and manage cost allocation rules with drag-and-drop interface
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PlayArrow />}
              sx={{ textTransform: 'none' }}
            >
              Test Rules
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openEditDialog()}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': {
                  backgroundColor: '#334e68',
                },
              }}
            >
              Add Rule
            </Button>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Drag rule blocks to reorganize them. Rules are executed in priority order (1 = highest priority).
          </Typography>
        </Alert>
      </Paper>

      {/* Rule Canvas */}
      <Paper
        elevation={2}
        sx={{
          position: 'relative',
          height: 600,
          borderRadius: '12px',
          backgroundColor: '#fafbfc',
          border: '2px dashed #e0e0e0',
          overflow: 'hidden',
        }}
      >
        {ruleBlocks.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6b7280',
            }}
          >
            <AccountTree sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No Allocation Rules
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
              Create your first allocation rule to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openEditDialog()}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': {
                  backgroundColor: '#334e68',
                },
              }}
            >
              Create Rule
            </Button>
          </Box>
        ) : (
          ruleBlocks.map(renderRuleBlock)
        )}
      </Paper>

      {/* Edit Rule Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' },
        }}
      >
        <DialogTitle>
          {isNewRule ? 'Create New Allocation Rule' : 'Edit Allocation Rule'}
        </DialogTitle>
        
        <DialogContent>
          {editingRule && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Rule Name"
                value={editingRule.name}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={editingRule.type}
                  label="Rule Type"
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, type: e.target.value as AllocationRule['type'] } : null)}
                >
                  <MenuItem value="percentage">Percentage Split</MenuItem>
                  <MenuItem value="driver-based">Driver-Based</MenuItem>
                  <MenuItem value="formula">Formula</MenuItem>
                  <MenuItem value="fixed-amount">Fixed Amount</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Source Account"
                value={editingRule.source}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, source: e.target.value } : null)}
                placeholder="e.g., IT Department, Facilities, Marketing"
                fullWidth
              />

              <TextField
                label="Target Accounts"
                value={editingRule.targets.join(', ')}
                onChange={(e) => setEditingRule(prev => prev ? { 
                  ...prev, 
                  targets: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                } : null)}
                placeholder="e.g., Sales, Marketing, R&D"
                helperText="Separate multiple targets with commas"
                fullWidth
              />

              {editingRule.type === 'driver-based' && (
                <TextField
                  label="Allocation Driver"
                  value={editingRule.driver || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, driver: e.target.value } : null)}
                  placeholder="e.g., Employee Count, Revenue, Square Footage"
                  fullWidth
                />
              )}

              {editingRule.type === 'formula' && (
                <TextField
                  label="Allocation Formula"
                  value={editingRule.formula || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, formula: e.target.value } : null)}
                  placeholder="e.g., (Revenue_Share * Weight) / Total_Revenue"
                  multiline
                  rows={2}
                  fullWidth
                />
              )}

              {editingRule.type === 'percentage' && (
                <TextField
                  label="Percentage"
                  type="number"
                  value={editingRule.percentage || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, percentage: parseFloat(e.target.value) || 0 } : null)}
                  InputProps={{ endAdornment: '%' }}
                  fullWidth
                />
              )}

              {editingRule.type === 'fixed-amount' && (
                <TextField
                  label="Fixed Amount"
                  type="number"
                  value={editingRule.amount || ''}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)}
                  InputProps={{ startAdornment: '$' }}
                  fullWidth
                />
              )}

              <TextField
                label="Conditions"
                value={editingRule.conditions.join(', ')}
                onChange={(e) => setEditingRule(prev => prev ? { 
                  ...prev, 
                  conditions: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                } : null)}
                placeholder="e.g., Active Employee, Revenue > 0"
                helperText="Separate multiple conditions with commas"
                multiline
                rows={2}
                fullWidth
              />

              <TextField
                label="Priority"
                type="number"
                value={editingRule.priority}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, priority: parseInt(e.target.value) || 1 } : null)}
                helperText="Lower numbers have higher priority"
                fullWidth
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRuleSave}
            variant="contained"
            disabled={!editingRule?.name || !editingRule?.source || editingRule?.targets.length === 0}
          >
            {isNewRule ? 'Create Rule' : 'Update Rule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}