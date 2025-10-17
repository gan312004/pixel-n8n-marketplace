"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X, User, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const navLinks = [
    {
      name: 'Templates',
      dropdown: [
        { name: 'All Templates', href: '/templates' },
        { name: 'Featured', href: '/templates' },
        { name: 'Popular', href: '/templates' },
      ]
    },
    {
      name: 'Agents',
      dropdown: [
        { name: 'All Agents', href: '/agents' },
        { name: 'AI Agents', href: '/agents' },
        { name: 'Automation Agents', href: '/agents' },
      ]
    },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Bundles', href: '/bundles' },
  ]

  return (
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'w-[95%] max-w-6xl' : 'w-[90%] max-w-5xl'
      }`}
    >
      <div 
        className={`bg-white rounded-2xl px-6 py-4 border border-border smooth-hover ${
          isScrolled ? '' : ''
        }`}
        style={{ 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 smooth-hover hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-deep-purple to-black rounded-xl flex items-center justify-center pixel-shadow">
              <span className="pixel-text text-dark-green" style={{ fontSize: '10px' }}>Auto</span>
            </div>
            <span className="pixel-text text-sm hidden sm:block">Mart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <>
                    <button
                      className="flex items-center gap-1 smooth-hover hover:text-primary font-medium"
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
                        openDropdown === link.name
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.dropdown.map((item, idx) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-3 smooth-hover hover:bg-muted hover:text-primary font-medium"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className="smooth-hover hover:text-primary font-medium"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}

            {!isPending && (
              session?.user ? (
                <div className="flex items-center gap-3">
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
                  
                  {/* Settings Dropdown */}
                  <div className="relative group">
                    <button
                      className="flex items-center gap-1 smooth-hover hover:text-primary font-medium p-2 rounded-lg hover:bg-muted"
                      onMouseEnter={() => setOpenDropdown('settings')}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <SettingsIcon className="w-5 h-5" />
                    </button>
                    
                    <div
                      className={`absolute top-full right-0 mt-2 min-w-[200px] bg-white border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
                        openDropdown === 'settings'
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                      onMouseEnter={() => setOpenDropdown('settings')}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        onClick={() => document.documentElement.classList.toggle('dark')}
                        className="w-full text-left px-4 py-3 smooth-hover hover:bg-muted hover:text-primary font-medium"
                      >
                        Toggle Theme
                      </button>
                      <div className="h-px bg-border" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 smooth-hover hover:bg-destructive/10 text-destructive font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button asChild className="pixel-text text-xs bg-primary hover:bg-primary/90 smooth-hover hover:scale-105">
                  <Link href="/auth">Login</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden smooth-hover hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <>
                    <button
                      className="w-full text-left px-3 py-2 smooth-hover hover:text-primary font-medium flex items-center justify-between"
                      onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        openDropdown === link.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {openDropdown === link.name && (
                      <div className="ml-4 space-y-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-3 py-2 smooth-hover hover:text-primary text-sm"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className="block px-3 py-2 smooth-hover hover:text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
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
                    <button
                      onClick={() => document.documentElement.classList.toggle('dark')}
                      className="w-full px-3 py-2 text-left smooth-hover hover:text-primary font-medium rounded-lg hover:bg-muted"
                    >
                      Toggle Theme
                    </button>
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