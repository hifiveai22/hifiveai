'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import './CompetitorComparison.css';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface CompetitorComparisonProps {
  onNavigate?: (page: PageId) => void;
}

/* ── Types ─────────────────────────────────────────── */
type CellKind = 'check' | 'partial' | 'x' | 'text';

interface Cell {
  kind: CellKind;
  /** Optional label rendered under/beside the symbol */
  label?: string;
}

interface Row {
  feature: string;
  /** Order: HiFive AI, BambooHR, Workday, Deel, Rippling */
  cells: Cell[];
}

interface Category {
  id: string;
  label: string;
  icon: string;
  rows: Row[];
}

/* ── Vendor meta ──────────────────────────────────── */
const VENDORS = ['HiFive AI', 'BambooHR', 'Workday', 'Deel', 'Rippling'] as const;

const VENDOR_TAGLINES: string[] = [
  'AI-native orgs consolidating their stack',
  'SMBs under 200 employees · US-focused',
  'Large enterprises with HCM budgets',
  'Global contractor & EOR operations',
  'IT + HR unified for US teams',
];

/* ── Comparison data ──────────────────────────────── */
const CATEGORIES: Category[] = [
  {
    id: 'core-hr',
    label: 'Core HR',
    icon: '👥',
    rows: [
      {
        feature: 'HRIS',
        cells: [
          { kind: 'check', label: 'Native unified' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'partial', label: 'Add-on' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Employee self-service',
        cells: [
          { kind: 'check', label: 'Consumer-grade' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Document management',
        cells: [
          { kind: 'check', label: 'E-sign + vault' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'partial', label: 'Basic' },
        ],
      },
      {
        feature: 'Org charts',
        cells: [
          { kind: 'check', label: 'Live & interactive' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'x' },
          { kind: 'partial', label: 'Static' },
        ],
      },
    ],
  },
  {
    id: 'global',
    label: 'Global',
    icon: '🌍',
    rows: [
      {
        feature: 'Multi-country payroll',
        cells: [
          { kind: 'check', label: '150+ countries' },
          { kind: 'partial', label: 'US/CA focus' },
          { kind: 'check', label: '50+ countries' },
          { kind: 'check', label: '150+ countries' },
          { kind: 'check', label: '50+ countries' },
        ],
      },
      {
        feature: 'EOR (Employer of Record)',
        cells: [
          { kind: 'check', label: 'Native' },
          { kind: 'x' },
          { kind: 'x' },
          { kind: 'check', label: 'Category leader' },
          { kind: 'partial', label: 'Via partner' },
        ],
      },
      {
        feature: 'Contractor management',
        cells: [
          { kind: 'check' },
          { kind: 'x' },
          { kind: 'partial', label: 'Add-on' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Compliance automation',
        cells: [
          { kind: 'check', label: 'Hardcoded' },
          { kind: 'partial', label: 'Manual alerts' },
          { kind: 'partial' },
          { kind: 'check' },
          { kind: 'partial' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: '🤖',
    rows: [
      {
        feature: 'Cross-module AI reasoning',
        cells: [
          { kind: 'check', label: 'Native' },
          { kind: 'x' },
          { kind: 'partial', label: 'Roadmap' },
          { kind: 'x' },
          { kind: 'x' },
        ],
      },
      {
        feature: 'AI assistant',
        cells: [
          { kind: 'check', label: 'HiAI Chief of Staff' },
          { kind: 'x' },
          { kind: 'partial', label: 'Ask Workday' },
          { kind: 'partial', label: 'Basic' },
          { kind: 'partial', label: 'Basic' },
        ],
      },
      {
        feature: 'Predictive analytics',
        cells: [
          { kind: 'check', label: 'Cross-module' },
          { kind: 'x' },
          { kind: 'partial' },
          { kind: 'x' },
          { kind: 'x' },
        ],
      },
      {
        feature: 'Auto-generated reports',
        cells: [
          { kind: 'check', label: 'Natural language' },
          { kind: 'partial', label: 'Templates' },
          { kind: 'partial', label: 'Builder' },
          { kind: 'partial' },
          { kind: 'partial' },
        ],
      },
    ],
  },
  {
    id: 'talent',
    label: 'Talent',
    icon: '🎯',
    rows: [
      {
        feature: 'ATS / Recruiting',
        cells: [
          { kind: 'check', label: 'AI semantic' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'x' },
          { kind: 'partial', label: 'Basic' },
        ],
      },
      {
        feature: 'Onboarding workflows',
        cells: [
          { kind: 'check', label: 'Agentic' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Performance reviews',
        cells: [
          { kind: 'check', label: 'AI-assisted' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'x' },
          { kind: 'partial' },
        ],
      },
      {
        feature: '360° feedback',
        cells: [
          { kind: 'check' },
          { kind: 'partial' },
          { kind: 'check' },
          { kind: 'x' },
          { kind: 'x' },
        ],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: '⚙️',
    rows: [
      {
        feature: 'IT asset management',
        cells: [
          { kind: 'check', label: 'Unified' },
          { kind: 'x' },
          { kind: 'partial', label: 'Add-on' },
          { kind: 'x' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'SSO (SAML / OIDC)',
        cells: [
          { kind: 'check', label: 'Native' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
      {
        feature: 'Integrations marketplace',
        cells: [
          { kind: 'check', label: '200+' },
          { kind: 'partial', label: '50+' },
          { kind: 'check', label: '100+' },
          { kind: 'partial', label: 'Limited' },
          { kind: 'check', label: '400+' },
        ],
      },
      {
        feature: 'API access',
        cells: [
          { kind: 'check', label: 'REST + GraphQL' },
          { kind: 'check' },
          { kind: 'check', label: 'SOAP/REST' },
          { kind: 'check' },
          { kind: 'check' },
        ],
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: '💳',
    rows: [
      {
        feature: 'Starting price',
        cells: [
          { kind: 'text', label: '$2,000/mo' },
          { kind: 'text', label: '$99/mo' },
          { kind: 'text', label: 'Enterprise only' },
          { kind: 'text', label: '$49/contractor/mo' },
          { kind: 'text', label: '$8/user/mo' },
        ],
      },
      {
        feature: 'Per-employee cost',
        cells: [
          { kind: 'text', label: '$12/employee' },
          { kind: 'text', label: '$5–9/employee' },
          { kind: 'text', label: '$20–35/employee' },
          { kind: 'text', label: '$49/contractor' },
          { kind: 'text', label: '$8–15/user' },
        ],
      },
      {
        feature: 'Implementation fee',
        cells: [
          { kind: 'text', label: 'Included' },
          { kind: 'text', label: 'Included' },
          { kind: 'text', label: '$50K–$500K' },
          { kind: 'text', label: 'None' },
          { kind: 'text', label: 'Included' },
        ],
      },
      {
        feature: 'Time-to-live',
        cells: [
          { kind: 'text', label: '2–4 weeks' },
          { kind: 'text', label: '1–2 weeks' },
          { kind: 'text', label: '6–18 months' },
          { kind: 'text', label: '1–3 days' },
          { kind: 'text', label: '2–4 weeks' },
        ],
      },
    ],
  },
];

/* ── Helpers ──────────────────────────────────────── */

/** Identity key used by the "Show only differences" filter.
 *  Non-text cells compare by kind only (label is decorative);
 *  text cells compare by their literal label. */
function cellKey(c: Cell): string {
  return c.kind === 'text' ? `text::${c.label ?? ''}` : c.kind;
}

function isDifferenceRow(cells: Cell[]): boolean {
  const hi = cellKey(cells[0]);
  return cells.slice(1).some((c) => cellKey(c) !== hi);
}

/* ── Cell renderer ────────────────────────────────── */
function CellRender({ cell, isHi }: { cell: Cell; isHi: boolean }) {
  if (cell.kind === 'text') {
    return (
      <span className={`cmp-cell-text${isHi ? ' cmp-cell-text-hi' : ''}`}>
        {cell.label}
      </span>
    );
  }

  const symbol = cell.kind === 'check' ? '✓' : cell.kind === 'partial' ? '◐' : '✗';
  return (
    <span className="cmp-cell-icon">
      <span
        className={`cmp-symbol cmp-symbol-${cell.kind}${isHi ? ' cmp-symbol-hi' : ''}`}
        aria-hidden="true"
      >
        {symbol}
      </span>
      {cell.label && (
        <span className="cmp-cell-icon-label">{cell.label}</span>
      )}
    </span>
  );
}

/* ── Component ────────────────────────────────────── */
export default function CompetitorComparison({ onNavigate }: CompetitorComparisonProps) {
  useReveal();

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  const toggleCategory = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCta = useCallback(() => {
    if (onNavigate) {
      onNavigate('why');
      // After page transition, gently scroll to the pricing calculator
      window.setTimeout(() => {
        document
          .querySelector('.pricing-calc-section')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 420);
    } else {
      document
        .querySelector('.pricing-calc-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [onNavigate]);

  const visibleCategories = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      rows: showOnlyDifferences
        ? cat.rows.filter((r) => isDifferenceRow(r.cells))
        : cat.rows,
    })).filter((cat) => cat.rows.length > 0);
  }, [showOnlyDifferences]);

  const totalCapabilities = CATEGORIES.reduce((n, c) => n + c.rows.length, 0);

  return (
    <section className="cmp-section" id="competitor-comparison">
      <div className="cmp-inner">
        {/* ── Header ── */}
        <div className="cmp-header">
          <div className="eyebrow reveal">Competitive Comparison</div>
          <h2 className="reveal d1">
            HiFive AI vs. <em>the rest of the market.</em>
          </h2>
          <p className="reveal d2">
            An honest, side-by-side look across {totalCapabilities} capabilities and 4 competing
            platforms. No marketing fluff - just the structural differences that decide whether
            your people stack stays fragmented or becomes one system.
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="cmp-controls reveal d3">
          <label className="cmp-toggle">
            <input
              type="checkbox"
              className="cmp-toggle-input"
              checked={showOnlyDifferences}
              onChange={(e) => setShowOnlyDifferences(e.target.checked)}
              aria-label="Show only rows where competitors differ from HiFive AI"
            />
            <span className="cmp-toggle-track">
              <span className="cmp-toggle-thumb" />
            </span>
            <span className="cmp-toggle-label">Show only differences</span>
          </label>

          <div className="cmp-legend" aria-hidden="true">
            <span className="cmp-legend-item">
              <span className="cmp-symbol cmp-symbol-check">✓</span>
              <span>Full support</span>
            </span>
            <span className="cmp-legend-item">
              <span className="cmp-symbol cmp-symbol-partial">◐</span>
              <span>Partial</span>
            </span>
            <span className="cmp-legend-item">
              <span className="cmp-symbol cmp-symbol-x">✗</span>
              <span>Not supported</span>
            </span>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="cmp-table-wrap reveal-scale">
          <table className="cmp-table">
            <caption className="sr-only">
              Feature comparison between HiFive AI, BambooHR, Workday, Deel, and Rippling across
              Core HR, Global, AI, Talent, Operations, and Pricing categories.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="cmp-corner">
                  <span>Capability</span>
                </th>
                {VENDORS.map((v, i) => (
                  <th
                    key={v}
                    scope="col"
                    className={i === 0 ? 'cmp-hifive-col cmp-col-header' : 'cmp-col-header'}
                  >
                    <span className="cmp-vendor-name">{v}</span>
                    {i === 0 && (
                      <span className="cmp-recommend-badge" aria-label="Recommended choice">
                        Recommended
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map((cat) => {
                const isCollapsed = collapsed.has(cat.id);
                return (
                  <Fragment key={cat.id}>
                    <tr
                      className="cmp-cat-row"
                      onClick={() => toggleCategory(cat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleCategory(cat.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={!isCollapsed}
                      aria-controls={`cmp-cat-body-${cat.id}`}
                    >
                      <td colSpan={VENDORS.length + 1} className="cmp-cat-cell">
                        <span className="cmp-cat-icon" aria-hidden="true">
                          {cat.icon}
                        </span>
                        <span className="cmp-cat-label">{cat.label}</span>
                        <span className="cmp-cat-count">
                          {cat.rows.length} {cat.rows.length === 1 ? 'capability' : 'capabilities'}
                        </span>
                        <span
                          className={`cmp-cat-chevron${isCollapsed ? ' is-collapsed' : ''}`}
                          aria-hidden="true"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M3 5l4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </td>
                    </tr>
                    {!isCollapsed &&
                      cat.rows.map((row) => (
                        <tr key={`${cat.id}-${row.feature}`} className="cmp-row">
                          <td className="cmp-feature-cell" scope="row">
                            {row.feature}
                          </td>
                          {row.cells.map((cell, i) => (
                            <td
                              key={i}
                              className={i === 0 ? 'cmp-hifive-col cmp-cell' : 'cmp-cell'}
                              data-label={VENDORS[i]}
                            >
                              <CellRender cell={cell} isHi={i === 0} />
                            </td>
                          ))}
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="cmp-footer-row">
                <td className="cmp-footer-label">Best for</td>
                {VENDOR_TAGLINES.map((t, i) => (
                  <td
                    key={i}
                    className={i === 0 ? 'cmp-hifive-col cmp-footer-cell' : 'cmp-footer-cell'}
                  >
                    {t}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ── CTA ── */}
        <div className="cmp-cta reveal d2">
          <button
            type="button"
            className="btn btn-gold btn-lg cmp-cta-btn"
            onClick={handleCta}
          >
            See how much you&apos;d save →
          </button>
          <p className="cmp-cta-note">
            Jump to the TCO estimator and quantify your exact annual savings.
          </p>
        </div>
      </div>
    </section>
  );
}
