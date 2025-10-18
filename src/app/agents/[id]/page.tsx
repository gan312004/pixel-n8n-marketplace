"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, Zap, Check, RefreshCw, Shield, ArrowLeft, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useParams } from 'next/navigation'

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
  keyPoints: string[]
  whyBuyIt: string
  image?: string | null
}

export default function AgentDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWhyBuy, setShowWhyBuy] = useState(false)

  useEffect(() => {
    fetchAgent()
  }, [params.id])

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/agents?id=${params.id}`)
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        const agentData = data.data[0]
        // Parse JSON fields if they're strings
        const parsedAgent = {
          ...agentData,
          features: typeof agentData.features === 'string' 
            ? JSON.parse(agentData.features) 
            : agentData.features || [],
          requirements: typeof agentData.requirements === 'string'
            ? JSON.parse(agentData.requirements)
            : agentData.requirements || [],
          keyPoints: typeof agentData.keyPoints === 'string'
            ? JSON.parse(agentData.keyPoints)
            : agentData.keyPoints || [],
        }
        setAgent(parsedAgent)
      }
    } catch (error) {
      console.error('Error fetching agent:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Agent not found</h2>
          <Link href="/agents">
            <Button>Back to Agents</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/agents">
              <ArrowLeft className="w-4 h-4" />
              Back to Agents
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Header */}
              <div className="bg-white rounded-lg p-8 pixel-shadow mb-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-deep-purple rounded-lg flex items-center justify-center pixel-shadow">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded">
                        {agent.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{agent.rating}</span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">{agent.name}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{agent.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {agent.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg pixel-shadow mb-6">
                <div className="border-b flex gap-1 p-2">
                  {['overview', 'features', 'requirements'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'bg-primary text-white'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-4">About This Agent</h3>
                        <p className="text-muted-foreground mb-6">{agent.description}</p>
                        
                        {agent.keyPoints && agent.keyPoints.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-neon-green" />
                              Key Points
                            </h4>
                            <ul className="space-y-2">
                              {agent.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {agent.whyBuyIt && (
                          <div>
                            <button
                              onClick={() => setShowWhyBuy(!showWhyBuy)}
                              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-neon-green/10 rounded-lg hover:from-primary/20 hover:to-neon-green/20 transition-colors"
                            >
                              <span className="font-bold">Why Buy This?</span>
                              {showWhyBuy ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            {showWhyBuy && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 p-4 bg-muted/50 rounded-lg"
                              >
                                <p className="text-muted-foreground">{agent.whyBuyIt}</p>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Features Included
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.isArray(agent.features) && agent.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'requirements' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        System Requirements
                      </h3>
                      <ul className="space-y-3">
                        {Array.isArray(agent.requirements) && agent.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 pixel-shadow sticky top-32"
            >
              <div className="mb-6">
                <div className="pixel-text text-4xl text-primary mb-2">${agent.price}</div>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>

              <Button
                size="lg"
                className="w-full mb-3 pixel-text text-xs smooth-hover hover:scale-105"
              >
                Purchase Agent
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full mb-6"
              >
                Preview Demo
              </Button>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-neon-green" />
                  <div className="text-sm">
                    <div className="font-medium">Secure Purchase</div>
                    <div className="text-muted-foreground">Encrypted checkout</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-neon-green" />
                  <div className="text-sm">
                    <div className="font-medium">Lifetime Updates</div>
                    <div className="text-muted-foreground">Free forever</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-neon-green" />
                  <div className="text-sm">
                    <div className="font-medium">Instant Access</div>
                    <div className="text-muted-foreground">Installation guide PDF included</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}