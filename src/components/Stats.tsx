"use client"

import { motion } from 'framer-motion'
import { Users, Star, Download, TrendingUp } from 'lucide-react'

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users'
    },
    {
      icon: Download,
      value: '50,000+',
      label: 'Downloads'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Average Rating'
    },
    {
      icon: TrendingUp,
      value: '99.9%',
      label: 'Uptime'
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary to-deep-purple text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="pixel-text text-3xl md:text-4xl mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Join our growing community of automation enthusiasts
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-neon-green" />
              <div className="pixel-text text-3xl mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}