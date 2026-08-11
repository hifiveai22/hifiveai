'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Globe,
  Shield,
  Rocket,
  Check,
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  highlights: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
}

const steps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to HiFive AI',
    subtitle: 'A 60-second tour of the People Operating System',
    body: 'HiFive AI is not another HR tool. It is a single, AI-native platform that replaces 5–8 disconnected point solutions with one continuously learning system. Let us show you how it works.',
    highlights: [
      '5 interconnected modules, not silos',
      'One AI layer reasons across all of them',
      'Cryptographic source of truth for every data point',
    ],
    icon: Sparkles,
    accent: 'gold',
  },
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    subtitle: 'Your command center, not another report',
    body: 'The dashboard contextualizes raw data against historical trends, industry benchmarks, and company goals. Every metric answers one question: are we growing efficiently? Numbers update in real-time as hires, payroll runs, and compliance events happen.',
    highlights: [
      'Live KPIs: headcount, revenue/employee, time-to-hire, attrition',
      'Hiring funnel with conversion rates per stage',
      'Compliance status across all jurisdictions',
      'Budget utilization tracking',
    ],
    icon: LayoutDashboard,
    accent: 'green',
  },
  {
    id: 'ask-ai',
    title: 'Ask AI - your Chief of Staff',
    subtitle: 'Reasoning, not just conversation',
    body: 'Ask AI does not generate plausible text. It queries your live data fabric, joins tables across modules, applies business logic, and returns an auditable answer with citations. Every number links to the underlying record.',
    highlights: [
      'Natural language to multi-table SQL queries',
      'Cross-module reasoning: hiring + payroll + compliance',
      'Cited answers with row-level permission enforcement',
      'Takes actions: posts jobs, schedules interviews, approves requests',
    ],
    icon: MessageSquare,
    accent: 'amber',
  },
  {
    id: 'global',
    title: 'Global compliance, hardcoded',
    subtitle: 'Labor laws as architecture, not bolt-on',
    body: 'HiGlobal tracks visa expirations, scans contracts for misclassification risk, generates localized offers per jurisdiction, and monitors labor law changes in 150+ countries. Compliance is enforced at the data layer - not by reminders humans might miss.',
    highlights: [
      '150+ country tax engines with real-time updates',
      'Visa tracking with 90/60/30-day expiry alerts',
      'Misclassification scanner for contractor contracts',
      'Localized contract generation per jurisdiction',
    ],
    icon: Globe,
    accent: 'gold',
  },
  {
    id: 'security',
    title: 'Enterprise-grade security',
    subtitle: 'Trust by architecture, not by promise',
    body: 'SOC 2 Type II, ISO 27001, GDPR, CCPA. Row-level security enforced at the database layer. Immutable audit logs with 7-year retention. SSO required for admins. Encryption everywhere with customer-managed keys on Enterprise.',
    highlights: [
      'SOC 2 Type II + ISO 27001 + GDPR + CCPA certified',
      'Row-level database security, not app-level filtering',
      'Immutable, cryptographically signed audit logs',
      'Data residency: EU-only for EU, US-only for US',
    ],
    icon: Shield,
    accent: 'green',
  },
  {
    id: 'go-live',
    title: 'Go live in 6 weeks',
    subtitle: 'From contract to production',
    body: 'Discovery, data migration, configuration, parallel payroll run, manager training, go-live with 2-week hypercare. Non-destructive migration - your source systems stay operational until validation passes. No data loss in 240+ implementations.',
    highlights: [
      '6-week standard implementation',
      'Parallel payroll run for validation',
      'Dedicated implementation specialist (not self-serve)',
      '2-week hypercare with 4-hour SLA',
    ],
    icon: Rocket,
    accent: 'gold',
  },
];

interface FeatureTourProps {
  onComplete?: () => void;
}

const emptySubscribe = () => () => {};
const STORAGE_KEY = 'hifive-tour-completed';

export default function FeatureTour({ onComplete }: FeatureTourProps = {}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-open on first visit disabled by default - users trigger via "Take the Tour" button
  // or window.dispatchEvent(new CustomEvent('hifive:open-tour'))
  // To re-enable auto-open, uncomment the block below:
  // useEffect(() => {
  //   if (!mounted) return;
  //   const completed = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY);
  //   if (!completed) {
  //     const timer = setTimeout(() => setIsOpen(true), 4000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [mounted]);

  // External open signal (e.g., from a "Take the Tour" button).
  // When the parent bumps openSignal (a number that increases), open the tour.
  // Implemented as a global CustomEvent listener so any component can trigger
  // it via: window.dispatchEvent(new CustomEvent('hifive:open-tour'))
  useEffect(() => {
    const handler = () => {
      setStepIdx(0);
      setIsOpen(true);
    };
    window.addEventListener('hifive:open-tour', handler);
    return () => window.removeEventListener('hifive:open-tour', handler);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'completed');
    }
    onComplete?.();
  }, [onComplete]);

  const handleNext = useCallback(() => {
    setStepIdx((i) => {
      if (i >= steps.length - 1) {
        handleClose();
        return 0;
      }
      return i + 1;
    });
  }, [handleClose]);

  const handlePrev = useCallback(() => {
    setStepIdx((i) => Math.max(0, i - 1));
  }, []);

  // ESC to close, Arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose, handleNext, handlePrev]);

  if (!mounted) return null;

  const step = steps[stepIdx];
  const Icon = step.icon;
  const progress = ((stepIdx + 1) / steps.length) * 100;

  return (
    <>
      {isOpen &&
        createPortal(
          <div className="tour-overlay" role="dialog" aria-modal="true" aria-labelledby="tour-title">
            <div className="tour-backdrop" onClick={handleClose} />
            <div className="tour-modal">
              {/* Progress bar */}
              <div className="tour-progress-bar">
                <div
                  className="tour-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Header */}
              <div className="tour-header">
                <div className="tour-step-counter">
                  Step {stepIdx + 1} of {steps.length}
                </div>
                <button
                  type="button"
                  className="tour-skip-btn"
                  onClick={handleClose}
                  aria-label="Skip tour"
                >
                  Skip <X size={13} />
                </button>
              </div>

              {/* Content */}
              <div className="tour-content" ref={scrollRef} key={step.id}>
                <div className={`tour-icon-wrap accent-${step.accent}`}>
                  <Icon size={36} />
                </div>
                <div className="tour-step-title" id="tour-title">{step.title}</div>
                <div className="tour-step-subtitle">{step.subtitle}</div>
                <p className="tour-step-body">{step.body}</p>
                <ul className="tour-highlights">
                  {step.highlights.map((h, idx) => (
                    <li key={idx}>
                      <Check size={14} className="tour-highlight-check" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="tour-footer">
                <button
                  type="button"
                  className="tour-nav-btn prev"
                  onClick={handlePrev}
                  disabled={stepIdx === 0}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                <div className="tour-dots">
                  {steps.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`tour-dot ${idx === stepIdx ? 'active' : ''} ${idx < stepIdx ? 'done' : ''}`}
                      onClick={() => setStepIdx(idx)}
                      aria-label={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="tour-nav-btn next"
                  onClick={handleNext}
                >
                  {stepIdx === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
