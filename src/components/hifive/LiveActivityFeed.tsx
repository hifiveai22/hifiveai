'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReveal } from '@/hooks/useReveal';
import './LiveActivityFeed.css';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface LiveActivityFeedProps {
  onNavigate?: (page: PageId) => void;
}

interface ActivityTemplate {
  icon: string;
  title: string;
  source: string;
  initials: string;
}

interface ActivityItem extends ActivityTemplate {
  id: string;
  timestamp: number;
}

interface KpiStat {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
}

/* ── Activity pool - 20 realistic HR event templates ── */
const ACTIVITY_POOL: ActivityTemplate[] = [
  { icon: '🎉', title: 'New hire onboarded: Sarah Chen, Senior Engineer at Stratos Labs', source: 'HiTalent → HiPeople sync', initials: 'SC' },
  { icon: '💰', title: 'Payroll approved: November run for 142 employees', source: 'HiPay', initials: 'NV' },
  { icon: '🏖️', title: 'Time off request: Marcus Reid, 3 days, Dec 15–17', source: 'HiPeople', initials: 'MR' },
  { icon: '✅', title: 'Onboarding complete: Priya Sharma, 12 of 12 tasks', source: 'HiPeople', initials: 'PS' },
  { icon: '📊', title: 'Report generated: Q3 attrition analysis', source: 'HiAI', initials: 'AI' },
  { icon: '🔔', title: 'Compliance alert: CA labor law update effective Jan 1', source: 'HiGlobal', initials: 'CL' },
  { icon: '🌍', title: 'EOR contract signed: Ana Costa, Portugal', source: 'HiGlobal', initials: 'AC' },
  { icon: '💬', title: 'Feedback collected: 24 pulse responses received', source: 'HiOps', initials: 'PF' },
  { icon: '🎉', title: 'New hire onboarded: David Okafor, Product Designer at NovaPay', source: 'HiTalent → HiPeople sync', initials: 'DO' },
  { icon: '💰', title: 'Payroll run: CloudStack Mexico, $284K processed', source: 'HiPay', initials: 'CS' },
  { icon: '🏖️', title: 'Time off approved: Lena Kowalski, 1 week, Feb 10–14', source: 'HiPeople', initials: 'LK' },
  { icon: '✅', title: 'Onboarding step: IT provisioning for Tomás Reyes complete', source: 'HiOps', initials: 'TR' },
  { icon: '📊', title: 'Report generated: Headcount by region, Q4 snapshot', source: 'HiAI', initials: 'AI' },
  { icon: '🔔', title: 'Compliance alert: GDPR audit checklist updated', source: 'HiGlobal', initials: 'GD' },
  { icon: '🌍', title: 'EOR contract: Renegotiation started, Brazil entity', source: 'HiGlobal', initials: 'BR' },
  { icon: '💬', title: 'Feedback collected: Manager review cycle 92% submitted', source: 'HiOps', initials: 'MR' },
  { icon: '🎉', title: 'New hire onboarded: Ingrid Sørensen, Data Lead at Meridian', source: 'HiTalent → HiPeople sync', initials: 'IS' },
  { icon: '💰', title: 'Payroll approved: CartBloom weekly contractor batch', source: 'HiPay', initials: 'CB' },
  { icon: '✅', title: 'Onboarding complete: Aarav Mehta, 14 of 14 tasks', source: 'HiPeople', initials: 'AM' },
  { icon: '📊', title: 'Report generated: Compensation parity benchmark 2025', source: 'HiAI', initials: 'AI' },
];

const MAX_ITEMS = 6;
const MIN_INTERVAL = 3000;
const MAX_INTERVAL = 4000;

const KPIS: KpiStat[] = [
  { label: 'Active Today', target: 1247 },
  { label: 'Pending Approvals', target: 8 },
  { label: 'Completed Today', target: 312 },
];

/* ── Helpers ── */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function formatTimeAgo(timestamp: number, now: number): string {
  const diff = Math.max(0, now - timestamp);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 30) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

let itemIdCounter = 0;
function makeId(): string {
  itemIdCounter += 1;
  return `live-feed-item-${itemIdCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function pickRandomTemplate(exclude?: Set<string>): ActivityTemplate {
  const pool =
    exclude && exclude.size > 0
      ? ACTIVITY_POOL.filter((t) => !exclude.has(t.title))
      : ACTIVITY_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

function createItem(template: ActivityTemplate, ageMs = 0): ActivityItem {
  return {
    ...template,
    id: makeId(),
    timestamp: Date.now() - ageMs,
  };
}

/* ── KPI counter with IntersectionObserver-triggered count-up ── */
function KpiCounter({ stat }: { stat: KpiStat }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const animate = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const duration = 1800;
    const startTime = performance.now();
    const target = stat.target;
    const prefix = stat.prefix || '';
    const suffix = stat.suffix || '';

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(eased * target);
      setDisplayValue(`${prefix}${formatNumber(current)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasAnimated, stat]);

  useEffect(() => {
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
    return () => observer.disconnect();
  }, [animate]);

  return (
    <span ref={ref} className="live-feed-kpi-value">
      {displayValue}
    </span>
  );
}

/* ── Main component ── */
export default function LiveActivityFeed({ onNavigate }: LiveActivityFeedProps) {
  useReveal();

  // Items seeded on mount (avoid SSR/CSR hydration mismatch from Date.now / Math.random)
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [newestId, setNewestId] = useState<string | null>(null);
  const [now, setNow] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastTitleRef = useRef<string | undefined>(undefined);

  // Seed initial feed on mount (deferred to avoid cascading-render lint warning
  // and to keep SSR markup stable since Date.now/Math.random differ server/client)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const realNow = Date.now();
      const seed: ActivityItem[] = [];
      const usedTitles = new Set<string>();
      const ages = [0, 90_000, 240_000, 480_000, 880_000]; // 0, 1.5m, 4m, 8m, ~15m
      for (let i = 0; i < 5; i += 1) {
        const tmpl = pickRandomTemplate(usedTitles);
        usedTitles.add(tmpl.title);
        seed.push(createItem(tmpl, ages[i]));
      }
      setItems(seed);
      setNow(realNow);
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  // Periodically refresh "Xm ago" labels so they stay accurate
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Pause feed when tab is not visible
  useEffect(() => {
    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Periodically prepend a new activity item (every 3–4 seconds)
  useEffect(() => {
    if (!mounted || isPaused) return;

    let timeout: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      timeout = setTimeout(() => {
        const exclude = lastTitleRef.current ? new Set([lastTitleRef.current]) : undefined;
        const tmpl = pickRandomTemplate(exclude);
        lastTitleRef.current = tmpl.title;
        const newItem = createItem(tmpl, 0);
        setItems((prev) => [newItem, ...prev].slice(0, MAX_ITEMS));
        setNewestId(newItem.id);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [mounted, isPaused]);

  // Clear the "newest" marker after the enter animation finishes
  useEffect(() => {
    if (!newestId) return;
    const t = setTimeout(() => setNewestId(null), 700);
    return () => clearTimeout(t);
  }, [newestId]);

  const handleViewDashboard = () => {
    if (onNavigate) {
      onNavigate('platform');
    }
  };

  const visibleItems = items.slice(0, MAX_ITEMS);
  const showSkeleton = items.length === 0;

  return (
    <section className="live-feed-section" aria-label="Live activity feed">
      <div className="live-feed-inner">
        <div className="live-feed-header reveal">
          <div className="eyebrow">Live Activity</div>
          <h2>
            Your dashboard, <em>in motion.</em>
          </h2>
          <p>
            A glimpse of what a HiFive AI customer sees every minute - hires syncing across modules,
            payroll runs clearing, compliance flags firing in real time.
          </p>
        </div>

        <div className="live-feed-card reveal d1">
          {/* Card header: live status + KPI row */}
          <div className="live-feed-card-header">
            <div className="live-feed-status">
              <span className="live-feed-pulse" aria-hidden="true">
                <span className="live-feed-pulse-dot" />
                <span className="live-feed-pulse-ring" />
              </span>
              <span className="live-feed-status-label">Live Activity</span>
              <span className="live-feed-status-sub" suppressHydrationWarning>
                {mounted ? (isPaused ? 'Paused while away' : 'Updating in real-time') : 'Updating in real-time'}
              </span>
            </div>
            <div className="live-feed-kpis">
              {KPIS.map((kpi) => (
                <div key={kpi.label} className="live-feed-kpi">
                  <KpiCounter stat={kpi} />
                  <div className="live-feed-kpi-label">{kpi.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed list */}
          <ul className="live-feed-list" role="list" aria-live="polite" aria-label="Recent HR activity">
            {showSkeleton
              ? Array.from({ length: 4 }).map((_, i) => (
                  <li
                    key={`skeleton-${i}`}
                    className="live-feed-item live-feed-item-skeleton"
                    style={{ '--live-feed-depth': i } as React.CSSProperties}
                  >
                    <div className="live-feed-item-icon" aria-hidden="true">
                      <span className="live-feed-skeleton-bone live-feed-skeleton-bone-icon" />
                    </div>
                    <div className="live-feed-item-body">
                      <span className="live-feed-skeleton-bone live-feed-skeleton-bone-wide" />
                      <span className="live-feed-skeleton-bone live-feed-skeleton-bone-narrow" />
                    </div>
                    <div className="live-feed-item-avatar" aria-hidden="true">
                      <span className="live-feed-skeleton-bone live-feed-skeleton-bone-avatar" />
                    </div>
                  </li>
                ))
              : visibleItems.map((item, idx) => {
                  const isNew = item.id === newestId;
                  return (
                    <li
                      key={item.id}
                      className={`live-feed-item${isNew ? ' live-feed-item-entering' : ''}`}
                      style={{ '--live-feed-depth': idx } as React.CSSProperties}
                    >
                      <div className="live-feed-item-icon" aria-hidden="true">
                        <span>{item.icon}</span>
                      </div>
                      <div className="live-feed-item-body">
                        <div className="live-feed-item-title">{item.title}</div>
                        <div className="live-feed-item-sub">
                          <span className="live-feed-item-source">{item.source}</span>
                          <span className="live-feed-item-dot" aria-hidden="true">
                            •
                          </span>
                          <span className="live-feed-item-time" suppressHydrationWarning>
                            {formatTimeAgo(item.timestamp, now)}
                          </span>
                        </div>
                      </div>
                      <div className="live-feed-item-avatar" aria-hidden="true">
                        {item.initials}
                      </div>
                    </li>
                  );
                })}
          </ul>

          {/* Footer */}
          <div className="live-feed-footer">
            <button
              type="button"
              className="live-feed-footer-link"
              onClick={handleViewDashboard}
            >
              View full dashboard
              <span className="live-feed-footer-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
