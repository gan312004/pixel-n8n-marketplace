"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Package, Star, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import LeftSidebar from '@/components/LeftSidebar'

interface Template {
  id: number
  name: string
  description: string
  category: string
  price: number
  rating: number
  downloads: number
  featured?: boolean
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTemplates(data.data)
        }
      })
      .catch(error => console.error('Error fetching templates:', error))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'AI Automation': '🤖',
      'Data Sync': '🔄',
      'Marketing': '📧',
      'Sales': '💼',
      'HR': '👥',
      'Finance': '💰',
      'IT': '🎫'
    }
    return emojiMap[category] || '📊'
  }

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white pt-32 pb-20 px-4 pl-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="pixel-text text-4xl md:text-5xl mb-4">
              Browse <span className="text-primary">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover ready-to-use n8n templates for every use case
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap smooth-hover transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white hover:bg-muted'
                  }`}
                >
                  {category === 'all' ? 'All Templates' : category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Templates Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading templates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                >
                  <Link href={`/templates/${template.id}`}>
                    <div className="bg-white rounded-lg p-6 pixel-shadow smooth-hover hover:scale-105 h-full">
                      <div className="text-6xl mb-4">{getEmoji(template.category)}</div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                          {template.category}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {template.rating}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="pixel-text text-lg text-primary">${template.price}</span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Download className="w-4 h-4" />
                          {template.downloads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}