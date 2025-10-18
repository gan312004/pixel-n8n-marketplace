"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Star, Download, Eye, Check, Play, 
  FileText, Settings, Zap, ShoppingCart, Loader2 
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Template {
  id: number
  name: string
  category: string
  price: number
  rating: number
  downloads: number
  description: string
  featured: boolean
  features: string[]
  requirements: string[]
  image?: string | null
}

interface TemplateDetailProps {
  templateId: string
}

export default function TemplateDetail({ templateId }: TemplateDetailProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}`)
      const data = await response.json()
      
      if (data.success) {
        // Parse JSON fields if they're strings
        const parsedTemplate = {
          ...data.data,
          features: typeof data.data.features === 'string' 
            ? JSON.parse(data.data.features) 
            : data.data.features || [],
          requirements: typeof data.data.requirements === 'string'
            ? JSON.parse(data.data.requirements)
            : data.data.requirements || []
        }
        setTemplate(parsedTemplate)
      }
    } catch (error) {
      console.error('Error fetching template:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!template) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item.id === template.id && item.type === 'template')

    if (existingItem) {
      existingItem.quantity += 1
      toast.success('Quantity updated in cart')
    } else {
      cart.push({
        id: template.id,
        name: template.name,
        type: 'template',
        price: template.price,
        quantity: 1,
        category: template.category
      })
      toast.success('Template added to cart!')
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const buyNow = () => {
    addToCart()
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Template not found</h2>
          <Link href="/templates">
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    )
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
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-3">Description</h3>
                    <p className="text-muted-foreground">{template.description}</p>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-4">What's Included</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Array.isArray(template.features) && template.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <Card className="p-6 pixel-shadow">
                    <h3 className="text-xl font-bold mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {Array.isArray(template.requirements) && template.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
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

                  <Button 
                    onClick={buyNow}
                    className="w-full smooth-hover hover:scale-105 pixel-text text-xs" 
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>

                  <Button 
                    onClick={addToCart}
                    variant="outline"
                    className="w-full smooth-hover hover:scale-105"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
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
                      <span>Installation guide PDF</span>
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