'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MetricItem {
  id: string;
  countTarget: number;
  countStart: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const METRICS: MetricItem[] = [
  {
    id: 'time-to-hire',
    countTarget: 40,
    countStart: 0,
    suffix: '%',
    label: 'Faster time-to-hire',
    sublabel: 'Median, mid-market',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'unified-platform',
    countTarget: 5,
    countStart: 0,
    suffix: '',
    label: 'Core modules',
    sublabel: 'Single unified platform',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'countries',
    countTarget: 100,
    countStart: 0,
    suffix: '+',
    label: 'Countries supported',
    sublabel: 'Global compliance & EOR',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'latency',
    countTarget: 0,
    countStart: 14,
    suffix: '',
    label: 'Information latency',
    sublabel: 'Real-time intelligence',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

function MetricCard({ metric, isVisible }: { metric: MetricItem; isVisible: boolean }) {
  const [currentVal, setCurrentVal] = useState<number>(metric.countStart);

  useEffect(() => {
    if (!isVisible) return;

    let animFrame: number;
    const duration = 1600;
    const startTime = performance.now();
    const startVal = metric.countStart;
    const endVal = metric.countTarget;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const computed = startVal + (endVal - startVal) * eased;
      setCurrentVal(Math.round(computed));

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isVisible, metric.countStart, metric.countTarget]);

  return (
    <div className="trust-metric-card">
      <div className="trust-metric-top">
        <div className="trust-metric-icon-wrap">
          {metric.icon}
        </div>
      </div>

      <div className="trust-metric-num-wrap">
        <span className="trust-metric-num-val">
          {currentVal}{metric.suffix}
        </span>
      </div>

      <div className="trust-metric-label">{metric.label}</div>
      <div className="trust-metric-sublabel">{metric.sublabel}</div>
    </div>
  );
}

export default function TrustMetricsBar() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="trust-bar" ref={sectionRef}>
      <div className="trust-bar-inner reveal">
        <div className="trust-bar-header">
          <div className="trust-bar-badge">
            <span className="trust-bar-badge-dot" />
            HiFive AI Platform Benchmarks
          </div>
          <h3 className="trust-bar-title">
            Enterprise impact built for speed, scale &amp; consolidation
          </h3>
        </div>

        <div className="trust-metrics-grid">
          {METRICS.map((metric) => (
            <MetricCard key={metric.id} metric={metric} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
