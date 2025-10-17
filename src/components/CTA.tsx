"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary to-deep-purple rounded-lg p-12 pixel-shadow text-center text-white !w-[99.8%] !h-full">

          <h2 className="pixel-text text-3xl md:text-4xl mb-4">
            Ready to Automate?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their workflows with our premium n8n templates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="pixel-text text-xs bg-neon-green text-black hover:bg-neon-green/90 smooth-hover hover:scale-105 group">

              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="pixel-text text-xs border-2 bg-white text-primary hover:bg-white/90 smooth-hover hover:scale-105">

              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>);

}