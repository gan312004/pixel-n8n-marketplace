"use client"

import { motion } from 'framer-motion'
import { Search, Download, Settings, CheckCircle } from 'lucide-react'
import { ShinyText } from '@/components/ui/shiny-text'

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Browse Templates',
      description: 'Explore our extensive library of pre-built n8n templates and AI agents'
    },
    {
      icon: Download,
      title: 'Choose Your Plan',
      description: 'Select a subscription, single purchase, or bundle that fits your needs'
    },
    {
      icon: Settings,
      title: 'Setup & Customize',
      description: 'Follow our detailed guides to configure templates for your workflow'
    },
    {
      icon: CheckCircle,
      title: 'Deploy & Automate',
      description: 'Launch your automation and watch your productivity soar'
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="pixel-text text-3xl md:text-4xl mb-4">
            How It Works
          </h2>
          <ShinyText className="text-lg max-w-2xl mx-auto block">
            Get started in minutes with our simple 4-step process
          </ShinyText>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-dark-purple to-primary rounded-full flex items-center justify-center pixel-shadow">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <div className="pixel-text text-lg mb-2">Step {idx + 1}</div>
              <h3 className="font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}