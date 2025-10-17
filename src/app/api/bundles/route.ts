import { NextResponse } from 'next/server'

// Mock bundle data
const bundles = [
  {
    id: 1,
    name: 'Marketing Automation Suite',
    description: 'Complete marketing automation toolkit',
    originalPrice: 299,
    bundlePrice: 179,
    discount: 40,
    templates: [
      'Email Campaign Bot',
      'Social Media Scheduler',
      'Content Generator',
      'Analytics Dashboard',
      'Lead Magnet Creator',
    ],
    saves: 120,
  },
  {
    id: 2,
    name: 'Sales Acceleration Pack',
    description: 'Boost your sales with AI-powered tools',
    originalPrice: 349,
    bundlePrice: 209,
    discount: 40,
    templates: [
      'Lead Scoring Agent',
      'CRM Sync Master',
      'Sales Intelligence Agent',
      'Proposal Generator',
      'Follow-up Automation',
    ],
    saves: 140,
  },
  {
    id: 3,
    name: 'AI Agent Starter Kit',
    description: 'Essential AI agents for automation',
    originalPrice: 399,
    bundlePrice: 239,
    discount: 40,
    templates: [
      'Customer Support AI',
      'Content Research Bot',
      'Data Analyzer',
      'Workflow Optimizer',
      'Sentiment Analyzer',
    ],
    saves: 160,
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: bundles,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bundleId, userId } = body

    const bundle = bundles.find(b => b.id === parseInt(bundleId))

    if (!bundle) {
      return NextResponse.json({
        success: false,
        message: 'Bundle not found',
      }, { status: 404 })
    }

    // In production, process payment and grant access
    const purchase = {
      id: `bundle_purchase_${Date.now()}`,
      userId,
      bundleId,
      amount: bundle.bundlePrice,
      status: 'completed',
      purchasedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: purchase,
      message: 'Bundle purchased successfully',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Purchase failed',
    }, { status: 500 })
  }
}