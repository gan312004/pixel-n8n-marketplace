"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import { Lock, Shield, Key, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import DashboardNavbar from '@/components/DashboardNavbar'
import { AppleStyleDock } from '@/components/AppleStyleDock'

export default function SecurityPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/auth')
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const securityFeatures = [
    { label: 'Two-Factor Auth', value: 'Disabled', icon: Key, color: 'text-yellow-500' },
    { label: 'Data Encryption', value: 'Active', icon: Lock, color: 'text-green-500' },
    { label: 'Security Score', value: '85%', icon: Shield, color: 'text-blue-500' },
    { label: 'Alerts', value: '0', icon: AlertTriangle, color: 'text-red-500' },
  ]

  return (
    <>
      <DashboardNavbar />
      <AppleStyleDock />
      <div className="min-h-screen pt-8 pb-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="pixel-text text-4xl md:text-5xl mb-4 text-foreground">
              Security Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account security and privacy settings
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {securityFeatures.map((feature, idx) => (
              <Card key={idx} className="bg-card dark:bg-card rounded-lg p-6 pixel-shadow border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-muted-foreground mb-1">{feature.label}</CardDescription>
                      <CardTitle className="text-lg text-card-foreground">{feature.value}</CardTitle>
                    </div>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-card dark:bg-card rounded-lg p-8 pixel-shadow border-border">
              <CardHeader className="mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl text-card-foreground">Enhanced Security</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your data is protected with enterprise-grade security
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    End-to-end encryption for all data
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    Regular security audits and updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-green-500" />
                    Secure authentication protocols
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card rounded-lg p-8 pixel-shadow border-border">
              <CardContent className="text-center py-8">
                <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="pixel-text text-xl mb-2 text-card-foreground">Advanced Settings</h3>
                <p className="text-muted-foreground mb-6">
                  Additional security features coming soon
                </p>
                <Button variant="outline" disabled>
                  Configure Security
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}