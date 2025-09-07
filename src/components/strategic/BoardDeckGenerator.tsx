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
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material'
import {
  Slideshow,
  Add,
  Preview,
  Download,
  Share,
  Edit,
  Delete,
  ContentCopy,
  Schedule,
  Assessment,
  TrendingUp,
  BarChart,
  PieChart,
  Timeline,
  Flag,
  Psychology,
} from '@mui/icons-material'

interface SlideTemplate {
  id: string
  name: string
  category: 'executive' | 'financial' | 'operational' | 'strategic' | 'closing'
  description: string
  thumbnail: string
  components: string[]
  estimatedTime: number
}

interface BoardDeckSlide {
  id: string
  templateId: string
  title: string
  subtitle?: string
  content: any
  order: number
  isIncluded: boolean
  speakerNotes?: string
}

interface BoardDeck {
  id: string
  title: string
  meetingDate: Date
  presenter: string
  audience: string
  duration: number
  status: 'draft' | 'review' | 'approved' | 'presented'
  slides: BoardDeckSlide[]
  theme: string
}

const mockSlideTemplates: SlideTemplate[] = [
  {
    id: '1',
    name: 'Executive Summary',
    category: 'executive',
    description: 'High-level overview of key metrics and achievements',
    thumbnail: 'exec-summary.png',
    components: ['Key Metrics Grid', 'Performance Highlights', 'Strategic Initiatives'],
    estimatedTime: 3,
  },
  {
    id: '2',
    name: 'Financial Performance',
    category: 'financial',
    description: 'Revenue, profitability, and financial health overview',
    thumbnail: 'financial-perf.png',
    components: ['Revenue Chart', 'Profit Margins', 'Cash Flow Statement'],
    estimatedTime: 5,
  },
  {
    id: '3',
    name: 'Market Analysis',
    category: 'strategic',
    description: 'Market trends, competitive landscape, and opportunities',
    thumbnail: 'market-analysis.png',
    components: ['Market Size Chart', 'Competitive Matrix', 'Growth Opportunities'],
    estimatedTime: 4,
  },
  {
    id: '4',
    name: 'Operational Metrics',
    category: 'operational',
    description: 'Key operational KPIs and efficiency metrics',
    thumbnail: 'operational.png',
    components: ['KPI Dashboard', 'Process Efficiency', 'Resource Utilization'],
    estimatedTime: 3,
  },
  {
    id: '5',
    name: 'Strategic Initiatives',
    category: 'strategic',
    description: 'Progress on strategic projects and future roadmap',
    thumbnail: 'initiatives.png',
    components: ['Initiative Timeline', 'Budget Allocation', 'Success Metrics'],
    estimatedTime: 4,
  },
  {
    id: '6',
    name: 'Risk Assessment',
    category: 'strategic',
    description: 'Risk matrix and mitigation strategies',
    thumbnail: 'risk.png',
    components: ['Risk Heat Map', 'Mitigation Plans', 'Scenario Analysis'],
    estimatedTime: 3,
  },
  {
    id: '7',
    name: 'Closing & Next Steps',
    category: 'closing',
    description: 'Key decisions, action items, and next meeting agenda',
    thumbnail: 'closing.png',
    components: ['Decision Summary', 'Action Items', 'Timeline'],
    estimatedTime: 2,
  },
]

const mockBoardDeck: BoardDeck = {
  id: '1',
  title: 'Q3 2025 Board Meeting',
  meetingDate: new Date('2025-10-15T14:00:00'),
  presenter: 'Sarah Johnson, CFO',
  audience: 'Board of Directors',
  duration: 45,
  status: 'draft',
  theme: 'Professional',
  slides: [
    {
      id: '1',
      templateId: '1',
      title: 'Q3 2025 Executive Summary',
      subtitle: 'Strong Performance Across Key Metrics',
      content: {},
      order: 1,
      isIncluded: true,
      speakerNotes: 'Highlight the 23% revenue growth and successful product launch.',
    },
    {
      id: '2',
      templateId: '2',
      title: 'Financial Performance Overview',
      subtitle: 'Revenue Growth and Margin Expansion',
      content: {},
      order: 2,
      isIncluded: true,
      speakerNotes: 'Emphasize the EBITDA margin improvement and cash flow strength.',
    },
    {
      id: '3',
      templateId: '5',
      title: 'Strategic Initiative Progress',
      subtitle: 'AI Platform Development on Track',
      content: {},
      order: 3,
      isIncluded: true,
    },
  ],
}

interface BoardDeckGeneratorProps {
  templates?: SlideTemplate[]
  onGenerateDeck?: (deck: BoardDeck) => void
  className?: string
}

export function BoardDeckGenerator({
  templates = mockSlideTemplates,
  onGenerateDeck,
  className
}: BoardDeckGeneratorProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['1', '2', '5'])
  const [deckSettings, setDeckSettings] = useState({
    title: 'Q3 2025 Board Meeting',
    meetingDate: '2025-10-15',
    presenter: 'Sarah Johnson, CFO',
    audience: 'Board of Directors',
    duration: 45,
    theme: 'Professional',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDeck, setGeneratedDeck] = useState<BoardDeck | null>(mockBoardDeck)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [selectedSlide, setSelectedSlide] = useState<BoardDeckSlide | null>(null)

  const steps = [
    'Select Templates',
    'Configure Settings',
    'Customize Content',
    'Review & Generate'
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'executive': return '#486581'
      case 'financial': return '#22c55e'
      case 'operational': return '#3b82f6'
      case 'strategic': return '#8b5cf6'
      case 'closing': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'executive': return <Assessment />
      case 'financial': return <TrendingUp />
      case 'operational': return <BarChart />
      case 'strategic': return <Flag />
      case 'closing': return <Schedule />
      default: return <Slideshow />
    }
  }

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const handleGenerateDeck = async () => {
    setIsGenerating(true)
    
    // Simulate deck generation process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newDeck: BoardDeck = {
      ...mockBoardDeck,
      id: Date.now().toString(),
      title: deckSettings.title,
      meetingDate: new Date(deckSettings.meetingDate),
      presenter: deckSettings.presenter,
      audience: deckSettings.audience,
      duration: deckSettings.duration,
      theme: deckSettings.theme,
      slides: selectedTemplates.map((templateId, index) => {
        const template = templates.find(t => t.id === templateId)!
        return {
          id: (index + 1).toString(),
          templateId,
          title: template.name,
          subtitle: `Generated for ${deckSettings.title}`,
          content: {},
          order: index + 1,
          isIncluded: true,
          speakerNotes: `Auto-generated content for ${template.name} slide.`,
        }
      }),
    }
    
    setGeneratedDeck(newDeck)
    setIsGenerating(false)
    onGenerateDeck?.(newDeck)
  }

  const handleSlidePreview = (slide: BoardDeckSlide) => {
    setSelectedSlide(slide)
    setPreviewDialog(true)
  }

  const totalEstimatedTime = selectedTemplates.reduce((total, templateId) => {
    const template = templates.find(t => t.id === templateId)
    return total + (template?.estimatedTime || 0)
  }, 0)

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Select Slide Templates
            </Typography>
            
            <Grid container spacing={3}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} lg={4} key={template.id}>
                  <Card
                    sx={{
                      border: selectedTemplates.includes(template.id) 
                        ? `2px solid ${getCategoryColor(template.category)}` 
                        : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: getCategoryColor(template.category),
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => handleTemplateToggle(template.id)}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: getCategoryColor(template.category),
                            width: 32,
                            height: 32,
                          }}
                        >
                          {getCategoryIcon(template.category)}
                        </Avatar>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`${template.estimatedTime} min`}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                          {selectedTemplates.includes(template.id) && (
                            <Chip
                              label="Selected"
                              size="small"
                              sx={{
                                backgroundColor: getCategoryColor(template.category),
                                color: 'white',
                                fontSize: '0.7rem',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.description}
                      </Typography>
                      
                      <Chip
                        label={template.category.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getCategoryColor(template.category)}20`,
                          color: getCategoryColor(template.category),
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          mb: 2,
                        }}
                      />
                      
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Components:
                      </Typography>
                      <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                        {template.components.map((component, index) => (
                          <Typography key={index} component="li" variant="caption">
                            {component}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Selection Summary:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTemplates.length} slides selected • Estimated presentation time: {totalEstimatedTime} minutes
              </Typography>
            </Box>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Configure Deck Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Presentation Title"
                  value={deckSettings.title}
                  onChange={(e) => setDeckSettings(prev => ({ ...prev, title: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Meeting Date"
                  type="date"
                  value={deckSettings.meetingDate}
                  onChange={(e) => setDeckSettings(prev => ({ ...prev, meetingDate: e.target.value }))}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Presenter"
                  value={deckSettings.presenter}
                  onChange={(e) => setDeckSettings(prev => ({ ...prev, presenter: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Audience</InputLabel>
                  <Select
                    value={deckSettings.audience}
                    label="Audience"
                    onChange={(e) => setDeckSettings(prev => ({ ...prev, audience: e.target.value }))}
                  >
                    <MenuItem value="Board of Directors">Board of Directors</MenuItem>
                    <MenuItem value="Executive Team">Executive Team</MenuItem>
                    <MenuItem value="Investment Committee">Investment Committee</MenuItem>
                    <MenuItem value="Audit Committee">Audit Committee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={deckSettings.duration}
                  onChange={(e) => setDeckSettings(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={deckSettings.theme}
                    label="Theme"
                    onChange={(e) => setDeckSettings(prev => ({ ...prev, theme: e.target.value }))}
                  >
                    <MenuItem value="Professional">Professional</MenuItem>
                    <MenuItem value="Executive">Executive</MenuItem>
                    <MenuItem value="Modern">Modern</MenuItem>
                    <MenuItem value="Minimal">Minimal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Customize Content
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
              Advanced content customization interface would be implemented here.
              Including slide-specific content editors, data source connections, and layout options.
            </Typography>
          </Box>
        )

      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Review & Generate Deck
            </Typography>
            
            {isGenerating ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Generating Board Deck...
                </Typography>
                <LinearProgress sx={{ borderRadius: 1, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Creating slides, formatting content, and applying theme...
                </Typography>
              </Box>
            ) : generatedDeck ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Deck successfully generated! Preview and customize your slides below.
                </Typography>
                
                <Grid container spacing={2}>
                  {generatedDeck.slides.map((slide, index) => (
                    <Grid item xs={12} md={6} lg={4} key={slide.id}>
                      <Card sx={{ cursor: 'pointer' }} onClick={() => handleSlidePreview(slide)}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              Slide {slide.order}
                            </Typography>
                            <IconButton size="small">
                              <Preview sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                            {slide.title}
                          </Typography>
                          {slide.subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {slide.subtitle}
                            </Typography>
                          )}
                          
                          <Box sx={{ 
                            height: 80, 
                            backgroundColor: '#f8fafc', 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Typography variant="caption" color="text.secondary">
                              Slide Preview
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button size="small" startIcon={<Edit />} sx={{ textTransform: 'none' }}>
                            Edit
                          </Button>
                          <Button size="small" startIcon={<ContentCopy />} sx={{ textTransform: 'none' }}>
                            Duplicate
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Ready to generate your board deck presentation.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGenerateDeck}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#486581',
                    '&:hover': { backgroundColor: '#334e68' },
                  }}
                >
                  Generate Deck
                </Button>
              </Box>
            )}
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Board Deck Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create professional board presentations with AI-powered content generation
            </Typography>
          </Box>

          <Avatar sx={{ backgroundColor: '#486581', width: 48, height: 48 }}>
            <Slideshow />
          </Avatar>
        </Box>

        {generatedDeck && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              Export PowerPoint
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              sx={{ textTransform: 'none' }}
            >
              Share Deck
            </Button>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              sx={{ textTransform: 'none' }}
            >
              Present Mode
            </Button>
          </Box>
        )}
      </Paper>

      {/* Stepper */}
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ mt: 2, mb: 3 }}>
                    {renderStepContent(index)}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, pb: 3 }}>
                    <Button
                      disabled={index === 0}
                      onClick={() => setActiveStep(prev => prev - 1)}
                      sx={{ textTransform: 'none' }}
                    >
                      Back
                    </Button>
                    {index === steps.length - 1 ? (
                      generatedDeck && (
                        <Button
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            backgroundColor: '#22c55e',
                            '&:hover': { backgroundColor: '#16a34a' },
                          }}
                        >
                          Complete
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(prev => prev + 1)}
                        disabled={index === 0 && selectedTemplates.length === 0}
                        sx={{
                          textTransform: 'none',
                          backgroundColor: '#486581',
                          '&:hover': { backgroundColor: '#334e68' },
                        }}
                      >
                        Continue
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Paper>

      {/* Slide Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Slide Preview</DialogTitle>
        <DialogContent>
          {selectedSlide && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedSlide.title}
              </Typography>
              {selectedSlide.subtitle && (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {selectedSlide.subtitle}
                </Typography>
              )}
              
              <Box sx={{ 
                height: 300, 
                backgroundColor: '#f8fafc', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}>
                <Typography variant="h6" color="text.secondary">
                  Slide Content Preview
                </Typography>
              </Box>
              
              {selectedSlide.speakerNotes && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Speaker Notes:
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                    {selectedSlide.speakerNotes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<Edit />}>Edit Slide</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}