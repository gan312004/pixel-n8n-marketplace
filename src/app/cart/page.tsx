"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, ShoppingCart, ArrowRight, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LeftSidebar from '@/components/LeftSidebar'

interface CartItem {
  id: number
  name: string
  type: 'template' | 'agent' | 'bundle'
  price: number
  quantity: number
  category?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items))
    setCartItems(items)
  }

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    saveCart(updatedCart)
  }

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    saveCart(updatedCart)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    router.push('/billing')
  }

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-white pt-32 pb-20 px-4 pl-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="pixel-text text-4xl mb-8">
              Shopping <span className="text-primary">Cart</span>
            </h1>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center py-20"
            >
              <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start adding templates and agents to your cart
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/templates">
                  <Button className="pixel-text text-xs">Browse Templates</Button>
                </Link>
                <Link href="/agents">
                  <Button variant="outline" className="pixel-text text-xs">Browse Agents</Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                  >
                    <Card className="p-6 pixel-shadow">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-neon-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">
                            {item.type === 'template' ? '📄' : item.type === 'agent' ? '🤖' : '📦'}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {item.type} {item.category && `• ${item.category}`}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive/80 smooth-hover"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-muted smooth-hover"
                                disabled={item.quantity === 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-muted smooth-hover"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="pixel-text text-xl text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs text-muted-foreground">
                                  ${item.price} each
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="p-6 pixel-shadow sticky top-32">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-bold text-lg">Total</span>
                        <span className="pixel-text text-2xl text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full pixel-text text-xs smooth-hover hover:scale-105"
                      size="lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        ✓ Secure checkout
                      </p>
                      <p className="flex items-center gap-2">
                        ✓ Instant access after payment
                      </p>
                      <p className="flex items-center gap-2">
                        ✓ 30-day money-back guarantee
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}