"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What is included in the subscription plan?',
      answer: 'Full access to all templates, AI agents, priority support, and monthly updates with new templates.'
    },
    {
      question: 'Can I use templates on multiple projects?',
      answer: 'Yes! Once purchased, you can use templates across unlimited projects within your organization.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee if you\'re not satisfied with your purchase.'
    },
    {
      question: 'How often are new templates added?',
      answer: 'We add new templates and agents weekly, with major releases every month.'
    },
    {
      question: 'Is technical support included?',
      answer: 'Yes! All plans include email support, with priority support for subscription members.'
    },
    {
      question: 'Can I customize the templates?',
      answer: 'Absolutely! All templates are fully customizable and come with detailed documentation.'
    }
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="pixel-text text-3xl md:text-4xl mb-4">
            Have Questions? We've Got Answers
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our platform
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="bg-white rounded-lg pixel-shadow overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left smooth-hover hover:bg-muted/50"
              >
                <span className="font-bold">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}