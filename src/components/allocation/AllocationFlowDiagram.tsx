'use client'

import React, { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  AccountTree,
  Visibility,
  VisibilityOff,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Download,
  Share,
} from '@mui/icons-material'

// Custom node component for allocation flow
const AllocationNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'source': return '#22c55e'
      case 'target': return '#3b82f6'
      case 'driver': return '#f59e0b'
      case 'rule': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'source': return '💰'
      case 'target': return '🎯'
      case 'driver': return '📊'
      case 'rule': return '⚙️'
      default: return '📦'
    }
  }

  return (
    <Card
      sx={{
        minWidth: 180,
        border: selected ? `3px solid ${getNodeColor(data.type)}` : `2px solid ${getNodeColor(data.type)}`,
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: selected ? `0 8px 25px ${getNodeColor(data.type)}30` : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ fontSize: '1.2rem' }}>{getNodeIcon(data.type)}</Box>
          <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
            {data.label}
          </Typography>
        </Box>
        
        <Chip
          label={data.type.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: `${getNodeColor(data.type)}20`,
            color: getNodeColor(data.type),
            fontWeight: 600,
            fontSize: '0.7rem',
            mb: 1,
          }}
        />
        
        {data.amount && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#374151' }}>
            ${data.amount.toLocaleString()}
          </Typography>
        )}
        
        {data.percentage && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#374151' }}>
            {data.percentage}%
          </Typography>
        )}
        
        {data.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {data.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

// Custom edge component with labels
const CustomEdge = ({ data }: { data: any }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#374151',
      }}
    >
      {data.label}
    </div>
  )
}

const nodeTypes = {
  allocationNode: AllocationNode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'allocationNode',
    position: { x: 100, y: 100 },
    data: {
      label: 'IT Department',
      type: 'source',
      amount: 500000,
      description: 'Total IT costs to allocate',
    },
  },
  {
    id: '2',
    type: 'allocationNode',
    position: { x: 400, y: 50 },
    data: {
      label: 'Employee Count',
      type: 'driver',
      description: 'Allocation driver',
    },
  },
  {
    id: '3',
    type: 'allocationNode',
    position: { x: 400, y: 150 },
    data: {
      label: 'Headcount Rule',
      type: 'rule',
      description: 'IT costs by employee count',
    },
  },
  {
    id: '4',
    type: 'allocationNode',
    position: { x: 700, y: 50 },
    data: {
      label: 'Sales Department',
      type: 'target',
      amount: 150000,
      percentage: 30,
      description: '45 employees',
    },
  },
  {
    id: '5',
    type: 'allocationNode',
    position: { x: 700, y: 150 },
    data: {
      label: 'Marketing',
      type: 'target',
      amount: 100000,
      percentage: 20,
      description: '30 employees',
    },
  },
  {
    id: '6',
    type: 'allocationNode',
    position: { x: 700, y: 250 },
    data: {
      label: 'R&D',
      type: 'target',
      amount: 200000,
      percentage: 40,
      description: '60 employees',
    },
  },
  {
    id: '7',
    type: 'allocationNode',
    position: { x: 700, y: 350 },
    data: {
      label: 'Finance',
      type: 'target',
      amount: 50000,
      percentage: 10,
      description: '15 employees',
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    label: 'uses driver',
    labelStyle: { fontSize: '0.75rem', fontWeight: 600 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    label: 'applies rule',
    labelStyle: { fontSize: '0.75rem', fontWeight: 600 },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    label: '30%',
    labelStyle: { fontSize: '0.75rem', fontWeight: 600, fill: '#22c55e' },
    style: { stroke: '#22c55e', strokeWidth: 3 },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    label: '20%',
    labelStyle: { fontSize: '0.75rem', fontWeight: 600, fill: '#3b82f6' },
    style: { stroke: '#3b82f6', strokeWidth: 3 },
  },
  {
    id: 'e3-6',
    source: '3',
    target: '6',
    type: 'smoothstep',
    label: '40%',
    labelStyle: { fontSize: '0.75rem', fontWeight: 600, fill: '#f59e0b' },
    style: { stroke: '#f59e0b', strokeWidth: 3 },
  },
  {
    id: 'e3-7',
    source: '3',
    target: '7',
    type: 'smoothstep',
    label: '10%',
    labelStyle: { fontSize: '0.75rem', fontWeight: 600, fill: '#ef4444' },
    style: { stroke: '#ef4444', strokeWidth: 3 },
  },
]

interface AllocationFlowDiagramProps {
  className?: string
  readOnly?: boolean
}

export function AllocationFlowDiagram({ className, readOnly = false }: AllocationFlowDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('LR')

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleExport = () => {
    // In a real implementation, this would export the diagram as image/PDF
    console.log('Exporting diagram...')
  }

  const handleShare = () => {
    // In a real implementation, this would generate a shareable link
    console.log('Sharing diagram...')
  }

  const fitView = () => {
    // This would be handled by the ReactFlow instance
    console.log('Fitting view...')
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Allocation Flow Diagram
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visual representation of cost allocation rules and data flow
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Layout</InputLabel>
              <Select
                value={layoutDirection}
                label="Layout"
                onChange={(e) => setLayoutDirection(e.target.value as 'TB' | 'LR')}
              >
                <MenuItem value="LR">Left to Right</MenuItem>
                <MenuItem value="TB">Top to Bottom</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={showMiniMap ? 'Hide MiniMap' : 'Show MiniMap'}>
              <IconButton onClick={() => setShowMiniMap(!showMiniMap)}>
                {showMiniMap ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Fit View">
              <IconButton onClick={fitView}>
                <CenterFocusStrong />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export Diagram">
              <IconButton onClick={handleExport}>
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share Diagram">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Box sx={{ fontSize: '0.9rem' }}>💰</Box>}
            label="Source Account"
            size="small"
            sx={{ backgroundColor: '#22c55e20', color: '#22c55e', fontWeight: 600 }}
          />
          <Chip
            icon={<Box sx={{ fontSize: '0.9rem' }}>📊</Box>}
            label="Allocation Driver"
            size="small"
            sx={{ backgroundColor: '#f59e0b20', color: '#f59e0b', fontWeight: 600 }}
          />
          <Chip
            icon={<Box sx={{ fontSize: '0.9rem' }}>⚙️</Box>}
            label="Allocation Rule"
            size="small"
            sx={{ backgroundColor: '#8b5cf620', color: '#8b5cf6', fontWeight: 600 }}
          />
          <Chip
            icon={<Box sx={{ fontSize: '0.9rem' }}>🎯</Box>}
            label="Target Account"
            size="small"
            sx={{ backgroundColor: '#3b82f620', color: '#3b82f6', fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* Flow Diagram */}
      <Paper
        elevation={2}
        sx={{
          height: 600,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
          <Controls
            style={{
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          />
          
          <Background 
            variant="dots" 
            gap={20} 
            size={1} 
            color="#e0e0e0"
          />
          
          {showMiniMap && (
            <MiniMap
              style={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
              }}
              nodeColor={(node) => {
                switch (node.data.type) {
                  case 'source': return '#22c55e'
                  case 'target': return '#3b82f6'
                  case 'driver': return '#f59e0b'
                  case 'rule': return '#8b5cf6'
                  default: return '#6b7280'
                }
              }}
            />
          )}

          <Panel position="top-left">
            <Card sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Allocation Summary
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Total Allocated: $500,000
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Rules Applied: 1
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Target Departments: 4
              </Typography>
            </Card>
          </Panel>
        </ReactFlow>
      </Paper>
    </Box>
  )
}