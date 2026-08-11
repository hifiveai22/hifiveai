'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import ModuleIcon, { type ModuleName } from './ModuleIcons';
import {
  Building2,
  AlertTriangle,
  Layers3,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  CalendarClock,
  Target,
} from 'lucide-react';
import './OnboardingWizard.css';

/* ── Types ──────────────────────────────────────────────── */

type Step = 1 | 2 | 3 | 4 | 5; // 5 = results screen

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface OnboardingWizardProps {
  onNavigate?: (page: PageId) => void;
}

type ModuleId = 'hitalent' | 'hipeople' | 'hipay' | 'hicomply' | 'higlobal' | 'hiops' | 'hiai';

interface ModuleMeta {
  id: ModuleId;
  name: string;
  role: string;
  monthlyCost: number;
  iconModule?: ModuleName; // when defined, use ModuleIcon; otherwise fall back to lucide
}

interface ChallengeMeta {
  id: string;
  label: string;
  suggests: ModuleId[];
}

interface TimelineMeta {
  id: string;
  label: string;
  description: string;
}

/* ── Constants ──────────────────────────────────────────── */

const GOLD = '#B07D2E';
const AMBER = '#D4A843';

const INDUSTRIES: { value: string; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
];

const CHALLENGES: ChallengeMeta[] = [
  { id: 'disconnected-tools', label: 'Multiple disconnected tools', suggests: ['hiops', 'hipeople'] },
  { id: 'compliance-countries', label: 'Compliance across countries', suggests: ['higlobal', 'hipay'] },
  { id: 'slow-onboarding', label: 'Slow onboarding', suggests: ['hitalent', 'hipeople'] },
  { id: 'no-analytics', label: 'No analytics / insights', suggests: ['hipeople', 'hipay'] },
  { id: 'expensive-stack', label: 'Expensive current stack', suggests: ['hipay', 'hiops'] },
  { id: 'poor-employee-experience', label: 'Poor employee experience', suggests: ['hipeople'] },
];

const MODULES: ModuleMeta[] = [
  { id: 'hitalent', name: 'HiTalent', role: 'Recruiting', monthlyCost: 800, iconModule: 'hitalent' },
  { id: 'hipeople', name: 'HiPeople', role: 'HRIS', monthlyCost: 600, iconModule: 'hipeople' },
  { id: 'hipay', name: 'HiPay', role: 'Payroll', monthlyCost: 1200, iconModule: 'hipay' },
  { id: 'higlobal', name: 'HiGlobal', role: 'EOR', monthlyCost: 1500, iconModule: 'higlobal' },
  { id: 'hiops', name: 'HiOps', role: 'IT Ops', monthlyCost: 500, iconModule: 'hiops' },
];

const MODULE_MAP: Record<ModuleId, ModuleMeta> = MODULES.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<ModuleId, ModuleMeta>
);

const TIMELINES: TimelineMeta[] = [
  { id: 'this-quarter', label: 'This quarter', description: 'Live within 90 days' },
  { id: 'next-quarter', label: 'Next quarter', description: 'Live within 3–6 months' },
  { id: 'next-6-months', label: 'Next 6 months', description: 'Live within 6–12 months' },
  { id: 'exploring', label: 'Just exploring', description: 'Evaluating options' },
];

const STEP_LABELS = ['Profile', 'Challenges', 'Modules', 'Timeline'] as const;

const STEP_ICONS = [
  <Building2 key="s1" size={14} />,
  <AlertTriangle key="s2" size={14} />,
  <Layers3 key="s3" size={14} />,
  <Clock key="s4" size={14} />,
];

const MAX_PRIORITY_PICKS = 3;

const TIER_BASE_COST: Record<string, number> = {
  Starter: 500,
  Growth: 1500,
  Enterprise: 4000,
};

const TIER_PER_EMPLOYEE: Record<string, number> = {
  Starter: 12,
  Growth: 8,
  Enterprise: 6,
};

const TIER_BASE_WEEKS: Record<string, number> = {
  Starter: 2,
  Growth: 4,
  Enterprise: 8,
};

const COUNTRY_FEE = 150;
const COUNTRY_WEEKS = 0.5;
const MODULE_WEEKS = 0.5;

/* ── Plan tier logic ───────────────────────────────────── */

function getPlanTier(size: number): 'Starter' | 'Growth' | 'Enterprise' {
  if (size <= 100) return 'Starter';
  if (size <= 500) return 'Growth';
  return 'Enterprise';
}

function getPlanTierDescription(tier: string): string {
  switch (tier) {
    case 'Starter':
      return 'For teams up to 100. Core HRIS, payroll, and AI insights - fast to deploy, easy to grow into.';
    case 'Growth':
      return 'For scaling teams 101–500. Adds talent acquisition, operations, and cross-module intelligence.';
    case 'Enterprise':
      return 'For 500+ employees across many countries. EOR, advanced compliance, and dedicated architecture.';
    default:
      return '';
  }
}

/* ── Module icon renderer (handles HiComply fallback) ──── */

function ModuleGlyph({ id, size = 22 }: { id: ModuleId; size?: number }) {
  const meta = MODULE_MAP[id];
  if (meta?.iconModule) {
    return <ModuleIcon name={meta.iconModule} size={size} />;
  }
  return <ShieldCheck size={size} style={{ color: GOLD }} />;
}

/* ── Animated number (count-up) ────────────────────────── */

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();
    const startVal = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (value - startVal) * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

/* ── Main Component ─────────────────────────────────────── */

export default function OnboardingWizard({ onNavigate }: OnboardingWizardProps) {
  useReveal();

  const [step, setStep] = useState<Step>(1);
  const [animateIn, setAnimateIn] = useState(true);

  // Step 1 state
  const [companySize, setCompanySize] = useState(100);
  const [industry, setIndustry] = useState<string>('');
  const [countries, setCountries] = useState(3);

  // Step 2 state
  const [challenges, setChallenges] = useState<Set<string>>(new Set());

  // Step 3 state
  const [priorities, setPriorities] = useState<ModuleId[]>([]);

  // Step 4 state
  const [timeline, setTimeline] = useState<string>('');

  /* ── Step transitions ─────────────────────────────── */
  const goToStep = useCallback((nextStep: Step) => {
    setAnimateIn(false);
    setTimeout(() => {
      setStep(nextStep);
      setAnimateIn(true);
    }, 220);
  }, []);

  /* ── Toggle handlers ──────────────────────────────── */
  const toggleChallenge = useCallback((id: string) => {
    setChallenges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const togglePriority = useCallback((id: ModuleId) => {
    setPriorities((prev) => {
      if (prev.includes(id)) {
        return prev.filter((m) => m !== id);
      }
      if (prev.length >= MAX_PRIORITY_PICKS) {
        // Replace the oldest pick to keep within max
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }, []);

  /* ── Validation ───────────────────────────────────── */
  const canProceedStep1 = industry !== '';
  const canProceedStep2 = challenges.size > 0;
  const canProceedStep3 = priorities.length > 0;
  const canProceedStep4 = timeline !== '';

  /* ── Derived: recommended modules & costs ─────────── */
  const recommendedModules = useMemo<ModuleId[]>(() => {
    const result: ModuleId[] = [...priorities];
    challenges.forEach((c) => {
      const meta = CHALLENGES.find((m) => m.id === c);
      meta?.suggests.forEach((m) => {
        if (!result.includes(m)) result.push(m);
      });
    });
    return result.slice(0, 5);
  }, [priorities, challenges]);

  const planTier = useMemo(() => getPlanTier(companySize), [companySize]);

  const monthlyCost = useMemo(() => {
    const base = TIER_BASE_COST[planTier];
    const moduleTotal = recommendedModules.reduce(
      (sum, m) => sum + (MODULE_MAP[m]?.monthlyCost ?? 0),
      0
    );
    const employeeTotal = companySize * TIER_PER_EMPLOYEE[planTier];
    const countryTotal = Math.max(0, countries - 1) * COUNTRY_FEE;
    return base + moduleTotal + employeeTotal + countryTotal;
  }, [planTier, recommendedModules, companySize, countries]);

  const setupWeeks = useMemo(() => {
    const base = TIER_BASE_WEEKS[planTier];
    const moduleWeeks = recommendedModules.length * MODULE_WEEKS;
    const countryWeeks = Math.max(0, countries - 1) * COUNTRY_WEEKS;
    return base + moduleWeeks + countryWeeks;
  }, [planTier, recommendedModules, countries]);

  const setupTimeLabel = useMemo(() => {
    const low = Math.max(1, Math.round(setupWeeks));
    const high = Math.round(setupWeeks * 1.5);
    if (low === high) return `${low} weeks`;
    return `${low}–${high} weeks`;
  }, [setupWeeks]);

  /* ── Persistence: fire-and-forget POST when results render ─── */
  // Persists the wizard submission to /api/onboarding exactly once per
  // results-screen entry. The ref is reset whenever the user leaves step 5
  // (e.g. by clicking "Start over"), so a fresh completion submits again.
  const persistedRef = useRef(false);
  useEffect(() => {
    if (step !== 5) {
      persistedRef.current = false;
      return;
    }
    if (persistedRef.current) return;
    persistedRef.current = true;

    const payload = {
      companySize,
      industry,
      countries,
      challenges: Array.from(challenges),
      priorities,
      timeline,
      recommendedPlan: planTier,
      estimatedCost: monthlyCost,
      estimatedSetup: setupTimeLabel,
    };

    fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Fire-and-forget: don't block the UI; just log on failure.
      console.error('Failed to persist onboarding submission:', err);
    });
  }, [
    step,
    companySize,
    industry,
    countries,
    challenges,
    priorities,
    timeline,
    planTier,
    monthlyCost,
    setupTimeLabel,
  ]);

  /* ── Reset ────────────────────────────────────────── */
  const resetWizard = useCallback(() => {
    setCompanySize(100);
    setIndustry('');
    setCountries(3);
    setChallenges(new Set());
    setPriorities([]);
    setTimeline('');
    goToStep(1);
  }, [goToStep]);

  /* ── Slider helpers ───────────────────────────────── */
  const sizePct = ((companySize - 10) / (1000 - 10)) * 100;
  const countryPct = ((countries - 1) / (20 - 1)) * 100;

  return (
    <section className="onboard-wizard">
      <div className="onboard-bg-glow" aria-hidden="true" />

      <div className="onboard-inner">
        {/* Header */}
        <header className="onboard-header">
          <div className="eyebrow reveal">Plan Finder</div>
          <h2 className="reveal d1">
            Find your perfect plan in
            <br />
            <em>four quick steps.</em>
          </h2>
          <p className="reveal d2">
            Answer a few questions about your team. We&apos;ll recommend a tier, the right modules,
            an estimated monthly cost, and a realistic setup timeline - all in under a minute.
          </p>
        </header>

        {/* Progress Bar - visible only on input steps */}
        {step < 5 && (
          <div className="onboard-progress reveal d2" aria-label={`Step ${step} of 4`}>
            <div className="onboard-progress-steps">
              {[1, 2, 3, 4].map((s) => {
                const isActive = step === s;
                const isDone = step > s;
                return (
                  <div
                    key={s}
                    className={[
                      'onboard-progress-step',
                      isActive ? 'active' : '',
                      isDone ? 'done' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="onboard-progress-dot">
                      {isDone ? <Check size={13} /> : <span>{s}</span>}
                    </div>
                    <span className="onboard-progress-label">
                      {STEP_ICONS[s - 1]}
                      {STEP_LABELS[s - 1]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="onboard-progress-bar">
              <div
                className="onboard-progress-fill"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Card with step content */}
        <div className={`onboard-card ${animateIn ? 'animating-in' : 'animating-out'}`}>
          {/* ── Step 1: Company Profile ─────────────── */}
          {step === 1 && (
            <div className="onboard-step">
              <div className="onboard-step-head">
                <div className="onboard-step-num">1</div>
                <div>
                  <h3>Company Profile</h3>
                  <p>Tell us about your organization.</p>
                </div>
              </div>

              {/* Company Size slider */}
              <div className="onboard-field">
                <div className="onboard-field-label">
                  <span>Company size</span>
                  <span className="onboard-field-value">
                    <AnimatedNumber key={companySize} value={companySize} /> employees
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={companySize}
                  onChange={(e) => setCompanySize(Number(e.target.value))}
                  className="onboard-slider"
                  style={
                    {
                      background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD} ${sizePct}%, var(--onboard-track) ${sizePct}%, var(--onboard-track) 100%)`,
                    } as React.CSSProperties
                  }
                  aria-label="Company size in employees"
                />
                <div className="onboard-slider-range">
                  <span>10</span>
                  <span>1,000</span>
                </div>
              </div>

              {/* Industry */}
              <div className="onboard-field">
                <label className="onboard-field-label" htmlFor="onboard-industry">
                  <span>Industry</span>
                </label>
                <div className="onboard-select-wrap">
                  <select
                    id="onboard-industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="onboard-select"
                    aria-label="Industry"
                  >
                    <option value="" disabled>
                      Select industry…
                    </option>
                    {INDUSTRIES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="onboard-select-caret"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Countries slider */}
              <div className="onboard-field">
                <div className="onboard-field-label">
                  <span>Countries operating in</span>
                  <span className="onboard-field-value">
                    <AnimatedNumber key={countries} value={countries} />
                    {countries === 1 ? ' country' : ' countries'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={countries}
                  onChange={(e) => setCountries(Number(e.target.value))}
                  className="onboard-slider"
                  style={
                    {
                      background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD} ${countryPct}%, var(--onboard-track) ${countryPct}%, var(--onboard-track) 100%)`,
                    } as React.CSSProperties
                  }
                  aria-label="Number of countries operating in"
                />
                <div className="onboard-slider-range">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              {/* Nav */}
              <div className="onboard-nav">
                <span className="onboard-nav-spacer" />
                <button
                  type="button"
                  className="onboard-btn onboard-btn-gold"
                  onClick={() => goToStep(2)}
                  disabled={!canProceedStep1}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Current Challenges ─────────────── */}
          {step === 2 && (
            <div className="onboard-step">
              <div className="onboard-step-head">
                <div className="onboard-step-num">2</div>
                <div>
                  <h3>Current Challenges</h3>
                  <p>Select all that apply to your organization today.</p>
                </div>
              </div>

              <div className="onboard-options">
                {CHALLENGES.map((c) => {
                  const checked = challenges.has(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`onboard-option ${checked ? 'selected' : ''}`}
                    >
                      <span className={`onboard-check ${checked ? 'checked' : ''}`}>
                        {checked && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2.5 6L5 8.5L9.5 3.5"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="onboard-option-text">{c.label}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChallenge(c.id)}
                        className="onboard-sr-input"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="onboard-nav">
                <button
                  type="button"
                  className="onboard-btn onboard-btn-outline"
                  onClick={() => goToStep(1)}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="onboard-btn onboard-btn-gold"
                  onClick={() => goToStep(3)}
                  disabled={!canProceedStep2}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Priority Modules ─────────────── */}
          {step === 3 && (
            <div className="onboard-step">
              <div className="onboard-step-head">
                <div className="onboard-step-num">3</div>
                <div>
                  <h3>Priority Modules</h3>
                  <p>
                    Pick your top {MAX_PRIORITY_PICKS}. You&apos;ve selected{' '}
                    <strong style={{ color: 'var(--gold)' }}>{priorities.length}</strong> of{' '}
                    {MAX_PRIORITY_PICKS}.
                  </p>
                </div>
              </div>

              <div className="onboard-modules">
                {MODULES.map((m) => {
                  const selected = priorities.includes(m.id);
                  const order = priorities.indexOf(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      className={`onboard-module ${selected ? 'selected' : ''}`}
                      onClick={() => togglePriority(m.id)}
                      aria-pressed={selected}
                    >
                      <div className="onboard-module-icon">
                        <ModuleGlyph id={m.id} size={24} />
                      </div>
                      <div className="onboard-module-text">
                        <span className="onboard-module-name">{m.name}</span>
                        <span className="onboard-module-role">{m.role}</span>
                      </div>
                      {selected && (
                        <span className="onboard-module-order">#{order + 1}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="onboard-nav">
                <button
                  type="button"
                  className="onboard-btn onboard-btn-outline"
                  onClick={() => goToStep(2)}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="onboard-btn onboard-btn-gold"
                  onClick={() => goToStep(4)}
                  disabled={!canProceedStep3}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Timeline ─────────────── */}
          {step === 4 && (
            <div className="onboard-step">
              <div className="onboard-step-head">
                <div className="onboard-step-num">4</div>
                <div>
                  <h3>Timeline</h3>
                  <p>When do you need it live?</p>
                </div>
              </div>

              <div className="onboard-options onboard-options-stack">
                {TIMELINES.map((t) => {
                  const selected = timeline === t.id;
                  return (
                    <label
                      key={t.id}
                      className={`onboard-option onboard-option-row ${selected ? 'selected' : ''}`}
                    >
                      <span className={`onboard-radio ${selected ? 'selected' : ''}`}>
                        {selected && <span className="onboard-radio-dot" />}
                      </span>
                      <span className="onboard-option-text">
                        <span className="onboard-option-title">{t.label}</span>
                        <span className="onboard-option-desc">{t.description}</span>
                      </span>
                      <input
                        type="radio"
                        name="timeline"
                        value={t.id}
                        checked={selected}
                        onChange={() => setTimeline(t.id)}
                        className="onboard-sr-input"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="onboard-nav">
                <button
                  type="button"
                  className="onboard-btn onboard-btn-outline"
                  onClick={() => goToStep(3)}
                >
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="onboard-btn onboard-btn-gold"
                  onClick={() => goToStep(5)}
                  disabled={!canProceedStep4}
                >
                  See Recommendation <Sparkles size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Results ─────────────── */}
          {step === 5 && (
            <div className="onboard-results">
              <div className="onboard-results-head">
                <div className="onboard-results-badge">
                  <Sparkles size={14} />
                  Your Recommendation
                </div>
                <h3>Based on your inputs</h3>
                <p>
                  A tailored plan for a {companySize}-employee {INDUSTRIES.find((i) => i.value === industry)?.label ?? ''}{' '}
                  organization operating across {countries} {countries === 1 ? 'country' : 'countries'}.
                </p>
              </div>

              {/* Plan tier + cost row */}
              <div className="onboard-result-grid">
                <div
                  className="onboard-result-card onboard-result-tier"
                  style={{ animationDelay: '0.05s' }}
                >
                  <div className="onboard-result-label">
                    <Building2 size={14} /> Recommended Plan
                  </div>
                  <div className="onboard-result-tier-name">{planTier}</div>
                  <p className="onboard-result-tier-desc">{getPlanTierDescription(planTier)}</p>
                </div>

                <div
                  className="onboard-result-card onboard-result-cost"
                  style={{ animationDelay: '0.13s' }}
                >
                  <div className="onboard-result-label">
                    <Target size={14} /> Estimated Monthly Cost
                  </div>
                  <div className="onboard-result-cost-amount">
                    $<AnimatedNumber key={monthlyCost} value={monthlyCost} />
                  </div>
                  <p className="onboard-result-cost-note">
                    Includes base tier, {recommendedModules.length} module
                    {recommendedModules.length === 1 ? '' : 's'}, {companySize} employees, and{' '}
                    {countries} {countries === 1 ? 'country' : 'countries'}.
                  </p>
                </div>

                <div
                  className="onboard-result-card onboard-result-time"
                  style={{ animationDelay: '0.21s' }}
                >
                  <div className="onboard-result-label">
                    <CalendarClock size={14} /> Estimated Setup Time
                  </div>
                  <div className="onboard-result-time-amount">{setupTimeLabel}</div>
                  <p className="onboard-result-time-note">
                    Based on plan tier, module count, and number of countries.
                  </p>
                </div>
              </div>

              {/* Recommended modules */}
              <div
                className="onboard-result-modules"
                style={{ animationDelay: '0.29s' }}
              >
                <div className="onboard-result-label">
                  <Layers3 size={14} /> Recommended Modules
                </div>
                <div className="onboard-module-list">
                  {recommendedModules.map((m, i) => {
                    const meta = MODULE_MAP[m];
                    return (
                      <div key={m} className="onboard-module-row" style={{ animationDelay: `${0.35 + i * 0.06}s` }}>
                        <div className="onboard-module-icon onboard-module-icon-sm">
                          <ModuleGlyph id={m} size={20} />
                        </div>
                        <div className="onboard-module-text">
                          <span className="onboard-module-name">{meta?.name ?? m}</span>
                          <span className="onboard-module-role">{meta?.role ?? ''}</span>
                        </div>
                        <span className="onboard-module-price">
                          ${meta?.monthlyCost ?? 0}/mo
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTAs */}
              <div
                className="onboard-result-ctas"
                style={{ animationDelay: '0.55s' }}
              >
                <button
                  type="button"
                  className="onboard-btn onboard-btn-gold onboard-btn-lg"
                  onClick={() => onNavigate?.('contact')}
                >
                  Book a Demo <ChevronRight size={16} />
                </button>
                <a
                  href="https://cal.com/hifiveai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="onboard-btn onboard-btn-outline onboard-btn-lg"
                >
                  Start Free Trial
                </a>
              </div>

              {/* Restart */}
              <div className="onboard-result-restart">
                <button type="button" onClick={resetWizard} className="onboard-restart-btn">
                  <RotateCcw size={13} /> Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
