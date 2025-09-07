'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Chip,
  LinearProgress,
  Fade,
  Zoom,
  Collapse,
} from '@mui/material'
import {
  Send,
  Mic,
  MicOff,
  ThumbUp,
  ThumbDown,
  ContentCopy,
  Share,
  MoreVert,
  Psychology,
  TrendingUp,
  Assessment,
  Lightbulb,
  Warning,
  CheckCircle,
  Schedule,
  Search,
  History,
  Clear,
} from '@mui/icons-material'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
  attachments?: string[]
  feedback?: 'positive' | 'negative'
  suggestions?: string[]
  isThinking?: boolean
}

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  preview: string
  messageCount: number
}

const mockSuggestions = [
  'Show me Q3 revenue variance by department',
  'What are the top 3 budget overruns this quarter?',
  'Compare marketing spend vs last year',
  'Generate variance analysis report for October',
  'Why is IT budget 15% over forecast?',
  'Show cash flow projection for next 6 months',
  'What drove the increase in personnel costs?',
  'Analyze sales performance by region',
]

const mockChatHistory: ChatSession[] = [
  {
    id: '1',
    title: 'Q3 Budget Analysis',
    timestamp: new Date('2025-09-06T14:30:00'),
    preview: 'Revenue variance analysis showing...',
    messageCount: 12,
  },
  {
    id: '2', 
    title: 'Marketing ROI Review',
    timestamp: new Date('2025-09-05T11:15:00'),
    preview: 'Digital campaigns performing 23% above...',
    messageCount: 8,
  },
  {
    id: '3',
    title: 'Cost Allocation Questions',
    timestamp: new Date('2025-09-04T16:45:00'),
    preview: 'IT costs allocation by department...',
    messageCount: 15,
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Hello! I\'m your AI financial analyst. I can help you analyze financial data, generate reports, and answer questions about your budget and forecasts. What would you like to explore?',
    timestamp: new Date('2025-09-06T14:30:00'),
    confidence: 100,
    suggestions: [
      'Show revenue trends',
      'Analyze budget variance',
      'Generate cost report',
      'Forecast next quarter'
    ],
  },
  {
    id: '2',
    type: 'user',
    content: 'Can you show me the revenue variance for Q3 by department?',
    timestamp: new Date('2025-09-06T14:31:00'),
  },
  {
    id: '3',
    type: 'ai',
    content: 'I\'ve analyzed Q3 revenue variance by department. Here are the key findings:\n\n**Sales Department**: +$1.2M (+8.3% vs budget)\n- Strong performance in enterprise deals\n- 15% increase in average deal size\n\n**Marketing**: +$340K (+5.1% vs budget)\n- Digital campaigns exceeded targets\n- ROI improved to 3.8x\n\n**Product**: -$180K (-2.1% vs budget)\n- Delayed product launch impacted revenue\n- Q4 recovery expected\n\nWould you like me to drill down into any specific department or create a detailed variance report?',
    timestamp: new Date('2025-09-06T14:31:30'),
    confidence: 94,
    sources: ['Q3 Financial Statements', 'Department Budgets', 'Sales Pipeline Data'],
    suggestions: [
      'Show detailed Sales analysis',
      'Marketing campaign breakdown',
      'Product launch impact',
      'Generate variance report'
    ],
  },
]

interface ChatInterfaceProps {
  onNewMessage?: (message: string) => void
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void
  className?: string
}

export function ChatInterface({ onNewMessage, onFeedback, className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [typingDots, setTypingDots] = useState('.')
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(mockChatHistory)
  const [showHistory, setShowHistory] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedMessage, setSelectedMessage] = useState<string>('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Typing animation for AI thinking
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '...') return '.'
          return prev + '.'
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isTyping])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowSuggestions(false)
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI response
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: getAIResponse(inputValue),
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      sources: ['Financial Database', 'Budget System', 'Market Data'],
      suggestions: getContextualSuggestions(inputValue),
    }

    setIsTyping(false)
    setMessages(prev => [...prev, aiResponse])
    onNewMessage?.(inputValue)
  }

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('revenue') || lowerInput.includes('sales')) {
      return 'Based on current financial data, revenue trends show positive growth. Q3 revenue is up 12% YoY, driven primarily by strong enterprise sales performance. The sales department exceeded targets by $1.2M, with marketing contributing an additional $340K above budget. Would you like me to break down the performance by specific channels or time periods?'
    }
    
    if (lowerInput.includes('budget') || lowerInput.includes('variance')) {
      return 'Budget variance analysis shows mixed results across departments. Overall, we\'re tracking 3.2% above budget YTD. Key drivers include:\n\n• Personnel costs: 2% under budget due to delayed hiring\n• Marketing spend: 8% over budget from successful Q3 campaigns\n• Technology: On track with planned investments\n\nShall I generate a detailed variance report with recommendations?'
    }
    
    if (lowerInput.includes('cost') || lowerInput.includes('expense')) {
      return 'Cost analysis reveals several optimization opportunities. Total expenses are within 1.5% of budget, but there are notable variances by category. IT costs have increased 15% due to new software implementations, while office expenses decreased 20% from hybrid work policies. I can provide a detailed cost breakdown with optimization suggestions.'
    }
    
    return 'I understand you\'re looking for financial insights. I\'ve analyzed the available data and can provide detailed analysis on revenue trends, budget variances, cost optimization, and forecasting. What specific area would you like to explore further?'
  }

  const getContextualSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('revenue')) {
      return [
        'Show revenue by product line',
        'Compare to last quarter',
        'Forecast next quarter revenue',
        'Revenue driver analysis'
      ]
    }
    
    if (lowerInput.includes('budget')) {
      return [
        'Show budget vs actual by department',
        'Identify top variances',
        'Generate budget report',
        'Budget reforecast analysis'
      ]
    }
    
    return [
      'Generate summary report',
      'Show key metrics',
      'Analyze trends',
      'Export data'
    ]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleVoiceToggle = () => {
    setIsListening(!isListening)
    // In a real implementation, this would start/stop speech recognition
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ))
    onFeedback?.(messageId, feedback)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const filteredHistory = chatHistory.filter(session =>
    session.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    session.preview.toLowerCase().includes(historySearch.toLowerCase())
  )

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Box className={className} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: '12px 12px 0 0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ backgroundColor: '#486581' }}>
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI Financial Analyst
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: '#22c55e',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }} />
                <Typography variant="caption" color="text.secondary">
                  Online • Ready to help
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Chat History">
              <IconButton onClick={() => setShowHistory(!showHistory)}>
                <Badge badgeContent={chatHistory.length} color="primary">
                  <History />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Chat History Sidebar */}
        <Collapse in={showHistory} orientation="horizontal">
          <Paper sx={{ width: 280, borderRadius: 0, borderRight: '1px solid #e0e0e0' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <TextField
                placeholder="Search chat history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <Search sx={{ color: '#6b7280', mr: 1 }} />,
                  endAdornment: historySearch && (
                    <IconButton size="small" onClick={() => setHistorySearch('')}>
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ overflow: 'auto', maxHeight: 400 }}>
              {filteredHistory.map((session) => (
                <Box
                  key={session.id}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {session.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {session.preview}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {session.timestamp.toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={`${session.messageCount} msgs`}
                      size="small"
                      sx={{ fontSize: '0.7rem', height: 18 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Collapse>

        {/* Chat Messages Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ maxWidth: '80%', display: 'flex', gap: 1 }}>
                  {message.type === 'ai' && (
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#486581' }}>
                      <Psychology sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  
                  <Box>
                    <Card
                      sx={{
                        backgroundColor: message.type === 'user' ? '#486581' : '#f8fafc',
                        color: message.type === 'user' ? 'white' : 'inherit',
                        borderRadius: message.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography
                          variant="body2"
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.5,
                          }}
                        >
                          {message.content}
                        </Typography>

                        {/* AI Message Metadata */}
                        {message.type === 'ai' && (
                          <Box sx={{ mt: 2 }}>
                            {message.confidence && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Confidence:
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={message.confidence}
                                  sx={{
                                    width: 60,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: message.confidence >= 90 ? '#22c55e' : 
                                                      message.confidence >= 75 ? '#f59e0b' : '#ef4444',
                                    },
                                  }}
                                />
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {message.confidence}%
                                </Typography>
                              </Box>
                            )}

                            {message.sources && (
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  Sources:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {message.sources.map((source, index) => (
                                    <Chip
                                      key={index}
                                      label={source}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem', height: 18 }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Message Actions */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      mt: 0.5,
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(message.timestamp)}
                      </Typography>
                      
                      {message.type === 'ai' && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleFeedback(message.id, 'positive')}
                            sx={{ 
                              color: message.feedback === 'positive' ? '#22c55e' : '#6b7280',
                              '&:hover': { color: '#22c55e' },
                            }}
                          >
                            <ThumbUp sx={{ fontSize: 14 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleFeedback(message.id, 'negative')}
                            sx={{ 
                              color: message.feedback === 'negative' ? '#ef4444' : '#6b7280',
                              '&:hover': { color: '#ef4444' },
                            }}
                          >
                            <ThumbDown sx={{ fontSize: 14 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyMessage(message.content)}
                            sx={{ color: '#6b7280' }}
                          >
                            <ContentCopy sx={{ fontSize: 14 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget)
                              setSelectedMessage(message.id)
                            }}
                            sx={{ color: '#6b7280' }}
                          >
                            <MoreVert sx={{ fontSize: 14 }} />
                          </IconButton>
                        </>
                      )}
                    </Box>

                    {/* AI Suggestions */}
                    {message.type === 'ai' && message.suggestions && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Suggested follow-ups:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {message.suggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              size="small"
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{
                                fontSize: '0.75rem',
                                backgroundColor: '#e0f2fe',
                                color: '#0277bd',
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: '#b3e5fc',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  {message.type === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#f59e0b' }}>
                      U
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}

            {/* AI Thinking Indicator */}
            {isTyping && (
              <Fade in={isTyping}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#486581' }}>
                      <Psychology sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Card sx={{ backgroundColor: '#f0f4f8' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            AI is thinking{typingDots}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[0, 1, 2].map((i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: '#486581',
                                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                                  '@keyframes bounce': {
                                    '0%, 80%, 100%': {
                                      transform: 'scale(0)',
                                    },
                                    '40%': {
                                      transform: 'scale(1)',
                                    },
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Suggestions */}
          {showSuggestions && (
            <Fade in={showSuggestions}>
              <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Try asking:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {mockSuggestions.slice(0, 4).map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        fontSize: '0.75rem',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#e0f2fe',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Fade>
          )}

          {/* Input Area */}
          <Paper elevation={2} sx={{ p: 2, borderRadius: '0 0 12px 12px' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about your financial data..."
                multiline
                maxRows={4}
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
              
              <IconButton
                onClick={handleVoiceToggle}
                sx={{
                  color: isListening ? '#ef4444' : '#6b7280',
                  '&:hover': {
                    color: isListening ? '#dc2626' : '#486581',
                  },
                }}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
              
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                sx={{
                  borderRadius: '20px',
                  minWidth: 'auto',
                  px: 3,
                  backgroundColor: '#486581',
                  '&:hover': {
                    backgroundColor: '#334e68',
                  },
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Share sx={{ mr: 1, fontSize: 18 }} />
          Share Message
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Assessment sx={{ mr: 1, fontSize: 18 }} />
          Generate Report
        </MenuItem>
      </Menu>
    </Box>
  )
}