import { NextResponse } from 'next/server'

// Mock agents data
const agents = [
  {
    id: 1,
    name: 'Customer Support AI',
    type: 'Conversational',
    price: 79,
    rating: 4.9,
    downloads: 450,
    description: '24/7 intelligent customer support with natural language understanding',
    features: ['Multi-language', 'Sentiment analysis', 'Auto-escalation'],
    requirements: ['n8n 1.0+', 'AI API access'],
  },
  {
    id: 2,
    name: 'Sales Intelligence Agent',
    type: 'Analytics',
    price: 99,
    rating: 4.8,
    downloads: 380,
    description: 'AI-powered lead scoring and opportunity prediction',
    features: ['Lead scoring', 'Pipeline analysis', 'Forecasting'],
    requirements: ['n8n 1.0+', 'CRM integration'],
  },
  {
    id: 3,
    name: 'Content Research Bot',
    type: 'Research',
    price: 69,
    rating: 4.7,
    downloads: 320,
    description: 'Automated content research and topic discovery',
    features: ['Trend analysis', 'Competitor tracking', 'SEO insights'],
    requirements: ['n8n 1.0+', 'API keys'],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  let filteredAgents = agents

  if (type && type !== 'All') {
    filteredAgents = filteredAgents.filter(a => a.type === type)
  }

  return NextResponse.json({
    success: true,
    data: filteredAgents,
    count: filteredAgents.length,
  })
}