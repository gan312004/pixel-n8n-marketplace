"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Bot, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import LeftSidebar from '@/components/LeftSidebar'
import { AppleStyleDock } from '@/components/AppleStyleDock'

interface Agent {
  id: number
  name: string
  description: string
  type: string
  price: number
  rating: number
  downloads: number
  features: string[] | string
  keyPoints?: string[] | string
  whyBuyIt?: string
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Parse JSON strings from database
          const parsedAgents = data.data.map((agent: Agent) => ({
            ...agent,
            features: typeof agent.features === 'string' 
              ? JSON.parse(agent.features) 
              : agent.features || [],
            keyPoints: agent.keyPoints 
              ? (typeof agent.keyPoints === 'string' ? JSON.parse(agent.keyPoints) : agent.keyPoints)
              : []
          }))
          setAgents(parsedAgents)
        }
      })
      .catch(error => console.error('Error fetching agents:', error))
      .finally(() => setLoading(false))
  }, [])

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      'Conversational': '🤖',
      'Analytics': '📊',
      'Research': '🔍',
      'Support': '💬',
      'Sales': '💼',
      'Marketing': '📧'
    }
    return emojiMap[type] || '🤖'
  }

  return (
    <>
      <LeftSidebar />
      <AppleStyleDock />
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white pt-32 pb-24 px-4 pl-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="pixel-text text-4xl md:text-5xl mb-4">
              AI <span className="text-primary">Agents</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Powerful AI agents to automate your most complex workflows
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search AI agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Agents Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading agents...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAgents.map((agent, idx) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                >
                  <Link href={`/agents/${agent.id}`}>
                    <div className="bg-white rounded-lg p-6 pixel-shadow smooth-hover hover:scale-105 h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-5xl">{getEmoji(agent.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                              {agent.type}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {agent.rating}
                            </span>
                          </div>
                          <h3 className="font-bold text-xl mb-2">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {agent.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {Array.isArray(agent.features) && agent.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Zap className="w-4 h-4 text-neon-green flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xl font-bold text-primary">${agent.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {agent.downloads} downloads
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No agents found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}