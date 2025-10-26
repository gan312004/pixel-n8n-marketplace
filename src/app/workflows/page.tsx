"use client"

import { useState, useCallback } from 'react'
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
import { Upload, Download, Trash2, Zap, Mail, Database, Globe, Code, Settings } from 'lucide-react'
import { toast } from 'sonner'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

// Custom node component that looks like n8n
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
          background: '#6B46C1', 
          width: 10, 
          height: 10, 
          border: '2px solid #fff',
          left: -5 
        }} 
      />
      <div className="bg-white border-2 border-[#6B46C1] rounded-lg shadow-lg min-w-[200px]">
        {/* Node Header */}
        <div className="bg-[#6B46C1] text-white px-3 py-2 rounded-t-md flex items-center gap-2">
          {getNodeIcon(data.type)}
          <span className="font-semibold text-sm truncate">{data.name}</span>
        </div>
        
        {/* Node Body */}
        <div className="px-3 py-2 space-y-1">
          <div className="text-xs font-medium text-gray-600">
            {data.typeLabel || 'Node'}
          </div>
          {data.description && (
            <div className="text-xs text-gray-500 line-clamp-2">
              {data.description}
            </div>
          )}
          {data.parameters && Object.keys(data.parameters).length > 0 && (
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t">
              {Object.entries(data.parameters).slice(0, 2).map(([key, value]: [string, any]) => (
                <div key={key} className="truncate">
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#6B46C1', 
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
    'n8n-nodes-base.if': 'Conditional Logic',
    'n8n-nodes-base.switch': 'Switch',
    'n8n-nodes-base.code': 'Code Execution',
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

// Helper to get node description from parameters
function getNodeDescription(node: any): string {
  const params = node.parameters || {}
  const type = node.type || ''
  
  if (type.includes('start')) {
    return 'Triggers the workflow execution'
  }
  if (type.includes('httpRequest')) {
    const method = params.method || 'GET'
    const url = params.url || 'URL not set'
    return `${method} request to ${url}`
  }
  if (type.includes('webhook')) {
    return `Listens for incoming webhook calls at ${params.path || '/webhook'}`
  }
  if (type.includes('set')) {
    const values = params.values || {}
    return `Sets ${Object.keys(values).length || 0} field(s)`
  }
  if (type.includes('if')) {
    return `Evaluates condition and routes flow`
  }
  if (type.includes('code') || type.includes('function')) {
    return `Executes custom JavaScript code`
  }
  if (type.includes('email') || type.includes('gmail')) {
    const to = params.toEmail || params.to || 'recipient'
    return `Sends email to ${to}`
  }
  if (type.includes('database') || type.includes('postgres') || type.includes('mysql')) {
    const operation = params.operation || 'query'
    return `Performs ${operation} operation`
  }
  if (type.includes('googleSheets')) {
    const operation = params.operation || 'read'
    return `${operation} Google Sheets data`
  }
  if (type.includes('slack')) {
    return `Sends message to Slack channel`
  }
  
  return 'Processes workflow data'
}

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [jsonInput, setJsonInput] = useState('')
  const [showImport, setShowImport] = useState(false)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleImportJSON = () => {
    try {
      const data = JSON.parse(jsonInput)
      
      // Parse n8n-style JSON workflow
      if (data.nodes && Array.isArray(data.nodes)) {
        const parsedNodes: Node[] = data.nodes.map((node: any, index: number) => {
          // n8n uses 'name' as the unique identifier in connections
          const nodeId = String(node.name || node.id || `node-${index}`)
          const nodeName = node.name || node.type || 'Node'
          const nodeType = node.type || 'workflow'
          
          // Handle position - n8n uses [x, y] array format
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
              description: getNodeDescription(node),
              parameters: node.parameters || {},
            },
            draggable: true,
          }
        })

        const parsedEdges: Edge[] = []
        
        // Parse connections - n8n uses node names as identifiers
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
                          stroke: '#6B46C1', 
                          strokeWidth: 2.5 
                        },
                        markerEnd: {
                          type: MarkerType.ArrowClosed,
                          color: '#6B46C1',
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

        console.log('Parsed nodes:', parsedNodes)
        console.log('Parsed edges:', parsedEdges)

        setNodes(parsedNodes)
        setEdges(parsedEdges)
        setShowImport(false)
        setJsonInput('')
        toast.success(`Workflow imported! ${parsedNodes.length} nodes, ${parsedEdges.length} connections`)
      } else {
        toast.error('Invalid workflow format. Please provide a JSON with "nodes" array.')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Invalid JSON format. Please check your input.')
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

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      
      try {
        const data = event.dataTransfer.getData('application/json')
        if (data) {
          const jsonData = JSON.parse(data)
          handleImportJSON()
        }
      } catch (error) {
        console.error('Drop error:', error)
      }
    },
    []
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen pt-24 pb-8 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold pixel-text mb-2">Workflow Visualizer</h1>
              <p className="text-muted-foreground">Import and visualize your n8n workflows</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setShowImport(!showImport)}
                variant="outline"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Import JSON
              </Button>
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
            style={{ height: '700px', width: '100%' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
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
                style: { strokeWidth: 2.5, stroke: '#6B46C1' },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#6B46C1' },
              }}
            >
              <Controls />
              <MiniMap
                nodeColor="#6B46C1"
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
                  <p className="text-muted-foreground">Import a JSON workflow to get started</p>
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