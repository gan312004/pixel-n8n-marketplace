import { NextResponse } from 'next/server'

// Mock subscription plans
const plans = [
  {
    id: 'single',
    name: 'Single Purchase',
    type: 'one-time',
    price: 0, // Variable per item
    features: [
      'Choose any template/agent',
      'Lifetime access',
      'Free updates for 1 year',
      'Basic support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Subscription',
    type: 'subscription',
    price: 49,
    interval: 'month',
    features: [
      'All templates & agents',
      'Unlimited downloads',
      'Priority support',
      'Early access to new releases',
      'Setup guidance sessions',
      'Commercial license',
    ],
  },
  {
    id: 'bundle',
    name: 'Bundle Deals',
    type: 'bundle',
    price: 0, // Variable per bundle
    discount: 40,
    features: [
      '5-10 related templates',
      'Lifetime access',
      'Free updates forever',
      'Priority support',
      'Implementation guide',
    ],
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: plans,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { planId, userId, paymentMethod } = body

    // In production, process payment with Stripe/PayPal
    // Create subscription record in database
    
    const subscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create subscription',
    }, { status: 500 })
  }
}