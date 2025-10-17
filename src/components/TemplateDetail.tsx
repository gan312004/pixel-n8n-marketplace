"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Star, Download, Eye, Check, Play, 
  FileText, Settings, Zap, ShoppingCart 
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface TemplateDetailProps {
  templateId: string
}

export default function TemplateDetail({ templateId }: TemplateDetailProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Mock data - in real app, fetch from API
  const template = {
    id: templateId,
    name: 'AI Content Generator',
    category: 'AI Automation',
    price: 49,
    rating: 4.9,
    reviews: 234,
    downloads: 1200,
    description: 'Advanced AI-powered content generation workflow using GPT-4. Perfect for marketers, bloggers, and content creators who need to produce high-quality content at scale.',
    longDescription: 'This comprehensive template integrates with multiple AI providers including OpenAI, Claude, and Gemini. It features intelligent prompt engineering, content quality scoring, and multi-format output support. Ideal for blog posts, social media, email campaigns, and more.',
    features: [
      'GPT-4 Integration',
      'Multi-format output (Blog, Social, Email)',
      'Content quality scoring',
      'SEO optimization',
      'Plagiarism checking',
      'Auto-publishing to CMS',
      'Analytics tracking',
      'A/B testing support',
    ],
    requirements: [
      'n8n version 1.0 or higher',
      'OpenAI API key',
      'Node.js 18+',
      '2GB RAM minimum',
    ],
    setupSteps: [
      {
        title: 'Import Template',
        description: 'Download and import the JSON file into your n8n instance',
      },
      {
        title: 'Configure API Keys',
        description: 'Add your OpenAI and other service API keys to credentials',
      },
      {
        title: 'Customize Workflows',
        description: 'Adjust nodes and parameters to match your use case',
      },
      {
        title: 'Test & Deploy',
        description: 'Run test executions and activate the workflow',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white">
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/templates">
            <Button variant="ghost" className="mb-6 smooth-hover hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-8 pixel-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2 bg-primary/10 text-primary">{template.category}</Badge>
                    <h1 className="text-4xl font-bold mb-2">{template.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{template.rating}</span>
                        <span className="text-sm">({template.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{template.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Image */}
              <Card className="overflow-hidden pixel-shadow">
                <div className="h-96 bg-gradient-to-br from-primary/20 via-deep-purple/20 to-neon-green/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white/90 hover:bg-white text-black smooth-hover hover:scale-110 pixel-text text-xs"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Preview Workflow
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start bg-white pixel-shadow">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="setup">Setup Guide</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-3">Description</h3>
                    <p className="text-muted-foreground mb-4">{template.description}</p>
                    <p className="text-muted-foreground">{template.longDescription}</p>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-4">What's Included</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {template.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TabsContent>

                <TabsContent value="setup" className="mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-4">Setup Instructions</h3>
                    <div className="space-y-4">
                      {template.setupSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {template.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2">
                          <Settings className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <Card className="p-6 sticky top-32 pixel-shadow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Price</span>
                    <span className="pixel-text text-2xl text-primary">${template.price}</span>
                  </div>

                  <Button asChild className="w-full smooth-hover hover:scale-105 pixel-text text-xs" size="lg">
                    <Link href="/auth">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Link>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full smooth-hover hover:scale-105"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>

                  <div className="pt-4 border-t space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-neon-green" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-neon-green" />
                      <span>Free updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-neon-green" />
                      <span>Setup documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-neon-green" />
                      <span>Community support</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6 pixel-shadow bg-gradient-to-br from-primary/10 to-deep-purple/10">
                <h3 className="font-bold mb-4">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get priority support and setup assistance with our Pro subscription.
                </p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full smooth-hover hover:scale-105">
                    View Plans
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}