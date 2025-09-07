'use client'

import React, { useEffect, useCallback, useState } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Kbd,
} from '@mui/material'
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Keyboard,
  Close,
  Search,
  Add,
  Save,
  Refresh,
  Settings,
  Help,
} from '@mui/icons-material'

interface KeyboardShortcut {
  keys: string[]
  description: string
  category: 'navigation' | 'actions' | 'data' | 'general'
  action: () => void
  preventDefault?: boolean
}

interface KeyboardNavigationProps {
  shortcuts?: KeyboardShortcut[]
  children: React.ReactNode
  disabled?: boolean
  showHelpDialog?: boolean
  onHelpToggle?: (show: boolean) => void
  className?: string
}

const defaultShortcuts: KeyboardShortcut[] = [
  // Navigation
  {
    keys: ['Tab'],
    description: 'Navigate to next element',
    category: 'navigation',
    action: () => {},
    preventDefault: false,
  },
  {
    keys: ['Shift', 'Tab'],
    description: 'Navigate to previous element',
    category: 'navigation',
    action: () => {},
    preventDefault: false,
  },
  {
    keys: ['ArrowUp'],
    description: 'Move up in lists/tables',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['ArrowDown'],
    description: 'Move down in lists/tables',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['ArrowLeft'],
    description: 'Move left or collapse',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['ArrowRight'],
    description: 'Move right or expand',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['Home'],
    description: 'Go to beginning',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['End'],
    description: 'Go to end',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['PageUp'],
    description: 'Page up',
    category: 'navigation',
    action: () => {},
  },
  {
    keys: ['PageDown'],
    description: 'Page down',
    category: 'navigation',
    action: () => {},
  },

  // Actions
  {
    keys: ['Enter'],
    description: 'Activate/Select item',
    category: 'actions',
    action: () => {},
  },
  {
    keys: ['Space'],
    description: 'Toggle checkboxes/switches',
    category: 'actions',
    action: () => {},
  },
  {
    keys: ['Escape'],
    description: 'Close dialog/cancel action',
    category: 'actions',
    action: () => {},
  },
  {
    keys: ['Delete'],
    description: 'Delete selected item',
    category: 'actions',
    action: () => {},
  },

  // Data shortcuts
  {
    keys: ['Ctrl', 's'],
    description: 'Save changes',
    category: 'data',
    action: () => console.log('Save shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'z'],
    description: 'Undo last action',
    category: 'data',
    action: () => console.log('Undo shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'y'],
    description: 'Redo last action',
    category: 'data',
    action: () => console.log('Redo shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'c'],
    description: 'Copy selected data',
    category: 'data',
    action: () => console.log('Copy shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'v'],
    description: 'Paste data',
    category: 'data',
    action: () => console.log('Paste shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'a'],
    description: 'Select all',
    category: 'data',
    action: () => console.log('Select all shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'f'],
    description: 'Search/Find',
    category: 'data',
    action: () => console.log('Search shortcut'),
    preventDefault: true,
  },

  // General shortcuts
  {
    keys: ['Ctrl', 'n'],
    description: 'Create new item',
    category: 'general',
    action: () => console.log('New item shortcut'),
    preventDefault: true,
  },
  {
    keys: ['Ctrl', 'r'],
    description: 'Refresh data',
    category: 'general',
    action: () => console.log('Refresh shortcut'),
    preventDefault: true,
  },
  {
    keys: ['F1'],
    description: 'Show help',
    category: 'general',
    action: () => {},
    preventDefault: true,
  },
  {
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    category: 'general',
    action: () => {},
    preventDefault: true,
  },
]

export function KeyboardNavigation({
  shortcuts = defaultShortcuts,
  children,
  disabled = false,
  showHelpDialog = false,
  onHelpToggle,
  className,
}: KeyboardNavigationProps) {
  const [helpOpen, setHelpOpen] = useState(showHelpDialog)
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [showShortcutFeedback, setShowShortcutFeedback] = useState('')

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return

    const newActiveKeys = new Set(activeKeys)
    
    // Add the key to active keys
    if (event.ctrlKey) newActiveKeys.add('Ctrl')
    if (event.shiftKey) newActiveKeys.add('Shift')
    if (event.altKey) newActiveKeys.add('Alt')
    if (event.metaKey) newActiveKeys.add('Meta')
    
    // Add the actual key
    newActiveKeys.add(event.key)
    
    setActiveKeys(newActiveKeys)

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      return shortcut.keys.length === newActiveKeys.size &&
             shortcut.keys.every(key => newActiveKeys.has(key))
    })

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault) {
        event.preventDefault()
      }
      
      // Special handling for help shortcuts
      if (matchingShortcut.keys.includes('F1') || matchingShortcut.keys.includes('?')) {
        setHelpOpen(true)
        onHelpToggle?.(true)
      } else {
        matchingShortcut.action()
        setShowShortcutFeedback(matchingShortcut.description)
        setTimeout(() => setShowShortcutFeedback(''), 2000)
      }
    }
  }, [disabled, activeKeys, shortcuts, onHelpToggle])

  const handleKeyUp = useCallback(() => {
    setActiveKeys(new Set())
  }, [])

  useEffect(() => {
    if (!disabled) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [disabled, handleKeyDown, handleKeyUp])

  useEffect(() => {
    setHelpOpen(showHelpDialog)
  }, [showHelpDialog])

  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(shortcut)
    return groups
  }, {} as Record<string, KeyboardShortcut[]>)

  const formatKeysCombination = (keys: string[]) => {
    return keys.map((key, index) => (
      <React.Fragment key={key}>
        {index > 0 && <span style={{ margin: '0 4px' }}>+</span>}
        <Kbd sx={{ 
          px: 1, 
          py: 0.5, 
          borderRadius: '4px', 
          border: '1px solid #d1d5db',
          backgroundColor: '#f9fafb',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
        }}>
          {key}
        </Kbd>
      </React.Fragment>
    ))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <KeyboardArrowUp />
      case 'actions': return <Add />
      case 'data': return <Save />
      case 'general': return <Settings />
      default: return <Keyboard />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return '#3b82f6'
      case 'actions': return '#22c55e'
      case 'data': return '#f59e0b'
      case 'general': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  return (
    <Box className={className}>
      {children}

      {/* Keyboard Shortcuts Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => {
          setHelpOpen(false)
          onHelpToggle?.(false)
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Keyboard />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Keyboard Shortcuts
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setHelpOpen(false)
                onHelpToggle?.(false)
              }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use these keyboard shortcuts to navigate and interact with the application more efficiently.
          </Typography>

          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ color: getCategoryColor(category) }}>
                  {getCategoryIcon(category)}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {category}
                </Typography>
                <Chip
                  label={categoryShortcuts.length}
                  size="small"
                  sx={{
                    backgroundColor: `${getCategoryColor(category)}20`,
                    color: getCategoryColor(category),
                    fontWeight: 600,
                  }}
                />
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600, width: '30%' }}>Keys</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryShortcuts.map((shortcut, index) => (
                      <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {formatKeysCombination(shortcut.keys)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {shortcut.description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Pro Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Hold <Kbd>Shift</Kbd> while navigating to select multiple items<br/>
              • Use <Kbd>Tab</Kbd> to navigate through interactive elements<br/>
              • Press <Kbd>?</Kbd> anytime to show this help dialog<br/>
              • Most shortcuts work globally throughout the application
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Shortcut Feedback Snackbar */}
      <Snackbar
        open={!!showShortcutFeedback}
        autoHideDuration={2000}
        onClose={() => setShowShortcutFeedback('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="info"
          sx={{
            backgroundColor: '#f0f9ff',
            color: '#1e40af',
            border: '1px solid #bfdbfe',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {showShortcutFeedback}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Kbd component for displaying keyboard keys
function Kbd({ children, sx, ...props }: { children: React.ReactNode; sx?: any; [key: string]: any }) {
  return (
    <Box
      component="kbd"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 0.75,
        py: 0.25,
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        fontWeight: 600,
        backgroundColor: '#f9fafb',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        minWidth: '24px',
        height: '24px',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Demo component
export function KeyboardNavigationDemo() {
  const [showHelp, setShowHelp] = useState(false)
  const [actionFeedback, setActionFeedback] = useState('')

  const demoShortcuts: KeyboardShortcut[] = [
    ...defaultShortcuts.map(shortcut => ({
      ...shortcut,
      action: () => {
        setActionFeedback(`Executed: ${shortcut.description}`)
        setTimeout(() => setActionFeedback(''), 3000)
      }
    })),
    {
      keys: ['Ctrl', 'k'],
      description: 'Quick command palette',
      category: 'general' as const,
      action: () => {
        setActionFeedback('Command palette opened')
        setTimeout(() => setActionFeedback(''), 3000)
      },
      preventDefault: true,
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Keyboard Navigation Demo
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Try these keyboard shortcuts:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Chip
            label="Ctrl + S (Save)"
            onClick={() => setActionFeedback('Save shortcut executed')}
            sx={{ backgroundColor: '#f0f9ff', color: '#1e40af' }}
          />
          <Chip
            label="Ctrl + F (Search)"
            onClick={() => setActionFeedback('Search shortcut executed')}
            sx={{ backgroundColor: '#f0f9ff', color: '#1e40af' }}
          />
          <Chip
            label="? (Help)"
            onClick={() => setShowHelp(true)}
            sx={{ backgroundColor: '#f0f9ff', color: '#1e40af' }}
          />
          <Chip
            label="F1 (Help)"
            onClick={() => setShowHelp(true)}
            sx={{ backgroundColor: '#f0f9ff', color: '#1e40af' }}
          />
        </Box>
      </Box>

      <KeyboardNavigation
        shortcuts={demoShortcuts}
        showHelpDialog={showHelp}
        onHelpToggle={setShowHelp}
      >
        <Paper sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Interactive Content Area
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This area supports keyboard navigation. Try using the shortcuts listed above
            or press <Kbd>?</Kbd> to see all available shortcuts.
          </Typography>
          
          {actionFeedback && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {actionFeedback}
            </Alert>
          )}
        </Paper>
      </KeyboardNavigation>
    </Box>
  )
}