'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';

interface Tier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  priceSuffix: string;
  priceNote: string;
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  badge?: string;
  features: { label: string; included: boolean }[];
}

const tiers: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For growing teams consolidating their core HR stack.',
    monthlyPrice: 1200,
    annualPrice: 1080,
    priceSuffix: '/mo',
    priceNote: 'billed annually',
    cta: 'Contact Sales',
    ctaHref: 'https://cal.com/hifiveai',
    highlighted: false,
    features: [
      { label: '3 entities / countries', included: true },
      { label: 'HiTalent + HiPeople + HiPay modules', included: true },
      { label: 'Global payroll (5 countries included)', included: true },
      { label: 'Executive dashboard with 12 KPIs', included: true },
      { label: 'Ask AI - 50 queries / month', included: true },
      { label: 'SSO (Google / Microsoft)', included: true },
      { label: 'Email support (24h SLA)', included: true },
      { label: 'HiOps & HiGlobal modules', included: false },
      { label: 'Custom AI workflows', included: false },
      { label: 'Dedicated success manager', included: false },
      { label: 'Audit log retention > 1 year', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For mid-market companies scaling across multiple regions.',
    monthlyPrice: 3800,
    annualPrice: 3420,
    priceSuffix: '/mo',
    priceNote: 'billed annually',
    cta: 'Contact Sales',
    ctaHref: 'https://cal.com/hifiveai',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      { label: '10 entities / countries', included: true },
      { label: 'All 5 modules + HiAI Intelligence Layer', included: true },
      { label: 'Global payroll (40 countries included)', included: true },
      { label: 'Executive dashboard + custom KPIs', included: true },
      { label: 'Ask AI - unlimited queries', included: true },
      { label: 'SSO (Google / Microsoft / Okta)', included: true },
      { label: 'Priority support (4h SLA) + CSM', included: true },
      { label: 'Custom AI workflows (5 active)', included: true },
      { label: 'Cross-module scenario planning', included: true },
      { label: 'SOC 2 Type II + GDPR + ISO 27001', included: true },
      { label: '7-year audit log retention', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For global organizations, complex entities, regulated industries, custom SLAs.',
    monthlyPrice: null,
    annualPrice: null,
    priceSuffix: '',
    priceNote: 'custom pricing',
    cta: 'Contact Sales',
    ctaHref: 'https://cal.com/hifiveai',
    highlighted: false,
    features: [
      { label: 'Unlimited entities / countries', included: true },
      { label: 'All 5 modules + custom integrations', included: true },
      { label: 'Global payroll (150+ countries)', included: true },
      { label: 'Custom dashboards + data warehouse export', included: true },
      { label: 'Ask AI - unlimited + fine-tuned on your data', included: true },
      { label: 'SSO + SAML + SCIM provisioning', included: true },
      { label: '24/7 dedicated support + TAM', included: true },
      { label: 'Unlimited custom AI workflows', included: true },
      { label: 'Advanced scenario modeling + forecasting', included: true },
      { label: 'SOC 2 + HIPAA + FedRAMP on request', included: true },
      { label: 'Unlimited audit log + WORM storage', included: true },
    ],
  },
];

export default function PricingTiers() {
  useReveal();
  const [cycle, setCycle] = useState<BillingCycle>('annual');

  return (
    <section className="pricing-tiers-section" id="pricing">
      <div className="pricing-tiers-inner">
        <div className="pricing-tiers-header">
          <div className="eyebrow reveal">Pricing</div>
          <h2 className="reveal d1">One platform.<br /><em>One predictable price.</em></h2>
          <p className="reveal d2">
            No per-module upsells. No surprise integration fees. No metered AI charges.
            Replace your $120K+ fragmented stack with a single, transparent subscription.
          </p>

          <div className="billing-toggle reveal d3" role="tablist" aria-label="Billing cycle">
            <button
              type="button"
              role="tab"
              aria-selected={cycle === 'monthly'}
              className={`billing-toggle-btn ${cycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setCycle('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={cycle === 'annual'}
              className={`billing-toggle-btn ${cycle === 'annual' ? 'active' : ''}`}
              onClick={() => setCycle('annual')}
            >
              Annual
              <span className="billing-toggle-save">Save 10%</span>
            </button>
          </div>
        </div>

        <div className="pricing-tiers-grid stagger">
          {tiers.map((tier) => {
            const price = cycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.id}
                className={`pricing-tier-card ${tier.highlighted ? 'highlighted' : ''}`}
              >
                {tier.badge && (
                  <div className="pricing-tier-badge">
                    <Sparkles size={12} />
                    {tier.badge}
                  </div>
                )}
                <div className="pricing-tier-name">{tier.name}</div>
                <div className="pricing-tier-tagline">{tier.tagline}</div>

                <div className="pricing-tier-price-row">
                  {price === null ? (
                    <span className="pricing-tier-price-custom">Custom</span>
                  ) : (
                    <>
                      <span className="pricing-tier-price-currency">$</span>
                      <span className="pricing-tier-price-amount">
                        {price.toLocaleString('en-US')}
                      </span>
                      <span className="pricing-tier-price-suffix">{tier.priceSuffix}</span>
                    </>
                  )}
                </div>
                <div className="pricing-tier-price-note">
                  {price === null ? tier.priceNote : `per employee · ${tier.priceNote}`}
                </div>

                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pricing-tier-cta ${tier.highlighted ? 'btn-gold' : 'btn-outline'}`}
                >
                  {tier.cta}
                  <ArrowRight size={16} />
                </a>

                <div className="pricing-tier-features">
                  <div className="pricing-tier-features-title">What&apos;s included</div>
                  <ul>
                    {tier.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className={`pricing-tier-feature ${feat.included ? 'in' : 'out'}`}
                      >
                        {feat.included ? (
                          <Check size={14} className="pricing-tier-feature-icon in" />
                        ) : (
                          <X size={14} className="pricing-tier-feature-icon out" />
                        )}
                        <span>{feat.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <p className="pricing-tiers-footnote reveal d2">
          All plans include the cryptographic source of truth, WCAG 2.1 AA accessibility,
          unlimited admin seats, and the full API. No hidden fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
