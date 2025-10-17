"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Star, TrendingUp, Zap, Code, FileText, Play } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { useParams } from 'next/navigation'

export default function AgentDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in production this would come from API
  const agent = {
    id: params.id,
    name: 'Customer Support AI',
    description: 'Intelligent AI agent that handles customer inquiries 24/7 with natural language processing',
    category: 'Support',
    price: 79,
    rating: 4.9,
    reviews: 543,
    users: 1234,
    icon: '🤖',
    image: '🤖',
    features: [
      'Natural language processing',
      'Multi-language support (50+ languages)',
      'Context awareness across conversations',
      'Integration with popular help desk tools',
      'Automated ticket creation',
      'Sentiment analysis',
      'Custom training on your data',
      '24/7 operation'
    ],
    capabilities: [
      'Understand and respond to customer queries',
      'Escalate complex issues to human agents',
      'Provide instant responses to common questions',
      'Learn from past interactions',
      'Handle multiple conversations simultaneously',
      'Integrate with CRM systems'
    ],
    setupSteps: [
      'Install the agent from n8n mart',
      'Connect your communication channels (Slack, Email, etc.)',
      'Configure response templates and rules',
      'Train the AI with your FAQs and documentation',
      'Test with sample queries',
      'Deploy to production'
    ],
    requirements: [
      'n8n instance (self-hosted or cloud)',
      'API keys for connected services',
      'Training data (FAQs, documentation)',
      'At least 2GB RAM recommended'
    ]
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
                  <div className="text-7xl">{agent.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded">
                        {agent.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{agent.rating}</span>
                        <span className="text-muted-foreground">({agent.reviews} reviews)</span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">{agent.name}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{agent.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {agent.users.toLocaleString()} users
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg pixel-shadow mb-6">
                <div className="border-b flex gap-1 p-2">
                  {['overview', 'setup', 'requirements'].map(tab => (
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
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Key Features
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {agent.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <RefreshCw className="w-5 h-5 text-primary" />
                          What It Can Do
                        </h3>
                        <ul className="space-y-3">
                          {agent.capabilities.map((capability, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                              <span>{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'setup' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Setup Guide</h3>
                      <ol className="space-y-4">
                        {agent.setupSteps.map((step, i) => (
                          <li key={i} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                              {i + 1}
                            </div>
                            <div className="flex-1 pt-1">
                              <p>{step}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {activeTab === 'requirements' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        System Requirements
                      </h3>
                      <ul className="space-y-3">
                        {agent.requirements.map((req, i) => (
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
                asChild
                size="lg"
                className="w-full mb-3 pixel-text text-xs smooth-hover hover:scale-105"
              >
                <Link href="/auth">
                  Purchase Agent
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full mb-6"
              >
                <Link href="#preview">
                  Preview Demo
                </Link>
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
                    <div className="text-muted-foreground">Download immediately</div>
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