'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material'
import {
  Timeline,
  TrendingUp,
  TrendingDown,
  Assessment,
  Flag,
  Edit,
  Save,
  Add,
  Remove,
  ZoomIn,
  ZoomOut,
  FilterList,
  GetApp,
  Psychology,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

interface StrategicInitiative {
  id: string
  name: string
  description: string
  category: 'revenue' | 'cost' | 'efficiency' | 'growth' | 'digital'
  startYear: number
  endYear: number
  investmentRequired: number
  expectedReturn: number
  roi: number
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold'
  risk: 'low' | 'medium' | 'high'
  owner: string
  milestones: { year: number; description: string; completed: boolean }[]
}

interface FinancialProjection {
  year: number
  revenue: number
  expenses: number
  ebitda: number
  netIncome: number
  cashFlow: number
  headcount: number
}

const mockFinancialProjections: FinancialProjection[] = [
  { year: 2023, revenue: 10500000, expenses: 8200000, ebitda: 2300000, netIncome: 1850000, cashFlow: 2100000, headcount: 125 },
  { year: 2024, revenue: 12200000, expenses: 9400000, ebitda: 2800000, netIncome: 2250000, cashFlow: 2600000, headcount: 145 },
  { year: 2025, revenue: 14800000, expenses: 11200000, ebitda: 3600000, netIncome: 2880000, cashFlow: 3300000, headcount: 170 },
  { year: 2026, revenue: 18500000, expenses: 13800000, ebitda: 4700000, netIncome: 3760000, cashFlow: 4200000, headcount: 200 },
  { year: 2027, revenue: 23200000, expenses: 16900000, ebitda: 6300000, netIncome: 5040000, cashFlow: 5600000, headcount: 235 },
  { year: 2028, revenue: 29800000, expenses: 21200000, ebitda: 8600000, netIncome: 6880000, cashFlow: 7500000, headcount: 280 },
  { year: 2029, revenue: 38500000, expenses: 27300000, ebitda: 11200000, netIncome: 8960000, cashFlow: 9800000, headcount: 335 },
]

const mockStrategicInitiatives: StrategicInitiative[] = [
  {
    id: '1',
    name: 'AI-Powered Analytics Platform',
    description: 'Develop next-generation AI analytics platform to automate financial forecasting and provide real-time insights',
    category: 'digital',
    startYear: 2025,
    endYear: 2027,
    investmentRequired: 2800000,
    expectedReturn: 8500000,
    roi: 203,
    status: 'planned',
    risk: 'medium',
    owner: 'Sarah Johnson',
    milestones: [
      { year: 2025, description: 'Complete AI platform architecture and begin development', completed: false },
      { year: 2026, description: 'Launch beta version with key customers', completed: false },
      { year: 2027, description: 'Full commercial launch and market rollout', completed: false },
    ],
  },
  {
    id: '2',
    name: 'Global Market Expansion',
    description: 'Expand operations to European and Asian markets with localized offerings',
    category: 'growth',
    startYear: 2026,
    endYear: 2029,
    investmentRequired: 5200000,
    expectedReturn: 15800000,
    roi: 204,
    status: 'planned',
    risk: 'high',
    owner: 'Michael Chen',
    milestones: [
      { year: 2026, description: 'Establish European headquarters and regulatory compliance', completed: false },
      { year: 2027, description: 'Launch in 5 European markets', completed: false },
      { year: 2028, description: 'Begin Asian market entry with partnerships', completed: false },
      { year: 2029, description: 'Achieve $10M+ revenue from international markets', completed: false },
    ],
  },
  {
    id: '3',
    name: 'Operational Excellence Program',
    description: 'Implement lean processes and automation to improve margins by 15%',
    category: 'efficiency',
    startYear: 2025,
    endYear: 2026,
    investmentRequired: 800000,
    expectedReturn: 3200000,
    roi: 300,
    status: 'in-progress',
    risk: 'low',
    owner: 'David Rodriguez',
    milestones: [
      { year: 2025, description: 'Complete process mapping and identify optimization opportunities', completed: true },
      { year: 2025, description: 'Implement automation tools and workflow optimization', completed: false },
      { year: 2026, description: 'Achieve 15% margin improvement target', completed: false },
    ],
  },
]

interface LongRangePlanningProps {
  projections?: FinancialProjection[]
  initiatives?: StrategicInitiative[]
  className?: string
}

export function LongRangePlanning({
  projections = mockFinancialProjections,
  initiatives = mockStrategicInitiatives,
  className
}: LongRangePlanningProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedYears, setSelectedYears] = useState([2025, 2029])
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return '#22c55e'
      case 'cost': return '#ef4444'
      case 'efficiency': return '#3b82f6'
      case 'growth': return '#8b5cf6'
      case 'digital': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e'
      case 'in-progress': return '#3b82f6'
      case 'planned': return '#f59e0b'
      case 'on-hold': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#22c55e'
      case 'medium': return '#f59e0b'
      case 'high': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const filteredProjections = projections.filter(p => 
    p.year >= selectedYears[0] && p.year <= selectedYears[1]
  )

  const calculateCAGR = (startValue: number, endValue: number, years: number) => {
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100
  }

  const revenueCAGR = calculateCAGR(
    projections[0].revenue,
    projections[projections.length - 1].revenue,
    projections.length - 1
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
              Strategic Long-Range Planning
            </Typography>
            <Typography variant="body2" color="text.secondary">
              5-year financial projections and strategic initiative planning
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={`${selectedYears[0]}-${selectedYears[1]}`}
                label="Time Range"
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-').map(Number)
                  setSelectedYears([start, end])
                }}
              >
                <MenuItem value="2025-2027">2025-2027</MenuItem>
                <MenuItem value="2025-2029">2025-2029</MenuItem>
                <MenuItem value="2024-2029">2024-2029</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              sx={{ textTransform: 'none' }}
            >
              Export Plan
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
              New Initiative
            </Button>
          </Box>
        </Box>

        {/* Key Metrics Summary */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mb: 0.5 }}>
                {revenueCAGR.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Revenue CAGR
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mb: 0.5 }}>
                {formatCurrency(projections[projections.length - 1].revenue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2029 Revenue Target
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 0.5 }}>
                {initiatives.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Strategic Initiatives
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 0.5 }}>
                {formatCurrency(initiatives.reduce((sum, i) => sum + i.investmentRequired, 0))}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Investment
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Financial Projections" icon={<Assessment />} />
          <Tab label="Strategic Initiatives" icon={<Flag />} />
          <Tab label="Timeline View" icon={<Timeline />} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Financial Projections Chart */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                5-Year Financial Projections
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl size="small">
                  <InputLabel>Metric</InputLabel>
                  <Select
                    value={selectedMetric}
                    label="Metric"
                    onChange={(e) => setSelectedMetric(e.target.value)}
                  >
                    <MenuItem value="revenue">Revenue</MenuItem>
                    <MenuItem value="ebitda">EBITDA</MenuItem>
                    <MenuItem value="netIncome">Net Income</MenuItem>
                    <MenuItem value="cashFlow">Cash Flow</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('chart')}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Chart
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Table
                </Button>
              </Box>
            </Box>

            {viewMode === 'chart' ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={filteredProjections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value)} />
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(value), selectedMetric]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#486581"
                    fill="#486581"
                    fillOpacity={0.1}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Year</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Revenue</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Expenses</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>EBITDA</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Net Income</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Cash Flow</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Headcount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjections.map((projection) => (
                      <TableRow key={projection.year}>
                        <TableCell sx={{ fontWeight: 600 }}>{projection.year}</TableCell>
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(projection.revenue)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(projection.expenses)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(projection.ebitda)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(projection.netIncome)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                          {formatCurrency(projection.cashFlow)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {projection.headcount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Strategic Initiatives Portfolio
            </Typography>

            <Grid container spacing={3}>
              {initiatives.map((initiative) => (
                <Grid item xs={12} md={6} lg={4} key={initiative.id}>
                  <Card
                    sx={{
                      height: '100%',
                      border: `2px solid ${getCategoryColor(initiative.category)}20`,
                      borderRadius: '12px',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: getCategoryColor(initiative.category),
                            width: 32,
                            height: 32,
                          }}
                        >
                          <Flag />
                        </Avatar>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {initiative.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                        {initiative.description}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={initiative.category.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: `${getCategoryColor(initiative.category)}20`,
                            color: getCategoryColor(initiative.category),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        <Chip
                          label={initiative.status.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(initiative.status)}20`,
                            color: getStatusColor(initiative.status),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        <Chip
                          label={`${initiative.risk.toUpperCase()} RISK`}
                          size="small"
                          sx={{
                            backgroundColor: `${getRiskColor(initiative.risk)}20`,
                            color: getRiskColor(initiative.risk),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Timeline: {initiative.startYear} - {initiative.endYear}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Owner: {initiative.owner}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Investment</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
                            {formatCurrency(initiative.investmentRequired)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">Expected Return</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
                            {formatCurrency(initiative.expectedReturn)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#486581' }}>
                          {initiative.roi}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Expected ROI
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                          Milestones Progress:
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(initiative.milestones.filter(m => m.completed).length / initiative.milestones.length) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getCategoryColor(initiative.category),
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {initiative.milestones.filter(m => m.completed).length} of {initiative.milestones.length} completed
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Strategic Timeline ({selectedYears[0]} - {selectedYears[1]})
            </Typography>

            {/* Timeline visualization would go here */}
            <Box sx={{ position: 'relative', height: 400, backgroundColor: '#f8fafc', borderRadius: '8px', p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 20 }}>
                Interactive timeline view with milestones, dependencies, and critical path visualization
              </Typography>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  )
}