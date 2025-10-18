"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Brain, MessageSquare, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
  keyPoints?: string[] | null
  whyBuyIt?: string | null
  image?: string | null
}

const iconMap: Record<string, any> = {
  'Conversational': MessageSquare,
  'Analytics': TrendingUp,
  'Research': Brain,
  'Automation': Bot,
}

const colorMap: Record<string, string> = {
  'Conversational': 'from-blue-500 to-cyan-500',
  'Analytics': 'from-green-500 to-emerald-500',
  'Research': 'from-purple-500 to-pink-500',
  'Automation': 'from-orange-500 to-red-500',
}

export default function AgentsShowcase() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents?limit=4')
        const data = await response.json()
        
        if (data.success) {
          const parsedAgents = data.data.map((agent: any) => ({
            ...agent,
            features: typeof agent.features === 'string' ? JSON.parse(agent.features) : agent.features,
            requirements: typeof agent.requirements === 'string' ? JSON.parse(agent.requirements) : agent.requirements,
            keyPoints: agent.keyPoints ? (typeof agent.keyPoints === 'string' ? JSON.parse(agent.keyPoints) : agent.keyPoints) : null,
          }))
          setAgents(parsedAgents)
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const toggleExpanded = (agentId: number) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId)
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Loading agents...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="pixel-text text-3xl md:text-4xl lg:text-5xl mb-4">
            AI Agents
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Intelligent agents that work 24/7 to automate complex tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent, idx) => {
            const IconComponent = iconMap[agent.type] || Bot
            const colorClass = colorMap[agent.type] || 'from-blue-500 to-cyan-500'
            const isExpanded = expandedAgent === agent.id

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="p-6 smooth-hover hover:shadow-xl border-2 group overflow-hidden relative bg-card">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center pixel-shadow`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          {agent.type}
                        </Badge>
                        <div className="pixel-text text-xl text-primary">${agent.price}</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary smooth-hover">
                      {agent.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Expandable Section Button */}
                    {(agent.keyPoints || agent.whyBuyIt) && (
                      <button
                        onClick={() => toggleExpanded(agent.id)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 smooth-hover mb-4"
                      >
                        {isExpanded ? 'Hide Details' : 'Why Buy This?'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Animated Dropdown Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden mb-4"
                        >
                          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            {agent.keyPoints && agent.keyPoints.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                                <ul className="space-y-1">
                                  {agent.keyPoints.map((point, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                      <span className="text-primary mt-1">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {agent.whyBuyIt && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Why Choose This Agent?</h4>
                                <p className="text-sm text-muted-foreground">{agent.whyBuyIt}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                      <Link href={`/agents/${agent.id}`} className="flex-1">
                        <Button className="w-full smooth-hover hover:scale-105">
                          View Details
                        </Button>
                      </Link>
                      <Button 
                        variant="outline"
                        className="smooth-hover hover:scale-105 hover:border-primary"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="pixel-text text-xs smooth-hover hover:scale-105 border-2"
          >
            View All Agents
          </Button>
        </div>
      </div>
    </section>
  )
}