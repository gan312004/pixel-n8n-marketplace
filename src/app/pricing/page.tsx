"use client"

import PricingPage from '@/components/ui/pricing-page'
import Navbar from '@/components/Navbar'

export default function PricingPageRoute() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24">
        <PricingPage />
      </div>
      
      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="pixel-text text-sm text-muted-foreground mb-4">
            AutoMart
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 All rights reserved. Built with precision and passion.
          </p>
        </div>
      </footer>
    </div>
  )
}