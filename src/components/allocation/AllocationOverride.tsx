'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import {
  Security,
  Edit,
  Save,
  Cancel,
  History,
  Warning,
  CheckCircle,
  Person,
  Schedule,
  Comment,
  Gavel,
  VpnKey,
} from '@mui/icons-material'

interface OverrideRequest {
  id: string
  accountName: string
  originalAmount: number
  overrideAmount: number
  reason: string
  justification: string
  requestedBy: string
  requestedDate: Date
  approvalStatus: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedDate?: Date
  comments: OverrideComment[]
}

interface OverrideComment {
  id: string
  author: string
  authorRole: string
  timestamp: Date
  comment: string
  type: 'comment' | 'approval' | 'rejection'
}

interface AuthorizationLevel {
  role: string
  maxAmount: number
  description: string
  approvers: string[]
}

const mockAuthorizationLevels: AuthorizationLevel[] = [
  {
    role: 'Finance Analyst',
    maxAmount: 10000,
    description: 'Can override allocations up to $10K',
    approvers: ['Finance Manager'],
  },
  {
    role: 'Finance Manager',
    maxAmount: 50000,
    description: 'Can approve overrides up to $50K',
    approvers: ['Finance Director'],
  },
  {
    role: 'Finance Director',
    maxAmount: 200000,
    description: 'Can approve overrides up to $200K',
    approvers: ['CFO'],
  },
  {
    role: 'CFO',
    maxAmount: Infinity,
    description: 'Can approve any override amount',
    approvers: [],
  },
]

const mockOverrideRequests: OverrideRequest[] = [
  {
    id: '1',
    accountName: 'Sales Department - IT Costs',
    originalAmount: 150000,
    overrideAmount: 120000,
    reason: 'Budget Constraint',
    justification: 'Sales department budget was reduced mid-quarter due to market conditions. Need to adjust IT allocation accordingly.',
    requestedBy: 'John Doe',
    requestedDate: new Date('2025-09-05T14:30:00'),
    approvalStatus: 'pending',
    comments: [
      {
        id: '1',
        author: 'John Doe',
        authorRole: 'Finance Analyst',
        timestamp: new Date('2025-09-05T14:30:00'),
        comment: 'Requesting override due to Sales budget reduction. Finance Director approved the budget change.',
        type: 'comment',
      },
    ],
  },
  {
    id: '2',
    accountName: 'Marketing - Facilities Cost',
    originalAmount: 52060,
    overrideAmount: 45000,
    reason: 'Space Optimization',
    justification: 'Marketing team moved to smaller office space as part of hybrid work initiative. Allocation should reflect actual space usage.',
    requestedBy: 'Sarah Johnson',
    requestedDate: new Date('2025-09-04T10:15:00'),
    approvalStatus: 'approved',
    approvedBy: 'Emily Chen',
    approvedDate: new Date('2025-09-04T16:45:00'),
    comments: [
      {
        id: '2',
        author: 'Sarah Johnson',
        authorRole: 'Finance Manager',
        timestamp: new Date('2025-09-04T10:15:00'),
        comment: 'Marketing has reduced their physical footprint by 15%. This override reflects the actual space usage.',
        type: 'comment',
      },
      {
        id: '3',
        author: 'Emily Chen',
        authorRole: 'Finance Director',
        timestamp: new Date('2025-09-04T16:45:00'),
        comment: 'Approved. Facilities team confirmed the space reduction. Override is justified.',
        type: 'approval',
      },
    ],
  },
]

interface AllocationOverrideProps {
  userRole?: string
  className?: string
}

export function AllocationOverride({ 
  userRole = 'Finance Manager',
  className 
}: AllocationOverrideProps) {
  const [overrideRequests, setOverrideRequests] = useState<OverrideRequest[]>(mockOverrideRequests)
  const [newOverrideDialog, setNewOverrideDialog] = useState(false)
  const [authorizationDialog, setAuthorizationDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<OverrideRequest | null>(null)
  const [newOverride, setNewOverride] = useState({
    accountName: '',
    originalAmount: 0,
    overrideAmount: 0,
    reason: '',
    justification: '',
  })

  const currentUserAuth = mockAuthorizationLevels.find(level => level.role === userRole)

  const handleCreateOverride = () => {
    const overrideAmount = Math.abs(newOverride.overrideAmount - newOverride.originalAmount)
    
    if (currentUserAuth && overrideAmount > currentUserAuth.maxAmount) {
      setAuthorizationDialog(true)
      return
    }

    const request: OverrideRequest = {
      id: Date.now().toString(),
      ...newOverride,
      requestedBy: 'Current User',
      requestedDate: new Date(),
      approvalStatus: overrideAmount <= (currentUserAuth?.maxAmount || 0) ? 'approved' : 'pending',
      approvedBy: overrideAmount <= (currentUserAuth?.maxAmount || 0) ? 'Current User' : undefined,
      approvedDate: overrideAmount <= (currentUserAuth?.maxAmount || 0) ? new Date() : undefined,
      comments: [
        {
          id: Date.now().toString(),
          author: 'Current User',
          authorRole: userRole,
          timestamp: new Date(),
          comment: newOverride.justification,
          type: 'comment',
        },
      ],
    }

    setOverrideRequests(prev => [request, ...prev])
    setNewOverrideDialog(false)
    setNewOverride({
      accountName: '',
      originalAmount: 0,
      overrideAmount: 0,
      reason: '',
      justification: '',
    })
  }

  const handleApproval = (requestId: string, approved: boolean, comment: string) => {
    setOverrideRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const newComment: OverrideComment = {
          id: Date.now().toString(),
          author: 'Current User',
          authorRole: userRole,
          timestamp: new Date(),
          comment,
          type: approved ? 'approval' : 'rejection',
        }

        return {
          ...request,
          approvalStatus: approved ? 'approved' : 'rejected',
          approvedBy: approved ? 'Current User' : undefined,
          approvedDate: approved ? new Date() : undefined,
          comments: [...request.comments, newComment],
        }
      }
      return request
    }))
  }

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e'
      case 'rejected': return '#ef4444'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getVarianceAmount = (original: number, override: number) => {
    return override - original
  }

  const getVariancePercent = (original: number, override: number) => {
    return ((override - original) / original) * 100
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Allocation Override Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Request and approve allocation overrides with proper authorization controls
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Security />}
              onClick={() => setAuthorizationDialog(true)}
              sx={{ textTransform: 'none' }}
            >
              Authorization Matrix
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setNewOverrideDialog(true)}
              sx={{
                textTransform: 'none',
                backgroundColor: '#486581',
                '&:hover': {
                  backgroundColor: '#334e68',
                },
              }}
            >
              Request Override
            </Button>
          </Box>
        </Box>

        {/* User Authorization Info */}
        <Alert severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <VpnKey sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Your Authorization Level: {userRole}
            </Typography>
            <Typography variant="body2">
              • Maximum Override: {currentUserAuth ? formatCurrency(currentUserAuth.maxAmount) : 'None'}
            </Typography>
          </Box>
        </Alert>
      </Paper>

      {/* Override Requests Table */}
      <Paper elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafbfc' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Override Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {overrideRequests.filter(r => r.approvalStatus === 'pending').length} pending • {overrideRequests.length} total
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Original</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Override</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Variance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Requested By</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overrideRequests.map((request) => {
                const variance = getVarianceAmount(request.originalAmount, request.overrideAmount)
                const variancePercent = getVariancePercent(request.originalAmount, request.overrideAmount)

                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {request.accountName}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                      {formatCurrency(request.originalAmount)}
                    </TableCell>
                    
                    <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {formatCurrency(request.overrideAmount)}
                    </TableCell>
                    
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontWeight: 600,
                            color: variance >= 0 ? '#22c55e' : '#ef4444',
                          }}
                        >
                          {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                        </Typography>
                        <Chip
                          label={`${variancePercent >= 0 ? '+' : ''}${variancePercent.toFixed(1)}%`}
                          size="small"
                          sx={{
                            backgroundColor: variancePercent >= 0 ? '#dcfce7' : '#fee2e2',
                            color: variancePercent >= 0 ? '#166534' : '#991b1b',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">{request.reason}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.requestedBy}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.requestedDate.toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={request.approvalStatus.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(request.approvalStatus)}20`,
                          color: getStatusColor(request.approvalStatus),
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <History sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        
                        {request.approvalStatus === 'pending' && (
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              onClick={() => handleApproval(request.id, true, 'Approved via quick action')}
                              sx={{ color: '#22c55e' }}
                            >
                              <CheckCircle sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* New Override Dialog */}
      <Dialog
        open={newOverrideDialog}
        onClose={() => setNewOverrideDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Request Allocation Override</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Account Name"
              value={newOverride.accountName}
              onChange={(e) => setNewOverride(prev => ({ ...prev, accountName: e.target.value }))}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Original Amount"
                type="number"
                value={newOverride.originalAmount}
                onChange={(e) => setNewOverride(prev => ({ ...prev, originalAmount: parseFloat(e.target.value) || 0 }))}
                InputProps={{ startAdornment: '$' }}
                fullWidth
              />
              <TextField
                label="Override Amount"
                type="number"
                value={newOverride.overrideAmount}
                onChange={(e) => setNewOverride(prev => ({ ...prev, overrideAmount: parseFloat(e.target.value) || 0 }))}
                InputProps={{ startAdornment: '$' }}
                fullWidth
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Reason for Override</InputLabel>
              <Select
                value={newOverride.reason}
                label="Reason for Override"
                onChange={(e) => setNewOverride(prev => ({ ...prev, reason: e.target.value }))}
              >
                <MenuItem value="Budget Constraint">Budget Constraint</MenuItem>
                <MenuItem value="Space Optimization">Space Optimization</MenuItem>
                <MenuItem value="Headcount Change">Headcount Change</MenuItem>
                <MenuItem value="Business Restructure">Business Restructure</MenuItem>
                <MenuItem value="Market Conditions">Market Conditions</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Detailed Justification"
              value={newOverride.justification}
              onChange={(e) => setNewOverride(prev => ({ ...prev, justification: e.target.value }))}
              multiline
              rows={4}
              placeholder="Provide detailed justification for this override request..."
              fullWidth
            />
            
            {/* Authorization Check */}
            {newOverride.originalAmount > 0 && newOverride.overrideAmount > 0 && (
              <Alert 
                severity={Math.abs(newOverride.overrideAmount - newOverride.originalAmount) > (currentUserAuth?.maxAmount || 0) ? 'warning' : 'success'}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Authorization Check
                </Typography>
                <Typography variant="body2">
                  Override amount: {formatCurrency(Math.abs(newOverride.overrideAmount - newOverride.originalAmount))}
                  {Math.abs(newOverride.overrideAmount - newOverride.originalAmount) > (currentUserAuth?.maxAmount || 0) 
                    ? ' • Requires additional approval'
                    : ' • Within your authorization limit'
                  }
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewOverrideDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateOverride}
            variant="contained"
            disabled={!newOverride.accountName || !newOverride.justification}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Authorization Matrix Dialog */}
      <Dialog
        open={authorizationDialog}
        onClose={() => setAuthorizationDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle>Authorization Matrix</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Override approval limits by role
          </Typography>
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Max Override</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Requires Approval From</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAuthorizationLevels.map((level, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    backgroundColor: level.role === userRole ? 'rgba(72, 101, 129, 0.08)' : 'transparent',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: level.role === userRole ? 700 : 500 }}>
                        {level.role}
                      </Typography>
                      {level.role === userRole && (
                        <Chip label="Your Role" size="small" sx={{ backgroundColor: '#486581', color: 'white' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {level.maxAmount === Infinity ? 'Unlimited' : formatCurrency(level.maxAmount)}
                  </TableCell>
                  <TableCell>{level.description}</TableCell>
                  <TableCell>
                    {level.approvers.length > 0 ? level.approvers.join(', ') : 'None required'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthorizationDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '12px' } }}
        >
          <DialogTitle>Override Request Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Override Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Account</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedRequest.accountName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Reason</Typography>
                        <Typography variant="body2">{selectedRequest.reason}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Justification</Typography>
                        <Typography variant="body2">{selectedRequest.justification}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Comments & Timeline
                    </Typography>
                    <List dense>
                      {selectedRequest.comments.map((comment) => (
                        <ListItem key={comment.id} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                              {comment.author.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {comment.author}
                                </Typography>
                                <Chip
                                  label={comment.authorRole}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 18 }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                  {comment.comment}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {comment.timestamp.toLocaleString()}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRequest(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}