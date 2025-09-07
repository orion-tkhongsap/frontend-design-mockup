'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  CheckCircle,
  Schedule,
  Error,
  Warning,
  Person,
  Comment,
  Send,
  Visibility,
  PlayArrow,
  Pause,
  FastForward,
  Assignment,
} from '@mui/icons-material'

interface WorkflowStep {
  id: string
  name: string
  description: string
  assignee: string
  assigneeRole: string
  status: 'completed' | 'in-progress' | 'pending' | 'blocked' | 'skipped'
  completedDate?: Date
  estimatedDays: number
  actualDays?: number
  requirements: string[]
  dependencies: string[]
}

interface WorkflowComment {
  id: string
  author: string
  authorRole: string
  timestamp: Date
  comment: string
  stepId: string
  type: 'comment' | 'approval' | 'rejection' | 'escalation'
}

interface BudgetWorkflow {
  id: string
  budgetName: string
  department: string
  submittedBy: string
  submittedDate: Date
  targetCompletionDate: Date
  currentStep: number
  status: 'draft' | 'in-review' | 'approved' | 'rejected' | 'needs-revision'
  priority: 'low' | 'medium' | 'high' | 'critical'
  steps: WorkflowStep[]
  comments: WorkflowComment[]
  totalAmount: number
}

const mockWorkflow: BudgetWorkflow = {
  id: '1',
  budgetName: 'Marketing Department - 2026 Operating Budget',
  department: 'Marketing',
  submittedBy: 'John Doe',
  submittedDate: new Date('2025-09-01T09:00:00'),
  targetCompletionDate: new Date('2025-09-15T17:00:00'),
  currentStep: 2,
  status: 'in-review',
  priority: 'high',
  totalAmount: 1250000,
  steps: [
    {
      id: '1',
      name: 'Initial Submission',
      description: 'Budget submitted by department head',
      assignee: 'John Doe',
      assigneeRole: 'Marketing Manager',
      status: 'completed',
      completedDate: new Date('2025-09-01T09:00:00'),
      estimatedDays: 1,
      actualDays: 1,
      requirements: ['Complete budget form', 'Include justifications'],
      dependencies: [],
    },
    {
      id: '2',
      name: 'Finance Review',
      description: 'Finance team reviews budget for completeness and accuracy',
      assignee: 'Sarah Johnson',
      assigneeRole: 'Finance Analyst',
      status: 'completed',
      completedDate: new Date('2025-09-03T14:30:00'),
      estimatedDays: 2,
      actualDays: 2,
      requirements: ['Verify calculations', 'Check historical trends', 'Validate assumptions'],
      dependencies: ['1'],
    },
    {
      id: '3',
      name: 'Director Approval',
      description: 'Department director reviews and approves budget',
      assignee: 'Emily Chen',
      assigneeRole: 'Finance Director',
      status: 'in-progress',
      estimatedDays: 3,
      requirements: ['Review strategic alignment', 'Approve major items', 'Sign off on budget'],
      dependencies: ['2'],
    },
    {
      id: '4',
      name: 'CFO Review',
      description: 'CFO final review for budgets over $1M',
      assignee: 'Michael Rodriguez',
      assigneeRole: 'CFO',
      status: 'pending',
      estimatedDays: 2,
      requirements: ['Strategic review', 'Cross-department analysis', 'Final approval'],
      dependencies: ['3'],
    },
    {
      id: '5',
      name: 'Budget Integration',
      description: 'Integrate approved budget into master budget',
      assignee: 'Finance Team',
      assigneeRole: 'Budget Analyst',
      status: 'pending',
      estimatedDays: 1,
      requirements: ['Update budget systems', 'Generate reports', 'Notify stakeholders'],
      dependencies: ['4'],
    },
  ],
  comments: [
    {
      id: '1',
      author: 'John Doe',
      authorRole: 'Marketing Manager',
      timestamp: new Date('2025-09-01T09:00:00'),
      comment: 'Initial budget submission for 2026. Includes 15% increase for digital marketing initiatives.',
      stepId: '1',
      type: 'comment',
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      authorRole: 'Finance Analyst',
      timestamp: new Date('2025-09-03T14:30:00'),
      comment: 'Budget reviewed and validated. All calculations are correct. Forwarding to Director for approval.',
      stepId: '2',
      type: 'approval',
    },
    {
      id: '3',
      author: 'Emily Chen',
      authorRole: 'Finance Director',
      timestamp: new Date('2025-09-04T11:15:00'),
      comment: 'Reviewing the digital marketing budget increase. Need clarification on ROI projections.',
      stepId: '3',
      type: 'comment',
    },
  ],
}

interface WorkflowTrackerProps {
  workflow?: BudgetWorkflow
  onAddComment?: (stepId: string, comment: string) => void
  onStepAction?: (stepId: string, action: 'approve' | 'reject' | 'escalate') => void
  className?: string
}

export function WorkflowTracker({ 
  workflow = mockWorkflow,
  onAddComment,
  onStepAction,
  className 
}: WorkflowTrackerProps) {
  const [commentDialog, setCommentDialog] = useState(false)
  const [selectedStep, setSelectedStep] = useState<string>('')
  const [newComment, setNewComment] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e'
      case 'in-progress': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'blocked': return '#ef4444'
      case 'skipped': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />
      case 'in-progress': return <PlayArrow />
      case 'pending': return <Schedule />
      case 'blocked': return <Error />
      case 'skipped': return <FastForward />
      default: return <Schedule />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#65a30d'
      default: return '#6b7280'
    }
  }

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e'
      case 'rejected': return '#ef4444'
      case 'in-review': return '#3b82f6'
      case 'needs-revision': return '#f59e0b'
      case 'draft': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`
  }

  const calculateProgress = () => {
    const completedSteps = workflow.steps.filter(step => step.status === 'completed').length
    return (completedSteps / workflow.steps.length) * 100
  }

  const getDaysRemaining = () => {
    const now = new Date()
    const target = workflow.targetCompletionDate
    const diffTime = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAddComment = () => {
    if (newComment.trim() && selectedStep) {
      onAddComment?.(selectedStep, newComment)
      setNewComment('')
      setCommentDialog(false)
      setSelectedStep('')
    }
  }

  const daysRemaining = getDaysRemaining()
  const progressPercent = calculateProgress()
  const currentStepData = workflow.steps[workflow.currentStep]

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {workflow.budgetName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Submitted by {workflow.submittedBy} • {workflow.submittedDate.toLocaleDateString()}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={workflow.status.replace('-', ' ').toUpperCase()}
                sx={{
                  backgroundColor: `${getWorkflowStatusColor(workflow.status)}20`,
                  color: getWorkflowStatusColor(workflow.status),
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`${workflow.priority.toUpperCase()} PRIORITY`}
                sx={{
                  backgroundColor: `${getPriorityColor(workflow.priority)}20`,
                  color: getPriorityColor(workflow.priority),
                  fontWeight: 600,
                }}
              />
              <Chip
                label={formatCurrency(workflow.totalAmount)}
                sx={{
                  backgroundColor: '#f0f4f8',
                  color: '#374151',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: daysRemaining < 0 ? '#ef4444' : '#486581' }}>
              {Math.abs(daysRemaining)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {daysRemaining < 0 ? 'days overdue' : 'days remaining'}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Workflow Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progressPercent)}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: progressPercent === 100 ? '#22c55e' : '#486581',
              },
            }}
          />
        </Box>

        <Alert severity={daysRemaining < 0 ? 'error' : daysRemaining < 2 ? 'warning' : 'info'}>
          <Typography variant="body2">
            <strong>Current Step:</strong> {currentStepData?.name} • Assigned to {currentStepData?.assignee}
            {daysRemaining < 0 && ' • Workflow is overdue'}
          </Typography>
        </Alert>
      </Paper>

      <Grid container spacing={3}>
        {/* Workflow Steps */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Approval Workflow
            </Typography>

            <Stepper orientation="vertical" connector={<StepConnector />}>
              {workflow.steps.map((step, index) => (
                <Step key={step.id} active={index <= workflow.currentStep}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: getStatusColor(step.status),
                          color: 'white',
                        }}
                      >
                        {getStatusIcon(step.status)}
                      </Box>
                    )}
                  >
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {step.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {step.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {step.assignee.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {step.assignee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {step.assigneeRole}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Chip
                          label={step.status.replace('-', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(step.status)}20`,
                            color: getStatusColor(step.status),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      {step.status === 'completed' && step.completedDate && (
                        <Typography variant="caption" color="text.secondary">
                          Completed: {step.completedDate.toLocaleDateString()} 
                          {step.actualDays && ` (${step.actualDays} days)`}
                        </Typography>
                      )}

                      {step.requirements.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                            Requirements:
                          </Typography>
                          {step.requirements.map((req, reqIndex) => (
                            <Typography key={reqIndex} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              • {req}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {step.status === 'in-progress' && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            startIcon={<Comment />}
                            onClick={() => {
                              setSelectedStep(step.id)
                              setCommentDialog(true)
                            }}
                            sx={{ textTransform: 'none' }}
                          >
                            Add Comment
                          </Button>
                          <Button
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => onStepAction?.(step.id, 'approve')}
                            sx={{ textTransform: 'none', color: '#22c55e' }}
                          >
                            Approve
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Comments Timeline */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Comments & Activity
            </Typography>

            <Timeline>
              {workflow.comments.map((comment, index) => (
                <TimelineItem key={comment.id}>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        backgroundColor: comment.type === 'approval' ? '#22c55e' : 
                                        comment.type === 'rejection' ? '#ef4444' : '#3b82f6',
                      }}
                    >
                      {comment.type === 'approval' ? <CheckCircle sx={{ fontSize: 16 }} /> :
                       comment.type === 'rejection' ? <Error sx={{ fontSize: 16 }} /> :
                       <Comment sx={{ fontSize: 16 }} />}
                    </TimelineDot>
                    {index < workflow.comments.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {comment.author}
                        </Typography>
                        <Chip
                          label={comment.authorRole}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 18 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {comment.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Comment />}
              onClick={() => setCommentDialog(true)}
              sx={{ textTransform: 'none', mt: 2 }}
            >
              Add Comment
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Comment Dialog */}
      <Dialog
        open={commentDialog}
        onClose={() => setCommentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            label="Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Add your comment or feedback..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}