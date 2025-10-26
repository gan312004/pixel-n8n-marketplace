"use client"

import { useState, useCallback, useRef } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import DashboardNavbar from '@/components/DashboardNavbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, Trash2, Zap, Mail, Database, Globe, Code, Settings, Maximize, Minimize, Palette, FileUp, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// Custom node component with enhanced hover tooltip
function CustomNode({ data }: { data: any }) {
  const getNodeIcon = (type: string) => {
    if (type.includes('start')) return <Zap className="w-5 h-5" />
    if (type.includes('email') || type.includes('gmail')) return <Mail className="w-5 h-5" />
    if (type.includes('database') || type.includes('postgres') || type.includes('mysql')) return <Database className="w-5 h-5" />
    if (type.includes('http') || type.includes('webhook')) return <Globe className="w-5 h-5" />
    if (type.includes('code') || type.includes('function')) return <Code className="w-5 h-5" />
    return <Settings className="w-5 h-5" />
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {/* Input Handle - Left side, free-floating, bigger */}
            <Handle 
              type="target" 
              position={Position.Left} 
              id="input"
              style={{ 
                background: data.nodeColor || '#6B46C1', 
                width: 16, 
                height: 16, 
                border: '3px solid #fff',
                left: -8,
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }} 
            />
            
            {/* Node Card - Bigger size */}
            <div 
              className="bg-white dark:bg-white rounded-lg shadow-lg min-w-[260px] max-w-[320px] cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105" 
              style={{ borderLeft: `5px solid ${data.nodeColor || '#6B46C1'}` }}
            >
              {/* Node Header - Colored */}
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: data.nodeColor || '#6B46C1' }}>
                <div className="text-white flex-shrink-0">
                  {getNodeIcon(data.type)}
                </div>
                <span className="font-semibold text-sm text-white truncate">{data.name}</span>
              </div>
              
              {/* Node Body - Light mode: black bg + white text, Dark mode: white bg + black text */}
              <div className="px-5 py-4 bg-black dark:bg-white">
                <div className="text-xs font-medium text-white dark:text-black">
                  {data.typeLabel || 'Node'}
                </div>
              </div>
            </div>
            
            {/* Output Handle - Right side, free-flowing, bigger */}
            <Handle 
              type="source" 
              position={Position.Right} 
              id="output"
              style={{ 
                background: data.nodeColor || '#6B46C1', 
                width: 16, 
                height: 16, 
                border: '3px solid #fff',
                right: -8,
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }} 
            />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-sm p-4 bg-popover border shadow-xl z-[100]"
          sideOffset={15}
        >
          <div className="space-y-2">
            <div className="font-bold text-base flex items-center gap-2 text-foreground">
              {getNodeIcon(data.type)}
              {data.name}
            </div>
            <div className="text-xs text-muted-foreground border-t pt-2 space-y-1">
              <div className="font-semibold text-foreground">{data.typeLabel}</div>
              <div className="leading-relaxed">{data.description}</div>
              {data.parameters && Object.keys(data.parameters).length > 0 && (
                <div className="pt-2 mt-2 border-t">
                  <div className="font-medium text-foreground mb-1">Configuration:</div>
                  <div className="text-[11px] space-y-0.5">
                    {Object.entries(data.parameters).slice(0, 3).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex gap-1">
                        <span className="font-medium">{key}:</span>
                        <span className="truncate">{typeof value === 'object' ? JSON.stringify(value).slice(0, 30) : String(value).slice(0, 30)}</span>
                      </div>
                    ))}
                    {Object.keys(data.parameters).length > 3 && (
                      <div className="italic text-[10px]">+{Object.keys(data.parameters).length - 3} more parameters</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

// Enhanced helper with detailed descriptions
function getNodeTypeInfo(type: string, parameters?: any): { label: string; description: string } {
  const typeMap: { [key: string]: { label: string; description: string } } = {
    'n8n-nodes-base.start': {
      label: 'Start Trigger',
      description: 'Initiates workflow execution. This is the entry point that triggers the entire automation sequence either manually or on a scheduled basis.'
    },
    'n8n-nodes-base.httpRequest': {
      label: 'HTTP Request',
      description: `Makes HTTP/HTTPS requests to external APIs. Fetches or sends data to web services using methods like GET, POST, PUT, or DELETE${parameters?.url ? ` to ${parameters.url}` : ''}.`
    },
    'n8n-nodes-base.webhook': {
      label: 'Webhook',
      description: 'Creates a unique URL endpoint to receive incoming HTTP requests from external services, allowing real-time data integration from third-party platforms.'
    },
    'n8n-nodes-base.set': {
      label: 'Set Values',
      description: 'Transforms and structures data by setting, modifying, or removing fields. Prepares data format for subsequent nodes in the workflow.'
    },
    'n8n-nodes-base.if': {
      label: 'Conditional Logic',
      description: 'Routes workflow execution based on if/else conditions. Compares values and directs data flow to different branches based on whether conditions are met.'
    },
    'n8n-nodes-base.switch': {
      label: 'Switch Router',
      description: 'Routes data to multiple different branches based on various conditions. Acts like a traffic controller directing data to the appropriate path.'
    },
    'n8n-nodes-base.code': {
      label: 'Code Execution',
      description: 'Executes custom JavaScript code to perform complex data transformations, calculations, or logic that built-in nodes cannot handle.'
    },
    'n8n-nodes-base.function': {
      label: 'Function Node',
      description: 'Runs custom JavaScript functions to manipulate workflow data. Allows advanced data processing with full JavaScript capabilities.'
    },
    'n8n-nodes-base.functionItem': {
      label: 'Function Item',
      description: 'Processes each data item individually with custom JavaScript code. Ideal for item-by-item transformations in batch operations.'
    },
    'n8n-nodes-base.emailSend': {
      label: 'Send Email',
      description: `Sends email messages via SMTP protocol${parameters?.toEmail ? ` to ${parameters.toEmail}` : ' to specified recipients'}. Supports HTML content, attachments, and custom headers.`
    },
    'n8n-nodes-base.gmail': {
      label: 'Gmail Integration',
      description: 'Connects to Gmail to send messages, read emails, search inbox, manage labels, or handle attachments using Google APIs.'
    },
    'n8n-nodes-base.postgres': {
      label: 'PostgreSQL Database',
      description: 'Connects to PostgreSQL databases to execute SQL queries, insert records, update data, or retrieve information from tables.'
    },
    'n8n-nodes-base.mysql': {
      label: 'MySQL Database',
      description: 'Interfaces with MySQL databases to run queries, manage records, or perform CRUD operations on database tables.'
    },
    'n8n-nodes-base.googleSheets': {
      label: 'Google Sheets',
      description: 'Reads from and writes to Google Sheets spreadsheets. Enables data synchronization between workflows and spreadsheet applications.'
    },
    'n8n-nodes-base.slack': {
      label: 'Slack Messenger',
      description: 'Integrates with Slack workspaces to send messages, create channels, manage users, or respond to events in real-time.'
    },
    'n8n-nodes-base.discord': {
      label: 'Discord Bot',
      description: 'Sends messages and manages Discord servers, channels, and roles. Automates Discord interactions and notifications.'
    },
    'n8n-nodes-base.merge': {
      label: 'Merge Data',
      description: 'Combines data from multiple workflow branches into a single unified output. Useful for aggregating results from parallel operations.'
    },
    'n8n-nodes-base.splitInBatches': {
      label: 'Split In Batches',
      description: 'Divides incoming data into smaller batches for processing. Prevents overwhelming downstream services with large datasets.'
    },
    'n8n-nodes-base.wait': {
      label: 'Wait Timer',
      description: 'Pauses workflow execution for a specified duration or until a certain condition is met. Useful for rate limiting or scheduling delays.'
    },
    'n8n-nodes-base.respondToWebhook': {
      label: 'Webhook Response',
      description: 'Sends an HTTP response back to the webhook caller that triggered the workflow. Completes the request-response cycle.'
    },
    'n8n-nodes-base.filter': {
      label: 'Filter Data',
      description: 'Filters data items based on specified conditions. Only passes through items that match the defined criteria.'
    },
    'n8n-nodes-base.json': {
      label: 'JSON Parser',
      description: 'Parses, manipulates, or transforms JSON data structures. Extracts specific fields or reformats JSON objects.'
    },
  }
  
  if (typeMap[type]) {
    return typeMap[type]
  }
  
  // Generate fallback description
  const defaultLabel = type.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Node'
  return {
    label: defaultLabel,
    description: `Processes and transforms workflow data. This ${defaultLabel.toLowerCase()} node performs specialized operations as part of the automation sequence.`
  }
}

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [jsonInput, setJsonInput] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [nodeColor, setNodeColor] = useState('#6B46C1')
  const [edgeColor, setEdgeColor] = useState('#6B46C1')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      type: 'default', // Free-flowing bezier curves
      style: { stroke: edgeColor, strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeColor,
        width: 22,
        height: 22,
      },
    }, eds)),
    [setEdges, edgeColor]
  )

  const parseWorkflowJSON = (data: any) => {
    if (data.nodes && Array.isArray(data.nodes)) {
      const parsedNodes: Node[] = data.nodes.map((node: any, index: number) => {
        const nodeId = String(node.name || node.id || `node-${index}`)
        const nodeName = node.name || node.type || 'Node'
        const nodeType = node.type || 'workflow'
        const nodeInfo = getNodeTypeInfo(nodeType, node.parameters)
        
        let position = { x: 100 + index * 350, y: 100 + (index % 3) * 200 }
        if (node.position) {
          if (Array.isArray(node.position) && node.position.length >= 2) {
            position = { x: node.position[0], y: node.position[1] }
          } else if (typeof node.position === 'object' && node.position.x !== undefined) {
            position = node.position
          }
        }
        
        return {
          id: nodeId,
          type: 'custom',
          position,
          data: { 
            name: nodeName,
            type: nodeType,
            typeLabel: nodeInfo.label,
            description: nodeInfo.description,
            nodeColor: nodeColor,
            parameters: node.parameters || {},
          },
          draggable: true,
        }
      })

      const parsedEdges: Edge[] = []
      
      // Parse connections - ensure ALL connections are created
      if (data.connections) {
        Object.keys(data.connections).forEach((sourceName: string) => {
          const connections = data.connections[sourceName]
          
          // Handle main connections with proper iteration
          if (connections.main && Array.isArray(connections.main)) {
            connections.main.forEach((connArray: any[], outputIndex: number) => {
              if (Array.isArray(connArray)) {
                connArray.forEach((target: any, targetIndex: number) => {
                  if (target && target.node) {
                    const edgeId = `e-${sourceName}-${target.node}-${outputIndex}-${targetIndex}`
                    parsedEdges.push({
                      id: edgeId,
                      source: String(sourceName),
                      target: String(target.node),
                      sourceHandle: 'output',
                      targetHandle: 'input',
                      type: 'default', // Bezier curves
                      animated: true,
                      style: { 
                        stroke: edgeColor, 
                        strokeWidth: 2.5 
                      },
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: edgeColor,
                        width: 22,
                        height: 22,
                      },
                    })
                  }
                })
              }
            })
          }
        })
      }

      setNodes(parsedNodes)
      setEdges(parsedEdges)
      toast.success(`✅ Workflow imported! ${parsedNodes.length} nodes, ${parsedEdges.length} connections`)
    } else {
      toast.error('Invalid workflow format. Please provide a JSON with "nodes" array.')
    }
  }

  const handleImportJSON = () => {
    try {
      const data = JSON.parse(jsonInput)
      parseWorkflowJSON(data)
      setShowImport(false)
      setJsonInput('')
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Invalid JSON format. Please check your input.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        parseWorkflowJSON(data)
        toast.success('✅ File imported successfully!')
      } catch (error) {
        console.error('File import error:', error)
        toast.error('Invalid JSON file. Please check the file format.')
      }
    }
    reader.readAsText(file)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExportJSON = () => {
    const workflow = {
      nodes: nodes.map((node) => ({
        id: node.id,
        name: node.data.name || node.id,
        type: node.data.type || 'workflow',
        position: [node.position.x, node.position.y],
        parameters: node.data.parameters || {}
      })),
      connections: edges.reduce((acc: any, edge) => {
        if (!acc[edge.source]) {
          acc[edge.source] = { main: [[]] }
        }
        if (!acc[edge.source].main[0]) {
          acc[edge.source].main[0] = []
        }
        acc[edge.source].main[0].push({
          node: edge.target,
          type: 'main',
          index: 0
        })
        return acc
      }, {})
    }
    
    const jsonStr = JSON.stringify(workflow, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('✅ Workflow exported!')
  }

  const handleClear = () => {
    setNodes([])
    setEdges([])
    toast.success('Canvas cleared!')
  }

  const handleColorChange = (newNodeColor: string, newEdgeColor: string) => {
    setNodeColor(newNodeColor)
    setEdgeColor(newEdgeColor)
    
    setNodes((nds) => nds.map((node) => ({
      ...node,
      data: { ...node.data, nodeColor: newNodeColor }
    })))
    
    setEdges((eds) => eds.map((edge) => ({
      ...edge,
      style: { ...edge.style, stroke: newEdgeColor, strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: newEdgeColor,
        width: 22,
        height: 22,
      }
    })))
    
    toast.success('✅ Colors updated!')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      setShowNavbar(false) // Hide navbar when entering fullscreen
    } else {
      setShowNavbar(true) // Show navbar when exiting fullscreen
    }
  }

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}>
      {(!isFullscreen || showNavbar) && <DashboardNavbar />}
      <div className={`${isFullscreen ? 'h-screen flex flex-col' : 'min-h-screen bg-background pt-24 pb-8 px-4'}`}>
        <div className={isFullscreen ? 'h-full flex flex-col' : 'max-w-7xl mx-auto'}>
          {/* Header */}
          <div className={`flex items-center justify-between flex-wrap gap-4 ${isFullscreen ? 'px-6 py-4 border-b bg-card/80 backdrop-blur-md shadow-sm' : 'mb-6'}`}>
            <div>
              <h1 className={`${isFullscreen ? 'text-xl' : 'text-3xl'} font-bold pixel-text mb-1`}>Workflow Visualizer</h1>
              <p className={`text-muted-foreground ${isFullscreen ? 'text-xs' : 'text-sm'}`}>Import and visualize your n8n workflows</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size={isFullscreen ? "sm" : "default"}
                className="gap-2"
              >
                <FileUp className="w-4 h-4" />
                Upload
              </Button>
              <Button
                onClick={() => setShowImport(!showImport)}
                variant="outline"
                size={isFullscreen ? "sm" : "default"}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Paste JSON
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size={isFullscreen ? "sm" : "default"} className="gap-2">
                    <Palette className="w-4 h-4" />
                    Colors
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Customize Colors</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="node-color">Node Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="node-color"
                            type="color"
                            value={nodeColor}
                            onChange={(e) => setNodeColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            type="text"
                            value={nodeColor}
                            onChange={(e) => setNodeColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edge-color">Line Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="edge-color"
                            type="color"
                            value={edgeColor}
                            onChange={(e) => setEdgeColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            type="text"
                            value={edgeColor}
                            onChange={(e) => setEdgeColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleColorChange(nodeColor, edgeColor)}
                        className="w-full"
                      >
                        Apply Colors
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {nodes.length > 0 && (
                <>
                  <Button
                    onClick={handleExportJSON}
                    variant="outline"
                    size={isFullscreen ? "sm" : "default"}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="destructive"
                    size={isFullscreen ? "sm" : "default"}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                </>
              )}
              {isFullscreen && (
                <Button
                  onClick={toggleNavbar}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {showNavbar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showNavbar ? 'Hide Nav' : 'Show Nav'}
                </Button>
              )}
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size={isFullscreen ? "sm" : "default"}
                className="gap-2"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
            </div>
          </div>

          {/* Import Section */}
          {showImport && (
            <div className={`p-4 bg-card rounded-lg border shadow-sm ${isFullscreen ? 'mx-6 mb-4' : 'mb-6'}`}>
              <h3 className="font-semibold mb-2">Import Workflow JSON</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Paste your n8n workflow JSON below
              </p>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"nodes": [{"name": "Start", "type": "n8n-nodes-base.start", "position": [250, 300], "parameters": {}}], "connections": {}}'
                className="min-h-[200px] font-mono text-sm mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={handleImportJSON}>Import Workflow</Button>
                <Button variant="outline" onClick={() => setShowImport(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div 
            className={`relative bg-card rounded-lg border shadow-lg overflow-hidden ${isFullscreen ? 'flex-1' : ''}`}
            style={{ 
              height: isFullscreen ? (showNavbar ? 'calc(100vh - 144px)' : 'calc(100vh - 80px)') : '700px', 
              width: '100%',
              margin: isFullscreen ? '0 24px 24px 24px' : '0'
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3, maxZoom: 1.2 }}
              minZoom={0.1}
              maxZoom={2}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              panOnDrag={true}
              zoomOnScroll={true}
              preventScrolling={true}
              defaultEdgeOptions={{
                type: 'default', // Free-flowing bezier curves
                animated: true,
                style: { strokeWidth: 2.5, stroke: edgeColor },
                markerEnd: { 
                  type: MarkerType.ArrowClosed, 
                  color: edgeColor,
                  width: 22,
                  height: 22
                },
              }}
            >
              <Controls className="bg-card/80 backdrop-blur-sm shadow-md" />
              <MiniMap
                nodeColor={nodeColor}
                maskColor="rgba(0, 0, 0, 0.1)"
                style={{ background: '#f5f5f5' }}
                className="border shadow-lg"
              />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#d1d5db" />
            </ReactFlow>

            {nodes.length === 0 && !showImport && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/50 backdrop-blur-sm">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workflow loaded</h3>
                  <p className="text-muted-foreground">Upload a file or paste JSON to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {nodes.length > 0 && !isFullscreen && (
            <div className="mt-4 p-4 bg-card rounded-lg border shadow-sm">
              <h3 className="font-semibold mb-2">Workflow Stats</h3>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">{nodes.length}</span> Nodes
                </div>
                <div>
                  <span className="font-medium text-foreground">{edges.length}</span> Connections
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkflowsPage() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  )
}