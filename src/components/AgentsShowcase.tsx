"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Brain, MessageSquare, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const agents = [
  {
    id: 1,
    name: 'Customer Support AI',
    type: 'Conversational',
    icon: MessageSquare,
    price: 79,
    description: '24/7 intelligent customer support with natural language understanding',
    features: ['Multi-language', 'Sentiment analysis', 'Auto-escalation'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Sales Intelligence Agent',
    type: 'Analytics',
    icon: TrendingUp,
    price: 99,
    description: 'AI-powered lead scoring and opportunity prediction',
    features: ['Lead scoring', 'Pipeline analysis', 'Forecasting'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    name: 'Content Research Bot',
    type: 'Research',
    icon: Brain,
    price: 69,
    description: 'Automated content research and topic discovery',
    features: ['Trend analysis', 'Competitor tracking', 'SEO insights'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 4,
    name: 'Workflow Optimizer',
    type: 'Automation',
    icon: Bot,
    price: 89,
    description: 'Intelligent workflow optimization and task automation',
    features: ['Smart routing', 'Auto-optimization', 'Performance tracking'],
    color: 'from-orange-500 to-red-500',
  },
]

export default function AgentsShowcase() {
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
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-6 smooth-hover hover:shadow-xl border-2 group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${agent.color} opacity-10 rounded-bl-full`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${agent.color} rounded-lg flex items-center justify-center pixel-shadow`}>
                      <agent.icon className="w-7 h-7 text-white" />
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
                    {agent.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

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
          ))}
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