"use client"

import { motion } from 'framer-motion'
import { Check, Zap, Crown, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LeftSidebar from '@/components/LeftSidebar'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$19',
      icon: Zap,
      description: 'Perfect for trying out n8n mart',
      features: [
        '5 Templates per month',
        '2 AI Agents',
        'Basic support',
        'Community access',
        'Monthly updates'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$49',
      icon: Crown,
      description: 'Best for professionals and teams',
      features: [
        'Unlimited Templates',
        'Unlimited AI Agents',
        'Priority support',
        'Private community',
        'Weekly updates',
        'Custom integrations',
        'Advanced analytics'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      icon: Rocket,
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated support',
        'Custom development',
        'SLA guarantees',
        'Training sessions',
        'White-label options',
        'API access'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen pt-32 pb-20 px-4 pl-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="pixel-text text-4xl md:text-5xl mb-4">
              Choose Your <span className="text-primary">Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your automation needs. All plans include our core features.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative bg-white rounded-lg p-8 pixel-shadow smooth-hover hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium pixel-text">
                    Most Popular
                  </div>
                )}

                <plan.icon className={`w-12 h-12 mb-4 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                
                <h3 className="pixel-text text-2xl mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full pixel-text text-xs smooth-hover hover:scale-105 ${
                    plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href="/auth">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Bundle Offers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-primary to-deep-purple rounded-lg p-8 text-white"
          >
            <div className="text-center">
              <h2 className="pixel-text text-3xl mb-4">Bundle Deals Available!</h2>
              <p className="text-lg mb-6 text-white/90">
                Save up to 40% when you buy template bundles. Perfect for specific use cases.
              </p>
              <Button
                asChild
                size="lg"
                className="pixel-text text-xs bg-white text-primary hover:bg-white/90 smooth-hover hover:scale-105"
              >
                <Link href="/bundles">
                  View Bundles
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}