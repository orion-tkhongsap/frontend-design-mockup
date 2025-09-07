'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  IconButton,
  Autocomplete,
  Badge,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Search,
  Clear,
  FilterList,
  History,
  TrendingUp,
  Description,
  People,
  Dashboard,
  Assessment,
  PieChart,
  AccountBalance,
  Psychology,
  RequestQuote,
  Schedule,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: 'page' | 'report' | 'data' | 'person' | 'action'
  category: string
  path?: string
  icon: React.ReactNode
  relevance: number
  badge?: string
  lastAccessed?: string
}

interface SearchFilter {
  id: string
  label: string
  count?: number
  active: boolean
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'P&L Statement - Q3 2025',
    subtitle: 'Financial report showing quarterly performance',
    type: 'report',
    category: 'Reports',
    path: '/reports/pl',
    icon: <Assessment />,
    relevance: 95,
    badge: 'Updated',
    lastAccessed: '2 hours ago',
  },
  {
    id: '2', 
    title: 'Revenue Budget Variance',
    subtitle: 'Analysis showing 8.2% variance vs budget',
    type: 'data',
    category: 'Analytics',
    icon: <TrendingUp />,
    relevance: 92,
  },
  {
    id: '3',
    title: 'Cost Allocation Rules',
    subtitle: 'Marketing department allocation configuration',
    type: 'page',
    category: 'Configuration',
    path: '/allocations',
    icon: <RequestQuote />,
    relevance: 88,
  },
  {
    id: '4',
    title: 'Sarah Johnson (CFO)',
    subtitle: 'sarah.johnson@company.com',
    type: 'person',
    category: 'People',
    icon: <People />,
    relevance: 85,
  },
  {
    id: '5',
    title: 'Create Budget Scenario',
    subtitle: 'Build what-if analysis for next quarter',
    type: 'action',
    category: 'Actions',
    path: '/scenarios/builder',
    icon: <PieChart />,
    relevance: 82,
  },
  {
    id: '6',
    title: 'Executive Dashboard',
    subtitle: 'KPI overview for leadership team',
    type: 'page',
    category: 'Dashboards',
    path: '/dashboard',
    icon: <Dashboard />,
    relevance: 78,
    lastAccessed: '1 day ago',
  },
]

const searchFilters: SearchFilter[] = [
  { id: 'all', label: 'All', count: 126, active: true },
  { id: 'reports', label: 'Reports', count: 45, active: false },
  { id: 'data', label: 'Data', count: 32, active: false },
  { id: 'people', label: 'People', count: 28, active: false },
  { id: 'actions', label: 'Actions', count: 21, active: false },
]

const recentSearches = [
  'Q3 revenue forecast',
  'cost allocation marketing',
  'budget variance analysis',
  'executive dashboard',
]

interface GlobalSearchProps {
  placeholder?: string
  maxResults?: number
  showFilters?: boolean
  className?: string
}

export function GlobalSearch({ 
  placeholder = 'Search financial data, reports, and more...', 
  maxResults = 6,
  showFilters = true,
  className 
}: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState(searchFilters)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter results based on active filters and query
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const activeFilter = filters.find(f => f.active)
      let filteredResults = mockSearchResults

      // Filter by type if not "all"
      if (activeFilter?.id !== 'all') {
        filteredResults = filteredResults.filter(result => {
          switch (activeFilter?.id) {
            case 'reports': return result.type === 'report'
            case 'data': return result.type === 'data'
            case 'people': return result.type === 'person'
            case 'actions': return result.type === 'action'
            default: return true
          }
        })
      }

      // Filter by query
      const queryLower = query.toLowerCase()
      filteredResults = filteredResults.filter(result =>
        result.title.toLowerCase().includes(queryLower) ||
        result.subtitle?.toLowerCase().includes(queryLower) ||
        result.category.toLowerCase().includes(queryLower)
      )

      // Sort by relevance and limit results
      const sortedResults = filteredResults
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, maxResults)

      setResults(sortedResults)
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [query, filters, maxResults])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    setOpen(value.length > 0)
  }

  const handleFilterChange = (filterId: string) => {
    setFilters(prev => prev.map(filter => ({
      ...filter,
      active: filter.id === filterId,
    })))
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.path) {
      router.push(result.path)
    }
    setOpen(false)
    setQuery('')
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    setOpen(true)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'report': return <Description />
      case 'data': return <TrendingUp />
      case 'person': return <People />
      case 'action': return <Schedule />
      default: return <Search />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'report': return '#3b82f6'
      case 'data': return '#10b981'
      case 'person': return '#8b5cf6'
      case 'action': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <Box ref={searchRef} className={className} sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(query.length > 0 || recentSearches.length > 0)}
        placeholder={placeholder}
        variant="outlined"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#6c757d' }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setQuery('')
                  setOpen(false)
                }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#486581',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#486581',
              borderWidth: '2px',
            },
          },
        }}
      />

      {/* Search Results Dropdown */}
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            maxHeight: '500px',
            overflow: 'hidden',
            zIndex: 1300,
          }}
        >
          {/* Filters */}
          {showFilters && (
            <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <Tabs
                value={filters.findIndex(f => f.active)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': {
                    minHeight: 40,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                  },
                }}
              >
                {filters.map((filter, index) => (
                  <Tab
                    key={filter.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {filter.label}
                        {filter.count && (
                          <Chip
                            label={filter.count}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.65rem',
                              backgroundColor: filter.active ? '#486581' : '#e0e0e0',
                              color: filter.active ? 'white' : '#6c757d',
                            }}
                          />
                        )}
                      </Box>
                    }
                    onClick={() => handleFilterChange(filter.id)}
                  />
                ))}
              </Tabs>
            </Box>
          )}

          {/* Results or Recent Searches */}
          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {query.length > 0 ? (
              // Search Results
              <List sx={{ py: 0 }}>
                {loading ? (
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      Searching...
                    </Typography>
                  </ListItem>
                ) : results.length > 0 ? (
                  results.map((result, index) => (
                    <React.Fragment key={result.id}>
                      <ListItem
                        button
                        onClick={() => handleResultClick(result)}
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'rgba(72, 101, 129, 0.04)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: getTypeColor(result.type) }}>
                          {result.icon}
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {result.title}
                              </Typography>
                              {result.badge && (
                                <Chip
                                  label={result.badge}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    backgroundColor: '#22c55e',
                                    color: 'white',
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {result.subtitle}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip
                                  label={result.category}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    height: 16,
                                    fontSize: '0.65rem',
                                    borderColor: getTypeColor(result.type),
                                    color: getTypeColor(result.type),
                                  }}
                                />
                                {result.lastAccessed && (
                                  <Typography variant="caption" color="text.secondary">
                                    • {result.lastAccessed}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < results.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      No results found for "{query}"
                    </Typography>
                  </ListItem>
                )}
              </List>
            ) : (
              // Recent Searches
              <List sx={{ py: 1 }}>
                <ListItem>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6c757d' }}>
                    Recent Searches
                  </Typography>
                </ListItem>
                {recentSearches.map((search, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleRecentSearchClick(search)}
                    sx={{
                      py: 0.75,
                      pl: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(72, 101, 129, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <History sx={{ fontSize: 16, color: '#6c757d' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          {search}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  )
}