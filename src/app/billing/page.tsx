"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, CreditCard, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LeftSidebar from '@/components/LeftSidebar'

interface CartItem {
  id: number
  name: string
  type: 'template' | 'agent' | 'bundle'
  price: number
  quantity: number
}

export default function BillingPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    } else {
      router.push('/cart')
    }
  }, [router])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      localStorage.removeItem('cart')
      toast.success('Payment successful! Check your email for download links.')
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white pt-32 pb-20 px-4 pl-32">
        <div className="max-w-6xl mx-auto">
          <Link href="/cart">
            <Button variant="ghost" className="mb-6 smooth-hover hover:scale-105">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
              Secure <span className="text-primary">Checkout</span>
            </h1>
            <p className="text-muted-foreground mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
              Complete your purchase securely
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="p-8 pixel-shadow" style={{ fontFamily: 'var(--font-sans)' }}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
                        Contact Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" required className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" required className="mt-1" />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" required className="mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
                        Payment Method
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative mt-1">
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              required
                              className="pl-10"
                            />
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" required className="mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">3</span>
                        Billing Address
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address">Street Address</Label>
                          <Input id="address" required className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" required className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" required className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" required className="mt-1" />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isProcessing}
                      className="w-full smooth-hover hover:scale-105 font-semibold text-base"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Secure Payment - ${total.toFixed(2)}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Your payment is secured with 256-bit SSL encryption
                    </p>
                  </form>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="p-6 pixel-shadow sticky top-32" style={{ fontFamily: 'var(--font-sans)' }}>
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground text-xs">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                      <span>Instant access after payment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                      <span>Installation guide PDF included</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                      <span>Lifetime updates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}