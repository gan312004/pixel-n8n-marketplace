import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TemplatesShowcase from '@/components/TemplatesShowcase'
import AgentsShowcase from '@/components/AgentsShowcase'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import PricingPlans from '@/components/PricingPlans'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <TemplatesShowcase />
      <AgentsShowcase />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <PricingPlans />
      <FAQ />
      <CTA />
      
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