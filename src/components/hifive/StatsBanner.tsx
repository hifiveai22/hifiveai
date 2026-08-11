'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
  countTarget?: number;
  countSuffix?: string;
  countPrefix?: string;
  countDecimals?: number;
}

const stats: StatItem[] = [
  { value: '99.9%', label: 'Payroll accuracy', sublabel: 'Across 150+ countries', countTarget: 99.9, countSuffix: '%', countDecimals: 1, countPrefix: '' },
  { value: '40%', label: 'Faster time-to-hire', sublabel: 'Median, mid-market', countTarget: 40, countSuffix: '%' },
  { value: '$120K+', label: 'Avg annual savings', sublabel: 'Per 150-employee org', countTarget: 120, countSuffix: 'K+', countPrefix: '$' },
  { value: '6 wks', label: 'Average go-live', sublabel: 'From contract to production', countTarget: 6, countSuffix: ' wks' },
  { value: '12', label: 'Point solutions consolidated', sublabel: 'Into one platform', countTarget: 12 },
  { value: 'SOC 2', label: 'Type II certified', sublabel: '+ GDPR + ISO 27001' },
];

/* Easing function: ease-out cubic */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/* Format a number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function AnimatedCounter({ stat }: { stat: StatItem }) {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const animate = useCallback(() => {
    if (stat.countTarget === undefined || hasAnimated) return;
    setHasAnimated(true);

    const duration = 2000;
    const startTime = performance.now();
    const target = stat.countTarget;
    const decimals = stat.countDecimals || 0;
    const prefix = stat.countPrefix || '';
    const suffix = stat.countSuffix || '';

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = easedProgress * target;

      let formatted: string;
      if (decimals > 0) {
        formatted = currentVal.toFixed(decimals);
      } else {
        formatted = formatNumber(Math.round(currentVal));
      }

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [stat, hasAnimated]);

  useEffect(() => {
    const el = ref.current;
    if (!el || stat.countTarget === undefined) return;

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
    return () => observer.disconnect();
  }, [stat, animate]);

  if (stat.countTarget === undefined) {
    return <span>{stat.value}</span>;
  }

  return (
    <span ref={ref} className="counter">
      {displayValue || `0${stat.countSuffix || ''}`}
    </span>
  );
}

export default function StatsBanner() {
  return (
    <section className="stats-banner-section">
      <div className="stats-banner-inner">
        <div className="stats-banner-header reveal">
          <div className="eyebrow">By the Numbers</div>
          <h2>
            Numbers that <em>compound.</em>
          </h2>
          <p>
            Six numbers that explain why mid-market companies switch to HiFive AI.
            All figures benchmarked against 2024 industry data.
          </p>
        </div>

        <div className="stats-banner-grid stagger">
          {stats.map((stat, idx) => (
            <div key={idx} className="stats-banner-card">
              <div className="stats-banner-card-value">
                <AnimatedCounter stat={stat} />
              </div>
              <div className="stats-banner-card-label">{stat.label}</div>
              {stat.sublabel && (
                <div className="stats-banner-card-sublabel">{stat.sublabel}</div>
              )}
              <div className="stats-banner-card-accent" />
            </div>
          ))}
        </div>

        <div className="stats-banner-footnote reveal d2">
          All figures verified against Gartner HR Tech Magic Quadrant 2024,
          Deloitte Global Payroll Benchmarking Study 2024, and HiFive AI customer data.
        </div>
      </div>
    </section>
  );
}
