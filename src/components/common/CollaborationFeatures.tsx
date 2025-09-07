'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Zoom,
  Fade,
} from '@mui/material'
import {
  PersonAdd,
  Chat,
  Notifications,
  MoreVert,
  Send,
  Reply,
  Edit,
  Delete,
  Visibility,
  History,
  Comment,
  Schedule,
  Check,
  Close,
  FiberManualRecord,
} from '@mui/icons-material'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  status: 'online' | 'away' | 'offline'
  lastSeen: Date
}

interface Comment {
  id: string
  user: User
  content: string
  timestamp: Date
  mentions: string[]
  replies?: Comment[]
  resolved: boolean
  edited: boolean
}

interface Activity {
  id: string
  user: User
  action: string
  description: string
  timestamp: Date
  type: 'edit' | 'comment' | 'approval' | 'view' | 'share'
  metadata?: any
}

interface PresenceUser extends User {
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number }
  activeElement?: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'SJ',
    role: 'CFO',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '2',
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.com',
    avatar: 'DR',
    role: 'Controller',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    avatar: 'PP',
    role: 'Analyst',
    status: 'away',
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: '4',
    name: 'Mark Chen',
    email: 'mark.chen@company.com',
    avatar: 'MC',
    role: 'Department Head',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
  },
]

const mockComments: Comment[] = [
  {
    id: '1',
    user: mockUsers[0],
    content: 'The Q3 numbers look great! @David can you verify the allocation methodology?',
    timestamp: new Date(Date.now() - 3600000),
    mentions: ['David Rodriguez'],
    resolved: false,
    edited: false,
    replies: [
      {
        id: '1-1',
        user: mockUsers[1],
        content: 'Yes, I\'ll review the allocation rules and get back to you by EOD.',
        timestamp: new Date(Date.now() - 3000000),
        mentions: [],
        resolved: false,
        edited: false,
      },
    ],
  },
  {
    id: '2',
    user: mockUsers[2],
    content: 'I notice some variance in the marketing spend. Should we investigate further?',
    timestamp: new Date(Date.now() - 7200000),
    mentions: [],
    resolved: true,
    edited: false,
  },
]

const mockActivities: Activity[] = [
  {
    id: '1',
    user: mockUsers[0],
    action: 'edited',
    description: 'Updated Q3 revenue forecast',
    timestamp: new Date(Date.now() - 300000),
    type: 'edit',
  },
  {
    id: '2',
    user: mockUsers[1],
    action: 'commented',
    description: 'Added comment on budget allocation',
    timestamp: new Date(Date.now() - 600000),
    type: 'comment',
  },
  {
    id: '3',
    user: mockUsers[2],
    action: 'viewed',
    description: 'Viewed financial statements',
    timestamp: new Date(Date.now() - 900000),
    type: 'view',
  },
]

interface CollaborationFeaturesProps {
  users?: User[]
  comments?: Comment[]
  activities?: Activity[]
  onAddComment?: (content: string, mentions: string[]) => void
  onResolveComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
  className?: string
}

export function CollaborationFeatures({
  users = mockUsers,
  comments = mockComments,
  activities = mockActivities,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  className,
}: CollaborationFeaturesProps) {
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>(
    users.filter(u => u.status === 'online').map(u => ({ ...u }))
  )
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [activitiesOpen, setActivitiesOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [mentionDialog, setMentionDialog] = useState(false)
  const [selectedMentions, setSelectedMentions] = useState<string[]>([])
  const [commentMenuAnchor, setCommentMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedComment, setSelectedComment] = useState<string>('')

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPresenceUsers(prev => prev.map(user => ({
        ...user,
        cursor: {
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e'
      case 'away': return '#f59e0b'
      case 'offline': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return <Edit sx={{ fontSize: 16 }} />
      case 'comment': return <Comment sx={{ fontSize: 16 }} />
      case 'approval': return <Check sx={{ fontSize: 16 }} />
      case 'view': return <Visibility sx={{ fontSize: 16 }} />
      case 'share': return <Send sx={{ fontSize: 16 }} />
      default: return <History sx={{ fontSize: 16 }} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'edit': return '#3b82f6'
      case 'comment': return '#f59e0b'
      case 'approval': return '#22c55e'
      case 'view': return '#6b7280'
      case 'share': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment, selectedMentions)
      setNewComment('')
      setSelectedMentions([])
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  const renderPresenceIndicator = (user: PresenceUser) => (
    <Zoom key={user.id} in={true}>
      <Tooltip title={`${user.name} is here`} arrow>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.8rem',
            backgroundColor: '#486581',
            border: `2px solid ${getStatusColor(user.status)}`,
            position: 'relative',
            cursor: 'pointer',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundColor: getStatusColor(user.status),
              borderRadius: '50%',
              bottom: -2,
              right: -2,
              border: '2px solid white',
            },
          }}
        >
          {user.avatar}
        </Avatar>
      </Tooltip>
    </Zoom>
  )

  return (
    <Box className={className}>
      {/* Presence Indicators */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Active Users:
            </Typography>
            <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
              {presenceUsers.map(user => renderPresenceIndicator(user))}
            </AvatarGroup>
            <Typography variant="caption" color="text.secondary">
              {presenceUsers.length} online
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Comments">
              <IconButton 
                onClick={() => setCommentsOpen(!commentsOpen)}
                sx={{ color: commentsOpen ? '#486581' : '#6b7280' }}
              >
                <Badge badgeContent={comments.filter(c => !c.resolved).length} color="error">
                  <Chat />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Activity Feed">
              <IconButton 
                onClick={() => setActivitiesOpen(!activitiesOpen)}
                sx={{ color: activitiesOpen ? '#486581' : '#6b7280' }}
              >
                <Badge badgeContent={activities.length} color="primary">
                  <History />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Invite Users">
              <IconButton sx={{ color: '#6b7280' }}>
                <PersonAdd />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Comments Panel */}
      {commentsOpen && (
        <Fade in={commentsOpen}>
          <Paper elevation={2} sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Comments & Discussion
              </Typography>
            </Box>
            
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {comments.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No comments yet. Start a discussion!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ py: 0 }}>
                  {comments.map((comment) => (
                    <Box key={comment.id}>
                      <ListItem
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          py: 2,
                          backgroundColor: comment.resolved ? '#f0fdf4' : 'transparent',
                        }}
                      >
                        <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: '#486581' }}>
                              {comment.user.avatar}
                            </Avatar>
                          </ListItemAvatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {comment.user.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {formatTimeAgo(comment.timestamp)}
                                </Typography>
                                {comment.resolved && (
                                  <Chip
                                    label="Resolved"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#22c55e',
                                      color: 'white',
                                      fontSize: '0.7rem',
                                      height: 18,
                                    }}
                                  />
                                )}
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    setCommentMenuAnchor(e.currentTarget)
                                    setSelectedComment(comment.id)
                                  }}
                                >
                                  <MoreVert sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {comment.content}
                            </Typography>
                            
                            {comment.mentions.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                                {comment.mentions.map((mention, index) => (
                                  <Chip
                                    key={index}
                                    label={`@${mention}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#e0f2fe',
                                      color: '#0277bd',
                                      fontSize: '0.7rem',
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                startIcon={<Reply />}
                                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                              >
                                Reply
                              </Button>
                              {!comment.resolved && (
                                <Button
                                  size="small"
                                  startIcon={<Check />}
                                  onClick={() => onResolveComment?.(comment.id)}
                                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                                >
                                  Resolve
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <Box sx={{ ml: 6, mt: 2, width: 'calc(100% - 48px)' }}>
                            {comment.replies.map((reply) => (
                              <Box key={reply.id} sx={{ mb: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {reply.user.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatTimeAgo(reply.timestamp)}
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  {reply.content}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                </List>
              )}
            </Box>
            
            {/* Add Comment */}
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  multiline
                  maxRows={3}
                  fullWidth
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleAddComment()
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    backgroundColor: '#486581',
                    '&:hover': { backgroundColor: '#334e68' },
                  }}
                >
                  <Send sx={{ fontSize: 16 }} />
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Press Ctrl+Enter to send • Use @username to mention someone
              </Typography>
            </Box>
          </Paper>
        </Fade>
      )}

      {/* Activity Feed */}
      {activitiesOpen && (
        <Fade in={activitiesOpen}>
          <Paper elevation={2} sx={{ mb: 2, borderRadius: '8px', overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
            </Box>
            
            <List sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
              {activities.map((activity) => (
                <ListItem key={activity.id} sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: getActivityColor(activity.type),
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          {activity.user.name}
                        </Box>{' '}
                        {activity.action} {activity.description}
                      </Typography>
                    }
                    secondary={formatTimeAgo(activity.timestamp)}
                  />
                  <ListItemSecondaryAction>
                    <FiberManualRecord
                      sx={{
                        fontSize: 8,
                        color: getActivityColor(activity.type),
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      )}

      {/* Comment Actions Menu */}
      <Menu
        anchorEl={commentMenuAnchor}
        open={Boolean(commentMenuAnchor)}
        onClose={() => setCommentMenuAnchor(null)}
      >
        <MenuItem onClick={() => setCommentMenuAnchor(null)}>
          <Edit sx={{ mr: 1, fontSize: 16 }} />
          Edit Comment
        </MenuItem>
        <MenuItem onClick={() => setCommentMenuAnchor(null)}>
          <Reply sx={{ mr: 1, fontSize: 16 }} />
          Reply
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteComment?.(selectedComment)
            setCommentMenuAnchor(null)
          }}
          sx={{ color: '#ef4444' }}
        >
          <Delete sx={{ mr: 1, fontSize: 16 }} />
          Delete Comment
        </MenuItem>
      </Menu>

      {/* Mention Dialog */}
      <Dialog
        open={mentionDialog}
        onClose={() => setMentionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mention Users</DialogTitle>
        <DialogContent>
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => {
                  const newMentions = selectedMentions.includes(user.name)
                    ? selectedMentions.filter(m => m !== user.name)
                    : [...selectedMentions, user.name]
                  setSelectedMentions(newMentions)
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: '#486581' }}>
                    {user.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.role}
                />
                <ListItemSecondaryAction>
                  {selectedMentions.includes(user.name) && (
                    <Check sx={{ color: '#22c55e' }} />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMentionDialog(false)}>Cancel</Button>
          <Button
            onClick={() => setMentionDialog(false)}
            variant="contained"
            sx={{ backgroundColor: '#486581' }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}