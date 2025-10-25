"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X, User, Settings as SettingsIcon, ShoppingCart, Package, Bot, DollarSign, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ExpandableTabs } from '@/components/ui/expandable-tabs'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(total)
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!session?.user) {
        setIsAdmin(false)
        return
      }

      try {
        const token = localStorage.getItem('bearer_token')
        if (!token) return

        const response = await fetch('/api/admin/check-auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        setIsAdmin(data.success && data.isAdmin)
      } catch (error) {
        setIsAdmin(false)
      }
    }

    if (!isPending) {
      checkAdmin()
    }
  }, [session, isPending])

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
    }
  }

  const navTabs = [
    { title: 'Templates', icon: Package },
    { title: 'Agents', icon: Bot },
    { type: 'separator' as const },
    { title: 'Pricing', icon: DollarSign },
    { title: 'Bundles', icon: Gift },
  ]

  const handleTabChange = (index: number | null) => {
    if (index === null) return
    
    const routes = ['/templates', '/agents', null, '/pricing', '/bundles']
    const route = routes[index >= 2 ? index - 1 : index]
    
    if (route) {
      router.push(route)
    }
  }

  return (
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'w-[95%] max-w-6xl' : 'w-[90%] max-w-5xl'
      }`}
    >
      <div 
        className="bg-white dark:bg-white rounded-2xl px-6 py-4 border border-border smooth-hover"
        style={{ 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 smooth-hover hover:scale-105 flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-deep-purple to-black rounded-xl flex items-center justify-center pixel-shadow">
              <span className="pixel-text text-dark-green" style={{ fontSize: '10px' }}>Auto</span>
            </div>
            <span className="pixel-text text-sm hidden sm:block text-black">Mart</span>
          </Link>

          {/* Desktop Navigation - Expandable Tabs */}
          <div className="hidden md:block flex-1 max-w-xl">
            <ExpandableTabs 
              tabs={navTabs}
              activeColor="text-primary"
              onChange={handleTabChange}
              className="bg-white border-border"
            />
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Cart Icon */}
            <Link href="/cart" className="relative smooth-hover hover:text-primary">
              <ShoppingCart className="w-6 h-6 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isPending && (
              session?.user ? (
                <>
                  <Button 
                    asChild 
                    className="pixel-text text-xs bg-primary hover:bg-primary/90 smooth-hover gap-2 relative"
                    style={{
                      transform: 'translateZ(0)',
                      boxShadow: '0 8px 0 rgba(107, 70, 193, 0.8), 0 12px 20px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) translateZ(0)'
                      e.currentTarget.style.boxShadow = '0 12px 0 rgba(107, 70, 193, 0.8), 0 16px 24px rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateZ(0)'
                      e.currentTarget.style.boxShadow = '0 8px 0 rgba(107, 70, 193, 0.8), 0 12px 20px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <Link href="/dashboard">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>

                  {isAdmin && (
                    <Button 
                      asChild 
                      variant="outline"
                      className="pixel-text text-xs smooth-hover"
                    >
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 smooth-hover hover:bg-destructive/10 text-destructive font-medium rounded-lg text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Button asChild className="pixel-text text-xs bg-primary hover:bg-primary/90 smooth-hover hover:scale-105">
                  <Link href="/auth">Login</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden smooth-hover hover:text-primary text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2">
            <Link
              href="/templates"
              className="flex items-center gap-3 px-3 py-2 smooth-hover hover:text-primary font-medium text-black rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package className="w-5 h-5" />
              Templates
            </Link>
            <Link
              href="/agents"
              className="flex items-center gap-3 px-3 py-2 smooth-hover hover:text-primary font-medium text-black rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bot className="w-5 h-5" />
              Agents
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-3 px-3 py-2 smooth-hover hover:text-primary font-medium text-black rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <DollarSign className="w-5 h-5" />
              Pricing
            </Link>
            <Link
              href="/bundles"
              className="flex items-center gap-3 px-3 py-2 smooth-hover hover:text-primary font-medium text-black rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Gift className="w-5 h-5" />
              Bundles
            </Link>
            
            {/* Mobile Cart Link */}
            <Link 
              href="/cart" 
              className="flex items-center justify-between px-3 py-2 smooth-hover hover:text-primary font-medium text-black rounded-lg hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="pt-2">
              {!isPending && (
                session?.user ? (
                  <div className="space-y-2">
                    <Button asChild className="w-full pixel-text text-xs bg-primary hover:bg-primary/90">
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button asChild variant="outline" className="w-full pixel-text text-xs">
                        <Link href="/admin">Admin Panel</Link>
                      </Button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 text-left smooth-hover hover:bg-destructive/10 text-destructive font-medium rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Button asChild className="w-full pixel-text text-xs bg-primary hover:bg-primary/90">
                    <Link href="/auth">Login</Link>
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}