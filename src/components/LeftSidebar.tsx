"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Bot, DollarSign, Package, User, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LeftSidebar() {
  const pathname = usePathname()
  const { data: session, refetch } = useSession()
  const router = useRouter()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
    }
    setShowSettings(false)
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Agents', href: '/agents', icon: Bot },
    { name: 'Bundles', href: '/bundles', icon: Package },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
    >
      <div 
        className="backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl border border-white/40 p-4 flex flex-col gap-1.5"
        style={{ 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), 4px 4px 0px rgba(0, 0, 0, 0.1)' 
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ x: 10, scale: 1.1 }}
          transition={{ duration: 0.15 }}
          className="relative"
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link 
            href="/" 
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-deep-purple to-black rounded-xl pixel-shadow"
          >
            <span className="pixel-text text-dark-green" style={{ fontSize: '10px' }}>Auto</span>
          </Link>
          
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredItem === 'logo' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none"
              >
                AutoMart
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="w-full h-px bg-border/50" />

        {/* Navigation Icons */}
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 10, scale: 1.2 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'hover:bg-white/50 text-foreground'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                </Link>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none z-50"
                    >
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="w-full h-px bg-border/50" />

        {/* User Section */}
        {session?.user ? (
          <div className="flex flex-col gap-1.5">
            <div 
              className="relative"
              onMouseEnter={() => setHoveredItem('dashboard')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ x: 10, scale: 1.2 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/50 text-foreground transition-colors"
                >
                  <User className="w-6 h-6" />
                </motion.div>
              </Link>

              <AnimatePresence>
                {hoveredItem === 'dashboard' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none z-50"
                  >
                    Dashboard
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setHoveredItem('settings')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ x: 10, scale: 1.2 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-white/50 text-foreground transition-colors"
              >
                <Settings className="w-6 h-6" />
              </motion.button>

              <AnimatePresence>
                {hoveredItem === 'settings' && !showSettings && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none z-50"
                  >
                    Settings
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setHoveredItem('login')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link href="/auth">
              <motion.div
                whileHover={{ x: 10, scale: 1.2 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white shadow-lg transition-colors hover:bg-primary/90"
              >
                <User className="w-6 h-6" />
              </motion.div>
            </Link>

            <AnimatePresence>
              {hoveredItem === 'login' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none z-50"
                >
                  Login
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Settings Dropdown */}
      <AnimatePresence>
        {showSettings && session?.user && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full ml-4 bottom-0 bg-white rounded-lg shadow-xl border border-border p-2 min-w-[200px]"
            style={{ 
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)' 
            }}
          >
            <Link 
              href="/dashboard"
              className="block px-4 py-2 rounded-lg smooth-hover hover:bg-muted text-sm font-medium text-black"
              onClick={() => setShowSettings(false)}
            >
              Dashboard
            </Link>
            <button 
              onClick={() => {
                document.documentElement.classList.toggle('dark')
                setShowSettings(false)
              }}
              className="w-full text-left px-4 py-2 rounded-lg smooth-hover hover:bg-muted text-sm font-medium text-black"
            >
              Toggle Theme
            </button>
            <div className="h-px bg-border my-1" />
            <button 
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 rounded-lg smooth-hover hover:bg-destructive/10 text-destructive text-sm font-medium"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}