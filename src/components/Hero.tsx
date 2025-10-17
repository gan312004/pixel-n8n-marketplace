"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [displayText, setDisplayText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  
  const words = ['Templates', 'Agents', 'Workflows', 'Automations']

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = isDeleting ? 500 : 2000

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      } else {
        setDisplayText(
          isDeleting
            ? currentWord.substring(0, displayText.length - 1)
            : currentWord.substring(0, displayText.length + 1)
        )
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, currentWordIndex])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              🚀 100+ Premium Templates & Agents
            </span>
          </div>
          
          <h1 className="pixel-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            <span className="text-neon-green" style={{ textShadow: '4px 4px 0px rgba(0, 0, 0, 1)' }}>
              n8n {displayText}
              <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-4 block">
              & AI Agents
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Supercharge your automation with premium n8n templates and intelligent agents. 
            Ready to deploy, easy to customize, built by experts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              asChild
              size="lg" 
              className="pixel-text text-xs bg-primary hover:bg-primary/90 smooth-hover hover:scale-105 group"
            >
              <Link href="/templates">
                Browse Templates
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              className="pixel-text text-xs bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary smooth-hover hover:scale-105"
            >
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Zap, label: 'Templates', value: '150+' },
            { icon: Bot, label: 'AI Agents', value: '50+' },
            { icon: ArrowRight, label: 'Happy Users', value: '10K+' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glassmorphic rounded-lg p-6 pixel-shadow smooth-hover hover:scale-105"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-neon-green" />
              <div className="pixel-text text-2xl mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}