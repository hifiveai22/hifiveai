'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import ModuleIcon, { type ModuleName } from './ModuleIcons';
import {
  ChevronRight,
  ChevronLeft,
  Building2,
  AlertTriangle,
  Target,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */

type Step = 1 | 2 | 3 | 4; // 4 = results

interface CompanyProfile {
  companySize: string;
  industry: string;
  toolCount: number;
}

const PAIN_POINTS = [
  'Manual data entry across systems',
  'Payroll errors or compliance risks',
  'Slow hiring process',
  'No cross-module analytics',
  'Difficulty managing global workforce',
] as const;

type PainPoint = (typeof PAIN_POINTS)[number];

const PRIORITIES = [
  'Reduce operational costs',
  'Improve compliance',
  'Accelerate hiring',
] as const;

type Priority = (typeof PRIORITIES)[number];

/* ── Constants ──────────────────────────────────────────── */

const GOLD = '#B07D2E';
const AMBER = '#D4A843';

const SIZE_OPTIONS = [
  { value: '1-50', label: '1–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '501-1000', label: '501–1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
];

const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' },
];

const SIZE_SCORES: Record<string, number> = {
  '1-50': 5,
  '51-200': 10,
  '201-500': 15,
  '501-1000': 20,
  '1000+': 25,
};

function getToolScore(count: number): number {
  if (count <= 3) return 5;
  if (count <= 6) return 10;
  if (count <= 9) return 15;
  if (count <= 12) return 20;
  return 25;
}

const MODULE_RECOMMENDATIONS: Record<Priority, ModuleName[]> = {
  'Reduce operational costs': ['hipay', 'hiops', 'hiai'],
  'Improve compliance': ['higlobal', 'hipay', 'hiai'],
  'Accelerate hiring': ['hitalent', 'hipeople', 'hiai'],
};

const MODULE_LABELS: Record<ModuleName, string> = {
  hiai: 'HiAI',
  hitalent: 'HiTalent',
  hipeople: 'HiPeople',
  hipay: 'HiPay',
  higlobal: 'HiGlobal',
  hiops: 'HiOps',
};

const MODULE_DESCRIPTIONS: Record<ModuleName, string> = {
  hiai: 'AI-native intelligence layer that reasons across all your people data',
  hitalent: 'Autonomous talent acquisition with AI-powered sourcing and scheduling',
  hipeople: 'Unified people management with engagement and performance insights',
  hipay: 'Global payroll with 99.9% accuracy across 150+ countries',
  higlobal: 'Compliance automation with labor laws hardcoded into the architecture',
  hiops: 'Operations hub for asset, workspace, and IT management',
};

const SAVINGS_RANGES: Record<string, [number, number]> = {
  '1-50': [15000, 45000],
  '51-200': [45000, 120000],
  '201-500': [120000, 250000],
  '501-1000': [250000, 500000],
  '1000+': [250000, 500000],
};

type MaturityLevel = 'Beginning' | 'Developing' | 'Advanced' | 'Leading';

function getMaturityLevel(score: number): MaturityLevel {
  if (score <= 25) return 'Beginning';
  if (score <= 50) return 'Developing';
  if (score <= 75) return 'Advanced';
  return 'Leading';
}

function getMaturityDescription(level: MaturityLevel): string {
  switch (level) {
    case 'Beginning':
      return 'Lots of room to improve - your HR processes are largely manual and fragmented.';
    case 'Developing':
      return 'Building foundation - you have some systems but they don\'t talk to each other.';
    case 'Advanced':
      return 'Optimizing processes - you have solid systems but need cross-module intelligence.';
    case 'Leading':
      return 'Best-in-class - your HR tech is mature and unified for strategic impact.';
  }
}

function getMaturityColor(level: MaturityLevel): string {
  switch (level) {
    case 'Beginning':
      return '#EF4444';
    case 'Developing':
      return '#F59E0B';
    case 'Advanced':
      return '#10B981';
    case 'Leading':
      return GOLD;
  }
}

function formatCurrency(n: number): string {
  if (n >= 1000) {
    return `$${(n / 1000).toFixed(0)}K`;
  }
  return `$${n}`;
}

/* ── Animated Score Counter ─────────────────────────────── */

function AnimatedScore({ target, color }: { target: number; color: string }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const startVal = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  // Circular progress
  const radius = 72;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (display / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: (radius * 2) + 16, height: (radius * 2) + 16, margin: '0 auto' }}>
      <svg
        width={(radius * 2) + 16}
        height={(radius * 2) + 16}
        viewBox={`0 0 ${(radius * 2) + 16} ${(radius * 2) + 16}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={radius + 8}
          cy={radius + 8}
          r={normalizedRadius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={radius + 8}
          cy={radius + 8}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--font-sans)' }}>
          {display}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
          out of 100
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */

export default function HRAssessment() {
  useReveal();

  const [step, setStep] = useState<Step>(1);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    companySize: '',
    industry: '',
    toolCount: 5,
  });
  const [painPoints, setPainPoints] = useState<Set<PainPoint>>(new Set());
  const [priority, setPriority] = useState<Priority | ''>('');
  const [animateIn, setAnimateIn] = useState(true);

  // Step transition
  const goToStep = useCallback((nextStep: Step) => {
    setAnimateIn(false);
    setTimeout(() => {
      setStep(nextStep);
      setAnimateIn(true);
    }, 250);
  }, []);

  // Calculate score
  const score = (() => {
    const sizeScore = SIZE_SCORES[companyProfile.companySize] ?? 0;
    const toolScore = getToolScore(companyProfile.toolCount);
    const painScore = painPoints.size * 10;
    return Math.min(sizeScore + toolScore + painScore, 100);
  })();

  const maturityLevel = getMaturityLevel(score);
  const maturityColor = getMaturityColor(maturityLevel);
  const recommendedModules = priority ? MODULE_RECOMMENDATIONS[priority] : ['hiai', 'hitalent', 'hipay'];

  // Estimated savings
  const savingsRange = companyProfile.companySize
    ? SAVINGS_RANGES[companyProfile.companySize]
    : [15000, 45000];
  const fragmentationFactor = companyProfile.toolCount / 5;
  const lowSavings = Math.round(savingsRange[0] * fragmentationFactor);
  const highSavings = Math.round(savingsRange[1] * fragmentationFactor);

  const canProceedStep1 = companyProfile.companySize !== '' && companyProfile.industry !== '';
  const canProceedStep2 = painPoints.size > 0;
  const canProceedStep3 = priority !== '';

  /* ── Step Icons ────────────────────────────── */
  const stepIcons = [
    <Building2 key="s1" size={16} />,
    <AlertTriangle key="s2" size={16} />,
    <Target key="s3" size={16} />,
    <BarChart3 key="s4" size={16} />,
  ];

  const stepLabels = ['Profile', 'Pain Points', 'Priorities', 'Results'];

  /* ── Styles ────────────────────────────── */

  const sectionStyle: React.CSSProperties = {
    padding: '80px 24px',
    background: 'linear-gradient(180deg, #0E0D0B 0%, #141210 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 640,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '40px 32px',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    zIndex: 1,
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  const sliderTrackStyle: React.CSSProperties = {
    width: '100%',
    height: 6,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.1)',
    position: 'relative',
    cursor: 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  };

  const btnGold: React.CSSProperties = {
    background: `linear-gradient(135deg, ${GOLD} 0%, ${AMBER} 100%)`,
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: `0 4px 16px rgba(176,125,46,0.3)`,
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const btnOutline: React.CSSProperties = {
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '14px 24px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'border-color 0.2s, color 0.2s',
  };

  return (
    <section className="hr-assessment-section" style={sectionStyle}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(176,125,46,0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow reveal">HR Maturity Assessment</div>
          <h2
            className="reveal d1"
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 12,
            }}
          >
            How mature is your<br /><em style={{ color: GOLD }}>HR technology stack?</em>
          </h2>
          <p
            className="reveal d2"
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Answer 3 quick questions and get your personalized HR maturity score, recommended modules, and estimated savings.
          </p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div style={{ maxWidth: 480, margin: '0 auto 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: step >= s ? GOLD : 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}
                >
                  {stepIcons[s - 1]}
                  {stepLabels[s - 1]}
                </div>
              ))}
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${GOLD}, ${AMBER})`,
                  width: `${(step / 3) * 100}%`,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div
          style={{
            ...cardStyle,
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {/* ── Step 1: Company Profile ─────────────── */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${GOLD}, ${AMBER})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  1
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>
                  Company Profile
                </h3>
              </div>

              {/* Company Size */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Company Size</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={companyProfile.companySize}
                    onChange={(e) =>
                      setCompanyProfile((p) => ({ ...p, companySize: e.target.value }))
                    }
                    style={selectStyle}
                  >
                    <option value="" disabled>
                      Select company size…
                    </option>
                    {SIZE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%) rotate(90deg)',
                      color: 'rgba(255,255,255,0.3)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Industry */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Industry</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={companyProfile.industry}
                    onChange={(e) =>
                      setCompanyProfile((p) => ({ ...p, industry: e.target.value }))
                    }
                    style={selectStyle}
                  >
                    <option value="" disabled>
                      Select industry…
                    </option>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%) rotate(90deg)',
                      color: 'rgba(255,255,255,0.3)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Tool Count Slider */}
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>
                  Current HR Tools Count: <span style={{ color: GOLD, fontWeight: 800 }}>{companyProfile.toolCount}</span>
                </label>
                <div style={{ padding: '8px 0' }}>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={companyProfile.toolCount}
                    onChange={(e) =>
                      setCompanyProfile((p) => ({ ...p, toolCount: parseInt(e.target.value, 10) }))
                    }
                    style={{
                      width: '100%',
                      height: 6,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD} ${((companyProfile.toolCount - 1) / 14) * 100}%, rgba(255,255,255,0.1) ${((companyProfile.toolCount - 1) / 14) * 100}%, rgba(255,255,255,0.1) 100%)`,
                      borderRadius: 3,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      marginTop: 4,
                    }}
                  >
                    <span>1 tool</span>
                    <span>15 tools</span>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => goToStep(2)}
                  disabled={!canProceedStep1}
                  style={{
                    ...btnGold,
                    opacity: canProceedStep1 ? 1 : 0.4,
                    cursor: canProceedStep1 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Pain Points ─────────────── */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${GOLD}, ${AMBER})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  2
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>
                  Pain Points
                </h3>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                Select all that apply to your organization.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {PAIN_POINTS.map((point) => {
                  const checked = painPoints.has(point);
                  return (
                    <label
                      key={point}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 18px',
                        background: checked
                          ? 'rgba(176,125,46,0.1)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${checked ? 'rgba(176,125,46,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 10,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: checked
                            ? `2px solid ${GOLD}`
                            : '2px solid rgba(255,255,255,0.2)',
                          background: checked ? GOLD : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          flexShrink: 0,
                        }}
                      >
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
                      </div>
                      <span
                        style={{
                          fontSize: 15,
                          color: checked ? '#fff' : 'rgba(255,255,255,0.6)',
                          fontWeight: checked ? 600 : 400,
                          transition: 'all 0.2s',
                        }}
                      >
                        {point}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setPainPoints((prev) => {
                            const next = new Set(prev);
                            if (next.has(point)) next.delete(point);
                            else next.add(point);
                            return next;
                          });
                        }}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => goToStep(1)} style={btnOutline}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => goToStep(3)}
                  disabled={!canProceedStep2}
                  style={{
                    ...btnGold,
                    opacity: canProceedStep2 ? 1 : 0.4,
                    cursor: canProceedStep2 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Priorities ─────────────── */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${GOLD}, ${AMBER})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  3
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>
                  Top Priority
                </h3>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                Choose the one that matters most right now.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {PRIORITIES.map((p) => {
                  const selected = priority === p;
                  return (
                    <label
                      key={p}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 18px',
                        background: selected
                          ? 'rgba(176,125,46,0.1)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selected ? 'rgba(176,125,46,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 10,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          border: selected
                            ? `2px solid ${GOLD}`
                            : '2px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          flexShrink: 0,
                        }}
                      >
                        {selected && (
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: GOLD,
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 15,
                          color: selected ? '#fff' : 'rgba(255,255,255,0.6)',
                          fontWeight: selected ? 600 : 400,
                          transition: 'all 0.2s',
                        }}
                      >
                        {p}
                      </span>
                      <input
                        type="radio"
                        name="priority"
                        checked={selected}
                        onChange={() => setPriority(p)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => goToStep(2)} style={btnOutline}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => goToStep(4)}
                  disabled={!canProceedStep3}
                  style={{
                    ...btnGold,
                    opacity: canProceedStep3 ? 1 : 0.4,
                    cursor: canProceedStep3 ? 'pointer' : 'not-allowed',
                  }}
                >
                  See Results <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Results ─────────────── */}
          {step === 4 && (
            <div>
              {/* Score */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <AnimatedScore target={score} color={maturityColor} />
              </div>

              {/* Maturity Level Badge */}
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 20px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: `${maturityColor}18`,
                    color: maturityColor,
                    border: `1px solid ${maturityColor}40`,
                  }}
                >
                  {maturityLevel}
                </span>
              </div>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                {getMaturityDescription(maturityLevel)}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.06)',
                  margin: '0 -32px 28px',
                }}
              />

              {/* Recommended Modules */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Target size={16} style={{ color: GOLD }} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: GOLD,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recommended Modules
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recommendedModules.map((mod, i) => (
                    <div
                      key={mod}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 18px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: `rgba(176,125,46,0.1)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ModuleIcon name={mod as ModuleName} size={24} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                          {MODULE_LABELS[mod]}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.4,
                            marginTop: 2,
                          }}
                        >
                          {MODULE_DESCRIPTIONS[mod]}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: GOLD,
                          opacity: 0.5,
                        }}
                      >
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: 'rgba(255,255,255,0.06)',
                  margin: '0 -32px 28px',
                }}
              />

              {/* Estimated Savings */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: 'rgba(176,125,46,0.06)',
                  border: '1px solid rgba(176,125,46,0.15)',
                  borderRadius: 12,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: GOLD,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Estimated Annual Savings
                </div>
                <div
                  style={{
                    fontSize: 'clamp(28px, 4vw, 36px)',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {formatCurrency(lowSavings)} – {formatCurrency(highSavings)}
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}> /yr</span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  Based on your company size and {companyProfile.toolCount} HR tool{companyProfile.toolCount !== 1 ? 's' : ''} in use.
                  Consolidation reduces licensing, reconciliation, and error costs.
                </p>
              </div>

              {/* CTA */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <a
                  href="https://cal.com/hifiveai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-lg pulse"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    textDecoration: 'none',
                  }}
                >
                  Book Free HR Audit <ExternalLink size={16} />
                </a>
              </div>

              {/* Retake */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setCompanyProfile({ companySize: '', industry: '', toolCount: 5 });
                    setPainPoints(new Set());
                    setPriority('');
                    goToStep(1);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 13,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Retake assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom style for select dropdown in dark mode */}
      <style>{`
        .hr-assessment-section select option {
          background: #1a1815;
          color: #fff;
        }
        .hr-assessment-section input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${GOLD}, ${AMBER});
          border: 2px solid rgba(255,255,255,0.2);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(176,125,46,0.3);
          transition: transform 0.15s;
        }
        .hr-assessment-section input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .hr-assessment-section input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${GOLD}, ${AMBER});
          border: 2px solid rgba(255,255,255,0.2);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(176,125,46,0.3);
        }
        .hr-assessment-section input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </section>
  );
}
