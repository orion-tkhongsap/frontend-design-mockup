'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Badge,
  Collapse,
  Alert,
} from '@mui/material'
import {
  Send,
  Reply,
  MoreVert,
  Edit,
  Delete,
  Flag,
  Visibility,
  VisibilityOff,
  AttachFile,
  EmojiEmotions,
  Notifications,
  NotificationsOff,
} from '@mui/icons-material'

interface User {
  id: string
  name: string
  role: string
  avatar: string
  department: string
}

interface Comment {
  id: string
  author: User
  content: string
  timestamp: Date
  mentions: string[]
  replies: Comment[]
  isResolved: boolean
  isEdited: boolean
  editedAt?: Date
  attachments: string[]
  reactions: { [emoji: string]: string[] }
}

interface Thread {
  id: string
  title: string
  category: 'budget-review' | 'question' | 'issue' | 'suggestion'
  status: 'open' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assignee?: User
  watchers: string[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', role: 'Marketing Manager', avatar: 'JD', department: 'Marketing' },
  { id: '2', name: 'Sarah Johnson', role: 'Finance Analyst', avatar: 'SJ', department: 'Finance' },
  { id: '3', name: 'Emily Chen', role: 'Finance Director', avatar: 'EC', department: 'Finance' },
  { id: '4', name: 'Michael Rodriguez', role: 'CFO', avatar: 'MR', department: 'Finance' },
  { id: '5', name: 'David Wilson', role: 'Budget Analyst', avatar: 'DW', department: 'Finance' },
]

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Digital Marketing Budget Increase',
    category: 'budget-review',
    status: 'open',
    priority: 'high',
    assignee: mockUsers[2],
    watchers: ['2', '3', '4'],
    createdAt: new Date('2025-09-04T10:30:00'),
    updatedAt: new Date('2025-09-06T14:15:00'),
    comments: [
      {
        id: '1',
        author: mockUsers[0],
        content: '@Emily Chen Can you review the 15% increase in digital marketing budget? This is driven by our Q4 product launch campaign and the need to compete more aggressively in paid search.',
        timestamp: new Date('2025-09-04T10:30:00'),
        mentions: ['3'],
        replies: [
          {
            id: '2',
            author: mockUsers[2],
            content: '@John Doe Thanks for the context. The increase looks reasonable given the market conditions. @Sarah Johnson can you validate the ROI projections?',
            timestamp: new Date('2025-09-04T15:45:00'),
            mentions: ['1', '2'],
            replies: [],
            isResolved: false,
            isEdited: false,
            attachments: [],
            reactions: { '👍': ['1', '4'] },
          },
        ],
        isResolved: false,
        isEdited: false,
        attachments: ['Q4_Marketing_Strategy.pdf'],
        reactions: { '👍': ['2', '3'], '👀': ['4'] },
      },
    ],
  },
  {
    id: '2',
    title: 'Personnel Cost Variance Question',
    category: 'question',
    status: 'resolved',
    priority: 'medium',
    watchers: ['1', '2'],
    createdAt: new Date('2025-09-05T09:00:00'),
    updatedAt: new Date('2025-09-05T16:30:00'),
    comments: [
      {
        id: '3',
        author: mockUsers[1],
        content: 'I noticed a 8% variance in personnel costs compared to last year. Is this due to the new hires or salary adjustments?',
        timestamp: new Date('2025-09-05T09:00:00'),
        mentions: [],
        replies: [
          {
            id: '4',
            author: mockUsers[0],
            content: 'Good catch @Sarah Johnson! It\'s primarily due to 3 new hires in Q2 plus the annual 3% salary increase. I can provide the detailed breakdown if needed.',
            timestamp: new Date('2025-09-05T16:30:00'),
            mentions: ['2'],
            replies: [],
            isResolved: true,
            isEdited: false,
            attachments: [],
            reactions: { '✅': ['2'] },
          },
        ],
        isResolved: true,
        isEdited: false,
        attachments: [],
        reactions: {},
      },
    ],
  },
]

interface CommentingSystemProps {
  budgetId?: string
  currentUser?: User
  className?: string
}

export function CommentingSystem({ 
  budgetId = '1',
  currentUser = mockUsers[0],
  className 
}: CommentingSystemProps) {
  const [threads, setThreads] = useState<Thread[]>(mockThreads)
  const [selectedThread, setSelectedThread] = useState<string>('')
  const [newThreadDialog, setNewThreadDialog] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string>('')
  const [editingComment, setEditingComment] = useState<string>('')
  const [mentionSearch, setMentionSearch] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedComment, setSelectedComment] = useState<string>('')
  const textFieldRef = useRef<HTMLInputElement>(null)

  const filteredUsers = mentionSearch 
    ? mockUsers.filter(user => 
        user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        user.role.toLowerCase().includes(mentionSearch.toLowerCase())
      )
    : mockUsers

  const handleMentionSelect = (user: User) => {
    const atIndex = newComment.lastIndexOf('@')
    const beforeMention = newComment.substring(0, atIndex)
    const afterMention = newComment.substring(atIndex + mentionSearch.length + 1)
    setNewComment(`${beforeMention}@${user.name} ${afterMention}`)
    setShowMentions(false)
    setMentionSearch('')
    textFieldRef.current?.focus()
  }

  const handleCommentChange = (value: string) => {
    setNewComment(value)
    
    // Check for @ mentions
    const atIndex = value.lastIndexOf('@')
    if (atIndex !== -1) {
      const afterAt = value.substring(atIndex + 1)
      const spaceIndex = afterAt.indexOf(' ')
      const searchTerm = spaceIndex === -1 ? afterAt : afterAt.substring(0, spaceIndex)
      
      if (searchTerm.length > 0 && spaceIndex === -1) {
        setMentionSearch(searchTerm)
        setShowMentions(true)
      } else {
        setShowMentions(false)
        setMentionSearch('')
      }
    } else {
      setShowMentions(false)
      setMentionSearch('')
    }
  }

  const addComment = (threadId: string, parentId?: string) => {
    if (!newComment.trim()) return

    // Extract mentions
    const mentionRegex = /@(\w+\s+\w+)/g
    const mentions: string[] = []
    let match
    while ((match = mentionRegex.exec(newComment)) !== null) {
      const user = mockUsers.find(u => u.name === match[1])
      if (user) mentions.push(user.id)
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: newComment,
      timestamp: new Date(),
      mentions,
      replies: [],
      isResolved: false,
      isEdited: false,
      attachments: [],
      reactions: {},
    }

    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        if (parentId) {
          // Add reply to existing comment
          const addReplyToComment = (comments: Comment[]): Comment[] => {
            return comments.map(c => {
              if (c.id === parentId) {
                return { ...c, replies: [...c.replies, comment] }
              } else if (c.replies.length > 0) {
                return { ...c, replies: addReplyToComment(c.replies) }
              }
              return c
            })
          }
          return { ...thread, comments: addReplyToComment(thread.comments), updatedAt: new Date() }
        } else {
          // Add new top-level comment
          return { ...thread, comments: [...thread.comments, comment], updatedAt: new Date() }
        }
      }
      return thread
    }))

    setNewComment('')
    setReplyingTo('')
    setShowMentions(false)
  }

  const addReaction = (commentId: string, emoji: string) => {
    setThreads(prev => prev.map(thread => ({
      ...thread,
      comments: updateCommentReactions(thread.comments, commentId, emoji, currentUser.id)
    })))
  }

  const updateCommentReactions = (comments: Comment[], commentId: string, emoji: string, userId: string): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        const reactions = { ...comment.reactions }
        if (reactions[emoji]) {
          if (reactions[emoji].includes(userId)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== userId)
            if (reactions[emoji].length === 0) delete reactions[emoji]
          } else {
            reactions[emoji].push(userId)
          }
        } else {
          reactions[emoji] = [userId]
        }
        return { ...comment, reactions }
      } else if (comment.replies.length > 0) {
        return { ...comment, replies: updateCommentReactions(comment.replies, commentId, emoji, userId) }
      }
      return comment
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'budget-review': return '#3b82f6'
      case 'question': return '#22c55e'
      case 'issue': return '#ef4444'
      case 'suggestion': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#3b82f6'
      case 'resolved': return '#22c55e'
      case 'closed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return 'Just now'
  }

  const renderComment = (comment: Comment, threadId: string, depth: number = 0) => (
    <Box key={comment.id} sx={{ ml: depth * 3 }}>
      <Card sx={{ mb: 2, backgroundColor: depth > 0 ? '#f8fafc' : 'white' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', backgroundColor: '#486581' }}>
              {comment.author.avatar}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {comment.author.name}
                </Typography>
                <Chip
                  label={comment.author.role}
                  size="small"
                  sx={{ fontSize: '0.7rem', height: 18 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(comment.timestamp)}
                </Typography>
                {comment.isEdited && (
                  <Chip
                    label="edited"
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 16, backgroundColor: '#f0f4f8' }}
                  />
                )}
                {comment.isResolved && (
                  <Chip
                    label="resolved"
                    size="small"
                    sx={{ fontSize: '0.65rem', height: 16, backgroundColor: '#dcfce7', color: '#166534' }}
                  />
                )}
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.5 }}>
                {comment.content}
              </Typography>
              
              {comment.attachments.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  {comment.attachments.map((attachment, index) => (
                    <Chip
                      key={index}
                      icon={<AttachFile />}
                      label={attachment}
                      size="small"
                      clickable
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              )}
              
              {Object.keys(comment.reactions).length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                  {Object.entries(comment.reactions).map(([emoji, users]) => (
                    <Chip
                      key={emoji}
                      label={`${emoji} ${users.length}`}
                      size="small"
                      clickable
                      onClick={() => addReaction(comment.id, emoji)}
                      sx={{
                        fontSize: '0.75rem',
                        height: 22,
                        backgroundColor: users.includes(currentUser.id) ? '#e0f2fe' : '#f5f5f5',
                        '&:hover': { backgroundColor: '#e0f2fe' },
                      }}
                    />
                  ))}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Reply />}
                  onClick={() => setReplyingTo(comment.id)}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Reply
                </Button>
                <Button
                  size="small"
                  onClick={() => addReaction(comment.id, '👍')}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  👍
                </Button>
                <Button
                  size="small"
                  onClick={() => addReaction(comment.id, '👀')}
                  sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                >
                  👀
                </Button>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setMenuAnchor(e.currentTarget)
                    setSelectedComment(comment.id)
                  }}
                >
                  <MoreVert sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Replies */}
      {comment.replies.map(reply => renderComment(reply, threadId, depth + 1))}
      
      {/* Reply Form */}
      {replyingTo === comment.id && (
        <Box sx={{ ml: 3, mb: 2 }}>
          <Card sx={{ backgroundColor: '#f8fafc' }}>
            <CardContent sx={{ p: 2 }}>
              <TextField
                ref={textFieldRef}
                value={newComment}
                onChange={(e) => handleCommentChange(e.target.value)}
                placeholder={`Reply to ${comment.author.name}...`}
                multiline
                rows={2}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => addComment(threadId, comment.id)}
                  disabled={!newComment.trim()}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#486581',
                    '&:hover': { backgroundColor: '#334e68' },
                  }}
                >
                  Reply
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setReplyingTo('')
                    setNewComment('')
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Comments & Discussions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Collaborate on budget reviews with threaded conversations and @mentions
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setNewThreadDialog(true)}
            sx={{
              textTransform: 'none',
              backgroundColor: '#486581',
              '&:hover': { backgroundColor: '#334e68' },
            }}
          >
            New Discussion
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={`${threads.filter(t => t.status === 'open').length} Open`}
            sx={{ backgroundColor: '#e0f2fe', color: '#0277bd', fontWeight: 600 }}
          />
          <Chip
            label={`${threads.filter(t => t.status === 'resolved').length} Resolved`}
            sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}
          />
          <Chip
            label={`${threads.reduce((sum, t) => sum + t.comments.length + t.comments.reduce((s, c) => s + c.replies.length, 0), 0)} Comments`}
            sx={{ backgroundColor: '#f0f4f8', color: '#374151', fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* Discussion Threads */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {threads.map((thread) => (
          <Paper key={thread.id} elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafbfc' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {thread.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={thread.category.replace('-', ' ').toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: `${getCategoryColor(thread.category)}20`,
                        color: getCategoryColor(thread.category),
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Chip
                      label={thread.status.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(thread.status)}20`,
                        color: getStatusColor(thread.status),
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Chip
                      label={`${thread.priority.toUpperCase()} PRIORITY`}
                      size="small"
                      sx={{
                        backgroundColor: `${getPriorityColor(thread.priority)}20`,
                        color: getPriorityColor(thread.priority),
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {thread.assignee && (
                    <Tooltip title={`Assigned to ${thread.assignee.name}`}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {thread.assignee.avatar}
                      </Avatar>
                    </Tooltip>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(thread.updatedAt)}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {thread.comments.length + thread.comments.reduce((sum, c) => sum + c.replies.length, 0)} comments • 
                {thread.watchers.length} watchers
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              {thread.comments.map(comment => renderComment(comment, thread.id))}
              
              {/* Add Comment Form */}
              {!replyingTo && (
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    ref={textFieldRef}
                    value={newComment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    placeholder="Add a comment... Use @name to mention someone"
                    multiline
                    rows={3}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Mention Suggestions */}
                  {showMentions && (
                    <Paper
                      elevation={3}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {filteredUsers.map((user) => (
                        <Box
                          key={user.id}
                          onClick={() => handleMentionSelect(user)}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': { backgroundColor: '#f5f5f5' },
                          }}
                        >
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {user.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.role} • {user.department}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={() => addComment(thread.id)}
                      disabled={!newComment.trim()}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: '#486581',
                        '&:hover': { backgroundColor: '#334e68' },
                      }}
                    >
                      Comment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AttachFile />}
                      sx={{ textTransform: 'none' }}
                    >
                      Attach
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Comment Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setEditingComment(selectedComment)}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit
        </MenuItem>
        <MenuItem>
          <Flag sx={{ mr: 1, fontSize: 18 }} />
          Flag
        </MenuItem>
        <MenuItem sx={{ color: '#ef4444' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}