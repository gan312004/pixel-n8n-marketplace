"use client"

import DashboardNavbar from '@/components/DashboardNavbar'
import { Bell, Check, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotificationsPage() {
  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen pt-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="pixel-text text-4xl md:text-5xl mb-4 text-foreground">
              Notifications
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with all your important notifications
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {notificationTypes.map((type, idx) => (
              <Card key={idx} className="bg-card dark:bg-card rounded-lg p-6 pixel-shadow border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-muted-foreground mb-1">{type.label}</CardDescription>
                      <CardTitle className="pixel-text text-2xl text-card-foreground">{type.value}</CardTitle>
                    </div>
                    <type.icon className={`w-8 h-8 ${type.color}`} />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card dark:bg-card rounded-lg p-8 pixel-shadow border-border">
              <CardContent className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="pixel-text text-xl mb-2 text-card-foreground">No Notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! No new notifications at this time.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}