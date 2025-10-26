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
import { Upload, Download, Trash2, Zap, Mail, Database, Globe, Code, Settings, Maximize, Minimize, Palette, FileUp } from 'lucide-react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// Custom node component with minimal details
function CustomNode({ data }: { data: any }) {
  const getNodeIcon = (type: string) => {
    if (type.includes('start')) return <Zap className="w-4 h-4" />
    if (type.includes('email') || type.includes('gmail')) return <Mail className="w-4 h-4" />
    if (type.includes('database') || type.includes('postgres') || type.includes('mysql')) return <Database className="w-4 h-4" />
    if (type.includes('http') || type.includes('webhook')) return <Globe className="w-4 h-4" />
    if (type.includes('code') || type.includes('function')) return <Code className="w-4 h-4" />
    return <Settings className="w-4 h-4" />
  }

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: data.nodeColor || '#6B46C1', 
          width: 10, 
          height: 10, 
          border: '2px solid #fff',
          left: -5 
        }} 
      />
      <div className="bg-white rounded-lg shadow-lg min-w-[180px]" style={{ borderLeft: `4px solid ${data.nodeColor || '#6B46C1'}` }}>
        {/* Node Header - Compact */}
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: data.nodeColor || '#6B46C1' }}>
          <div className="text-white">
            {getNodeIcon(data.type)}
          </div>
          <span className="font-semibold text-sm text-white truncate">{data.name}</span>
        </div>
        
        {/* Node Body - Summary Only */}
        <div className="px-3 py-2">
          <div className="text-xs font-medium text-gray-500">
            {data.typeLabel || 'Node'}
          </div>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: data.nodeColor || '#6B46C1', 
          width: 10, 
          height: 10, 
          border: '2px solid #fff',
          right: -5 
        }} 
      />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

// Helper to get readable node type label
function getNodeTypeLabel(type: string): string {
  const typeMap: { [key: string]: string } = {
    'n8n-nodes-base.start': 'Start Trigger',
    'n8n-nodes-base.httpRequest': 'HTTP Request',
    'n8n-nodes-base.webhook': 'Webhook',
    'n8n-nodes-base.set': 'Set Values',
    'n8n-nodes-base.if': 'Conditional',
    'n8n-nodes-base.switch': 'Switch',
    'n8n-nodes-base.code': 'Code',
    'n8n-nodes-base.function': 'Function',
    'n8n-nodes-base.emailSend': 'Send Email',
    'n8n-nodes-base.gmail': 'Gmail',
    'n8n-nodes-base.postgres': 'PostgreSQL',
    'n8n-nodes-base.mysql': 'MySQL',
    'n8n-nodes-base.googleSheets': 'Google Sheets',
    'n8n-nodes-base.slack': 'Slack',
    'n8n-nodes-base.discord': 'Discord',
  }
  
  return typeMap[type] || type.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || 'Node'
}

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [jsonInput, setJsonInput] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [nodeColor, setNodeColor] = useState('#6B46C1')
  const [edgeColor, setEdgeColor] = useState('#6B46C1')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 2.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeColor,
        width: 20,
        height: 20,
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
        
        let position = { x: 100 + index * 300, y: 100 + (index % 3) * 180 }
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
            typeLabel: getNodeTypeLabel(nodeType),
            nodeColor: nodeColor,
            parameters: node.parameters || {},
          },
          draggable: true,
        }
      })

      const parsedEdges: Edge[] = []
      
      if (data.connections) {
        Object.keys(data.connections).forEach((sourceName: string) => {
          const connections = data.connections[sourceName]
          
          if (connections.main && Array.isArray(connections.main)) {
            connections.main.forEach((connArray: any[], outputIndex: number) => {
              if (Array.isArray(connArray)) {
                connArray.forEach((target: any, targetIndex: number) => {
                  if (target && target.node) {
                    parsedEdges.push({
                      id: `e-${sourceName}-${target.node}-${outputIndex}-${targetIndex}`,
                      source: String(sourceName),
                      target: String(target.node),
                      type: 'default',
                      animated: true,
                      style: { 
                        stroke: edgeColor, 
                        strokeWidth: 2.5 
                      },
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: edgeColor,
                        width: 20,
                        height: 20,
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
      toast.success(`Workflow imported! ${parsedNodes.length} nodes, ${parsedEdges.length} connections`)
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
        toast.success('File imported successfully!')
      } catch (error) {
        console.error('File import error:', error)
        toast.error('Invalid JSON file. Please check the file format.')
      }
    }
    reader.readAsText(file)
    
    // Reset input
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
    toast.success('Workflow exported!')
  }

  const handleClear = () => {
    setNodes([])
    setEdges([])
    toast.success('Canvas cleared!')
  }

  const handleColorChange = (newNodeColor: string, newEdgeColor: string) => {
    setNodeColor(newNodeColor)
    setEdgeColor(newEdgeColor)
    
    // Update existing nodes
    setNodes((nds) => nds.map((node) => ({
      ...node,
      data: { ...node.data, nodeColor: newNodeColor }
    })))
    
    // Update existing edges
    setEdges((eds) => eds.map((edge) => ({
      ...edge,
      style: { ...edge.style, stroke: newEdgeColor },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: newEdgeColor,
        width: 20,
        height: 20,
      }
    })))
    
    toast.success('Colors updated!')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <>
      {!isFullscreen && <DashboardNavbar />}
      <div className={`min-h-screen bg-background ${isFullscreen ? 'pt-0' : 'pt-24 pb-8'} px-4`}>
        <div className={isFullscreen ? 'h-screen' : 'max-w-7xl mx-auto'}>
          <div className={`mb-6 flex items-center justify-between flex-wrap gap-4 ${isFullscreen ? 'pt-4' : ''}`}>
            <div>
              <h1 className="text-3xl font-bold pixel-text mb-2">Workflow Visualizer</h1>
              <p className="text-muted-foreground">Import and visualize your n8n workflows</p>
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
                className="gap-2"
              >
                <FileUp className="w-4 h-4" />
                Upload File
              </Button>
              <Button
                onClick={() => setShowImport(!showImport)}
                variant="outline"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Paste JSON
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
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
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                </>
              )}
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="gap-2"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
            </div>
          </div>

          {showImport && (
            <div className="mb-6 p-4 bg-card rounded-lg border shadow-sm">
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

          <div 
            className="relative bg-card rounded-lg border shadow-lg overflow-hidden" 
            style={{ height: isFullscreen ? 'calc(100vh - 140px)' : '700px', width: '100%' }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
              minZoom={0.1}
              maxZoom={1.5}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              panOnDrag={true}
              zoomOnScroll={true}
              preventScrolling={true}
              defaultEdgeOptions={{
                type: 'default',
                animated: true,
                style: { strokeWidth: 2.5, stroke: edgeColor },
                markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
              }}
            >
              <Controls />
              <MiniMap
                nodeColor={nodeColor}
                maskColor="rgba(0, 0, 0, 0.1)"
                style={{ background: '#f5f5f5' }}
              />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
            </ReactFlow>

            {nodes.length === 0 && !showImport && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/50">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workflow loaded</h3>
                  <p className="text-muted-foreground">Upload a file or paste JSON to get started</p>
                </div>
              </div>
            )}
          </div>

          {nodes.length > 0 && (
            <div className="mt-4 p-4 bg-card rounded-lg border">
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
    </>
  )
}

export default function WorkflowsPage() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  )
}