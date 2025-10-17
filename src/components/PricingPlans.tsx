"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Sparkles, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Single Purchase',
    icon: Zap,
    price: 'Per Item',
    description: 'Buy individual templates or agents',
    features: [
      'Choose any template/agent',
      'Lifetime access',
      'Free updates for 1 year',
      'Basic support',
      'Setup documentation',
    ],
    cta: 'Browse mart',
    popular: false,
  },
  {
    name: 'Pro Subscription',
    icon: Sparkles,
    price: '$49/mo',
    description: 'Unlimited access to all templates',
    features: [
      'All templates & agents',
      'Unlimited downloads',
      'Priority support',
      'Early access to new releases',
      'Setup guidance sessions',
      'Commercial license',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Bundle Deals',
    icon: Rocket,
    price: 'Save 40%',
    description: 'Curated bundles for specific needs',
    features: [
      '5-10 related templates',
      'Lifetime access',
      'Free updates forever',
      'Priority support',
      'Implementation guide',
      'Custom configurations',
    ],
    cta: 'View Bundles',
    popular: false,
  },
]

export default function PricingPlans() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="pixel-text text-3xl md:text-4xl lg:text-5xl mb-4">
            Flexible Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that works best for your automation needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className={`p-8 smooth-hover hover:shadow-2xl relative overflow-hidden bg-card ${
                plan.popular ? 'border-2 border-primary scale-105 md:scale-110' : 'border-2'
              }`}>
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-neon-green text-black font-bold pixel-text text-xs">
                    Popular
                  </Badge>
                )}

                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-deep-purple rounded-lg flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="pixel-text text-3xl mb-2 text-primary">{plan.price}</div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full smooth-hover hover:scale-105 ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 text-white pixel-text text-xs' 
                      : 'variant-outline'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bundle Offers Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-neon-green" />
                  Special Bundle Offers
                </h3>
                <p className="text-muted-foreground">
                  Get curated bundles for Marketing, Sales, or AI Automation - Save up to 40%
                </p>
              </div>
              <Button 
                size="lg"
                className="pixel-text text-xs bg-primary hover:bg-primary/90 smooth-hover hover:scale-105"
              >
                Explore Bundles
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}