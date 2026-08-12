'use client';

import { Fragment, useCallback, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Sparkles, ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import './PlanComparisonMatrix.css';

/* ── Types ─────────────────────────────────────────── */
type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface PlanComparisonMatrixProps {
  onNavigate?: (page: PageId) => void;
}

type BillingCycle = 'monthly' | 'annual';
type CellKind = 'check' | 'x' | 'text';

interface Cell {
  kind: CellKind;
  /** Optional label rendered under the symbol (for check/x) or as the value (for text) */
  label?: string;
}

interface Row {
  feature: string;
  /** Order: Starter, Growth, Enterprise */
  cells: [Cell, Cell, Cell];
}

interface Category {
  id: string;
  label: string;
  icon: string;
  rows: Row[];
}

interface Plan {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  employeeRange: string;
  cta: string;
  highlighted: boolean;
  badge?: string;
}

/* ── Plans ────────────────────────────────────────── */
const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For small teams getting started',
    monthlyPrice: 24,
    annualPrice: 18,
    employeeRange: 'Up to 50 employees',
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For scaling companies',
    monthlyPrice: 24,
    annualPrice: 18,
    employeeRange: '50–500 employees',
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large global organizations',
    monthlyPrice: null,
    annualPrice: null,
    employeeRange: '500+ employees',
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const PLAN_INDEX: Record<Plan['id'], 0 | 1 | 2> = {
  starter: 0,
  growth: 1,
  enterprise: 2,
};

/* ── Feature categories (29 rows across 6 categories) ── */
const CATEGORIES: Category[] = [
  {
    id: 'core',
    label: 'Core Platform',
    icon: '◆',
    rows: [
      {
        feature: 'All 5 modules (HiTalent, HiPeople, HiPay, HiGlobal, HiOps) + HiAI Intelligence Layer',
        cells: [
          { kind: 'text', label: 'Core 3' },
          { kind: 'check', label: 'All 5' },
          { kind: 'check', label: 'All 5 + custom' },
        ],
      },
      {
        feature: 'Single source of truth',
        cells: [
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check', label: 'Cryptographic' },
        ],
      },
      {
        feature: 'Mobile app (iOS + Android)',
        cells: [
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'API access (REST + GraphQL)',
        cells: [
          { kind: 'text', label: 'Standard' },
          { kind: 'check', label: 'Full' },
          { kind: 'check', label: 'Full + signed' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI Capabilities',
    icon: '✦',
    rows: [
      {
        feature: 'Ask AI queries / month',
        cells: [
          { kind: 'text', label: '1,000' },
          { kind: 'text', label: 'Unlimited' },
          { kind: 'text', label: 'Unlimited + fine-tuned' },
        ],
      },
      {
        feature: 'Cross-module reasoning',
        cells: [
          { kind: 'x' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Predictive analytics',
        cells: [
          { kind: 'x' },
          { kind: 'check' },
          { kind: 'check', label: 'Cross-module' },
        ],
      },
      {
        feature: 'Custom AI workflows',
        cells: [
          { kind: 'x' },
          { kind: 'text', label: '5 active' },
          { kind: 'text', label: 'Unlimited' },
        ],
      },
      {
        feature: 'AI report generation',
        cells: [
          { kind: 'check', label: 'Templates' },
          { kind: 'check', label: 'Natural language' },
          { kind: 'check', label: '+ Scheduled' },
        ],
      },
    ],
  },
  {
    id: 'global',
    label: 'Global Operations',
    icon: '◉',
    rows: [
      {
        feature: 'Countries supported',
        cells: [
          { kind: 'text', label: '5' },
          { kind: 'text', label: '40' },
          { kind: 'text', label: '150+' },
        ],
      },
      {
        feature: 'Payroll runs / month',
        cells: [
          { kind: 'text', label: '1' },
          { kind: 'text', label: '4' },
          { kind: 'text', label: 'Unlimited' },
        ],
      },
      {
        feature: 'EOR employees',
        cells: [
          { kind: 'x' },
          { kind: 'text', label: 'Up to 50' },
          { kind: 'text', label: 'Unlimited' },
        ],
      },
      {
        feature: 'Contractor management',
        cells: [
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Compliance automation',
        cells: [
          { kind: 'text', label: 'Manual alerts' },
          { kind: 'check', label: 'Hardcoded' },
          { kind: 'check', label: 'Hardcoded + custom' },
        ],
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: '⬡',
    rows: [
      {
        feature: 'Native integrations',
        cells: [
          { kind: 'text', label: '25+' },
          { kind: 'text', label: '100+' },
          { kind: 'text', label: '200+' },
        ],
      },
      {
        feature: 'HRIS sync',
        cells: [
          { kind: 'check' },
          { kind: 'check', label: 'Real-time' },
          { kind: 'check', label: 'Real-time + custom' },
        ],
      },
      {
        feature: 'SSO providers',
        cells: [
          { kind: 'text', label: 'Google / MS' },
          { kind: 'text', label: 'Google / MS / Okta' },
          { kind: 'text', label: 'SAML / SCIM / OIDC' },
        ],
      },
      {
        feature: 'Webhook events',
        cells: [
          { kind: 'x' },
          { kind: 'check' },
          { kind: 'check', label: 'Signed' },
        ],
      },
      {
        feature: 'Custom integrations',
        cells: [
          { kind: 'x' },
          { kind: 'text', label: 'Add-on' },
          { kind: 'check' },
        ],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    icon: '✧',
    rows: [
      {
        feature: 'Support channels',
        cells: [
          { kind: 'text', label: 'Email' },
          { kind: 'text', label: 'Email + Chat' },
          { kind: 'text', label: '24/7 + Slack' },
        ],
      },
      {
        feature: 'Response time',
        cells: [
          { kind: 'text', label: '24h' },
          { kind: 'text', label: '4h' },
          { kind: 'text', label: '1h' },
        ],
      },
      {
        feature: 'Implementation',
        cells: [
          { kind: 'text', label: 'Self-service' },
          { kind: 'text', label: '2–4 weeks' },
          { kind: 'text', label: '8–12 weeks' },
        ],
      },
      {
        feature: 'Dedicated CSM',
        cells: [
          { kind: 'x' },
          { kind: 'check' },
          { kind: 'check', label: '+ TAM' },
        ],
      },
      {
        feature: 'Custom SLAs',
        cells: [
          { kind: 'x' },
          { kind: 'x' },
          { kind: 'check' },
        ],
      },
    ],
  },

];

/* ── FAQ ──────────────────────────────────────────── */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes - you can upgrade or downgrade at any time. Upgrades take effect immediately and unlock the new features on the spot; downgrades take effect at the start of your next billing cycle. We prorate any difference automatically, so you never pay for capacity you don\u2019t use.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express), ACH and SEPA bank transfers, and wire transfers for Enterprise contracts. Annual plans can be invoiced with Net-30 terms. Stripe handles all billing - your card data never touches our servers.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No. All plans include free implementation. Starter is fully self-service with a guided setup wizard; Growth includes a 2–4 week white-glove onboarding with a dedicated migration specialist; Enterprise includes a full implementation team and custom data migration from your existing stack.',
  },
  {
    q: 'What happens if I exceed my employee limit?',
    a: 'We\u2019ll never cut off access. If you grow beyond your plan\u2019s band, we\u2019ll proactively reach out to discuss upgrading to the appropriate tier. Mid-cycle overages are prorated automatically - you only pay the difference for the days you\u2019re over, never a full month retroactively.',
  },
  {
    q: 'Do you offer non-profit discounts?',
    a: 'Yes - registered non-profits, educational institutions, and government organizations receive a 30% discount on all plans. Reach out to our sales team with your 501(c)(3) documentation (or international equivalent) and we\u2019ll apply the discount within 1–2 business days.',
  },
];

/* ── Cell renderer ────────────────────────────────── */
function CellRender({ cell, highlighted }: { cell: Cell; highlighted: boolean }) {
  if (cell.kind === 'text') {
    return (
      <span className={`plan-matrix-cell-text${highlighted ? ' plan-matrix-cell-text-hi' : ''}`}>
        {cell.label}
      </span>
    );
  }
  const symbol = cell.kind === 'check' ? '✓' : '✗';
  return (
    <span className="plan-matrix-cell-icon">
      <span
        className={`plan-matrix-symbol plan-matrix-symbol-${cell.kind}${
          highlighted ? ' plan-matrix-symbol-hi' : ''
        }`}
        aria-hidden="true"
      >
        {symbol}
      </span>
      {cell.label && <span className="plan-matrix-cell-icon-label">{cell.label}</span>}
    </span>
  );
}

/* ── Mobile plan card ─────────────────────────────── */
function PlanCard({
  plan,
  cycle,
  onCta,
}: {
  plan: Plan;
  cycle: BillingCycle;
  onCta: () => void;
}) {
  const cellIdx = PLAN_INDEX[plan.id];
  return (
    <div className={`plan-matrix-card${plan.highlighted ? ' plan-matrix-card-hi' : ''}`}>
      {plan.badge && (
        <div className="plan-matrix-card-badge">
          <Sparkles size={12} /> {plan.badge}
        </div>
      )}
      <div className="plan-matrix-card-name">{plan.name}</div>
      <div className="plan-matrix-card-tagline">{plan.tagline}</div>

      <div className="plan-matrix-card-price-note">
        {plan.employeeRange}
      </div>

      <button
        type="button"
        className={`plan-matrix-card-cta ${plan.highlighted ? 'btn-gold' : 'plan-matrix-btn-outline'}`}
        onClick={onCta}
      >
        {plan.cta}
        <ArrowRight size={15} />
      </button>

      <div className="plan-matrix-card-features">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="plan-matrix-card-cat">
            <div className="plan-matrix-card-cat-label">
              <span className="plan-matrix-card-cat-icon" aria-hidden="true">
                {cat.icon}
              </span>
              {cat.label}
            </div>
            <ul>
              {cat.rows.map((row, idx) => {
                const cell = row.cells[cellIdx];
                return (
                  <li
                    key={idx}
                    className={`plan-matrix-card-feat ${cell.kind === 'x' ? 'out' : 'in'}`}
                  >
                    <span className="plan-matrix-card-feat-cell">
                      <CellRender cell={cell} highlighted={plan.highlighted} />
                    </span>
                    <span className="plan-matrix-card-feat-label">{row.feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────── */
export default function PlanComparisonMatrix({ onNavigate }: PlanComparisonMatrixProps) {
  useReveal();
  const [cycle, setCycle] = useState<BillingCycle>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handlePlanHeaderClick = useCallback(() => {
    onNavigate?.('contact');
  }, [onNavigate]);

  const handleCtaClick = useCallback(() => {
    onNavigate?.('contact');
  }, [onNavigate]);

  const toggleFaq = useCallback((idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  }, []);

  const totalFeatures = CATEGORIES.reduce((n, c) => n + c.rows.length, 0);

  return (
    <section className="plan-matrix-section" id="plan-comparison">
      <div className="plan-matrix-inner">
        {/* ── Header ── */}
        <div className="plan-matrix-header">
          <div className="eyebrow reveal">Plan Comparison</div>
          <h2 className="reveal d1">
            Compare every capability <em>across all three plans.</em>
          </h2>
          <p className="reveal d2">
            A complete side-by-side breakdown of what&apos;s included in Starter, Growth, and Enterprise  - 
            across {totalFeatures} capabilities in {CATEGORIES.length} categories. No hidden line items,
            no per-module upsells.
          </p>


        </div>

        {/* ── Legend ── */}
        <div className="plan-matrix-legend reveal d3" aria-hidden="true">
          <span className="plan-matrix-legend-item">
            <span className="plan-matrix-symbol plan-matrix-symbol-check">✓</span>
            <span>Included</span>
          </span>
          <span className="plan-matrix-legend-item">
            <span className="plan-matrix-symbol plan-matrix-symbol-x">✗</span>
            <span>Not included</span>
          </span>
          <span className="plan-matrix-legend-item">
            <span className="plan-matrix-symbol plan-matrix-symbol-text">abc</span>
            <span>Variable by plan</span>
          </span>
        </div>

        {/* ── Desktop: comparison table ── */}
        <div className="plan-matrix-table-wrap reveal-scale">
          <table className="plan-matrix-table">
            <caption className="sr-only">
              Feature comparison between HiFive AI Starter, Growth, and Enterprise plans across Core
              Platform, AI Capabilities, Global Operations, Integrations, Support, and Security &amp;
              Compliance categories.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="plan-matrix-corner">
                  <span>Capability</span>
                </th>
                {PLANS.map((p) => {
                  return (
                    <th
                      key={p.id}
                      scope="col"
                      className={`plan-matrix-col-header${p.highlighted ? ' plan-matrix-col-hi' : ''}`}
                    >
                      <button
                        type="button"
                        className="plan-matrix-col-btn"
                        onClick={handlePlanHeaderClick}
                        aria-label={`Get started with ${p.name} - ${p.cta}`}
                      >
                        {p.badge && (
                          <span className="plan-matrix-col-badge">
                            <Sparkles size={10} /> {p.badge}
                          </span>
                        )}
                        <span className="plan-matrix-col-name">{p.name}</span>

                        <span className="plan-matrix-col-range">{p.employeeRange}</span>
                        <span className="plan-matrix-col-cta-label">
                          Get started <ArrowRight size={11} />
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => (
                <Fragment key={cat.id}>
                  <tr className="plan-matrix-cat-row">
                    <td colSpan={4} className="plan-matrix-cat-cell">
                      <span className="plan-matrix-cat-icon" aria-hidden="true">
                        {cat.icon}
                      </span>
                      <span className="plan-matrix-cat-label">{cat.label}</span>
                      <span className="plan-matrix-cat-count">
                        {cat.rows.length} {cat.rows.length === 1 ? 'feature' : 'features'}
                      </span>
                    </td>
                  </tr>
                  {cat.rows.map((row) => (
                    <tr key={`${cat.id}-${row.feature}`} className="plan-matrix-row">
                      <td className="plan-matrix-feature-cell" scope="row">
                        {row.feature}
                      </td>
                      {row.cells.map((cell, i) => (
                        <td
                          key={i}
                          className={`plan-matrix-cell${
                            PLANS[i].highlighted ? ' plan-matrix-cell-hi' : ''
                          }`}
                          data-label={PLANS[i].name}
                        >
                          <CellRender cell={cell} highlighted={PLANS[i].highlighted} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile: card-per-plan layout ── */}
        <div className="plan-matrix-cards">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} cycle={cycle} onCta={handleCtaClick} />
          ))}
        </div>

        {/* ── 3 CTA buttons (one per plan) ── */}
        <div className="plan-matrix-cta-row reveal d2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`plan-matrix-cta-btn ${p.highlighted ? 'btn-gold' : 'plan-matrix-btn-outline'}`}
              onClick={handleCtaClick}
            >
              {p.cta}
              <ArrowRight size={15} />
            </button>
          ))}
        </div>

        {/* ── FAQ accordion ── */}
        <div className="plan-matrix-faq">
          <div className="plan-matrix-faq-header reveal">
            <HelpCircle size={18} />
            <h3>Frequently asked questions about plans</h3>
          </div>
          <div className="plan-matrix-faq-list">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`plan-matrix-faq-item${isOpen ? ' open' : ''}`}
                >
                  <button
                    type="button"
                    className="plan-matrix-faq-q"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`plan-matrix-faq-a-${idx}`}
                  >
                    <span>{item.q}</span>
                    <span
                      className={`plan-matrix-faq-chevron${isOpen ? ' open' : ''}`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  <div
                    id={`plan-matrix-faq-a-${idx}`}
                    className="plan-matrix-faq-a"
                    role="region"
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="plan-matrix-footnote reveal d2">
          All plans include the cryptographic source of truth, WCAG 2.1 AA accessibility, unlimited admin
          seats, and the full API. No hidden fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
