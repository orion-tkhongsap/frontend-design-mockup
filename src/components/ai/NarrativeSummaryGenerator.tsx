'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Avatar,
  Grid,
} from '@mui/material'
import {
  AutoStories,
  Download,
  Share,
  Refresh,
  ExpandMore,
  Psychology,
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  Lightbulb,
  Warning,
  CheckCircle,
  ContentCopy,
  Email,
} from '@mui/icons-material'

interface NarrativeSection {
  id: string
  title: string
  content: string
  type: 'executive-summary' | 'analysis' | 'insights' | 'recommendations' | 'outlook'
  wordCount: number
  confidence: number
  keyPoints: string[]
}

interface NarrativeSummary {
  id: string
  title: string
  dateGenerated: Date
  reportType: string
  period: string
  sections: NarrativeSection[]
  totalWordCount: number
  averageConfidence: number
  executiveSummary: string
  author: string
}

const mockNarrativeSummary: NarrativeSummary = {
  id: '1',
  title: 'Q3 2025 Financial Performance Narrative',
  dateGenerated: new Date('2025-09-06T15:30:00'),
  reportType: 'Quarterly Review',
  period: 'Q3 2025',
  totalWordCount: 847,
  averageConfidence: 92,
  author: 'AI Financial Analyst',
  executiveSummary: 'Q3 2025 delivered strong financial performance with revenue growth of 12% YoY, driven by exceptional marketing ROI and controlled cost management. While overall results exceeded targets, IT spending requires attention and Q4 outlook remains positive with recommended forecast adjustments.',
  sections: [
    {
      id: '1',
      title: 'Executive Summary',
      type: 'executive-summary',
      wordCount: 156,
      confidence: 95,
      content: `Q3 2025 demonstrated robust financial performance with total revenue reaching $2.48M, representing a 12% year-over-year increase and 8.3% above budget targets. This exceptional growth was primarily driven by the Sales department's outstanding performance, which exceeded targets by $1.2M, and Marketing's highly effective digital campaigns that delivered 3.8x ROI.

Cost management remained disciplined across most departments, with personnel costs tracking 2% under budget due to strategic hiring delays. However, IT operational expenses increased 23% month-over-month, requiring immediate attention and process optimization.

The quarter's strong momentum positions the organization well for Q4, with pipeline indicators suggesting continued growth trajectory and opportunities for forecast revision.`,
      keyPoints: [
        'Revenue up 12% YoY, $2.48M total',
        'Sales exceeded targets by $1.2M',
        'Marketing ROI reached 3.8x',
        'IT costs increased 23% MoM'
      ],
    },
    {
      id: '2',
      title: 'Revenue Performance Analysis',
      type: 'analysis',
      wordCount: 203,
      confidence: 94,
      content: `Revenue performance in Q3 exceeded all expectations, with strong contributions across multiple business segments. The Sales department led the charge with $1.2M in overperformance, driven by accelerated enterprise deal closures and a 15% increase in average deal size. This success reflects the effectiveness of our enhanced sales methodology and improved lead qualification processes.

Marketing's contribution of $340K above budget represents a 27% improvement over target ROI. The digital transformation initiatives launched in Q2 are showing measurable impact, with online channels delivering 23% higher conversion rates compared to traditional methods. Customer acquisition costs have decreased 12% quarter-over-quarter while customer lifetime value increased 8%.

Product revenue streams showed mixed results, with core offerings maintaining steady growth while newer products experienced a temporary dip due to delayed launches. This $180K shortfall in Product revenue (-2.1% vs budget) is expected to recover in Q4 as scheduled releases come online.`,
      keyPoints: [
        'Enterprise deals driving sales growth',
        'Digital marketing ROI up 27%',
        'Customer acquisition costs down 12%',
        'Product launches delayed affecting revenue'
      ],
    },
    {
      id: '3',
      title: 'Cost Management & Operational Efficiency',
      type: 'analysis',
      wordCount: 187,
      confidence: 89,
      content: `Cost management delivered mixed results in Q3, with notable successes in personnel management offset by unexpected increases in technology spending. Personnel costs came in 2% under budget, primarily due to strategic delays in hiring for non-critical positions and effective contractor utilization for project-based work.

The standout concern is the 23% month-over-month increase in IT operational costs, totaling $45K above projections. This spike resulted from emergency software license purchases ($28K) and unplanned server infrastructure upgrades ($17K). While these investments were necessary for operational continuity, they highlight the need for improved technology budget planning and vendor management.

Facilities and administrative costs remained well-controlled, with office expenses decreasing 20% due to effective hybrid work policies. Professional services spending aligned with budget expectations, though there are opportunities for consolidation in Q4.`,
      keyPoints: [
        'Personnel costs 2% under budget',
        'IT spending up 23% MoM ($45K)',
        'Office expenses down 20%',
        'Professional services on target'
      ],
    },
    {
      id: '4',
      title: 'AI-Generated Insights & Anomalies',
      type: 'insights',
      wordCount: 145,
      confidence: 87,
      content: `Advanced analytics identified several key patterns and anomalies in Q3 performance. The marketing ROI surge correlates strongly with algorithm improvements and creative refresh cycles, suggesting systematic optimization is working effectively. Machine learning models predict this trend will continue through Q4 with 89% confidence.

Seasonal analysis reveals that Q3 performance patterns deviate positively from historical norms by 15%, indicating structural improvements rather than temporary market conditions. The IT cost spike, while concerning, follows a predictable pattern that occurs every 18 months during infrastructure refresh cycles, though this instance was 3 months earlier than anticipated.

Customer behavior analysis shows increasing preference for digital channels (up 34% in engagement) and longer sales cycles for enterprise deals (extended by 12 days on average), requiring adjusted forecasting models for Q4 planning.`,
      keyPoints: [
        'Marketing optimization showing systematic gains',
        'Q3 patterns exceed historical norms by 15%',
        'IT costs follow 18-month cycle patterns',
        'Digital engagement up 34%'
      ],
    },
    {
      id: '5',
      title: 'Strategic Recommendations',
      type: 'recommendations',
      wordCount: 156,
      confidence: 91,
      content: `Based on Q3 performance analysis, several strategic recommendations emerge for Q4 and beyond. First, capitalize on marketing momentum by increasing digital advertising budget by 15% to maximize ROI during the peak Q4 season. The current 3.8x return justifies additional investment in proven channels.

Second, implement predictive IT infrastructure management to prevent future unplanned spending spikes. Establish a quarterly technology assessment process and emergency allocation buffer of $25K to handle unexpected requirements without budget variance.

Third, consider revising Q4 revenue forecast upward by 8% to $2.68M based on current pipeline strength and conversion rate improvements. This adjustment aligns with AI model predictions and current momentum indicators.

Finally, accelerate product launch timelines to capture Q4 seasonal demand and recover the Q3 shortfall. Resource reallocation from delayed hiring can support these initiatives without additional budget impact.`,
      keyPoints: [
        'Increase digital marketing budget 15%',
        'Implement predictive IT management',
        'Revise Q4 forecast up 8% to $2.68M',
        'Accelerate product launches'
      ],
    },
  ],
}

const reportTypes = [
  'Monthly Review',
  'Quarterly Review', 
  'Annual Report',
  'Budget Analysis',
  'Variance Report',
  'Executive Brief',
  'Board Presentation',
  'Performance Summary'
]

const periods = [
  'September 2025',
  'Q3 2025',
  'YTD 2025',
  'Last 12 Months',
  'Q2 vs Q3 2025',
  'Custom Period'
]

interface NarrativeSummaryGeneratorProps {
  onGenerate?: (summary: NarrativeSummary) => void
  onExport?: (format: 'pdf' | 'word' | 'email') => void
  className?: string
}

export function NarrativeSummaryGenerator({
  onGenerate,
  onExport,
  className
}: NarrativeSummaryGeneratorProps) {
  const [selectedReportType, setSelectedReportType] = useState('Quarterly Review')
  const [selectedPeriod, setSelectedPeriod] = useState('Q3 2025')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState<NarrativeSummary | null>(mockNarrativeSummary)
  const [expandedSection, setExpandedSection] = useState<string>('1')
  const [progress, setProgress] = useState(0)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setGeneratedSummary(null)

    // Simulate AI generation process with progress updates
    const steps = [
      'Analyzing financial data...',
      'Identifying key trends...',
      'Generating insights...',
      'Creating narrative content...',
      'Finalizing summary...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(((i + 1) / steps.length) * 100)
    }

    // Generate new summary with selected parameters
    const newSummary: NarrativeSummary = {
      ...mockNarrativeSummary,
      id: Date.now().toString(),
      title: `${selectedPeriod} Financial Performance Narrative`,
      reportType: selectedReportType,
      period: selectedPeriod,
      dateGenerated: new Date(),
    }

    setGeneratedSummary(newSummary)
    setIsGenerating(false)
    setProgress(0)
    onGenerate?.(newSummary)
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'executive-summary': return <Assessment />
      case 'analysis': return <TrendingUp />
      case 'insights': return <Psychology />
      case 'recommendations': return <Lightbulb />
      case 'outlook': return <Timeline />
      default: return <AutoStories />
    }
  }

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'executive-summary': return '#486581'
      case 'analysis': return '#22c55e'
      case 'insights': return '#8b5cf6'
      case 'recommendations': return '#f59e0b'
      case 'outlook': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const formatWordCount = (count: number) => {
    return `${count} words`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              AI Narrative Summary Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate professional narrative summaries of your financial data using AI
            </Typography>
          </Box>

          <Avatar sx={{ backgroundColor: '#486581', width: 48, height: 48 }}>
            <AutoStories />
          </Avatar>
        </Box>

        {/* Configuration */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={selectedReportType}
                label="Report Type"
                onChange={(e) => setSelectedReportType(e.target.value)}
              >
                {reportTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Period"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {periods.map(period => (
                  <MenuItem key={period} value={period}>{period}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={isGenerating}
              startIcon={isGenerating ? <Psychology /> : <AutoStories />}
              fullWidth
              sx={{
                height: 56,
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': { backgroundColor: '#334e68' },
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </Button>
          </Grid>
        </Grid>

        {/* Generation Progress */}
        {isGenerating && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                AI Processing Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#486581',
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Generated Summary */}
      {generatedSummary && (
        <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          {/* Summary Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8fafc' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {generatedSummary.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={generatedSummary.reportType}
                    sx={{ backgroundColor: '#e0f2fe', color: '#0277bd', fontWeight: 600 }}
                  />
                  <Chip
                    label={generatedSummary.period}
                    sx={{ backgroundColor: '#f0f4f8', color: '#374151', fontWeight: 600 }}
                  />
                  <Chip
                    label={formatWordCount(generatedSummary.totalWordCount)}
                    sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}
                  />
                  <Chip
                    label={`${generatedSummary.averageConfidence}% Confidence`}
                    sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Generated by {generatedSummary.author} on {generatedSummary.dateGenerated.toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Download PDF">
                  <IconButton onClick={() => onExport?.('pdf')}>
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton onClick={() => onExport?.('email')}>
                    <Share />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy Summary">
                  <IconButton onClick={() => copyToClipboard(generatedSummary.executiveSummary)}>
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Regenerate">
                  <IconButton onClick={handleGenerate}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Executive Summary Preview */}
            <Alert severity="info" icon={<CheckCircle />}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Executive Summary:
              </Typography>
              <Typography variant="body2">
                {generatedSummary.executiveSummary}
              </Typography>
            </Alert>
          </Box>

          {/* Detailed Sections */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Detailed Analysis Sections
            </Typography>

            {generatedSummary.sections.map((section, index) => (
              <Accordion
                key={section.id}
                expanded={expandedSection === section.id}
                onChange={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
                sx={{
                  mb: 2,
                  border: `1px solid ${getSectionColor(section.type)}40`,
                  borderRadius: '8px !important',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: `${getSectionColor(section.type)}10`,
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                      borderRadius: '8px 8px 0 0',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: getSectionColor(section.type),
                      }}
                    >
                      {getSectionIcon(section.type)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {section.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={section.type.replace('-', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            backgroundColor: `${getSectionColor(section.type)}20`,
                            color: getSectionColor(section.type),
                          }}
                        />
                        <Chip
                          label={formatWordCount(section.wordCount)}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip
                          label={`${section.confidence}% confidence`}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 3 }}>
                    {section.content}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                    Key Points:
                  </Typography>
                  <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                    {section.keyPoints.map((point, pointIndex) => (
                      <Typography key={pointIndex} component="li" variant="body2" sx={{ mb: 0.5 }}>
                        {point}
                      </Typography>
                    ))}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(section.content)}
                      sx={{ textTransform: 'none' }}
                    >
                      Copy Section
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Email />}
                      sx={{ textTransform: 'none' }}
                    >
                      Email Section
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Export Options */}
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', backgroundColor: '#f8fafc' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Export Options
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => onExport?.('pdf')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#dc2626',
                  '&:hover': { backgroundColor: '#b91c1c' },
                }}
              >
                Export PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => onExport?.('word')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#2563eb',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                }}
              >
                Export Word
              </Button>
              <Button
                variant="contained"
                startIcon={<Email />}
                onClick={() => onExport?.('email')}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#059669',
                  '&:hover': { backgroundColor: '#047857' },
                }}
              >
                Email Summary
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                sx={{ textTransform: 'none' }}
              >
                Share Link
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  )
}