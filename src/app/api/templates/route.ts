import { NextResponse } from 'next/server'

// Mock template data - in production, this would come from a database
const templates = [
  {
    id: 1,
    name: 'AI Content Generator',
    category: 'AI Automation',
    price: 49,
    rating: 4.9,
    downloads: 1200,
    description: 'Automated content generation with GPT-4 integration',
    featured: true,
    features: ['GPT-4 Integration', 'Multi-format output', 'SEO optimization'],
    requirements: ['n8n 1.0+', 'OpenAI API key'],
  },
  {
    id: 2,
    name: 'CRM Sync Master',
    category: 'Data Sync',
    price: 39,
    rating: 4.8,
    downloads: 980,
    description: 'Synchronize multiple CRM platforms seamlessly',
    featured: true,
    features: ['Multi-CRM support', 'Real-time sync', 'Conflict resolution'],
    requirements: ['n8n 1.0+', 'CRM API access'],
  },
  {
    id: 3,
    name: 'Email Campaign Bot',
    category: 'Marketing',
    price: 59,
    rating: 4.7,
    downloads: 850,
    description: 'Intelligent email marketing automation',
    featured: false,
    features: ['A/B testing', 'Segmentation', 'Analytics'],
    requirements: ['n8n 1.0+', 'Email provider API'],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  let filteredTemplates = templates

  if (category && category !== 'All') {
    filteredTemplates = filteredTemplates.filter(t => t.category === category)
  }

  if (featured === 'true') {
    filteredTemplates = filteredTemplates.filter(t => t.featured)
  }

  return NextResponse.json({
    success: true,
    data: filteredTemplates,
    count: filteredTemplates.length,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In production, save to database
    const newTemplate = {
      id: templates.length + 1,
      ...body,
      rating: 0,
      downloads: 0,
      featured: false,
    }

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create template',
    }, { status: 500 })
  }
}