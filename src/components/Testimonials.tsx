"use client"

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      content: 'These templates saved us hundreds of hours. The AI agents are incredibly powerful and easy to set up.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      company: 'StartupXYZ',
      content: 'Best investment we made this year. The automation workflows are game-changing for our operations.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Lead',
      company: 'Enterprise Co',
      content: 'Outstanding support and documentation. We scaled our automation from 0 to 100 in just weeks.',
      rating: 5
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
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real feedback from real automation experts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-lg p-6 pixel-shadow smooth-hover hover:scale-105"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-neon-green text-neon-green" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}