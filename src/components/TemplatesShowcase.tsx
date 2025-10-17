"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Star, Download } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const templates = [
  {
    id: 1,
    name: 'AI Content Generator',
    category: 'AI Automation',
    price: 49,
    rating: 4.9,
    downloads: 1200,
    description: 'Automated content generation with GPT-4 integration',
    featured: true,
  },
  {
    id: 2,
    name: 'CRM Sync Master',
    category: 'Data Sync',
    price: 39,
    rating: 4.8,
    downloads: 980,
    description: 'Synchronize multiple CRM platforms seamlessly',
    featured: true,
  },
  {
    id: 3,
    name: 'Email Campaign Bot',
    category: 'Marketing',
    price: 59,
    rating: 4.7,
    downloads: 850,
    description: 'Intelligent email marketing automation',
    featured: false,
  },
  {
    id: 4,
    name: 'Social Media Scheduler',
    category: 'Social Media',
    price: 45,
    rating: 4.9,
    downloads: 1100,
    description: 'Cross-platform social media posting',
    featured: true,
  },
  {
    id: 5,
    name: 'Invoice Generator Pro',
    category: 'Finance',
    price: 35,
    rating: 4.6,
    downloads: 720,
    description: 'Automated invoice creation and tracking',
    featured: false,
  },
  {
    id: 6,
    name: 'Lead Scoring Agent',
    category: 'Sales',
    price: 69,
    rating: 4.8,
    downloads: 890,
    description: 'AI-powered lead qualification system',
    featured: true,
  },
]

const categories = ['All', 'AI Automation', 'Data Sync', 'Marketing', 'Social Media', 'Finance', 'Sales']

export default function TemplatesShowcase() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="pixel-text text-3xl md:text-4xl lg:text-5xl mb-4">
            Featured Templates
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked premium templates to accelerate your workflow
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              className={`smooth-hover ${
                activeCategory === category 
                  ? 'bg-primary text-white' 
                  : 'hover:border-primary'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden smooth-hover hover:shadow-xl border-2 group">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 via-deep-purple/20 to-neon-green/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-deep-purple to-primary rounded-lg pixel-shadow flex items-center justify-center">
                      <span className="pixel-text text-neon-green text-xs">N8N</span>
                    </div>
                  </div>
                  {template.featured && (
                    <Badge className="absolute top-3 right-3 bg-neon-green text-black font-bold">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary smooth-hover">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                    <div className="pixel-text text-lg text-primary">${template.price}</div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/templates/${template.id}`} className="flex-1">
                      <Button className="w-full smooth-hover hover:scale-105">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="smooth-hover hover:scale-105 hover:border-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="pixel-text text-xs smooth-hover hover:scale-105 border-2"
          >
            View All Templates
          </Button>
        </div>
      </div>
    </section>
  )
}