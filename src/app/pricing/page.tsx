"use client"

import { useState } from 'react'
import DashboardNavbar from '@/components/DashboardNavbar'
import { AppleStyleDock } from '@/components/AppleStyleDock'
import PricingPlans from '@/components/PricingPlans'
import FAQ from '@/components/FAQ'

export default function PricingPage() {
  return (
    <>
      <DashboardNavbar />
      <AppleStyleDock />
      <div className="min-h-screen pt-24 pb-24 px-4 bg-background">
        <PricingPlans />
        <FAQ />
      </div>
    </>
  )
}