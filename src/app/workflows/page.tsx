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
        const parsedNodes: Node[] = data.nodes.map((node: any, index: number) => ({
          id: node.id || `node-${index}`,
          type: 'default',
          position: node.position || { x: 100 + index * 200, y: 100 },
          data: { 
            label: (
              <div className="px-4 py-2">
                <div className="font-bold text-sm">{node.name || node.type || 'Node'}</div>
                <div className="text-xs text-muted-foreground mt-1">{node.type || 'workflow'}</div>
                {node.parameters && (
                  <div className="text-xs mt-2 text-left">
                    {Object.keys(node.parameters).slice(0, 3).map((key) => (
                      <div key={key} className="truncate">
                        <span className="font-medium">{key}:</span> {String(node.parameters[key]).slice(0, 20)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          },
          style: {
            background: '#fff',
            border: '2px solid #6B46C1',
            borderRadius: '8px',
            padding: 0,
            minWidth: 180,
          }
        }))

        const parsedEdges: Edge[] = []
        data.connections && Object.keys(data.connections).forEach((sourceId: string) => {
          const connections = data.connections[sourceId]
          Object.keys(connections).forEach((connectionType: string) => {
            connections[connectionType].forEach((conn: any) => {
              conn.forEach((target: any) => {
                parsedEdges.push({
                  id: `e-${sourceId}-${target.node}`,
                  source: sourceId,
                  target: target.node,
                  animated: true,
                  style: { stroke: '#6B46C1' }
                })
              })
            })
          })
        })

        setNodes(parsedNodes)
        setEdges(parsedEdges)
        setShowImport(false)
        setJsonInput('')
        toast.success('Workflow imported successfully!')
      } else {
        toast.error('Invalid workflow format')
      }
    } catch (error) {
      toast.error('Invalid JSON format')
    }
  }

  const handleExportJSON = () => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        name: node.id,
        type: 'workflow',
        position: node.position,
        parameters: {}
      })),
      connections: {}
    }
    
    const jsonStr = JSON.stringify(workflow, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
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
      <div className="min-h-screen pt-24 pb-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold pixel-text mb-2">Workflow Visualizer</h1>
              <p className="text-muted-foreground">Import and visualize your n8n workflows</p>
            </div>
            <div className="flex gap-2">
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
            <div className="mb-6 p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Import Workflow JSON</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Paste your n8n workflow JSON below
              </p>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"nodes": [...], "connections": {...}}'
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

          <div className="bg-card rounded-lg border" style={{ height: '600px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <MiniMap
                nodeColor="#6B46C1"
                maskColor="rgba(0, 0, 0, 0.1)"
                style={{ background: '#f5f5f5' }}
              />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>

          {nodes.length === 0 && !showImport && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No workflow loaded</h3>
                <p className="text-muted-foreground">Import a JSON workflow to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
