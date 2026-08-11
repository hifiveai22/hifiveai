'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import ProductDemo from './ProductDemo';
import ImplementationTimeline from './ImplementationTimeline';
import HiAIConsoleDemo from './HiAIConsoleDemo';

const archModules = [
  { name:'HiTalent', title:'HiTalent: Talent Acquisition & Intelligence', desc:'AI-native recruitment that replaces keyword matching with semantic skill analysis. Candidates are parsed into structured competency profiles, ranked against job requirements and historical success patterns.', feats:[{icon:'📋',name:'Resume Parsing',desc:'Semantic extraction of skills, not keyword matching'},{icon:'🎯',name:'AI Match Scoring',desc:'Rank candidates against role requirements and success traits'},{icon:'🔖',name:'Anonymized Screening',desc:'Remove demographic data for DEI-compliant evaluation'},{icon:'📅',name:'Auto Scheduling',desc:'Calendar-synced interview scheduling, zero ping-pong'},{icon:'📊',name:'Recruitment Analytics',desc:'Funnel analysis, source ROI, time-in-stage tracking'},{icon:'🚀',name:'Multi-Board Posting',desc:'One click posts to LinkedIn, Indeed, GitHub Jobs and more'}] },
  { name:'HiPeople', title:'HiPeople: People Lifecycle & Culture', desc:'Orchestrates every employee transition - onboarding, promotions, transfers, performance reviews, exits - through a unified workflow engine that auto-propagates changes to Payroll, IT, and Operations.', feats:[{icon:'🚪',name:'Zero-Day Onboarding',desc:'Equipment, accounts, and training ready before day one'},{icon:'📈',name:'Promotions & Transfers',desc:'Multi-approval chains with auto-updates across all modules'},{icon:'⭐',name:'Performance & OKRs',desc:'Goal tracking, calibration, and AI-drafted review summaries'},{icon:'🏢',name:'Org Chart & Succession',desc:'Interactive org visualization with bench strength scoring'},{icon:'🔍',name:'Employee Directory',desc:'Semantic search: "Who knows Python and speaks German?"'},{icon:'💬',name:'Engagement & eNPS',desc:'Pulse surveys with AI-powered root cause analysis'}] },
  { name:'HiPay', title:'HiPay: Payroll, Compensation & Rewards', desc:'Global payroll processing with 100+ country tax engines. Connects to every module - budget validation from HiTalent, salary updates from HiPeople, cost calculations from HiGlobal: eliminating reconciliation entirely.', feats:[{icon:'🌍',name:'100+ Country Tax Engines',desc:'Real-time tax law updates, automatic compliance'},{icon:'⚠️',name:'Pre-Processing Error Detection',desc:'Catches overtime, duplicate payments, and missing data before run'},{icon:'💰',name:'Compensation Bands',desc:'Internal parity checks, equity management, merit cycles'},{icon:'⚖️',name:'Pay Equity Auditing',desc:'Automated equity analysis controlling for tenure and performance'},{icon:'📈',name:'Budget vs. Actual',desc:'Real-time payroll variance tracking against forecast'},{icon:'🏦',name:'Multi-Currency Disbursement',desc:'Single run, multiple currencies, multiple payment providers'}] },
  { name:'HiGlobal', title:'HiGlobal: Global Workforce & Compliance', desc:'Manages the complexity of employing people across borders. EOR cost calculators, contractor misclassification scanning, visa tracking, and localized contract generation - all from one dashboard.', feats:[{icon:'🧮',name:'EOR Cost Calculator',desc:'Compare total landed costs across 80+ countries'},{icon:'🔍',name:'Misclassification Scanner',desc:'AI scans contracts for language triggering misclassification risk'},{icon:'🛂',name:'Visa & Permit Tracking',desc:'Automated expiry alerts 90, 60, and 30 days out'},{icon:'📝',name:'Localized Contracts',desc:'Auto-generated, legally compliant offers per jurisdiction'},{icon:'🗺️',name:'Workforce Map',desc:'Real-time geographic distribution with compliance status'},{icon:'⚖️',name:'Labor Law Engine',desc:'Continuous monitoring of local labor law changes'}] },
  { name:'HiOps', title:'HiOps: Operations, Workspace & IT', desc:'The operational backbone: workspace utilization heatmaps, full asset lifecycle tracking, automated IT provisioning tied to people events, and instant de-provisioning on exit to close security gaps.', feats:[{icon:'🏢',name:'Workspace Heatmaps',desc:'Real-time office utilization to optimize lease decisions'},{icon:'💻',name:'Asset Lifecycle',desc:'Procurement → assignment → maintenance → retirement tracking'},{icon:'🔐',name:'IT Provisioning',desc:'Auto-provision accounts, SSO, and software on hire'},{icon:'🚪',name:'Instant De-Provisioning',desc:'Revoke all access the moment an exit is triggered'},{icon:'📦',name:'Predictive Ordering',desc:'AI predicts equipment needs based on hiring pipeline'},{icon:'📊',name:'Operational Analytics',desc:'Cost-per-employee, real estate efficiency, asset utilization'}] },
];

const checkSvg = (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface PlatformPageProps {
  onNavigate: (page: PageId) => void;
}

export default function PlatformPage({ onNavigate }: PlatformPageProps) {
  useReveal();

  const [activeArchNode, setActiveArchNode] = useState(0);
  const [autoCyclePaused, setAutoCyclePaused] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [hiaiResponseVisible, setHiaiResponseVisible] = useState(false);
  const [hiaiThinking, setHiaiThinking] = useState(true);
  const hiaiBodyRef = useRef<HTMLDivElement>(null);
  const autoCycleRef = useRef<NodeJS.Timeout | null>(null);

  const currentMod = archModules[activeArchNode] || archModules[0];

  const handleArchNodeClick = (index: number) => {
    setActiveArchNode(index);
    setAutoCyclePaused(true);
  };

  useEffect(() => {
    setHeroReady(true);
  }, []);

  // Auto-cycle architecture nodes
  useEffect(() => {
    if (autoCyclePaused) return;

    autoCycleRef.current = setInterval(() => {
      setActiveArchNode((prev) => (prev + 1) % archModules.length);
    }, 4000);

    return () => {
      if (autoCycleRef.current) clearInterval(autoCycleRef.current);
    };
  }, [autoCyclePaused]);

  // HiAI typing animation
  useEffect(() => {
    const body = hiaiBodyRef.current;
    if (!body) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            obs.unobserve(e.target);
            setTimeout(() => {
              setHiaiThinking(false);
              setHiaiResponseVisible(true);
            }, 2200);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(body);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="platform-page">
      {/* HERO */}
      <section className="plat-hero" id="hero">
        <div className="plat-hero-glow" />
        <div className="noise" />
        <div className="plat-hero-content">
          <div className="plat-hero-eyebrow eyebrow" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease' }}>
            Architecture Overview
          </div>
          <h1 style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? 'none' : 'translateY(20px)', transition: 'opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)' }}>
            Five modules.<br /><em>One intelligence layer.</em>
          </h1>
          <p className="plat-hero-sub" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease .3s' }}>
            HiFive AI unifies HiTalent, HiPeople, HiPay, HiGlobal, and HiOps under HiAI: a cross-module reasoning engine that eliminates data silos and automates workflows end-to-end.
          </p>
          <div className="plat-hero-ctas" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease .5s' }}>
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">
              Book Free HR Audit →
            </a>
            <ProductDemo
              trigger={
                <button type="button" className="btn btn-outline-light btn-lg">
                  <span aria-hidden="true">✦</span> Live Demo
                </button>
              }
            />
          </div>
        </div>
      </section>

      {/* ARCHITECTURE DIAGRAM - Animated Orbital Display */}
      <section className="arch-section" id="arch">
        <div className="arch-inner">
          <div className="arch-header reveal">
            <div className="eyebrow">System Architecture</div>
            <h2>Five modules. <em>One intelligence layer.</em></h2>
            <p>Every module shares a single data fabric powered by HiAI. Changes in one propagate instantly across the entire system - no syncs, no imports, no lag.</p>
          </div>

          {/* Orbital Display */}
          <div className="arch-orbit reveal-scale">
            {/* Orbital ring visual */}
            <div className="arch-orbit-ring" />
            <div className="arch-orbit-ring arch-orbit-ring-inner" />

            {/* Animated connection lines SVG */}
            <svg className="arch-connection-svg" viewBox="0 0 500 500" fill="none">
              {archModules.map((_, i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const cx = 250 + 180 * Math.cos(angle);
                const cy = 250 + 180 * Math.sin(angle);
                const isActive = activeArchNode === i;
                return (
                  <g key={i}>
                    {/* Base connection line */}
                    <line
                      x1={250} y1={250} x2={cx} y2={cy}
                      className={`arch-conn-line ${isActive ? 'arch-conn-active' : ''}`}
                    />
                    {/* Data flow pulse dot - active line */}
                    {isActive && (
                      <circle r="4" className="arch-conn-pulse">
                        <animateMotion
                          path={`M250,250 L${cx},${cy}`}
                          dur="1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
              {/* Cross-connections for active module to its neighbors */}
              {activeArchNode >= 0 && (() => {
                const activeAngle = (activeArchNode * 72 - 90) * (Math.PI / 180);
                const ax = 250 + 180 * Math.cos(activeAngle);
                const ay = 250 + 180 * Math.sin(activeAngle);
                const neighbors = [(activeArchNode + 1) % 5, (activeArchNode + 4) % 5];
                return neighbors.map((ni) => {
                  const nAngle = (ni * 72 - 90) * (Math.PI / 180);
                  const nx = 250 + 180 * Math.cos(nAngle);
                  const ny = 250 + 180 * Math.sin(nAngle);
                  return (
                    <line
                      key={`cross-${ni}`}
                      x1={ax} y1={ay} x2={nx} y2={ny}
                      className="arch-conn-cross"
                    />
                  );
                });
              })()}
            </svg>

            {/* Center Hub */}
            <div className="arch-center-hub">
              <div className="arch-center-hub-pulse" />
              <div className="arch-center-hub-name">HiAI</div>
              <div className="arch-center-hub-sub">Intelligence Layer</div>
            </div>

            {/* Orbiting Module Nodes */}
            {archModules.map((m, i) => (
              <div
                key={i}
                className={`arch-orbit-node ${activeArchNode === i ? 'active' : ''}`}
                style={{ '--orbit-angle': `${i * 72 - 90}deg`, '--orbit-delay': `${i * 0.15}s` } as React.CSSProperties}
                onClick={() => handleArchNodeClick(i)}
                onMouseEnter={() => setActiveArchNode(i)}
              >
                <div className="arch-orbit-node-glow" />
                <div className="arch-orbit-node-icon">{['🎯','👥','💸','🌍','⚙️'][i]}</div>
                <div className="arch-orbit-node-name">{m.name}</div>
                <div className="arch-orbit-node-desc">{['Talent Acquisition','People Lifecycle','Payroll & Rewards','Global Workforce','Operations'][i]}</div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className={`arch-detail-panel ${activeArchNode !== -1 ? 'open' : ''}`}>
            <div className="arch-detail-panel-header">
              <h3>{currentMod.title}</h3>
              {autoCyclePaused && (
                <button
                  type="button"
                  className="arch-resume-btn"
                  onClick={() => setAutoCyclePaused(false)}
                  aria-label="Resume auto-cycle"
                >
                  ▶ Resume Tour
                </button>
              )}
            </div>
            <p>{currentMod.desc}</p>
            <div className="arch-detail-features">
              {currentMod.feats.map((f, i) => (
                <div key={i} className="arch-detail-feat"><div className="arch-detail-feat-icon">{f.icon}</div><div className="arch-detail-feat-name">{f.name}</div><div className="arch-detail-feat-desc">{f.desc}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HiAI */}
      <section className="mod-section dark-section" id="askai">
        <div className="noise" />
        <div className="mod-inner">
          <div className="mod-text dark-text reveal-left" style={{ marginBottom: '48px', textAlign: 'center', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="eyebrow">HiAI: The Reasoning Engine</div>
            <h2>Not a chatbot. <em>The cognitive tissue of your company.</em></h2>
            <p>Ask AI inverts the software paradigm: instead of navigating to data, data navigates to your intent. It reasons across every module simultaneously - correlating hiring, payroll, compliance, and operations into one answer.</p>
          </div>
          <div className="hiai-demo reveal-blur">
            <div className="hiai-bar">
              <div className="hiai-dots"><span></span><span></span><span></span></div>
              <span className="hiai-bar-label">HiAI: Cross-Module Reasoning</span>
              <span className="hiai-bar-badge"><span className="dot-live" /> Live</span>
            </div>
            <div className="hiai-body" ref={hiaiBodyRef}>
              <div className="hiai-msg hiai-msg-user">
                <div className="hiai-msg-user-avatar">CFO</div>
                <div className="hiai-msg-user-text">Why are payroll costs in the London office 12% over budget this quarter?</div>
              </div>
              {hiaiThinking && (
                <div className="hiai-thinking"><span></span><span></span><span></span> Reasoning across 4 modules…</div>
              )}
              {hiaiResponseVisible && (
                <div className="hiai-msg hiai-msg-ai" style={{ animation: 'fadeIn .4s ease' }}>
                  <p>The variance has <strong>three contributing factors</strong>, ranked by impact:</p>
                  <ul>
                    <li><strong>Unbudgeted hires (HiTalent)</strong> - 4 senior engineers were onboarded in March without updated budget allocations, adding <span className="hiai-tag">£48,000/mo</span></li>
                    <li><strong>Contractor overtime (HiOps)</strong> - 3 contractors exceeded their 40-hr caps by an average of 18 hrs/wk, adding <span className="hiai-tag">£12,400/mo</span></li>
                    <li><strong>FX fluctuation (HiPay)</strong> - GBP→USD rate shifted 3.2%, impacting USD-denominated vendor payments by <span className="hiai-tag">£8,200/mo</span></li>
                  </ul>
                  <p><strong>Recommended action:</strong> Cap contractor overtime immediately (saves £12.4K/mo). Retroactively adjust Q2 budget in HiPay to account for the 4 hires. Hedge FX exposure for Q3.</p>
                  <div className="hiai-modules-referenced">
                    <span className="hiai-mod-ref">HiTalent</span>
                    <span className="hiai-mod-ref">HiOps</span>
                    <span className="hiai-mod-ref">HiPay</span>
                    <span className="hiai-mod-ref">HiAI</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mod-features reveal" style={{ maxWidth: '700px', margin: '40px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Natural language querying across all modules</div>
            <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Root cause analysis with data correlation</div>
            <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>What-if scenario modeling &amp; forecasting</div>
            <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Autonomous document &amp; email generation</div>
            <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Executive briefings &amp; board report generation</div>
            <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Agentic workflows with supervised autonomy</div>
          </div>
        </div>
      </section>

      {/* HiTalent */}
      <section className="mod-section" id="talent">
        <div className="mod-inner">
          <div className="mod-grid">
            <div className="mod-text reveal-left">
              <div className="eyebrow">HiTalent: Talent Acquisition</div>
              <h2>Stop screening. <em>Start deciding.</em></h2>
              <p>HiTalent replaces the traditional ATS with an AI-native candidate intelligence system. Resumes are parsed into structured competency profiles. Candidates are ranked against job requirements and historical success traits - not keywords.</p>
              <div className="mod-features">
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>AI-powered resume parsing &amp; skill normalization</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Automated interview scheduling via calendar sync</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Anonymized screening mode for DEI compliance</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Multi-board job posting with source ROI tracking</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Candidate profile converts to employee on hire</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See HiTalent in Action →</a>
            </div>
            <div className="mod-mockup reveal-right">
              <div className="mod-mockup-bar"><div className="mod-mockup-dots"><span></span><span></span><span></span></div><span className="mod-mockup-bar-title">HiTalent: Pipeline: Senior Engineer</span></div>
              <div className="mod-mockup-body">
                <div className="kanban-board">
                  <div className="kanban-col">
                    <div className="kanban-col-head"><span className="kanban-col-title">Applied</span><span className="kanban-col-count">24</span></div>
                    <div className="kanban-cards">
                      <div className="kanban-card"><div className="kanban-card-name">Sarah K.</div><div className="kanban-card-role">Staff Eng @ Stripe</div><div className="kanban-card-bottom"><span className="kanban-card-score high">96%</span><div className="kanban-card-avatar" /></div></div>
                      <div className="kanban-card"><div className="kanban-card-name">James L.</div><div className="kanban-card-role">Sr. Eng @ Shopify</div><div className="kanban-card-bottom"><span className="kanban-card-score high">91%</span><div className="kanban-card-avatar" /></div></div>
                      <div className="kanban-card"><div className="kanban-card-name">Priya M.</div><div className="kanban-card-role">Tech Lead @ Razorpay</div><div className="kanban-card-bottom"><span className="kanban-card-score med">78%</span><div className="kanban-card-avatar" /></div></div>
                    </div>
                  </div>
                  <div className="kanban-col">
                    <div className="kanban-col-head"><span className="kanban-col-title">Screen</span><span className="kanban-col-count">8</span></div>
                    <div className="kanban-cards">
                      <div className="kanban-card"><div className="kanban-card-name">Alex W.</div><div className="kanban-card-role">Principal @ Notion</div><div className="kanban-card-bottom"><span className="kanban-card-score high">94%</span><div className="kanban-card-avatar" /></div></div>
                      <div className="kanban-card"><div className="kanban-card-name">Maria G.</div><div className="kanban-card-role">Sr. Eng @ Mercado</div><div className="kanban-card-bottom"><span className="kanban-card-score med">82%</span><div className="kanban-card-avatar" /></div></div>
                    </div>
                  </div>
                  <div className="kanban-col">
                    <div className="kanban-col-head"><span className="kanban-col-title">Interview</span><span className="kanban-col-count">5</span></div>
                    <div className="kanban-cards">
                      <div className="kanban-card"><div className="kanban-card-name">Daniel R.</div><div className="kanban-card-role">Staff Eng @ Circle</div><div className="kanban-card-bottom"><span className="kanban-card-score high">89%</span><div className="kanban-card-avatar" /></div></div>
                    </div>
                  </div>
                  <div className="kanban-col">
                    <div className="kanban-col-head"><span className="kanban-col-title">Offer</span><span className="kanban-col-count">2</span></div>
                    <div className="kanban-cards">
                      <div className="kanban-card" style={{ borderColor: 'var(--gold)' }}><div className="kanban-card-name">Lin Z.</div><div className="kanban-card-role">Staff @ Plaid</div><div className="kanban-card-bottom"><span className="kanban-card-score high">97%</span><div className="kanban-card-avatar" /></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HiPeople */}
      <section className="mod-section" id="lifecycle">
        <div className="mod-inner">
          <div className="mod-grid reverse">
            <div className="mod-text reveal-right">
              <div className="eyebrow">HiPeople: People Lifecycle</div>
              <h2>Every transition. <em>One workflow.</em></h2>
              <p>Promotions, transfers, leaves, onboarding, exits - every lifecycle event is orchestrated through a unified workflow engine. A promotion auto-updates the org chart, triggers a prorated payroll adjustment in HiPay, and notifies IT for permission changes. Zero manual handoffs.</p>
              <div className="mod-features">
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Automated onboarding with zero-day readiness</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Multi-step approval chains for promotions &amp; transfers</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Interactive org chart with succession planning</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Performance reviews, OKRs &amp; calibration</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Employee directory with semantic search</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See HiPeople in Action →</a>
            </div>
            <div className="mod-mockup reveal-left">
              <div className="mod-mockup-bar"><div className="mod-mockup-dots"><span></span><span></span><span></span></div><span className="mod-mockup-bar-title">HiPeople: Lifecycle: Sarah Kim</span></div>
              <div className="mod-mockup-body">
                <div className="timeline-mock">
                  <div className="timeline-item"><div className="timeline-dot green">✓</div><div className="timeline-content"><div className="timeline-label">Completed</div><div className="timeline-title">Onboarding</div><div className="timeline-desc">Equipment assigned, accounts provisioned, compliance training completed. Day-1 readiness: 100%</div><div className="timeline-date">Jan 15, 2025</div></div></div>
                  <div className="timeline-item"><div className="timeline-dot gold">★</div><div className="timeline-content"><div className="timeline-label">Promotion</div><div className="timeline-title">Senior Engineer → Staff Engineer</div><div className="timeline-desc">Approved by VP Engineering. Salary updated in HiPay. Org chart reflected. IT permissions escalated.</div><div className="timeline-date">Aug 2, 2025</div></div></div>
                  <div className="timeline-item"><div className="timeline-dot blue">→</div><div className="timeline-content"><div className="timeline-label">In Progress</div><div className="timeline-title">Lateral Transfer - Payments Team</div><div className="timeline-desc">Awaiting Finance budget confirmation. Reporting line change queued. Manager notified.</div><div className="timeline-date">Dec 10, 2025</div></div></div>
                  <div className="timeline-item"><div className="timeline-dot" style={{ background: 'var(--cream-2)', border: '1.5px solid var(--border)' }}>○</div><div className="timeline-content"><div className="timeline-label">Scheduled</div><div className="timeline-title">Q1 Performance Review</div><div className="timeline-desc">Auto-drafted by HiAI based on OKR completion, peer feedback, and manager notes.</div><div className="timeline-date">Mar 15, 2026</div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HiPay */}
      <section className="mod-section" id="payroll">
        <div className="mod-inner">
          <div className="mod-grid">
            <div className="mod-text reveal-left">
              <div className="eyebrow">HiPay: Payroll &amp; Rewards</div>
              <h2>Accurate payroll. <em>Every country. Every currency.</em></h2>
              <p>HiPay processes global payroll with built-in tax engines for 100+ countries. It connects to HiTalent (budget validation before hiring), HiPeople (automatic salary updates on promotion), and HiGlobal (EOR cost calculations) - eliminating the reconciliation nightmare.</p>
              <div className="mod-features">
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>100+ country tax engines with real-time updates</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Pre-processing error detection &amp; variance alerts</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Compensation bands, equity &amp; benefits management</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Pay equity auditing with internal parity checks</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Real-time budget utilization vs. forecast</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See HiPay in Action →</a>
            </div>
            <div className="mod-mockup reveal-right">
              <div className="mod-mockup-bar"><div className="mod-mockup-dots"><span></span><span></span><span></span></div><span className="mod-mockup-bar-title">HiPay: December 2025 Payroll Run</span></div>
              <div className="mod-mockup-body">
                <div className="payroll-mock">
                  <div className="payroll-summary">
                    <div className="payroll-stat"><div className="payroll-stat-val">$1.24M</div><div className="payroll-stat-label">Gross Payroll</div><span className="payroll-stat-change up">↑ 3.2% vs Nov</span></div>
                    <div className="payroll-stat"><div className="payroll-stat-val">$847K</div><div className="payroll-stat-label">Net Disbursed</div><span className="payroll-stat-change up">↑ 2.8% vs Nov</span></div>
                    <div className="payroll-stat"><div className="payroll-stat-val">98.2%</div><div className="payroll-stat-label">On-Time Rate</div><span className="payroll-stat-change up">↑ 0.4%</span></div>
                  </div>
                  <table className="payroll-table">
                    <thead><tr><th>Employee</th><th>Entity</th><th>Gross</th><th>Net</th><th>Status</th></tr></thead>
                    <tbody>
                      <tr><td><span className="payroll-avatar">SK</span>Sarah Kim</td><td>US - California</td><td>$18,400</td><td>$12,680</td><td><span className="status paid">Paid</span></td></tr>
                      <tr><td><span className="payroll-avatar">JL</span>James Lee</td><td>UK - London</td><td>£9,200</td><td>£6,840</td><td><span className="status paid">Paid</span></td></tr>
                      <tr><td><span className="payroll-avatar">PM</span>Priya Mehta</td><td>IN - Bangalore</td><td>₹285,000</td><td>₹242,250</td><td><span className="status processing">Processing</span></td></tr>
                      <tr><td><span className="payroll-avatar">AW</span>Alex Weber</td><td>DE - Berlin</td><td>€7,800</td><td>€5,340</td><td><span className="status pending">Pending</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HiGlobal */}
      <section className="mod-section dark-section" id="global">
        <div className="noise" />
        <div className="mod-inner">
          <div className="mod-grid">
            <div className="mod-text dark-text reveal-left">
              <div className="eyebrow">HiGlobal: Global Workforce</div>
              <h2>Hire anywhere. <em>Comply everywhere.</em></h2>
              <p>HiGlobal manages EOR partnerships, independent contractor compliance, and cross-border employment vehicles. It calculates total landed costs by country, tracks visa expiration dates, and flags misclassification risks - all in one view.</p>
              <div className="mod-features">
                <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>EOR cost calculator across 80+ countries</div>
                <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Contractor misclassification risk scanning</div>
                <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Visa &amp; work permit expiry tracking</div>
                <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Localized contract generation per jurisdiction</div>
                <div className="mod-feat dark-feat"><div className="mod-feat-check">{checkSvg}</div>Real-time global workforce distribution map</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold">See HiGlobal in Action →</a>
            </div>
            <div className="mod-mockup reveal-right">
              <div className="mod-mockup-bar"><div className="mod-mockup-dots"><span></span><span></span><span></span></div><span className="mod-mockup-bar-title">HiGlobal: Workforce Distribution</span></div>
              <div className="mod-mockup-body">
                <div className="global-mock">
                  <div className="global-mock-header"><span className="global-mock-title">6 Entities · 142 Employees · 18 Contractors</span><span className="global-mock-badge"><span className="dot-live" /> All Compliant</span></div>
                  <div className="global-map-grid">
                    <div className="global-country"><div className="global-country-head"><span className="global-country-name">United States</span><span className="global-country-flag">🇺🇸</span></div><div className="global-country-stat"><strong>68</strong> employees · 4 contractors<br />Entity: HiFive Inc. (Delaware)</div></div>
                    <div className="global-country"><div className="global-country-head"><span className="global-country-name">United Kingdom</span><span className="global-country-flag">🇬🇧</span></div><div className="global-country-stat"><strong>24</strong> employees · 3 EOR workers<br />Entity: HiFive Ltd. (London)</div></div>
                    <div className="global-country"><div className="global-country-head"><span className="global-country-name">India</span><span className="global-country-flag">🇮🇳</span></div><div className="global-country-stat"><strong>32</strong> employees · 2 contractors<br />Entity: HiFive Tech Pvt. Ltd.</div></div>
                    <div className="global-country"><div className="global-country-head"><span className="global-country-name">UAE</span><span className="global-country-flag">🇦🇪</span></div><div className="global-country-stat"><strong>12</strong> employees · 5 EOR workers<br />Entity: HiFive FZ-LLC (DIFC)</div></div>
                    <div className="global-country"><div className="global-country-head"><span className="global-country-name">Germany</span><span className="global-country-flag">🇩🇪</span></div><div className="global-country-stat"><strong>6</strong> EOR workers · 2 contractors<br />⚠️ 1 visa expiring in 23 days</div></div>
                    <div className="global-country"><div className="global-country-head"><span className="global-country-name">Singapore</span><span className="global-country-flag">🇸🇬</span></div><div className="global-country-stat"><strong>4</strong> EOR workers<br />Entity: Via Deel EOR</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HiOps */}
      <section className="mod-section" id="operations">
        <div className="mod-inner">
          <div className="mod-grid reverse">
            <div className="mod-text reveal-right">
              <div className="eyebrow">HiOps: Operations</div>
              <h2>Workspace, assets, IT. <em>One operational layer.</em></h2>
              <p>HiOps tracks every physical and digital asset, monitors workspace utilization with real-time heatmaps, manages IT provisioning and de-provisioning, and ensures that off-boarding triggers instant access revocation - closing the security gaps that legacy systems leave open.</p>
              <div className="mod-features">
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Workspace utilization heatmaps &amp; lease optimization</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Full asset lifecycle: procurement → assignment → retirement</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Automated IT provisioning tied to HiPeople events</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Instant de-provisioning on employee exit</div>
                <div className="mod-feat"><div className="mod-feat-check">{checkSvg}</div>Predictive asset ordering based on hiring pipeline</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See HiOps in Action →</a>
            </div>
            <div className="mod-mockup reveal-left">
              <div className="mod-mockup-bar"><div className="mod-mockup-dots"><span></span><span></span><span></span></div><span className="mod-mockup-bar-title">HiOps: Operations Dashboard</span></div>
              <div className="mod-mockup-body">
                <div className="ops-mock">
                  <div className="ops-grid">
                    <div className="ops-card">
                      <div className="ops-card-title">Workspace Utilization</div>
                      <div className="ops-card-val">72%</div>
                      <div className="ops-card-sub">↑ 8% vs last month</div>
                      <div className="ops-bar-chart" style={{ marginTop: '12px' }}>
                        <div className="ops-bar filled" style={{ height: '60%' }}><span className="ops-bar-label">Mon</span></div>
                        <div className="ops-bar filled" style={{ height: '78%' }}><span className="ops-bar-label">Tue</span></div>
                        <div className="ops-bar filled" style={{ height: '85%' }}><span className="ops-bar-label">Wed</span></div>
                        <div className="ops-bar filled" style={{ height: '70%' }}><span className="ops-bar-label">Thu</span></div>
                        <div className="ops-bar filled" style={{ height: '45%' }}><span className="ops-bar-label">Fri</span></div>
                      </div>
                    </div>
                    <div className="ops-card">
                      <div className="ops-card-title">Asset Summary</div>
                      <div className="ops-card-val">312</div>
                      <div className="ops-card-sub">Total tracked assets</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(34,197,94,.08)', color: '#16a34a', fontWeight: 600 }}>248 assigned</span>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(176,125,46,.08)', color: 'var(--gold)', fontWeight: 600 }}>52 in stock</span>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(239,68,68,.08)', color: 'var(--red)', fontWeight: 600 }}>12 retired</span>
                      </div>
                    </div>
                  </div>
                  <div className="ops-card" style={{ marginTop: '10px' }}>
                    <div className="ops-card-title">Recent Asset Activity</div>
                    <div className="ops-asset-list">
                      <div className="ops-asset"><div className="ops-asset-icon">💻</div><span className="ops-asset-name">MacBook Pro 16&quot; - SN: HK4X2</span><span className="ops-asset-status assigned">Assigned</span></div>
                      <div className="ops-asset"><div className="ops-asset-icon">🖥️</div><span className="ops-asset-name">Dell U2723QE - SN: DL891</span><span className="ops-asset-status stock">In Stock</span></div>
                      <div className="ops-asset"><div className="ops-asset-icon">📱</div><span className="ops-asset-name">iPhone 15 Pro - SN: MP7X3</span><span className="ops-asset-status retired">Retired</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-MODULE CONNECTIONS */}
      <section className="cross-section" id="connections">
        <div className="cross-inner">
          <div className="cross-header reveal">
            <div className="eyebrow">Cross-Module Intelligence</div>
            <h2>Modules don&apos;t just coexist. <em>They collaborate.</em></h2>
            <p>A question never belongs to a single module. HiAI reasons across all five simultaneously - because real business problems don&apos;t respect software boundaries.</p>
          </div>
          <div className="cross-flow reveal-scale">
            <div className="cross-flow-item"><div className="cross-flow-icon">🎯</div><div className="cross-flow-name">HiTalent</div><div className="cross-flow-desc">Requisition opens → budget validated → JD drafted</div><div className="cross-flow-arrow">→</div></div>
            <div className="cross-flow-item"><div className="cross-flow-icon">👥</div><div className="cross-flow-name">HiPeople</div><div className="cross-flow-desc">Candidate hired → profile converts → onboarding triggers</div><div className="cross-flow-arrow">→</div></div>
            <div className="cross-flow-item"><div className="cross-flow-icon">💸</div><div className="cross-flow-name">HiPay</div><div className="cross-flow-desc">Salary set → payroll cycle updated → equity granted</div><div className="cross-flow-arrow">→</div></div>
            <div className="cross-flow-item"><div className="cross-flow-icon">🌍</div><div className="cross-flow-name">HiGlobal</div><div className="cross-flow-desc">Entity selected → compliance checked → contract generated</div></div>
          </div>
          <div className="cross-examples stagger">
            <div className="cross-example">
              <div className="cross-example-q"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Model the financial impact of shifting 30% of customer support hiring to the Philippines.</div>
              <div className="cross-example-modules"><span className="cross-example-mod">HiPay</span><span className="cross-example-mod">HiGlobal</span><span className="cross-example-mod">HiTalent</span><span className="cross-example-mod">HiAI</span></div>
            </div>
            <div className="cross-example">
              <div className="cross-example-q"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Which engineers haven&apos;t had a 1-on-1 in 4 weeks and have declining engagement scores?</div>
              <div className="cross-example-modules"><span className="cross-example-mod">HiPeople</span><span className="cross-example-mod">HiAI</span></div>
            </div>
            <div className="cross-example">
              <div className="cross-example-q"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Predict when we&apos;ll run out of MacBook Pros based on the current hiring pipeline.</div>
              <div className="cross-example-modules"><span className="cross-example-mod">HiOps</span><span className="cross-example-mod">HiTalent</span><span className="cross-example-mod">HiAI</span></div>
            </div>
            <div className="cross-example">
              <div className="cross-example-q"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>Generate a pay equity audit for the product org, controlling for tenure and performance.</div>
              <div className="cross-example-modules"><span className="cross-example-mod">HiPay</span><span className="cross-example-mod">HiPeople</span><span className="cross-example-mod">HiAI</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY STRIP */}
      <section className="sec-section">
        <div className="sec-inner reveal">
          <div className="sec-badges">
            <div className="sec-badge"><div className="sec-badge-icon"><svg viewBox="0 0 20 20" fill="none"><path d="M10 1L3 5v5c0 5.25 3 10.15 7 11.5C14 20.15 17 15.25 17 10V5l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>SOC 2 Type II</div>
            <div className="sec-badge"><div className="sec-badge-icon"><svg viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div>ISO 27001</div>
            <div className="sec-badge"><div className="sec-badge-icon"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>GDPR / CCPA</div>
            <div className="sec-badge"><div className="sec-badge-icon"><svg viewBox="0 0 20 20" fill="none"><path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M4 9h12M9 4v12" stroke="currentColor" strokeWidth="1.5" /></svg></div>Row-Level Security</div>
            <div className="sec-badge"><div className="sec-badge-icon"><svg viewBox="0 0 20 20" fill="none"><path d="M10 2L3 6v5c0 5 3 9.5 7 11 4-1.5 7-6 7-11V6l-7-4z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 7v3m0 3h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div>Zero-Trust Architecture</div>
          </div>
          <div className="sec-cta-text">Bank-grade security for your most sensitive data.<br /><a href="#">Read our security whitepaper →</a></div>
        </div>
      </section>

      {/* IMPLEMENTATION TIMELINE */}
      <ImplementationTimeline />

      {/* HIAI CONSOLE DEMO - interactive simulated AI console */}
      <HiAIConsoleDemo onNavigate={onNavigate} />

      {/* CTA */}
      <section className="cta-section">
        <div className="noise" />
        <div className="cta-glow" />
        <div className="cta-inner reveal">
          <h2>Stop managing tools.<br /><em>Start making decisions.</em></h2>
          <p>Replace 5-8 disconnected point solutions with one continuously learning People Operating System. Book a free HR audit and see the platform in action.</p>
          <div className="cta-buttons">
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Book Free HR Audit →</a>
            <button onClick={() => onNavigate('solutions')} className="btn btn-outline-light btn-lg">See Solutions →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
