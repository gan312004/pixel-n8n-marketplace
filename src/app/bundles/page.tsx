"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Star, Zap, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LeftSidebar from '@/components/LeftSidebar'

interface Bundle {
  id: number
  name: string
  description: string
  originalPrice: number
  bundlePrice: number
  discount: number
  templates: string[]
  saves: number
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bundles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBundles(data.data)
        }
      })
      .catch(error => console.error('Error fetching bundles:', error))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white pt-20 pb-20 px-4 pl-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-neon-green/10 border border-neon-green/20 rounded-full text-sm font-medium text-neon-green">
                🎉 Save up to 50% with Bundles
              </span>
            </div>
            <h1 className="pixel-text text-4xl md:text-5xl mb-4">
              Bundle <span className="text-primary">Deals</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get more value with our curated bundles. Perfect for specific use cases.
            </p>
          </motion.div>

          {/* Bundles Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading bundles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bundles.map((bundle, idx) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="bg-white rounded-lg p-8 pixel-shadow smooth-hover hover:scale-105"
                >
                  <div className="mb-6">
                    <h3 className="font-bold text-2xl mb-2">{bundle.name}</h3>
                    <p className="text-muted-foreground mb-3">{bundle.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl font-bold text-primary">${bundle.bundlePrice}</span>
                      <span className="text-lg text-muted-foreground line-through">${bundle.originalPrice}</span>
                      <span className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs font-bold rounded">
                        SAVE {bundle.discount}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>

                  {/* Includes */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      What's Included:
                    </h4>
                    <ul className="space-y-2">
                      {bundle.templates.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    asChild
                    className="w-full pixel-text text-xs smooth-hover hover:scale-105"
                    size="lg"
                  >
                    <Link href="/auth">
                      Get This Bundle
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}