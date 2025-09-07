'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Popper,
  ClickAwayListener,
} from '@mui/material'
import {
  Search,
  TrendingUp,
  Assessment,
  PieChart,
  Timeline,
  Calculate,
  CompareArrows,
  Psychology,
  Lightbulb,
  History,
  Star,
  Clear,
} from '@mui/icons-material'

interface QuerySuggestion {
  id: string
  text: string
  category: 'analysis' | 'comparison' | 'forecast' | 'report' | 'calculation'
  icon: React.ReactNode
  popularity: number
  description: string
  context?: string[]
}

interface RecentQuery {
  id: string
  text: string
  timestamp: Date
  category: string
}

const mockSuggestions: QuerySuggestion[] = [
  {
    id: '1',
    text: 'Show revenue variance by department',
    category: 'analysis',
    icon: <TrendingUp />,
    popularity: 95,
    description: 'Analyze revenue performance across departments',
    context: ['Revenue', 'Department', 'Variance'],
  },
  {
    id: '2',
    text: 'Compare Q3 vs Q2 budget performance',
    category: 'comparison',
    icon: <CompareArrows />,
    popularity: 88,
    description: 'Quarter-over-quarter budget analysis',
    context: ['Budget', 'Comparison', 'Quarterly'],
  },
  {
    id: '3',
    text: 'Generate cash flow forecast for next 6 months',
    category: 'forecast',
    icon: <Timeline />,
    popularity: 92,
    description: 'Predictive cash flow analysis',
    context: ['Cash Flow', 'Forecast', 'Projection'],
  },
  {
    id: '4',
    text: 'What are the top 5 expense categories?',
    category: 'analysis',
    icon: <PieChart />,
    popularity: 85,
    description: 'Breakdown of largest expense categories',
    context: ['Expenses', 'Categories', 'Analysis'],
  },
  {
    id: '5',
    text: 'Create monthly P&L summary report',
    category: 'report',
    icon: <Assessment />,
    popularity: 90,
    description: 'Generate comprehensive P&L report',
    context: ['P&L', 'Report', 'Monthly'],
  },
  {
    id: '6',
    text: 'Calculate marketing ROI by channel',
    category: 'calculation',
    icon: <Calculate />,
    popularity: 78,
    description: 'ROI analysis across marketing channels',
    context: ['Marketing', 'ROI', 'Channels'],
  },
  {
    id: '7',
    text: 'Why is IT budget over by 15%?',
    category: 'analysis',
    icon: <Psychology />,
    popularity: 82,
    description: 'AI-powered budget variance explanation',
    context: ['IT', 'Budget', 'Variance'],
  },
  {
    id: '8',
    text: 'Show sales performance trends over 12 months',
    category: 'analysis',
    icon: <TrendingUp />,
    popularity: 87,
    description: 'Long-term sales trend analysis',
    context: ['Sales', 'Trends', 'Performance'],
  },
  {
    id: '9',
    text: 'Forecast Q4 revenue based on current pipeline',
    category: 'forecast',
    icon: <Timeline />,
    popularity: 89,
    description: 'Revenue projection using pipeline data',
    context: ['Revenue', 'Q4', 'Pipeline'],
  },
  {
    id: '10',
    text: 'Compare actual vs budget for all departments',
    category: 'comparison',
    icon: <CompareArrows />,
    popularity: 91,
    description: 'Department-wide budget variance analysis',
    context: ['Budget', 'Actual', 'Departments'],
  },
]

const mockRecentQueries: RecentQuery[] = [
  {
    id: '1',
    text: 'Show Q3 marketing spend breakdown',
    timestamp: new Date('2025-09-06T14:30:00'),
    category: 'analysis',
  },
  {
    id: '2',
    text: 'Compare revenue vs last year',
    timestamp: new Date('2025-09-06T11:15:00'),
    category: 'comparison',
  },
  {
    id: '3',
    text: 'Generate expense report for October',
    timestamp: new Date('2025-09-05T16:45:00'),
    category: 'report',
  },
]

interface QueryAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onQuerySelect: (query: string) => void
  placeholder?: string
  className?: string
}

export function QueryAutocomplete({
  value,
  onChange,
  onQuerySelect,
  placeholder = 'Ask me about your financial data...',
  className
}: QueryAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<QuerySuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showRecent, setShowRecent] = useState(false)
  const [highlightedText, setHighlightedText] = useState('')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.trim().length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.context?.some(ctx => ctx.toLowerCase().includes(value.toLowerCase()))
      ).sort((a, b) => b.popularity - a.popularity)
      
      setFilteredSuggestions(filtered.slice(0, 6))
      setShowRecent(false)
      setIsOpen(filtered.length > 0)
      setHighlightedText(value.toLowerCase())
    } else {
      setFilteredSuggestions([])
      setShowRecent(true)
      setIsOpen(true)
      setHighlightedText('')
    }
    setSelectedIndex(-1)
  }, [value])

  const handleInputFocus = () => {
    setIsOpen(true)
    if (!value.trim()) {
      setShowRecent(true)
    }
  }

  const handleInputBlur = () => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => setIsOpen(false), 150)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return

    const suggestions = showRecent ? mockRecentQueries : filteredSuggestions
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => (prev + 1) % suggestions.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1)
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0) {
          const selectedQuery = showRecent 
            ? mockRecentQueries[selectedIndex].text 
            : filteredSuggestions[selectedIndex].text
          handleQuerySelect(selectedQuery)
        } else if (value.trim()) {
          handleQuerySelect(value)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleQuerySelect = (query: string) => {
    onChange(query)
    onQuerySelect(query)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis': return '#22c55e'
      case 'comparison': return '#3b82f6'
      case 'forecast': return '#8b5cf6'
      case 'report': return '#f59e0b'
      case 'calculation': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight) return text
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Box key={index} component="span" sx={{ backgroundColor: '#fef3c7', fontWeight: 600 }}>
          {part}
        </Box>
      ) : part
    )
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return 'Just now'
  }

  return (
    <Box className={className} ref={anchorRef}>
      <TextField
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        fullWidth
        InputProps={{
          startAdornment: <Search sx={{ color: '#6b7280', mr: 1 }} />,
          endAdornment: value && (
            <IconButton size="small" onClick={() => onChange('')}>
              <Clear sx={{ fontSize: 16 }} />
            </IconButton>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        }}
      />

      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper
              elevation={8}
              sx={{
                mt: 1,
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                maxHeight: 400,
                overflow: 'hidden',
              }}
            >
              {showRecent && mockRecentQueries.length > 0 ? (
                <>
                  <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', backgroundColor: '#f8fafc' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <History sx={{ fontSize: 14 }} />
                      Recent Queries
                    </Typography>
                  </Box>
                  <List dense sx={{ py: 0 }}>
                    {mockRecentQueries.map((query, index) => (
                      <ListItem
                        key={query.id}
                        button
                        selected={selectedIndex === index}
                        onClick={() => handleQuerySelect(query.text)}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f0f9ff',
                          },
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                          },
                        }}
                      >
                        <ListItemIcon>
                          <History sx={{ fontSize: 18, color: '#6b7280' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={query.text}
                          secondary={formatTimeAgo(query.timestamp)}
                        />
                        <Chip
                          label={query.category}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 18,
                            backgroundColor: '#f0f4f8',
                            color: '#374151',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <>
                  {filteredSuggestions.length > 0 && (
                    <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', backgroundColor: '#f8fafc' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Psychology sx={{ fontSize: 14 }} />
                        AI Suggestions ({filteredSuggestions.length})
                      </Typography>
                    </Box>
                  )}
                  <List dense sx={{ py: 0, maxHeight: 320, overflow: 'auto' }}>
                    {filteredSuggestions.map((suggestion, index) => (
                      <ListItem
                        key={suggestion.id}
                        button
                        selected={selectedIndex === index}
                        onClick={() => handleQuerySelect(suggestion.text)}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: '#f0f9ff',
                          },
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                          },
                          py: 1.5,
                        }}
                      >
                        <ListItemIcon>
                          <Box sx={{ color: getCategoryColor(suggestion.category) }}>
                            {suggestion.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {highlightMatch(suggestion.text, highlightedText)}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {suggestion.description}
                              </Typography>
                              {suggestion.context && (
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {suggestion.context.map((ctx, idx) => (
                                    <Chip
                                      key={idx}
                                      label={ctx}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: '0.65rem',
                                        height: 16,
                                        borderColor: getCategoryColor(suggestion.category),
                                        color: getCategoryColor(suggestion.category),
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                          <Chip
                            label={suggestion.category.toUpperCase()}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 18,
                              backgroundColor: `${getCategoryColor(suggestion.category)}20`,
                              color: getCategoryColor(suggestion.category),
                              fontWeight: 600,
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ fontSize: 12, color: '#f59e0b' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#f59e0b' }}>
                              {suggestion.popularity}%
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* No Results */}
              {!showRecent && filteredSuggestions.length === 0 && value.trim().length > 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Psychology sx={{ fontSize: 32, color: '#6b7280', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No suggestions found. Try a different query or press Enter to ask directly.
                  </Typography>
                </Box>
              )}

              {/* Quick Tips */}
              {showRecent && mockRecentQueries.length === 0 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                    <Lightbulb sx={{ fontSize: 14, mr: 0.5 }} />
                    Try asking about:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {['Revenue trends', 'Budget variance', 'Cost analysis', 'Forecasting'].map((tip, index) => (
                      <Chip
                        key={index}
                        label={tip}
                        size="small"
                        onClick={() => handleQuerySelect(`Show ${tip.toLowerCase()}`)}
                        sx={{
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#e0f2fe' },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}