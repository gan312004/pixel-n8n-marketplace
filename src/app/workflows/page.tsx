"use client"

import { useState, useCallback, useEffect } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'
import DashboardNavbar from '@/components/DashboardNavbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function WorkflowsPage() {
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
          const nodeId = node.id || node.name || `node-${index}`
          const nodeName = node.name || node.type || 'Node'
          const nodeType = node.type || 'workflow'
          
          return {
            id: String(nodeId),
            type: 'default',
            position: node.position || { x: 100 + index * 250, y: 100 + (index % 3) * 150 },
            data: { 
              label: nodeName
            },
            style: {
              background: '#fff',
              border: '2px solid #6B46C1',
              borderRadius: '8px',
              padding: '12px 16px',
              minWidth: 160,
              fontSize: '14px',
              fontWeight: '600',
            }
          }
        })

        const parsedEdges: Edge[] = []
        
        // Parse connections if they exist
        if (data.connections) {
          Object.keys(data.connections).forEach((sourceId: string) => {
            const connections = data.connections[sourceId]
            
            if (connections.main && Array.isArray(connections.main)) {
              connections.main.forEach((connArray: any[], outputIndex: number) => {
                if (Array.isArray(connArray)) {
                  connArray.forEach((target: any) => {
                    if (target && target.node) {
                      parsedEdges.push({
                        id: `e-${sourceId}-${target.node}-${outputIndex}`,
                        source: String(sourceId),
                        target: String(target.node),
                        animated: true,
                        style: { stroke: '#6B46C1', strokeWidth: 2 }
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
      nodes: nodes.map((node, index) => ({
        id: node.id,
        name: typeof node.data.label === 'string' ? node.data.label : `Node ${index + 1}`,
        type: 'workflow',
        position: node.position,
        parameters: {}
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
                placeholder='{"nodes": [{"id": "1", "name": "Start", "type": "n8n-nodes-base.start", "position": [250, 300]}], "connections": {}}'
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

          <div className="relative bg-card rounded-lg border shadow-lg overflow-hidden" style={{ height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
              maxZoom={2}
            >
              <Controls />
              <MiniMap
                nodeColor="#6B46C1"
                maskColor="rgba(0, 0, 0, 0.1)"
                style={{ background: '#f5f5f5' }}
              />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
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