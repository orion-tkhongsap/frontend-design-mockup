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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material'
import {
  ContentCopy,
  Preview,
  Star,
  StarBorder,
  History,
  TrendingUp,
  TrendingDown,
  Remove,
  Download,
  Upload,
  Add,
} from '@mui/icons-material'

interface HistoricalData {
  year: number
  actual: number
  budget: number
  variance: number
  variancePercent: number
}

interface BudgetTemplate {
  id: string
  name: string
  description: string
  category: string
  department: string
  type: 'operating' | 'capital' | 'revenue'
  lastUsed: Date
  timesUsed: number
  isStarred: boolean
  lineItems: {
    category: string
    subcategory: string
    description: string
    q1Amount: number
    q2Amount: number
    q3Amount: number
    q4Amount: number
    totalAmount: number
    historicalData: HistoricalData[]
  }[]
  totalBudget: number
}

const mockTemplates: BudgetTemplate[] = [
  {
    id: '1',
    name: 'Marketing Department - Operating Budget',
    description: 'Standard operating budget template for marketing team including personnel, campaigns, and technology',
    category: 'Department Template',
    department: 'Marketing',
    type: 'operating',
    lastUsed: new Date('2025-08-15'),
    timesUsed: 12,
    isStarred: true,
    totalBudget: 1250000,
    lineItems: [
      {
        category: 'Personnel',
        subcategory: 'Salaries & Benefits',
        description: 'Marketing team salaries, benefits, and bonuses',
        q1Amount: 180000,
        q2Amount: 185000,
        q3Amount: 190000,
        q4Amount: 195000,
        totalAmount: 750000,
        historicalData: [
          { year: 2023, actual: 720000, budget: 700000, variance: 20000, variancePercent: 2.86 },
          { year: 2024, actual: 735000, budget: 725000, variance: 10000, variancePercent: 1.38 },
          { year: 2025, actual: 745000, budget: 750000, variance: -5000, variancePercent: -0.67 },
        ],
      },
      {
        category: 'Marketing',
        subcategory: 'Digital Advertising',
        description: 'Online advertising, paid social media, SEM, and display campaigns',
        q1Amount: 50000,
        q2Amount: 60000,
        q3Amount: 55000,
        q4Amount: 65000,
        totalAmount: 230000,
        historicalData: [
          { year: 2023, actual: 210000, budget: 200000, variance: 10000, variancePercent: 5.0 },
          { year: 2024, actual: 225000, budget: 220000, variance: 5000, variancePercent: 2.27 },
          { year: 2025, actual: 235000, budget: 230000, variance: 5000, variancePercent: 2.17 },
        ],
      },
      {
        category: 'Technology',
        subcategory: 'Software & Tools',
        description: 'Marketing automation, analytics, CRM, and creative software licenses',
        q1Amount: 15000,
        q2Amount: 15000,
        q3Amount: 15000,
        q4Amount: 20000,
        totalAmount: 65000,
        historicalData: [
          { year: 2023, actual: 58000, budget: 60000, variance: -2000, variancePercent: -3.33 },
          { year: 2024, actual: 62000, budget: 65000, variance: -3000, variancePercent: -4.62 },
          { year: 2025, actual: 64000, budget: 65000, variance: -1000, variancePercent: -1.54 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Sales Team - Operating Budget',
    description: 'Comprehensive sales budget including compensation, travel, and sales tools',
    category: 'Department Template',
    department: 'Sales',
    type: 'operating',
    lastUsed: new Date('2025-09-01'),
    timesUsed: 8,
    isStarred: false,
    totalBudget: 1850000,
    lineItems: [
      {
        category: 'Personnel',
        subcategory: 'Sales Compensation',
        description: 'Base salaries, commissions, and incentive programs',
        q1Amount: 280000,
        q2Amount: 290000,
        q3Amount: 300000,
        q4Amount: 330000,
        totalAmount: 1200000,
        historicalData: [
          { year: 2023, actual: 1100000, budget: 1150000, variance: -50000, variancePercent: -4.35 },
          { year: 2024, actual: 1180000, budget: 1200000, variance: -20000, variancePercent: -1.67 },
          { year: 2025, actual: 1195000, budget: 1200000, variance: -5000, variancePercent: -0.42 },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'IT Infrastructure - Capital Budget',
    description: 'Annual capital expenditure template for IT equipment and infrastructure',
    category: 'IT Template',
    department: 'Information Technology',
    type: 'capital',
    lastUsed: new Date('2025-07-20'),
    timesUsed: 5,
    isStarred: true,
    totalBudget: 850000,
    lineItems: [
      {
        category: 'Equipment',
        subcategory: 'Servers & Networking',
        description: 'Data center equipment, servers, switches, and networking hardware',
        q1Amount: 100000,
        q2Amount: 150000,
        q3Amount: 75000,
        q4Amount: 125000,
        totalAmount: 450000,
        historicalData: [
          { year: 2023, actual: 420000, budget: 400000, variance: 20000, variancePercent: 5.0 },
          { year: 2024, actual: 435000, budget: 450000, variance: -15000, variancePercent: -3.33 },
          { year: 2025, actual: 445000, budget: 450000, variance: -5000, variancePercent: -1.11 },
        ],
      },
    ],
  },
]

interface BudgetTemplatesProps {
  onSelectTemplate?: (template: BudgetTemplate) => void
  onCreateFromTemplate?: (template: BudgetTemplate) => void
  className?: string
}

export function BudgetTemplates({ onSelectTemplate, onCreateFromTemplate, className }: BudgetTemplatesProps) {
  const [templates] = useState<BudgetTemplate[]>(mockTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate | null>(null)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [filterType, setFilterType] = useState<'all' | 'operating' | 'capital' | 'revenue'>('all')

  const filteredTemplates = templates.filter(template => 
    filterType === 'all' || template.type === filterType
  )

  const starredTemplates = filteredTemplates.filter(t => t.isStarred)
  const recentTemplates = [...filteredTemplates]
    .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
    .slice(0, 3)

  const handlePreviewTemplate = (template: BudgetTemplate) => {
    setSelectedTemplate(template)
    setPreviewDialog(true)
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

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 1000) return '#6b7280'
    if (variance > 0) return '#ef4444'
    return '#22c55e'
  }

  const getVarianceIcon = (variance: number) => {
    if (Math.abs(variance) < 1000) return <Remove sx={{ fontSize: 16 }} />
    if (variance > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    return <TrendingDown sx={{ fontSize: 16 }} />
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operating': return '#22c55e'
      case 'capital': return '#3b82f6'
      case 'revenue': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const renderTemplateCard = (template: BudgetTemplate) => (
    <Card 
      key={template.id}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${getTypeColor(template.type)}20`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: `0 8px 25px ${getTypeColor(template.type)}20`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, lineHeight: 1.3 }}>
            {template.name}
          </Typography>
          <IconButton size="small" sx={{ color: template.isStarred ? '#f59e0b' : '#6b7280' }}>
            {template.isStarred ? <Star /> : <StarBorder />}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {template.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={template.type.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: `${getTypeColor(template.type)}20`,
              color: getTypeColor(template.type),
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
          <Chip
            label={template.department}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: getTypeColor(template.type), mb: 0.5 }}>
            {formatCurrency(template.totalBudget)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Budget • {template.lineItems.length} line items
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Used {template.timesUsed} times
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {template.lastUsed.toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          startIcon={<Preview />}
          onClick={() => handlePreviewTemplate(template)}
          sx={{ textTransform: 'none' }}
        >
          Preview
        </Button>
        <Button
          size="small"
          startIcon={<ContentCopy />}
          onClick={() => onCreateFromTemplate?.(template)}
          sx={{ textTransform: 'none' }}
        >
          Use Template
        </Button>
      </CardActions>
    </Card>
  )

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Budget Templates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pre-built budget templates with historical data and proven line items
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              sx={{ textTransform: 'none' }}
            >
              Import Template
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
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
              Create Template
            </Button>
          </Box>
        </Box>

        {/* Filter Tabs */}
        <Tabs
          value={filterType}
          onChange={(_, newValue) => setFilterType(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="All Templates" value="all" />
          <Tab label="Operating" value="operating" />
          <Tab label="Capital" value="capital" />
          <Tab label="Revenue" value="revenue" />
        </Tabs>
      </Paper>

      {/* Quick Access Sections */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          ⭐ Starred Templates
        </Typography>
        {starredTemplates.length > 0 ? (
          <Grid container spacing={3}>
            {starredTemplates.map(renderTemplateCard)}
          </Grid>
        ) : (
          <Alert severity="info">
            <Typography variant="body2">
              No starred templates yet. Star templates you use frequently for quick access.
            </Typography>
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          🕒 Recently Used
        </Typography>
        <Grid container spacing={3}>
          {recentTemplates.map(renderTemplateCard)}
        </Grid>
      </Box>

      {/* All Templates */}
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafbfc' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Templates ({filteredTemplates.length})
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {filteredTemplates.map(renderTemplateCard)}
          </Grid>
        </Box>
      </Paper>

      {/* Template Preview Dialog */}
      {selectedTemplate && (
        <Dialog
          open={previewDialog}
          onClose={() => setPreviewDialog(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { borderRadius: '12px', maxHeight: '90vh' } }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedTemplate.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTemplate.description}
                </Typography>
              </Box>
              <Chip
                label={selectedTemplate.type.toUpperCase()}
                sx={{
                  backgroundColor: `${getTypeColor(selectedTemplate.type)}20`,
                  color: getTypeColor(selectedTemplate.type),
                  fontWeight: 600,
                }}
              />
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: '1px solid #e0e0e0' }}
            >
              <Tab label="Line Items" />
              <Tab label="Historical Data" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              <TabPanel value={activeTab} index={0}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Q1</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Q2</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Q3</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Q4</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTemplate.lineItems.map((item, index) => (
                        <TableRow key={index}>
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
                          <TableCell>{item.description}</TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                            {formatCurrency(item.q1Amount)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                            {formatCurrency(item.q2Amount)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                            {formatCurrency(item.q3Amount)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                            {formatCurrency(item.q4Amount)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {formatCurrency(item.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                {selectedTemplate.lineItems.map((item, itemIndex) => (
                  <Box key={itemIndex} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {item.category} - {item.subcategory}
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Year</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Budget</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actual</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Variance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item.historicalData.map((data) => (
                            <TableRow key={data.year}>
                              <TableCell sx={{ fontWeight: 600 }}>{data.year}</TableCell>
                              <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                                {formatCurrency(data.budget)}
                              </TableCell>
                              <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                                {formatCurrency(data.actual)}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                  <Box sx={{ color: getVarianceColor(data.variance) }}>
                                    {getVarianceIcon(data.variance)}
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: getVarianceColor(data.variance),
                                      fontWeight: 600,
                                      fontFamily: 'monospace',
                                    }}
                                  >
                                    {formatCurrency(data.variance)}
                                  </Typography>
                                  <Chip
                                    label={`${data.variancePercent > 0 ? '+' : ''}${data.variancePercent.toFixed(1)}%`}
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      backgroundColor: data.variancePercent >= 0 ? '#fee2e2' : '#dcfce7',
                                      color: data.variancePercent >= 0 ? '#991b1b' : '#166534',
                                      fontWeight: 600,
                                      fontSize: '0.7rem',
                                    }}
                                  />
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </TabPanel>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
            <Button onClick={() => setPreviewDialog(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<ContentCopy />}
              onClick={() => {
                onCreateFromTemplate?.(selectedTemplate)
                setPreviewDialog(false)
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Use This Template
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}