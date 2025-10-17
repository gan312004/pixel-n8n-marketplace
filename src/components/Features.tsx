"use client"

import { motion } from 'framer-motion'
import { Zap, Shield, Code, Puzzle, Rocket, Clock } from 'lucide-react'
import { ShinyText } from '@/components/ui/shiny-text'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Deploy workflows in seconds with optimized templates'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime guarantee'
    },
    {
      icon: Code,
      title: 'Easy Integration',
      description: 'Works with 300+ apps and services out of the box'
    },
    {
      icon: Puzzle,
      title: 'Drag & Drop',
      description: 'No coding required with our visual workflow builder'
    },
    {
      icon: Rocket,
      title: 'Scale Effortlessly',
      description: 'From startup to enterprise, grow without limits'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Expert support team ready to help anytime'
    }
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="pixel-text text-3xl md:text-4xl mb-4">
            Why Choose Us
          </h2>
          <ShinyText className="text-lg max-w-2xl mx-auto block">
            Everything you need to automate your workflows and scale your business
          </ShinyText>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-lg p-6 pixel-shadow smooth-hover hover:scale-105"
            >
              <feature.icon className="w-12 h-12 text-neon-green mb-4" />
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}