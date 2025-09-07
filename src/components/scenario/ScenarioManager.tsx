'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@mui/material'
import {
  Add,
  MoreVert,
  PlayArrow,
  Edit,
  Delete,
  ContentCopy,
  Compare,
  Star,
  StarBorder,
  Schedule,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'

interface Scenario {
  id: string
  name: string
  description: string
  type: 'budget' | 'forecast' | 'whatif' | 'stress-test'
  status: 'draft' | 'active' | 'archived' | 'published'
  owner: string
  ownerAvatar: string
  createdDate: Date
  lastModified: Date
  starred: boolean
  tags: string[]
  impact: {
    revenue: number
    expenses: number
    netIncome: number
  }
  baseScenario?: string
}

const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Q4 2025 Budget Plan',
    description: 'Official budget plan for Q4 with aggressive growth targets',
    type: 'budget',
    status: 'published',
    owner: 'Sarah Johnson',
    ownerAvatar: 'SJ',
    createdDate: new Date('2025-08-15'),
    lastModified: new Date('2025-09-02'),
    starred: true,
    tags: ['Official', 'Q4', 'Growth'],
    impact: {
      revenue: 2800000,
      expenses: -2100000,
      netIncome: 700000,
    },
  },
  {
    id: '2',
    name: 'Conservative Scenario',
    description: 'Risk-adjusted planning with 15% revenue decline assumptions',
    type: 'whatif',
    status: 'active',
    owner: 'John Doe',
    ownerAvatar: 'JD',
    createdDate: new Date('2025-09-01'),
    lastModified: new Date('2025-09-05'),
    starred: false,
    tags: ['Conservative', 'Risk Analysis'],
    impact: {
      revenue: 2100000,
      expenses: -1800000,
      netIncome: 300000,
    },
    baseScenario: '1',
  },
  {
    id: '3',
    name: 'New Product Launch',
    description: 'Impact analysis for launching AI-powered analytics module',
    type: 'forecast',
    status: 'draft',
    owner: 'Emily Chen',
    ownerAvatar: 'EC',
    createdDate: new Date('2025-09-03'),
    lastModified: new Date('2025-09-06'),
    starred: true,
    tags: ['Product Launch', 'AI', 'Innovation'],
    impact: {
      revenue: 3200000,
      expenses: -2400000,
      netIncome: 800000,
    },
  },
  {
    id: '4',
    name: 'Economic Downturn Stress Test',
    description: 'Worst-case scenario planning for economic recession',
    type: 'stress-test',
    status: 'active',
    owner: 'Michael Rodriguez',
    ownerAvatar: 'MR',
    createdDate: new Date('2025-08-28'),
    lastModified: new Date('2025-09-04'),
    starred: false,
    tags: ['Stress Test', 'Risk Management'],
    impact: {
      revenue: 1800000,
      expenses: -1600000,
      netIncome: 200000,
    },
  },
]

interface ScenarioManagerProps {
  viewMode?: 'grid' | 'list'
  onScenarioSelect?: (scenario: Scenario) => void
  onScenarioCompare?: (scenarios: Scenario[]) => void
}

export function ScenarioManager({ 
  viewMode = 'grid',
  onScenarioSelect,
  onScenarioCompare 
}: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState(mockScenarios)
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    type: 'whatif' as Scenario['type'],
    baseScenario: '',
  })

  const handleScenarioClick = (scenario: Scenario) => {
    if (selectedScenarios.length > 0) {
      // Multi-select mode
      setSelectedScenarios(prev => 
        prev.includes(scenario.id) 
          ? prev.filter(id => id !== scenario.id)
          : [...prev, scenario.id]
      )
    } else {
      // Single select mode
      onScenarioSelect?.(scenario)
    }
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, scenarioId: string) => {
    event.stopPropagation()
    setSelectedScenario(scenarioId)
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedScenario(null)
  }

  const handleStarToggle = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, starred: !s.starred } : s
    ))
    handleMenuClose()
  }

  const handleDuplicate = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario)
    if (scenario) {
      const duplicated: Scenario = {
        ...scenario,
        id: Date.now().toString(),
        name: `${scenario.name} (Copy)`,
        status: 'draft',
        createdDate: new Date(),
        lastModified: new Date(),
        starred: false,
      }
      setScenarios(prev => [duplicated, ...prev])
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    if (selectedScenario) {
      setScenarios(prev => prev.filter(s => s.id !== selectedScenario))
    }
    handleMenuClose()
  }

  const handleCompareSelected = () => {
    const scenariosToCompare = scenarios.filter(s => selectedScenarios.includes(s.id))
    onScenarioCompare?.(scenariosToCompare)
    setSelectedScenarios([])
  }

  const handleCreateScenario = () => {
    const scenario: Scenario = {
      id: Date.now().toString(),
      name: newScenario.name,
      description: newScenario.description,
      type: newScenario.type,
      status: 'draft',
      owner: 'Current User',
      ownerAvatar: 'CU',
      createdDate: new Date(),
      lastModified: new Date(),
      starred: false,
      tags: [],
      impact: {
        revenue: 0,
        expenses: 0,
        netIncome: 0,
      },
      baseScenario: newScenario.baseScenario || undefined,
    }
    
    setScenarios(prev => [scenario, ...prev])
    setCreateDialogOpen(false)
    setNewScenario({ name: '', description: '', type: 'whatif', baseScenario: '' })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'budget': return '#22c55e'
      case 'forecast': return '#3b82f6'
      case 'whatif': return '#f59e0b'
      case 'stress-test': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#22c55e'
      case 'active': return '#3b82f6'
      case 'draft': return '#f59e0b'
      case 'archived': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    if (absAmount >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000).toFixed(0)}K`
    }
    return `${amount < 0 ? '-' : ''}$${absAmount.toLocaleString()}`
  }

  const renderScenarioCard = (scenario: Scenario) => (
    <Card
      key={scenario.id}
      sx={{
        cursor: 'pointer',
        border: selectedScenarios.includes(scenario.id) ? '2px solid #486581' : '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(72, 101, 129, 0.15)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => handleScenarioClick(scenario)}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }} noWrap>
                {scenario.name}
              </Typography>
              {scenario.starred && <Star sx={{ fontSize: 16, color: '#f59e0b' }} />}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={scenario.type.replace('-', ' ').toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: `${getTypeColor(scenario.type)}20`,
                  color: getTypeColor(scenario.type),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
              <Chip
                label={scenario.status.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: `${getStatusColor(scenario.status)}20`,
                  color: getStatusColor(scenario.status),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          </Box>
          
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, scenario.id)}
            sx={{ color: '#6b7280' }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {scenario.description}
        </Typography>

        {/* Financial Impact */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'block' }}>
            Financial Impact
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Revenue</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#22c55e' }}>
                {formatCurrency(scenario.impact.revenue)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Expenses</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
                {formatCurrency(scenario.impact.expenses)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Net Income</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#486581' }}>
                {formatCurrency(scenario.impact.netIncome)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tags */}
        {scenario.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
            {scenario.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: '#e0e0e0',
                  color: '#6b7280',
                }}
              />
            ))}
          </Box>
        )}

        {/* Owner & Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#486581' }}>
              {scenario.ownerAvatar}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {scenario.owner}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {scenario.lastModified.toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<PlayArrow />}
          sx={{ textTransform: 'none' }}
        >
          Run Scenario
        </Button>
        <Button
          size="small"
          startIcon={<Edit />}
          sx={{ textTransform: 'none' }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Scenario Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, manage, and compare financial scenarios
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedScenarios.length > 1 && (
            <Button
              variant="outlined"
              startIcon={<Compare />}
              onClick={handleCompareSelected}
              sx={{ textTransform: 'none' }}
            >
              Compare ({selectedScenarios.length})
            </Button>
          )}
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              textTransform: 'none',
              backgroundColor: '#486581',
              '&:hover': {
                backgroundColor: '#334e68',
              },
            }}
          >
            New Scenario
          </Button>
        </Box>
      </Box>

      {/* Scenario Grid */}
      <Grid container spacing={3}>
        {scenarios.map(renderScenarioCard)}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStarToggle(selectedScenario!)}>
          {scenarios.find(s => s.id === selectedScenario)?.starred ? (
            <>
              <StarBorder sx={{ mr: 1, fontSize: 18 }} />
              Remove Star
            </>
          ) : (
            <>
              <Star sx={{ mr: 1, fontSize: 18 }} />
              Add Star
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy sx={{ mr: 1, fontSize: 18 }} />
          Duplicate
        </MenuItem>
        <MenuItem>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Scenario Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Scenario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Scenario Name"
              value={newScenario.name}
              onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Description"
              value={newScenario.description}
              onChange={(e) => setNewScenario(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Scenario Type</InputLabel>
              <Select
                value={newScenario.type}
                label="Scenario Type"
                onChange={(e) => setNewScenario(prev => ({ ...prev, type: e.target.value as Scenario['type'] }))}
              >
                <MenuItem value="budget">Budget Plan</MenuItem>
                <MenuItem value="forecast">Forecast</MenuItem>
                <MenuItem value="whatif">What-If Analysis</MenuItem>
                <MenuItem value="stress-test">Stress Test</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Base Scenario (Optional)</InputLabel>
              <Select
                value={newScenario.baseScenario}
                label="Base Scenario (Optional)"
                onChange={(e) => setNewScenario(prev => ({ ...prev, baseScenario: e.target.value }))}
              >
                <MenuItem value="">None</MenuItem>
                {scenarios.map(scenario => (
                  <MenuItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateScenario}
            variant="contained"
            disabled={!newScenario.name}
          >
            Create Scenario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}