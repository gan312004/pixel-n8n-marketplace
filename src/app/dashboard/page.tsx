"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import LeftSidebar from '@/components/LeftSidebar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Star, Trophy, Zap, Download, Bot, DollarSign } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/auth')
    }
  }, [session, isPending, router])

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

  const statCards = [
    { label: 'Templates', value: '0', icon: Package, color: 'text-primary', href: '/templates' },
    { label: 'Agents', value: '0', icon: Bot, color: 'text-neon-green', href: '/agents' },
    { label: 'Downloads', value: '0', icon: Download, color: 'text-yellow-500', href: '#' },
    { label: 'Spent', value: '$0', icon: DollarSign, color: 'text-blue-500', href: '/pricing' },
  ]

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen pt-32 pb-20 px-4 pl-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="pixel-text text-4xl md:text-5xl mb-4">
              Welcome, <span className="text-primary">{session.user.name}</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your templates, agents, and subscriptions
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statCards.map((stat, idx) => (
              <Link key={idx} href={stat.href}>
                <Card className="bg-white rounded-lg p-6 pixel-shadow smooth-hover hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardDescription className="text-muted-foreground mb-1">{stat.label}</CardDescription>
                        <CardTitle className="pixel-text text-2xl">{stat.value}</CardTitle>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Getting Started */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 pixel-shadow"
            >
              <h2 className="pixel-text text-xl mb-6">Getting Started</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You haven't purchased any templates or agents yet. Start exploring our marketplace!
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="justify-start" variant="outline">
                    <Link href="/templates">
                      <Package className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Link>
                  </Button>
                  <Button asChild className="justify-start" variant="outline">
                    <Link href="/agents">
                      <Star className="w-4 h-4 mr-2" />
                      Explore Agents
                    </Link>
                  </Button>
                  <Button asChild className="justify-start" variant="outline">
                    <Link href="/bundles">
                      <Trophy className="w-4 h-4 mr-2" />
                      Check Bundles (Save up to 50%)
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg p-6 pixel-shadow"
            >
              <h2 className="pixel-text text-xl mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full justify-start smooth-hover hover:scale-105"
                  variant="outline"
                >
                  <Link href="/templates">
                    <Package className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start smooth-hover hover:scale-105"
                  variant="outline"
                >
                  <Link href="/agents">
                    <Star className="w-4 h-4 mr-2" />
                    Explore Agents
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start smooth-hover hover:scale-105"
                  variant="outline"
                >
                  <Link href="/pricing">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Plans
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start smooth-hover hover:scale-105 bg-primary text-white"
                >
                  <Link href="/bundles">
                    <Zap className="w-4 h-4 mr-2" />
                    View Bundles
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Upgrade Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-primary to-deep-purple rounded-lg p-8 text-white pixel-shadow"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="pixel-text text-2xl mb-2">Upgrade to Pro</h3>
                <p className="text-white/90">
                  Get unlimited access to all templates, agents, and priority support
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="pixel-text text-xs bg-white text-primary hover:bg-white/90 smooth-hover hover:scale-105"
              >
                <Link href="/pricing">
                  Upgrade Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}