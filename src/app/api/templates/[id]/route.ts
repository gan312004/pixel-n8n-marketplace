import { NextResponse } from 'next/server'

// Mock detailed template data
const templateDetails: Record<string, any> = {
  '1': {
    id: 1,
    name: 'AI Content Generator',
    category: 'AI Automation',
    price: 49,
    rating: 4.9,
    reviews: 234,
    downloads: 1200,
    description: 'Advanced AI-powered content generation workflow using GPT-4',
    longDescription: 'This comprehensive template integrates with multiple AI providers including OpenAI, Claude, and Gemini. Perfect for marketers and content creators.',
    features: [
      'GPT-4 Integration',
      'Multi-format output',
      'Content quality scoring',
      'SEO optimization',
      'Plagiarism checking',
      'Auto-publishing to CMS',
    ],
    requirements: [
      'n8n version 1.0 or higher',
      'OpenAI API key',
      'Node.js 18+',
      '2GB RAM minimum',
    ],
    setupSteps: [
      { title: 'Import Template', description: 'Download and import the JSON file' },
      { title: 'Configure API Keys', description: 'Add your API keys to credentials' },
      { title: 'Customize Workflows', description: 'Adjust nodes and parameters' },
      { title: 'Test & Deploy', description: 'Run test executions and activate' },
    ],
  },
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const template = templateDetails[params.id]

  if (!template) {
    return NextResponse.json({
      success: false,
      message: 'Template not found',
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: template,
  })
}