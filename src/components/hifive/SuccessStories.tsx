'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { ArrowRight, Quote, Building2, Globe2, Users2 } from 'lucide-react';
import './SuccessStories.css';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface SuccessStoriesProps {
  onNavigate?: (page: PageId) => void;
}

interface Metric {
  /** When set, the value animates from 0 → target using rAF + ease-out-cubic */
  countTarget?: number;
  /** When countTarget is undefined, this is rendered statically */
  staticValue?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

interface SuccessStory {
  company: string;
  initials: string;
  industry: string;
  size: string;
  countries?: number;
  employees: number;
  narrative: string;
  quote: string;
  author: string;
  authorTitle: string;
  metrics: Metric[];
}

const successStories: SuccessStory[] = [
  {
    company: 'NovaPay',
    initials: 'NP',
    industry: 'Fintech',
    size: '40 employees · 3 countries',
    countries: 3,
    employees: 40,
    narrative:
      'NovaPay was juggling five separate tools for HRIS, payroll, ATS, performance reviews, and engagement surveys. After consolidating on HiFive AI, they retired five vendors in a single quarter, cut hiring cycles by 40%, and gave every hiring manager instant cross-module answers via Ask AI. The platform paid for itself in 3.2 months.',
    quote:
      'We replaced five separate tools with one platform. The consolidation alone saved us $84K a year, but the real win is having every people decision grounded in real-time data across all modules.',
    author: 'Marcus Chen',
    authorTitle: 'CEO, NovaPay',
    metrics: [
      { countTarget: 84, prefix: '$', suffix: 'K', label: 'Annual Savings' },
      { countTarget: 40, suffix: '%', label: 'Faster Hiring' },
      { countTarget: 5, label: 'Tools Replaced' },
      { countTarget: 3.2, suffix: 'mo', decimals: 1, label: 'Payback Period' },
    ],
  },
  {
    company: 'MedVista Health',
    initials: 'MV',
    industry: 'Healthcare',
    size: '150 employees',
    employees: 150,
    narrative:
      'Compliance incidents were rising as MedVista scaled across multiple states. Each compliance check required pulling data from three disconnected systems, and cross-referencing was manual and error-prone. With HiFive AI\'s Ask AI, cross-module questions that once took days are answered in seconds - and 99.9% of payroll runs hit zero reconciliation errors.',
    quote:
      'Ask AI doesn\'t just answer questions - it reasons across modules. I asked about attrition risk in our nursing staff, and it correlated compensation data, shift patterns, and engagement scores in one response. That\'s impossible with separate systems.',
    author: 'Dr. Amara Osei',
    authorTitle: 'CHRO, MedVista Health',
    metrics: [
      { countTarget: 99.9, suffix: '%', decimals: 1, label: 'Payroll Accuracy' },
      { countTarget: 100, suffix: '%', label: 'Audit Trail Coverage' },
      { countTarget: 60, suffix: '%', label: 'Fewer Compliance Incidents' },
      { countTarget: 32, suffix: '%', label: 'Less Admin Time' },
    ],
  },
  {
    company: 'CloudStack',
    initials: 'CS',
    industry: 'SaaS',
    size: '80 employees · 4 countries',
    countries: 4,
    employees: 80,
    narrative:
      'Running payroll across four countries meant four vendors, four timelines, and four sets of compliance risk. HiFive AI unified everything into a single platform with built-in local tax and labor-law compliance, going from contract to production in just six weeks - and cutting total cost of ownership by 73%.',
    quote:
      'Running payroll across four countries used to mean four vendors, four timelines, and four sets of compliance risk. HiFive AI unified it all. Month-end close went from five days to one, and we haven\'t had a single compliance flag since deployment.',
    author: 'Lena Kowalski',
    authorTitle: 'CFO, CloudStack',
    metrics: [
      { countTarget: 73, suffix: '%', label: 'TCO Reduction' },
      { countTarget: 6, suffix: ' wks', label: 'Implementation Time' },
      { countTarget: 99.8, suffix: '%', decimals: 1, label: 'Payroll Accuracy' },
      { staticValue: '5→1', label: 'Days, Month-End Close' },
    ],
  },
  {
    company: 'Meridian Consulting',
    initials: 'MC',
    industry: 'Consulting',
    size: '200 employees · 6 countries',
    countries: 6,
    employees: 200,
    narrative:
      'Compliance across six jurisdictions used to be a spreadsheet nightmare. HiFive AI automated compliance monitoring across every region, kept the firm audit-ready 365 days a year, and produced zero compliance incidents over an 18-month period - even as local labor laws changed three times.',
    quote:
      'Compliance across six jurisdictions is a nightmare with spreadsheets and point solutions. HiFive AI keeps us audit-ready 365 days a year. When local labor law changes, the system flags it before our legal team even hears about it.',
    author: 'Ingrid Svensson',
    authorTitle: 'VP People, Meridian Consulting',
    metrics: [
      { staticValue: '0', label: 'Compliance Incidents' },
      { countTarget: 6, label: 'Jurisdictions Automated' },
      { countTarget: 18, suffix: 'mo', label: 'Incident-Free Streak' },
      { countTarget: 100, suffix: '%', label: 'Audit-Ready, 365 Days' },
    ],
  },
];

interface AggregateStat {
  countTarget?: number;
  staticValue?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

const aggregateStats: AggregateStat[] = [
  { countTarget: 4.2, suffix: 'M+', decimals: 1, label: 'Employees managed' },
  { countTarget: 340, prefix: '$', suffix: 'M+', label: 'Saved annually' },
  { countTarget: 150, suffix: '+', label: 'Countries' },
  { countTarget: 99.9, suffix: '%', decimals: 1, label: 'Payroll accuracy' },
];

/* Easing: ease-out cubic */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* Detect prefers-reduced-motion (SSR-safe) */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---------- Metric counter (animates when mounted / when active changes) ---------- */
function MetricCounter({ metric, animate }: { metric: Metric; animate: boolean }) {
  const rafRef = useRef<number | null>(null);

  const formatValue = useCallback(
    (val: number): string => {
      const prefix = metric.prefix || '';
      const suffix = metric.suffix || '';
      const decimals = metric.decimals || 0;
      let formatted: string;
      if (decimals > 0) {
        formatted = val.toFixed(decimals);
      } else {
        formatted = Math.round(val).toLocaleString('en-US');
      }
      return `${prefix}${formatted}${suffix}`;
    },
    [metric]
  );

  // Lazy initializer: start at the zero-prefix state for this metric.
  // (Component remounts on tab switch via parent key, so this captures the fresh metric.)
  const [display, setDisplay] = useState<string>(() => formatValue(0));

  useEffect(() => {
    if (metric.countTarget === undefined) return;
    const target = metric.countTarget;
    if (!animate) return;

    // Respect reduced-motion preference: jump straight to target in next frame
    // (rAF callback keeps setState out of the synchronous effect body)
    if (prefersReducedMotion()) {
      rafRef.current = requestAnimationFrame(() => {
        setDisplay(formatValue(target));
      });
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const duration = 1500; // 1.5s as specified
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * target;
      setDisplay(formatValue(current));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(formatValue(target));
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [metric, animate, formatValue]);

  if (metric.countTarget === undefined && metric.staticValue !== undefined) {
    return <span className="success-metric-num">{metric.staticValue}</span>;
  }

  return <span className="success-metric-num">{display}</span>;
}

/* ---------- Aggregate counter (triggers on scroll into view) ---------- */
function AggregateCounter({ stat }: { stat: AggregateStat }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  const formatValue = useCallback(
    (val: number): string => {
      const prefix = stat.prefix || '';
      const suffix = stat.suffix || '';
      const decimals = stat.decimals || 0;
      let formatted: string;
      if (decimals > 0) {
        formatted = val.toFixed(decimals);
      } else {
        formatted = Math.round(val).toLocaleString('en-US');
      }
      return `${prefix}${formatted}${suffix}`;
    },
    [stat]
  );

  // Lazy initial state - avoids calling setState synchronously in the effect body
  const [display, setDisplay] = useState<string>(() => formatValue(0));

  const animate = useCallback(() => {
    if (stat.countTarget === undefined || hasAnimated) return;
    setHasAnimated(true);
    const target = stat.countTarget;

    if (prefersReducedMotion()) {
      rafRef.current = requestAnimationFrame(() => {
        setDisplay(formatValue(target));
      });
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplay(formatValue(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(formatValue(target));
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [stat, hasAnimated, formatValue]);

  useEffect(() => {
    if (stat.countTarget === undefined) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stat, animate]);

  if (stat.countTarget === undefined && stat.staticValue !== undefined) {
    return <span ref={ref}>{stat.staticValue}</span>;
  }

  return <span ref={ref}>{display}</span>;
}

export default function SuccessStories({ onNavigate }: SuccessStoriesProps) {
  useReveal();
  const [activeIdx, setActiveIdx] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((idx: number) => {
    setActiveIdx(idx);
    // Bump key to retrigger fade+slide animation on the card and counter re-animation
    setAnimateKey((k) => k + 1);
  }, []);

  // Keyboard nav for tabs (optional a11y nicety)
  const handleTabKey = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (idx + 1) % successStories.length;
        handleTabClick(next);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (idx - 1 + successStories.length) % successStories.length;
        handleTabClick(prev);
      }
    },
    [handleTabClick]
  );

  const active = successStories[activeIdx];

  return (
    <section className="success-section" id="success-stories">
      <div className="success-inner">
        {/* HEADER */}
        <div className="success-header reveal">
          <div className="eyebrow">Customer Success</div>
          <h2>
            Real companies. <em>Real outcomes.</em>
          </h2>
          <p>
            Four organizations. Four very different challenges. One People Operating System.
            Explore the measurable results each team achieved with HiFive AI: and the numbers
            behind the switch.
          </p>
        </div>

        {/* MAIN LAYOUT: tabs + detail card */}
        <div className="success-layout reveal d1">
          {/* VERTICAL TAB LIST */}
          <div
            className="success-tabs"
            ref={tabsRef}
            role="tablist"
            aria-label="Customer success stories"
            aria-orientation="vertical"
          >
            {successStories.map((s, idx) => (
              <button
                key={s.company}
                type="button"
                role="tab"
                id={`success-tab-${idx}`}
                aria-selected={idx === activeIdx}
                aria-controls={`success-panel-${idx}`}
                tabIndex={idx === activeIdx ? 0 : -1}
                className={`success-tab ${idx === activeIdx ? 'active' : ''}`}
                onClick={() => handleTabClick(idx)}
                onKeyDown={(e) => handleTabKey(e, idx)}
              >
                <span className="success-tab-index">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="success-tab-body">
                  <span className="success-tab-name">{s.company}</span>
                  <span className="success-tab-meta">
                    {s.industry} · {s.employees} emp{s.countries ? ` · ${s.countries} countries` : ''}
                  </span>
                </span>
                <ArrowRight className="success-tab-arrow" size={14} />
              </button>
            ))}
          </div>

          {/* DETAIL CARD */}
          <div
            className="success-panel"
            id={`success-panel-${activeIdx}`}
            role="tabpanel"
            aria-labelledby={`success-tab-${activeIdx}`}
          >
            <div className="success-card" key={animateKey}>
              {/* CARD HEADER */}
              <div className="success-card-head">
                <div className="success-logo" aria-hidden="true">
                  {active.initials}
                </div>
                <div className="success-card-titles">
                  <h3 className="success-card-name">{active.company}</h3>
                  <div className="success-card-badges">
                    <span className="success-badge">
                      <Building2 size={11} />
                      {active.industry}
                    </span>
                    <span className="success-badge">
                      <Users2 size={11} />
                      {active.employees} employees
                    </span>
                    {active.countries && (
                      <span className="success-badge">
                        <Globe2 size={11} />
                        {active.countries} countries
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* METRICS GRID */}
              <div className="success-metrics">
                {active.metrics.map((m, i) => (
                  <div className="success-metric" key={`${activeIdx}-${i}`}>
                    <MetricCounter metric={m} animate={true} />
                    <div className="success-metric-label">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* NARRATIVE */}
              <p className="success-narrative">{active.narrative}</p>

              {/* READ FULL CASE STUDY LINK */}
              <button
                type="button"
                className="success-read-link"
                onClick={() => onNavigate?.('solutions')}
              >
                Read full case study
                <ArrowRight size={14} />
              </button>

              {/* QUOTE */}
              <blockquote className="success-quote">
                <Quote className="success-quote-icon" size={20} />
                <p className="success-quote-text">&ldquo;{active.quote}&rdquo;</p>
                <footer className="success-quote-author">
                  <span className="success-quote-name">{active.author}</span>
                  <span className="success-quote-title">{active.authorTitle}</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
