'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Collapse,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Save,
  History,
  Tag,
  Schedule,
  Person,
  Visibility,
  VisibilityOff,
  Compare,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Restore,
  Delete,
} from '@mui/icons-material'

interface ScenarioVersion {
  id: string
  version: string
  name: string
  description: string
  author: string
  authorAvatar: string
  timestamp: Date
  changes: string[]
  isStarred: boolean
  tags: string[]
}

interface ScenarioSaveDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: ScenarioSaveData) => void
  currentScenario?: {
    id?: string
    name: string
    description: string
    type: string
  }
  versions?: ScenarioVersion[]
}

interface ScenarioSaveData {
  name: string
  description: string
  type: string
  tags: string[]
  isPublic: boolean
  createNewVersion: boolean
  versionNote: string
}

const mockVersions: ScenarioVersion[] = [
  {
    id: '1',
    version: 'v2.1',
    name: 'Q4 Budget - Final',
    description: 'Final budget with board approval and conservative adjustments',
    author: 'Sarah Johnson',
    authorAvatar: 'SJ',
    timestamp: new Date('2025-09-06T14:30:00'),
    changes: ['Reduced marketing spend by 8%', 'Increased R&D budget by 15%', 'Added contingency buffer'],
    isStarred: true,
    tags: ['Final', 'Board Approved'],
  },
  {
    id: '2',
    version: 'v2.0',
    name: 'Q4 Budget - Draft 2',
    description: 'Second iteration incorporating stakeholder feedback',
    author: 'Sarah Johnson',
    authorAvatar: 'SJ',
    timestamp: new Date('2025-09-04T11:15:00'),
    changes: ['Adjusted pricing assumptions', 'Updated headcount projections', 'Revised expense allocations'],
    isStarred: false,
    tags: ['Draft', 'Stakeholder Review'],
  },
  {
    id: '3',
    version: 'v1.5',
    name: 'Q4 Budget - Iteration',
    description: 'Minor adjustments based on Q3 actuals',
    author: 'John Doe',
    authorAvatar: 'JD',
    timestamp: new Date('2025-09-02T16:45:00'),
    changes: ['Updated Q3 actuals', 'Adjusted growth assumptions', 'Minor cost corrections'],
    isStarred: false,
    tags: ['Q3 Update'],
  },
  {
    id: '4',
    version: 'v1.0',
    name: 'Q4 Budget - Initial',
    description: 'Initial budget draft based on historical trends',
    author: 'Emily Chen',
    authorAvatar: 'EC',
    timestamp: new Date('2025-08-28T09:30:00'),
    changes: ['Initial scenario creation', 'Base assumptions defined', 'Historical data imported'],
    isStarred: false,
    tags: ['Initial', 'Historical'],
  },
]

export function ScenarioSaveDialog({
  open,
  onClose,
  onSave,
  currentScenario,
  versions = mockVersions,
}: ScenarioSaveDialogProps) {
  const [formData, setFormData] = useState<ScenarioSaveData>({
    name: currentScenario?.name || '',
    description: currentScenario?.description || '',
    type: currentScenario?.type || 'whatif',
    tags: [],
    isPublic: false,
    createNewVersion: true,
    versionNote: '',
  })
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleVersionRestore = (version: ScenarioVersion) => {
    setFormData(prev => ({
      ...prev,
      name: version.name,
      description: version.description,
      tags: version.tags,
    }))
    setSelectedVersion(version.id)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px', maxHeight: '90vh' },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        borderBottom: '1px solid #e0e0e0',
      }}>
        <Save sx={{ color: '#486581' }} />
        Save Scenario
        {currentScenario?.id && (
          <Chip
            label={`${versions.length} versions`}
            size="small"
            sx={{ ml: 1, backgroundColor: '#f0f4f8', color: '#486581' }}
          />
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Basic Information */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Scenario Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="Scenario Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Scenario Type</InputLabel>
              <Select
                value={formData.type}
                label="Scenario Type"
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <MenuItem value="budget">Budget Plan</MenuItem>
                <MenuItem value="forecast">Forecast</MenuItem>
                <MenuItem value="whatif">What-If Analysis</MenuItem>
                <MenuItem value="stress-test">Stress Test</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tags */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Tags
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleTagAdd}
                disabled={!newTag.trim()}
                sx={{ textTransform: 'none' }}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleTagRemove(tag)}
                  size="small"
                  sx={{
                    backgroundColor: '#e0f2fe',
                    color: '#0277bd',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Version Options */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Version Management
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.createNewVersion}
                  onChange={(e) => setFormData(prev => ({ ...prev, createNewVersion: e.target.checked }))}
                />
              }
              label="Create new version"
            />
            
            {formData.createNewVersion && (
              <TextField
                label="Version Notes"
                value={formData.versionNote}
                onChange={(e) => setFormData(prev => ({ ...prev, versionNote: e.target.value }))}
                placeholder="Describe the changes in this version..."
                multiline
                rows={2}
                fullWidth
                sx={{ mt: 2 }}
              />
            )}
          </Box>

          {/* Sharing Options */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Sharing
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              />
            }
            label="Make scenario visible to other users"
          />
        </Box>

        {/* Version History */}
        {currentScenario?.id && versions.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Button
                startIcon={showVersionHistory ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                sx={{ 
                  textTransform: 'none',
                  mb: 2,
                  color: '#486581',
                }}
              >
                <History sx={{ mr: 1 }} />
                Version History ({versions.length})
              </Button>

              <Collapse in={showVersionHistory}>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {versions.map((version, index) => (
                    <ListItem
                      key={version.id}
                      sx={{
                        border: selectedVersion === version.id ? '2px solid #486581' : '1px solid #e0e0e0',
                        borderRadius: '8px',
                        mb: 1,
                        backgroundColor: selectedVersion === version.id ? 'rgba(72, 101, 129, 0.04)' : 'white',
                      }}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', backgroundColor: '#486581' }}>
                          {version.authorAvatar}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {version.name}
                            </Typography>
                            <Chip
                              label={version.version}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                backgroundColor: '#f0f4f8',
                                color: '#486581',
                                fontWeight: 600,
                              }}
                            />
                            {version.isStarred && (
                              <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              {version.author} • {formatTimeAgo(version.timestamp)}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                              {version.description}
                            </Typography>
                            
                            {version.changes.length > 0 && (
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                  Changes:
                                </Typography>
                                {version.changes.map((change, i) => (
                                  <Typography key={i} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    • {change}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                            
                            {version.tags.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {version.tags.map((tag) => (
                                  <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      fontSize: '0.7rem',
                                      height: 18,
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Tooltip title="Restore this version">
                          <IconButton
                            size="small"
                            onClick={() => handleVersionRestore(version)}
                            sx={{ color: '#486581' }}
                          >
                            <Restore sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        
                        {index > 0 && (
                          <Tooltip title="Compare with current">
                            <IconButton
                              size="small"
                              sx={{ color: '#6b7280' }}
                            >
                              <Compare sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          </>
        )}

        {selectedVersion && (
          <Alert severity="info" sx={{ m: 3, mt: 0 }}>
            Version data has been loaded. You can modify it before saving as a new version.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafbfc',
      }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name.trim()}
          sx={{
            textTransform: 'none',
            backgroundColor: '#486581',
            '&:hover': {
              backgroundColor: '#334e68',
            },
          }}
        >
          Save Scenario
        </Button>
      </DialogActions>
    </Dialog>
  )
}