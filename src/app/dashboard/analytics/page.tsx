"use client"

import DashboardNavbar from '@/components/DashboardNavbar'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function AnalyticsPage() {
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
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your template usage and performance metrics
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {metrics.map((metric, idx) => (
              <Card key={idx} className="bg-card dark:bg-card rounded-lg p-6 pixel-shadow border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription className="text-muted-foreground mb-1">{metric.label}</CardDescription>
                      <CardTitle className="pixel-text text-2xl text-card-foreground">{metric.value}</CardTitle>
                    </div>
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
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
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="pixel-text text-xl mb-2 text-card-foreground">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and insights will be available here soon.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}