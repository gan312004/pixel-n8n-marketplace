"use client";

import React, { useState } from 'react';
import { Check, X, Layers, Monitor, Users, Building2 } from 'lucide-react';

function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "For individuals and small projects",
      icon: <Layers className="w-8 h-8 text-primary" />,
      priceMonthly: 9,
      priceYearly: 90,
      users: "Up to 3 users",
      features: [
        { label: "Basic analytics", included: true },
        { label: "Community access", included: true },
        { label: "Priority support", included: false },
      ],
    },
    {
      id: "basic",
      name: "Basic",
      description: "For small teams getting started",
      icon: <Monitor className="w-8 h-8 text-primary" />,
      priceMonthly: 29,
      priceYearly: 290,
      users: "Up to 10 users",
      features: [
        { label: "Advanced analytics", included: true },
        { label: "Priority support", included: true },
        { label: "Team collaboration tools", included: false },
      ],
    },
    {
      id: "team",
      name: "Team",
      description: "For growing startups and agencies",
      icon: <Users className="w-8 h-8 text-primary" />,
      priceMonthly: 99,
      priceYearly: 990,
      users: "Up to 50 users",
      features: [
        { label: "Dedicated success manager", included: true },
        { label: "Custom integrations", included: true },
        { label: "AI-powered insights", included: true },
      ],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations with custom needs",
      icon: <Building2 className="w-8 h-8 text-primary" />,
      priceMonthly: 199,
      priceYearly: 1990,
      users: "Unlimited users",
      features: [
        { label: "24/7 priority support", included: true },
        { label: "Custom SLAs", included: true },
        { label: "Private cloud hosting", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 md:px-8 w-full transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="pixel-text text-3xl md:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Switch between monthly and yearly billing anytime.
          </p>

          {/* Toggle */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Monthly
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnnual}
                  onChange={(e) => setIsAnnual(e.target.checked)}
                />
                <div className="w-12 h-6 bg-muted rounded-full peer-focus:ring-4 peer-focus:ring-primary/30 peer-checked:bg-primary transition-colors relative">
                  <span className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transform transition-transform peer-checked:translate-x-6"></span>
                </div>
              </label>

              <span className="text-sm font-medium text-muted-foreground">
                Yearly
              </span>
            </div>

            <span className="text-sm text-neon-green font-medium">
              Pay annually and save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-card border rounded-lg shadow-sm transition-all smooth-hover hover:shadow-xl pixel-shadow ${
                plan.recommended
                  ? 'border-primary ring-2 ring-primary/20 scale-105'
                  : 'border-border'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-neon-green text-white text-xs px-3 py-1 rounded-full font-bold">
                  Recommended
                </div>
              )}

              {/* Card Header */}
              <div className="text-center pt-8 px-6">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Card Content */}
              <div className="px-6 pb-6">
                <div className="text-center mb-6">
                  <div className="pixel-text text-2xl mb-2 transition-all duration-300 text-primary">
                    ${isAnnual ? plan.priceYearly : plan.priceMonthly}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    / {isAnnual ? "year" : "month"}
                  </p>
                </div>

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all smooth-hover hover:scale-105 mb-6 pixel-shadow ${
                    plan.recommended
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-card border-2 border-border text-foreground hover:bg-muted'
                  }`}
                >
                  Start Now
                </button>

                <div className="text-left text-sm">
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-muted-foreground mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                    {plan.users}
                  </p>

                  <h4 className="font-semibold mb-2">Highlights</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground line-through"
                          }
                        >
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
