"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react'

type TabType = 'templates' | 'agents' | 'bundles'

interface Template {
  id: number
  name: string
  category: string
  price: number
  rating: number
  downloads: number
  description: string
  featured: boolean
  features: string[]
  requirements: string[]
  image?: string | null
  createdAt: string
}

interface Agent {
  id: number
  name: string
  type: string
  price: number
  rating: number
  downloads: number
  description: string
  features: string[]
  requirements: string[]
  image?: string | null
  createdAt: string
}

interface Bundle {
  id: number
  name: string
  description: string
  originalPrice: number
  bundlePrice: number
  discount: number
  templates: string[]
  saves: number
  image?: string | null
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('templates')
  const [isLoading, setIsLoading] = useState(false)

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    featured: false,
    features: '',
    requirements: '',
    image: ''
  })

  // Agents state
  const [agents, setAgents] = useState<Agent[]>([])
  const [agentForm, setAgentForm] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    features: '',
    requirements: '',
    image: ''
  })

  // Bundles state
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [bundleForm, setBundleForm] = useState({
    name: '',
    description: '',
    originalPrice: '',
    bundlePrice: '',
    discount: '',
    templates: '',
    saves: '',
    image: ''
  })

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (isPending) return

      if (!session?.user) {
        router.push('/auth?redirect=/admin')
        return
      }

      try {
        const token = localStorage.getItem('bearer_token')
        if (!token) {
          toast.error('Authentication required')
          router.push('/auth?redirect=/admin')
          return
        }

        const response = await fetch('/api/admin/check-auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (!response.ok || !data.success || !data.isAdmin) {
          toast.error('Admin access required')
          router.push('/')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Auth check error:', error)
        toast.error('Authentication failed')
        router.push('/')
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [session, isPending, router])

  // Load data based on active tab
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'templates') loadTemplates()
      if (activeTab === 'agents') loadAgents()
      if (activeTab === 'bundles') loadBundles()
    }
  }, [isAdmin, activeTab])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.data)
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.data)
      }
    } catch (error) {
      console.error('Error loading agents:', error)
    }
  }

  const loadBundles = async () => {
    try {
      const response = await fetch('/api/admin/bundles')
      const data = await response.json()
      if (data.success) {
        setBundles(data.data)
      }
    } catch (error) {
      console.error('Error loading bundles:', error)
    }
  }

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('bearer_token')
      const features = templateForm.features.split(',').map(f => f.trim()).filter(Boolean)
      const requirements = templateForm.requirements.split(',').map(r => r.trim()).filter(Boolean)

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: templateForm.name,
          category: templateForm.category,
          price: parseInt(templateForm.price),
          description: templateForm.description,
          featured: templateForm.featured,
          features,
          requirements,
          image: templateForm.image || null
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Template created successfully!')
        setTemplateForm({
          name: '',
          category: '',
          price: '',
          description: '',
          featured: false,
          features: '',
          requirements: '',
          image: ''
        })
        loadTemplates()
      } else {
        toast.error(data.error || 'Failed to create template')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('bearer_token')
      const features = agentForm.features.split(',').map(f => f.trim()).filter(Boolean)
      const requirements = agentForm.requirements.split(',').map(r => r.trim()).filter(Boolean)

      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: agentForm.name,
          type: agentForm.type,
          price: parseInt(agentForm.price),
          description: agentForm.description,
          features,
          requirements,
          image: agentForm.image || null
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Agent created successfully!')
        setAgentForm({
          name: '',
          type: '',
          price: '',
          description: '',
          features: '',
          requirements: '',
          image: ''
        })
        loadAgents()
      } else {
        toast.error(data.error || 'Failed to create agent')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('Failed to create agent')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBundleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('bearer_token')
      const templates = bundleForm.templates.split(',').map(t => t.trim()).filter(Boolean)

      const response = await fetch('/api/admin/bundles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: bundleForm.name,
          description: bundleForm.description,
          originalPrice: parseInt(bundleForm.originalPrice),
          bundlePrice: parseInt(bundleForm.bundlePrice),
          discount: parseInt(bundleForm.discount),
          templates,
          saves: parseInt(bundleForm.saves),
          image: bundleForm.image || null
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Bundle created successfully!')
        setBundleForm({
          name: '',
          description: '',
          originalPrice: '',
          bundlePrice: '',
          discount: '',
          templates: '',
          saves: '',
          image: ''
        })
        loadBundles()
      } else {
        toast.error(data.error || 'Failed to create bundle')
      }
    } catch (error) {
      console.error('Error creating bundle:', error)
      toast.error('Failed to create bundle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const token = localStorage.getItem('bearer_token')
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Template deleted successfully!')
        loadTemplates()
      } else {
        toast.error(data.error || 'Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  const handleDeleteAgent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this agent?')) return

    try {
      const token = localStorage.getItem('bearer_token')
      const response = await fetch(`/api/admin/agents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Agent deleted successfully!')
        loadAgents()
      } else {
        toast.error(data.error || 'Failed to delete agent')
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast.error('Failed to delete agent')
    }
  }

  const handleDeleteBundle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return

    try {
      const token = localStorage.getItem('bearer_token')
      const response = await fetch(`/api/admin/bundles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Bundle deleted successfully!')
        loadBundles()
      } else {
        toast.error(data.error || 'Failed to delete bundle')
      }
    } catch (error) {
      console.error('Error deleting bundle:', error)
      toast.error('Failed to delete bundle')
    }
  }

  if (isChecking || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="pixel-text text-3xl mb-4">Admin Panel</h1>
          <p className="text-muted-foreground">Manage templates, agents, and bundles</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'templates'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'agents'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTab('bundles')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'bundles'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bundles
          </button>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Add New Template</h2>
              <form onSubmit={handleTemplateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <Input
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                    placeholder="e.g., AI Automation, Data Sync"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($) *</label>
                  <Input
                    type="number"
                    value={templateForm.price}
                    onChange={(e) => setTemplateForm({ ...templateForm, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Features (comma-separated) *</label>
                  <Input
                    value={templateForm.features}
                    onChange={(e) => setTemplateForm({ ...templateForm, features: e.target.value })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Requirements (comma-separated) *</label>
                  <Input
                    value={templateForm.requirements}
                    onChange={(e) => setTemplateForm({ ...templateForm, requirements: e.target.value })}
                    placeholder="n8n 1.0+, API key"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={templateForm.image}
                    onChange={(e) => setTemplateForm({ ...templateForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={templateForm.featured}
                    onChange={(e) => setTemplateForm({ ...templateForm, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Template
                </Button>
              </form>
            </div>

            {/* List */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Existing Templates ({templates.length})</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm mb-2">{template.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold">${template.price}</span>
                      <span className="text-muted-foreground">
                        {template.rating}⭐ · {template.downloads} downloads
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Add New Agent</h2>
              <form onSubmit={handleAgentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={agentForm.name}
                    onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <Input
                    value={agentForm.type}
                    onChange={(e) => setAgentForm({ ...agentForm, type: e.target.value })}
                    placeholder="e.g., Conversational, Analytics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($) *</label>
                  <Input
                    type="number"
                    value={agentForm.price}
                    onChange={(e) => setAgentForm({ ...agentForm, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={agentForm.description}
                    onChange={(e) => setAgentForm({ ...agentForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Features (comma-separated) *</label>
                  <Input
                    value={agentForm.features}
                    onChange={(e) => setAgentForm({ ...agentForm, features: e.target.value })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Requirements (comma-separated) *</label>
                  <Input
                    value={agentForm.requirements}
                    onChange={(e) => setAgentForm({ ...agentForm, requirements: e.target.value })}
                    placeholder="n8n 1.0+, API access"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={agentForm.image}
                    onChange={(e) => setAgentForm({ ...agentForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Agent
                </Button>
              </form>
            </div>

            {/* List */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Existing Agents ({agents.length})</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground">{agent.type}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm mb-2">{agent.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold">${agent.price}</span>
                      <span className="text-muted-foreground">
                        {agent.rating}⭐ · {agent.downloads} downloads
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Add New Bundle</h2>
              <form onSubmit={handleBundleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={bundleForm.name}
                    onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    value={bundleForm.description}
                    onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price ($) *</label>
                    <Input
                      type="number"
                      value={bundleForm.originalPrice}
                      onChange={(e) => setBundleForm({ ...bundleForm, originalPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bundle Price ($) *</label>
                    <Input
                      type="number"
                      value={bundleForm.bundlePrice}
                      onChange={(e) => setBundleForm({ ...bundleForm, bundlePrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount (%) *</label>
                    <Input
                      type="number"
                      value={bundleForm.discount}
                      onChange={(e) => setBundleForm({ ...bundleForm, discount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Saves ($) *</label>
                    <Input
                      type="number"
                      value={bundleForm.saves}
                      onChange={(e) => setBundleForm({ ...bundleForm, saves: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Templates (comma-separated) *</label>
                  <Textarea
                    value={bundleForm.templates}
                    onChange={(e) => setBundleForm({ ...bundleForm, templates: e.target.value })}
                    placeholder="Template 1, Template 2, Template 3"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={bundleForm.image}
                    onChange={(e) => setBundleForm({ ...bundleForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Bundle
                </Button>
              </form>
            </div>

            {/* List */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-4">Existing Bundles ({bundles.length})</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{bundle.name}</h3>
                        <p className="text-sm text-muted-foreground">{bundle.description}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBundle(bundle.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <div>
                        <span className="line-through text-muted-foreground">${bundle.originalPrice}</span>
                        <span className="font-bold ml-2">${bundle.bundlePrice}</span>
                      </div>
                      <span className="text-neon-green font-medium">{bundle.discount}% OFF</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}