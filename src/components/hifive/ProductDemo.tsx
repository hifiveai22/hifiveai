'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  LayoutDashboard,
  MessageSquare,
  Filter,
  ShieldCheck,
  Sparkles,
  Send,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabId = 'overview' | 'askai' | 'funnel' | 'compliance';

interface ProductDemoProps {
  /** Optional trigger element. If omitted, the default "Live Demo" button is rendered. */
  trigger?: ReactNode;
}

interface Kpi {
  id: string;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delta: number; // percent change vs last period
  positive: boolean; // is an upward delta good?
  icon: ReactNode;
  sub: string;
}

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  bullets?: string[];
}

interface FunnelStage {
  name: string;
  count: number;
  pct: number; // width % relative to top
  conversion: string; // conversion from previous stage
  color: string;
}

interface ComplianceItem {
  country: string;
  flag: string;
  area: string;
  status: 'green' | 'amber' | 'red';
  note: string;
}

/* ------------------------------------------------------------------ */
/*  Static demo data                                                   */
/* ------------------------------------------------------------------ */

const KPIS: Kpi[] = [
  {
    id: 'headcount',
    label: 'Total Headcount',
    value: 1284,
    delta: 4.2,
    positive: true,
    icon: <Users size={18} />,
    sub: 'across 14 countries',
  },
  {
    id: 'rev',
    label: 'Revenue / Employee',
    value: 312,
    decimals: 0,
    prefix: '$',
    suffix: 'K',
    delta: 6.8,
    positive: true,
    icon: <DollarSign size={18} />,
    sub: 'TTM, +$21K YoY',
  },
  {
    id: 'tth',
    label: 'Time-to-Hire',
    value: 18,
    suffix: 'd',
    delta: -12.5,
    positive: true,
    icon: <Clock size={18} />,
    sub: 'median, eng + ops',
  },
  {
    id: 'attr',
    label: 'Voluntary Attrition',
    value: 7.4,
    decimals: 1,
    suffix: '%',
    delta: -1.8,
    positive: true,
    icon: <TrendingDown size={18} />,
    sub: 'rolling 12 months',
  },
];

const ASK_QUESTIONS: { q: string; a: string; bullets?: string[] }[] = [
  {
    q: 'Why is payroll 12% over budget in London?',
    a: 'London payroll is £418K over forecast for Q3. Three drivers account for 96% of the variance:',
    bullets: [
      'Unbudgeted hires - 4 senior engineers onboarded in Aug ahead of approved plan (+£172K)',
      'Contractor overtime - infrastructure team converted 2,140 hrs at premium rate (+£138K)',
      'FX fluctuation - GBP→USD moved 3.1% unfavourably on intercompany transfers (+£91K)',
    ],
  },
  {
    q: 'Show flight-risk scores for engineering',
    a: '3 of 47 engineering employees currently score above 0.7 flight-risk (high). Top signals: comp band gap, manager skip-level cadence, recent peer departures.',
    bullets: [
      'A. Petrov - Staff Eng, Platform - risk 0.86 (comp -14% below band, no skip in 90d)',
      'M. Okafor - Sr Eng, Infra - risk 0.78 (3 peers exited in 60d, late promo cycle)',
      'J. Chen - Eng Manager - risk 0.72 (span-of-control doubled, recent survey dip)',
    ],
  },
  {
    q: "What's our hiring velocity this quarter?",
    a: 'Q3 hiring velocity is running 23% ahead of plan. 38 of 52 open roles are at or beyond offer stage, with average cycle time of 17 days (down from 24d Q2).',
    bullets: [
      'Open roles: 52 - 18 ahead of plan, 14 on track, 20 behind',
      'Offers extended: 31 - 27 accepted, 3 pending, 1 declined',
      'Pipeline: 1,847 candidates - 412 in interview, 89 in final round',
      'Bottleneck: design team cycle 31d (vs 17d company avg) - flagged for review',
    ],
  },
];

const FUNNEL_STAGES: FunnelStage[] = [
  { name: 'Applied', count: 4128, pct: 100, conversion: ' - ', color: 'linear-gradient(90deg,#B07D2E,#C99140)' },
  { name: 'Screened', count: 1846, pct: 71, conversion: '44.7%', color: 'linear-gradient(90deg,#C99140,#D4891A)' },
  { name: 'Interviewed', count: 612, pct: 47, conversion: '33.2%', color: 'linear-gradient(90deg,#D4891A,#E0A040)' },
  { name: 'Final Round', count: 198, pct: 32, conversion: '32.4%', color: 'linear-gradient(90deg,#E0A040,#E8B85A)' },
  { name: 'Offered', count: 87, pct: 22, conversion: '43.9%', color: 'linear-gradient(90deg,#E8B85A,#F0C97A)' },
  { name: 'Hired', count: 64, pct: 16, conversion: '73.6%', color: 'linear-gradient(90deg,#22C55E,#16A34A)' },
];

const COMPLIANCE: ComplianceItem[] = [
  { country: 'United States', flag: '🇺🇸', area: 'I-9 / E-Verify', status: 'green', note: 'All 412 employees current' },
  { country: 'United Kingdom', flag: '🇬🇧', area: 'Right-to-Work + IR35', status: 'amber', note: '3 visas expiring <60d' },
  { country: 'Germany', flag: '🇩🇪', area: 'Works Council / BetrVG', status: 'green', note: 'No open items' },
  { country: 'France', flag: '🇫🇷', area: 'DSN + CDI tracking', status: 'green', note: 'Filed on schedule' },
  { country: 'Singapore', flag: '🇸🇬', area: 'MOM EP renewals', status: 'red', note: '2 EPs overdue - action req.' },
  { country: 'Brazil', flag: '🇧🇷', area: 'eSocial + CLT', status: 'amber', note: '1 payroll dispute open' },
  { country: 'Japan', flag: '🇯🇵', area: 'Visa + Shakai Hoken', status: 'green', note: 'All enrolled' },
  { country: 'Australia', flag: '🇦🇺', area: 'STP + Super', status: 'amber', note: 'Super rate change pending' },
  { country: 'India', flag: '🇮🇳', area: 'PF + ESI + TDS', status: 'green', note: 'Compliant' },
  { country: 'Canada', flag: '🇨🇦', area: 'ROE + CPP', status: 'green', note: 'Compliant' },
];

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'askai', label: 'Ask AI', icon: <MessageSquare size={16} /> },
  { id: 'funnel', label: 'Hiring Funnel', icon: <Filter size={16} /> },
  { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={16} /> },
];

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, run: boolean, duration = 1100, decimals = 0) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!run || startedRef.current) return;
    startedRef.current = true;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);

  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/* ------------------------------------------------------------------ */
/*  Helper formatters                                                  */
/* ------------------------------------------------------------------ */

function formatKpi(k: Kpi, value: number): string {
  const fixed = k.decimals ? value.toFixed(k.decimals) : Math.round(value).toLocaleString();
  return `${k.prefix ?? ''}${fixed}${k.suffix ?? ''}`;
}

function statusLabel(s: ComplianceItem['status']): string {
  return s === 'green' ? 'Compliant' : s === 'amber' ? 'Action Needed' : 'Critical';
}

/* ------------------------------------------------------------------ */
/*  Sub-renderers                                                      */
/* ------------------------------------------------------------------ */

function KpiCard({ kpi, run }: { kpi: Kpi; run: boolean }) {
  const value = useCountUp(kpi.value, run, 1200, kpi.decimals ?? 0);
  const deltaIsGood = kpi.positive ? kpi.delta > 0 : kpi.delta < 0;

  return (
    <div className="product-demo-kpi-card">
      <div className="product-demo-kpi-icon">{kpi.icon}</div>
      <div className="product-demo-kpi-label">{kpi.label}</div>
      <div className="product-demo-kpi-value">{formatKpi(kpi, value)}</div>
      <div className={`product-demo-kpi-delta ${deltaIsGood ? 'good' : 'bad'}`}>
        {kpi.delta > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{Math.abs(kpi.delta)}%</span>
        <span className="product-demo-kpi-sub">vs last Q</span>
      </div>
      <div className="product-demo-kpi-foot">{kpi.sub}</div>
    </div>
  );
}

function OverviewTab({ run }: { run: boolean }) {
  return (
    <div className="product-demo-tab-content">
      <div className="product-demo-section-head">
        <div>
          <div className="product-demo-section-eyebrow">Live snapshot</div>
          <h3>Workforce at a glance</h3>
        </div>
        <div className="product-demo-live-pill">
          <span className="dot-live" /> Live data · refreshed 2m ago
        </div>
      </div>
      <div className="product-demo-kpi-grid">
        {KPIS.map((k) => (
          <KpiCard key={k.id} kpi={k} run={run} />
        ))}
      </div>
      <div className="product-demo-mini-row">
        <div className="product-demo-mini-card">
          <div className="product-demo-mini-label">Open roles</div>
          <div className="product-demo-mini-value">52</div>
          <div className="product-demo-mini-bar">
            <div style={{ width: '78%' }} />
          </div>
        </div>
        <div className="product-demo-mini-card">
          <div className="product-demo-mini-label">Pending approvals</div>
          <div className="product-demo-mini-value">7</div>
          <div className="product-demo-mini-bar">
            <div style={{ width: '32%' }} />
          </div>
        </div>
        <div className="product-demo-mini-card">
          <div className="product-demo-mini-label">Payroll runs (mo)</div>
          <div className="product-demo-mini-value">14</div>
          <div className="product-demo-mini-bar">
            <div style={{ width: '92%' }} />
          </div>
        </div>
        <div className="product-demo-mini-card">
          <div className="product-demo-mini-label">Compliance alerts</div>
          <div className="product-demo-mini-value">3</div>
          <div className="product-demo-mini-bar">
            <div style={{ width: '18%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AskAiTab() {
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      role: 'assistant',
      content:
        "Hi - I'm Ask AI, the reasoning layer across your HiFive workspace. Pick a question below or explore the data yourself.",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, thinking]);

  const ask = useCallback((qIdx: number) => {
    const q = ASK_QUESTIONS[qIdx];
    if (!q) return;
    setTurns((prev) => [...prev, { role: 'user', content: q.q }]);
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      setTurns((prev) => [
        ...prev,
        { role: 'assistant', content: q.a, bullets: q.bullets },
      ]);
    }, 900);
  }, []);

  return (
    <div className="product-demo-tab-content product-demo-askai">
      <div className="product-demo-section-head">
        <div>
          <div className="product-demo-section-eyebrow">Ask AI · natural language</div>
          <h3>Ask anything across all five modules</h3>
        </div>
        <div className="product-demo-askai-badge">
          <Sparkles size={13} /> HiAI reasoning
        </div>
      </div>

      <div className="product-demo-chat" ref={scrollRef}>
        {turns.map((t, i) => (
          <div key={i} className={`product-demo-chat-msg ${t.role}`}>
            {t.role === 'assistant' && (
              <div className="product-demo-chat-avatar">
                <Sparkles size={14} />
              </div>
            )}
            <div className="product-demo-chat-bubble">
              <p>{t.content}</p>
              {t.bullets && (
                <ul className="product-demo-chat-bullets">
                  {t.bullets.map((b, j) => (
                    <li key={j}>
                      <span className="product-demo-bullet-dot" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="product-demo-chat-msg assistant">
            <div className="product-demo-chat-avatar">
              <Sparkles size={14} />
            </div>
            <div className="product-demo-chat-bubble product-demo-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="product-demo-questions">
        <div className="product-demo-questions-label">Try a question</div>
        <div className="product-demo-questions-grid">
          {ASK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              type="button"
              className="product-demo-question-btn"
              onClick={() => ask(i)}
              disabled={thinking}
            >
              <span className="product-demo-question-icon">
                <Send size={12} />
              </span>
              <span>{q.q}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FunnelTab({ run }: { run: boolean }) {
  return (
    <div className="product-demo-tab-content">
      <div className="product-demo-section-head">
        <div>
          <div className="product-demo-section-eyebrow">HiTalent · recruitment pipeline</div>
          <h3>Hiring funnel - last 90 days</h3>
        </div>
        <div className="product-demo-funnel-meta">
          <span><strong>4,128</strong> applied</span>
          <span><strong>64</strong> hired</span>
          <span><strong>1.55%</strong> overall conversion</span>
        </div>
      </div>

      <div className="product-demo-funnel">
        {FUNNEL_STAGES.map((s, i) => (
          <div key={s.name} className="product-demo-funnel-row" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="product-demo-funnel-stage">
              <span className="product-demo-funnel-name">{s.name}</span>
              <span className="product-demo-funnel-count">{s.count.toLocaleString()}</span>
            </div>
            <div className="product-demo-funnel-track">
              <div
                className={`product-demo-funnel-bar ${run ? 'grow' : ''}`}
                style={{
                  width: run ? `${s.pct}%` : '0%',
                  background: s.color,
                  transitionDelay: `${i * 90}ms`,
                }}
              >
                <span className="product-demo-funnel-conv">{s.conversion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="product-demo-funnel-footer">
        <div className="product-demo-funnel-insight">
          <AlertTriangle size={14} />
          <span>Insight: Final Round → Offered conversion (43.9%) is below industry benchmark (55%).</span>
        </div>
      </div>
    </div>
  );
}

function ComplianceTab() {
  const counts = useMemo(() => {
    return COMPLIANCE.reduce(
      (acc, c) => {
        acc[c.status] += 1;
        return acc;
      },
      { green: 0, amber: 0, red: 0 } as Record<ComplianceItem['status'], number>,
    );
  }, []);

  return (
    <div className="product-demo-tab-content">
      <div className="product-demo-section-head">
        <div>
          <div className="product-demo-section-eyebrow">HiGlobal · workforce compliance</div>
          <h3>Compliance status - 14 countries</h3>
        </div>
        <div className="product-demo-compliance-summary">
          <span className="green">
            <CheckCircle2 size={13} /> {counts.green} compliant
          </span>
          <span className="amber">
            <AlertTriangle size={13} /> {counts.amber} action needed
          </span>
          <span className="red">
            <AlertTriangle size={13} /> {counts.red} critical
          </span>
        </div>
      </div>

      <div className="product-demo-compliance-list">
        {COMPLIANCE.map((c, i) => (
          <div
            key={c.country}
            className={`product-demo-compliance-item ${c.status}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="product-demo-compliance-flag">{c.flag}</span>
            <div className="product-demo-compliance-main">
              <div className="product-demo-compliance-country">{c.country}</div>
              <div className="product-demo-compliance-area">{c.area}</div>
            </div>
            <div className="product-demo-compliance-note">{c.note}</div>
            <div className="product-demo-compliance-status">
              <span className={`product-demo-compliance-dot ${c.status}`} />
              <span className="product-demo-compliance-status-text">{statusLabel(c.status)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SSR-safe client mount detection                                    */
/* ------------------------------------------------------------------ */

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

/* ------------------------------------------------------------------ */
/*  Main modal component                                               */
/* ------------------------------------------------------------------ */

export default function ProductDemo({ trigger }: ProductDemoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const mounted = useIsClient();
  const [animateIn, setAnimateIn] = useState(false);
  const [tabKey, setTabKey] = useState(0); // bump to re-trigger fade on tab switch

  // Body scroll lock + ESC listener
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    // Trigger enter animation on next frame
    const raf = requestAnimationFrame(() => setAnimateIn(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
      setAnimateIn(false);
    };
  }, [isOpen]);

  const open = useCallback(() => {
    setActiveTab('overview');
    setIsOpen(true);
  }, []);

  const switchTab = useCallback((id: TabId) => {
    setActiveTab(id);
    setTabKey((k) => k + 1);
  }, []);

  // Run animations only for tabs that mount data dynamically
  const runAnimations = isOpen && animateIn;

  const defaultTrigger = (
    <button type="button" className="btn btn-gold btn-lg" onClick={open}>
      <Sparkles size={16} /> Live Demo
    </button>
  );

  return (
    <>
      {trigger ? (
        <span className="product-demo-trigger" onClick={open}>
          {trigger}
        </span>
      ) : (
        defaultTrigger
      )}

      {mounted && isOpen &&
        createPortal(
          <div
            className={`product-demo-overlay ${animateIn ? 'open' : ''}`}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="HiFive AI product demo"
          >
            <div className={`product-demo-modal ${animateIn ? 'open' : ''}`}>
              {/* Header */}
              <div className="product-demo-header">
                <div className="product-demo-header-left">
                  <div className="product-demo-logo-mark">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="product-demo-title">HiFive AI · Live Demo</div>
                    <div className="product-demo-subtitle">
                      Interactive product walkthrough · simulated data
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="product-demo-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close demo"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="product-demo-tabs">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`product-demo-tab ${activeTab === t.id ? 'active' : ''}`}
                    onClick={() => switchTab(t.id)}
                  >
                    <span className="product-demo-tab-icon">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="product-demo-content">
                <div key={tabKey} className="product-demo-fade">
                  {activeTab === 'overview' && <OverviewTab run={runAnimations} />}
                  {activeTab === 'askai' && <AskAiTab />}
                  {activeTab === 'funnel' && <FunnelTab run={runAnimations} />}
                  {activeTab === 'compliance' && <ComplianceTab />}
                </div>
              </div>

              {/* Footer */}
              <div className="product-demo-footer">
                <div className="product-demo-footer-note">
                  <ShieldCheck size={13} /> This is a non-interactive simulation. Book a real walkthrough for live data.
                </div>
                <a
                  href="https://cal.com/hifiveai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Book Free HR Audit →
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
