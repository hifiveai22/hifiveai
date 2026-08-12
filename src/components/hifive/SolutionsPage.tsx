'use client';

import { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';


const checkSvg = (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type PersonaId = 'ceo' | 'chro' | 'cfo' | 'coo' | 'legal' | 'it';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface SolutionsPageProps {
  onNavigate: (page: PageId, sectionId?: string) => void;
}

export default function SolutionsPage({ onNavigate }: SolutionsPageProps) {
  useReveal();
  const [activePersona, setActivePersona] = useState<PersonaId>('ceo');
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Sync active persona tab with URL hash
  useEffect(() => {
    const syncHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1) as PersonaId;
        const validPersonas: PersonaId[] = ['ceo', 'chro', 'cfo', 'coo', 'legal', 'it'];
        if (validPersonas.includes(hash)) {
          setActivePersona(hash);
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // Funnel animation for CHRO section
  useEffect(() => {
    const funnel = document.querySelector('.chro-funnel');
    if (!funnel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.chro-funnel-fill').forEach((f) => f.classList.add('animated'));
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(funnel);
    return () => obs.disconnect();
  }, []);

  const personas: { id: PersonaId; icon: string; label: string; count: string }[] = [
    { id: 'ceo', icon: '👔', label: 'CEO / Founder', count: '6 KPIs' },
    { id: 'chro', icon: '👥', label: 'CHRO / HR', count: '5 KPIs' },
    { id: 'cfo', icon: '💰', label: 'CFO / Finance', count: '5 KPIs' },
    { id: 'coo', icon: '⚙️', label: 'COO / Ops', count: '4 KPIs' },
    { id: 'legal', icon: '⚖️', label: 'Legal / Compliance', count: '4 KPIs' },
    { id: 'it', icon: '🔐', label: 'IT / Security', count: '4 KPIs' },
  ];

  const scrollToPersona = (id: PersonaId) => {
    setActivePersona(id);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* HERO */}
      <section className="sol-hero" id="hero">
        <div className="sol-hero-glow" />
        <div className="noise" />
        <div className="sol-hero-content">
          <div className="eyebrow" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease' }}>Solutions by Role</div>
          <h1 style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? 'none' : 'translateY(20px)', transition: 'opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)' }}>The platform adapts<br /><em>to your role.</em></h1>
          <p className="sol-hero-sub" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease .3s' }}>Every department has different KPIs, different pain points, and different definitions of success. HiFive AI maps the same five modules to each buyer&apos;s specific outcomes.</p>
          <div className="sol-hero-ctas" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease .5s' }}>
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Book Free HR Audit →</a>
            <a href="#ceo" className="btn btn-outline-light btn-lg">Explore by Role ↓</a>
          </div>
        </div>
      </section>

      {/* PERSONA NAV */}
      <nav className="persona-nav" id="persona-nav">
        <div className="persona-nav-inner">
          {personas.map((p) => (
            <button key={p.id} className={`persona-tab ${activePersona === p.id ? 'active' : ''}`} onClick={() => scrollToPersona(p.id)}>
              <span className="persona-tab-icon">{p.icon}</span>{p.label}<span className="persona-tab-count">{p.count}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* CEO / FOUNDER */}
      <section className="sol-section" id="ceo">
        <div className="sol-inner">
          <div className="sol-header reveal">
            <div className="eyebrow">CEO / Founder</div>
            <h2>Drive growth. <em>Don&apos;t collect data.</em></h2>
            <p>CEOs don&apos;t need more dashboards. They need a command center that answers strategic questions instantly - without waiting for three departments to compile a report.</p>
          </div>
          <div className="pain-grid stagger">
            <div className="pain-card"><div className="pain-icon">📊</div><div className="pain-title">Information Latency</div><div className="pain-desc">Waiting days for HR, Finance, and Ops to compile headcount reports before you can make a single decision.</div></div>
            <div className="pain-card"><div className="pain-icon">🔗</div><div className="pain-title">Fragmented Systems</div><div className="pain-desc">Recruiting in one tool, payroll in another, expenses in a third. No single source of truth exists.</div></div>
            <div className="pain-card"><div className="pain-icon">📉</div><div className="pain-title">Revenue per Employee Blind Spot</div><div className="pain-desc">Headcount grows 20% but you can&apos;t see if revenue per employee is rising or falling in real time.</div></div>
            <div className="pain-card"><div className="pain-icon">🏗️</div><div className="pain-title">Succession Gaps</div><div className="pain-desc">No visibility into bench strength. If a VP leaves tomorrow, you don&apos;t know who can step in.</div></div>
          </div>
          <div className="sol-grid">
            <div className="sol-text reveal-left">
              <h3>One screen. <em>Full organizational clarity.</em></h3>
              <p>The Executive Dashboard contextualizes raw data against historical trends, industry benchmarks, and company goals. Every metric answers a fundamental question: Are we growing efficiently?</p>
              <div className="sol-modules"><span className="sol-mod-tag">HiTalent</span><span className="sol-mod-tag">HiPeople</span><span className="sol-mod-tag">HiPay</span><span className="sol-mod-tag">HiGlobal</span><span className="sol-mod-tag">HiOps</span></div>
              <div className="sol-outcomes">
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">0</span> information latency - answers are instant</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">1 dashboard</span> replaces 5-8 point solutions</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Real-time</span> revenue per employee tracking</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">AI-generated</span> board reports in minutes, not days</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See Your Executive Dashboard →</a>
            </div>
            <div className="sol-mockup reveal-right">
              <div className="sol-mockup-bar"><div className="sol-mockup-dots"><span></span><span></span><span></span></div><span className="sol-mockup-bar-title">Executive Command Center</span><span className="sol-mockup-bar-persona">CEO View</span></div>
              <div className="ceo-dash">
                <div className="ceo-top-row">
                  <div className="ceo-kpi"><div className="ceo-kpi-val">142</div><div className="ceo-kpi-label">Headcount</div><span className="ceo-kpi-change up">↑ 4 vs last month</span></div>
                  <div className="ceo-kpi"><div className="ceo-kpi-val">$312K</div><div className="ceo-kpi-label">Revenue / Employee</div><span className="ceo-kpi-change up">↑ 8.2% YoY</span></div>
                  <div className="ceo-kpi"><div className="ceo-kpi-val">18 days</div><div className="ceo-kpi-label">Avg Time-to-Hire</div><span className="ceo-kpi-change up">↓ 6 days</span></div>
                  <div className="ceo-kpi"><div className="ceo-kpi-val">6.2%</div><div className="ceo-kpi-label">Voluntary Attrition</div><span className="ceo-kpi-change down">↑ 1.1%</span></div>
                </div>
                <div className="ceo-lower">
                  <div className="ceo-panel"><div className="ceo-panel-title">Department Health</div>
                    <div className="ceo-health-row"><span className="ceo-health-dept">Engineering</span><div className="ceo-health-score"><div className="ceo-health-bar"><div className="ceo-health-fill green" style={{ width: '88%' }}></div></div><span className="ceo-health-val" style={{ color: '#16a34a' }}>88</span></div></div>
                    <div className="ceo-health-row"><span className="ceo-health-dept">Sales</span><div className="ceo-health-score"><div className="ceo-health-bar"><div className="ceo-health-fill green" style={{ width: '76%' }}></div></div><span className="ceo-health-val" style={{ color: '#16a34a' }}>76</span></div></div>
                    <div className="ceo-health-row"><span className="ceo-health-dept">Customer Success</span><div className="ceo-health-score"><div className="ceo-health-bar"><div className="ceo-health-fill gold" style={{ width: '52%' }}></div></div><span className="ceo-health-val" style={{ color: 'var(--gold)' }}>52</span></div></div>
                    <div className="ceo-health-row"><span className="ceo-health-dept">Finance</span><div className="ceo-health-score"><div className="ceo-health-bar"><div className="ceo-health-fill green" style={{ width: '91%' }}></div></div><span className="ceo-health-val" style={{ color: '#16a34a' }}>91</span></div></div>
                    <div className="ceo-health-row"><span className="ceo-health-dept">Product</span><div className="ceo-health-score"><div className="ceo-health-bar"><div className="ceo-health-fill red" style={{ width: '38%' }}></div></div><span className="ceo-health-val" style={{ color: 'var(--red)' }}>38</span></div></div>
                  </div>
                  <div className="ceo-panel"><div className="ceo-panel-title">AI Alerts</div>
                    <div className="ceo-alert-list">
                      <div className="ceo-alert"><div className="ceo-alert-dot red"></div><span>Product dept health dropped to 38 - driven by 15% attrition spike and missed Q3 OKRs.</span></div>
                      <div className="ceo-alert"><div className="ceo-alert-dot gold"></div><span>3 contractor overtime exceptions in Ops exceeding $12K/mo unbudgeted.</span></div>
                      <div className="ceo-alert"><div className="ceo-alert-dot green"></div><span>Engineering hiring velocity improved 32% after Ask AI scheduling automation.</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHRO / HR */}
      <section className="sol-section" id="chro">
        <div className="sol-inner">
          <div className="sol-header reveal">
            <div className="eyebrow">CHRO / HR Leadership</div>
            <h2>Build world-class teams. <em>Stop doing admin.</em></h2>
            <p>HR leaders spend 60% of their time on administrative tasks that should be automated. HiFive AI eliminates the noise so you can focus on talent strategy, retention, and organizational design.</p>
          </div>
          <div className="pain-grid stagger">
            <div className="pain-card"><div className="pain-icon">⏳</div><div className="pain-title">Slow Hiring Funnel</div><div className="pain-desc">Candidates spend 14 days in &quot;Technical Interview&quot; because hiring managers take 5 days to submit feedback.</div></div>
            <div className="pain-card"><div className="pain-icon">🚪</div><div className="pain-title">Reactive Attrition</div><div className="pain-desc">You find out top performers are leaving when they hand in their notice - not when the warning signs appeared.</div></div>
            <div className="pain-card"><div className="pain-icon">⚖️</div><div className="pain-title">Pay Equity Gaps</div><div className="pain-desc">Compensation parity analysis requires pulling data from 3 systems and 2 weeks of spreadsheet work.</div></div>
            <div className="pain-card"><div className="pain-icon">📋</div><div className="pain-title">Manual Onboarding</div><div className="pain-desc">New hires spend their first week navigating IT tickets and HR checklists instead of learning the business.</div></div>
          </div>
          <div className="sol-grid reverse">
            <div className="sol-text reveal-right">
              <h3>From reactive HR <em>to predictive talent strategy.</em></h3>
              <p>HiTalent automates screening and scheduling. HiPeople orchestrates every lifecycle event. HiAI predicts attrition before it happens and drafts performance reviews in seconds. HiPay ensures compensation parity in real time.</p>
              <div className="sol-modules"><span className="sol-mod-tag">HiTalent</span><span className="sol-mod-tag">HiPeople</span><span className="sol-mod-tag">HiPay</span></div>
              <div className="sol-outcomes">
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">40% faster</span> time-to-hire with AI scheduling</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Predictive</span> flight-risk scoring for every employee</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Instant</span> pay equity audits by department</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">100%</span> day-1 readiness for new hires</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See Your Talent Dashboard →</a>
            </div>
            <div className="sol-mockup reveal-left">
              <div className="sol-mockup-bar"><div className="sol-mockup-dots"><span></span><span></span><span></span></div><span className="sol-mockup-bar-title">Talent &amp; Retention Command</span><span className="sol-mockup-bar-persona">CHRO View</span></div>
              <div className="chro-mock">
                <div className="chro-top">
                  <div className="chro-stat"><div className="chro-stat-val">18d</div><div className="chro-stat-label">Time-to-Hire</div></div>
                  <div className="chro-stat"><div className="chro-stat-val">87%</div><div className="chro-stat-label">Offer Accept Rate</div></div>
                  <div className="chro-stat"><div className="chro-stat-val">6.2%</div><div className="chro-stat-label">Vol. Attrition</div></div>
                </div>
                <div className="chro-funnel">
                  <div className="chro-funnel-title">Hiring Funnel - This Month</div>
                  <div className="chro-funnel-row"><span className="chro-funnel-label">Applied</span><div className="chro-funnel-track"><div className="chro-funnel-fill animated" style={{ '--w': 1 } as React.CSSProperties} /></div><span className="chro-funnel-num">482</span></div>
                  <div className="chro-funnel-row"><span className="chro-funnel-label">Screened</span><div className="chro-funnel-track"><div className="chro-funnel-fill animated" style={{ '--w': 0.42 } as React.CSSProperties} /></div><span className="chro-funnel-num">203</span></div>
                  <div className="chro-funnel-row"><span className="chro-funnel-label">Interview</span><div className="chro-funnel-track"><div className="chro-funnel-fill animated" style={{ '--w': 0.18 } as React.CSSProperties} /></div><span className="chro-funnel-num">87</span></div>
                  <div className="chro-funnel-row"><span className="chro-funnel-label">Offered</span><div className="chro-funnel-track"><div className="chro-funnel-fill animated" style={{ '--w': 0.07 } as React.CSSProperties} /></div><span className="chro-funnel-num">34</span></div>
                  <div className="chro-funnel-row"><span className="chro-funnel-label">Accepted</span><div className="chro-funnel-track"><div className="chro-funnel-fill animated" style={{ '--w': 0.06 } as React.CSSProperties} /></div><span className="chro-funnel-num">30</span></div>
                </div>
                <div className="chro-risk">
                  <div className="chro-risk-title">Flight Risk - Top Alerts</div>
                  <div className="chro-risk-row"><div className="chro-risk-avatar">DR</div><div className="chro-risk-info"><div className="chro-risk-name">Daniel R.</div><div className="chro-risk-role">Staff Engineer · 2.1 yrs</div></div><span className="chro-risk-score high">92%</span></div>
                  <div className="chro-risk-row"><div className="chro-risk-avatar">MG</div><div className="chro-risk-info"><div className="chro-risk-name">Maria G.</div><div className="chro-risk-role">Sr. Designer · 1.8 yrs</div></div><span className="chro-risk-score high">84%</span></div>
                  <div className="chro-risk-row"><div className="chro-risk-avatar">LZ</div><div className="chro-risk-info"><div className="chro-risk-name">Lin Z.</div><div className="chro-risk-role">Tech Lead · 3.2 yrs</div></div><span className="chro-risk-score med">67%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CFO / FINANCE */}
      <section className="sol-section" id="cfo">
        <div className="sol-inner">
          <div className="sol-header reveal">
            <div className="eyebrow">CFO / Finance</div>
            <h2>Predictable payroll. <em>Accurate forecasting.</em></h2>
            <p>Payroll is the largest single expense. When it lives in a separate system from hiring, contractor management, and FX rates, surprises are inevitable. HiFive AI gives Finance real-time visibility into every dollar.</p>
          </div>
          <div className="pain-grid stagger">
            <div className="pain-card"><div className="pain-icon">💲</div><div className="pain-title">Payroll Variance Surprises</div><div className="pain-desc">End-of-quarter reveals unbudgeted hires, excessive contractor overtime, and FX drift - too late to course-correct.</div></div>
            <div className="pain-card"><div className="pain-icon">📊</div><div className="pain-title">Manual Reconciliation</div><div className="pain-desc">Finance spends days manually transferring data between the HRIS and accounting system every payroll cycle.</div></div>
            <div className="pain-card"><div className="pain-icon">🌐</div><div className="pain-title">Hidden Contractor Costs</div><div className="pain-desc">EOR fees, contractor overtime, and cross-border tax obligations are invisible until they hit the P&amp;L.</div></div>
            <div className="pain-card"><div className="pain-icon">🔮</div><div className="pain-title">No Scenario Modeling</div><div className="pain-desc">You can&apos;t model &quot;what if we shift 30% of support hiring to the Philippines&quot; without a week of analyst work.</div></div>
          </div>
          <div className="sol-grid">
            <div className="sol-text reveal-left">
              <h3>From backward-looking <em>to forward-looking finance.</em></h3>
              <p>HiPay connects to HiTalent (budget validation before hiring), HiOps (contractor overtime tracking), and HiGlobal (EOR cost calculations). HiAI enables real-time scenario modeling: ask a question, get a financial projection.</p>
              <div className="sol-modules"><span className="sol-mod-tag">HiPay</span><span className="sol-mod-tag">HiGlobal</span><span className="sol-mod-tag">HiTalent</span><span className="sol-mod-tag">HiOps</span></div>
              <div className="sol-outcomes">
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Real-time</span> budget vs. actual - no more surprises</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Zero</span> manual data reconciliation between systems</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Instant</span> &quot;what-if&quot; scenario modeling via HiAI</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Full visibility</span> into total landed cost per employee</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See Your Financial Dashboard →</a>
            </div>
            <div className="sol-mockup reveal-right">
              <div className="sol-mockup-bar"><div className="sol-mockup-dots"><span></span><span></span><span></span></div><span className="sol-mockup-bar-title">Financial Command</span><span className="sol-mockup-bar-persona">CFO View</span></div>
              <div className="cfo-mock">
                <div className="cfo-summary">
                  <div className="cfo-stat"><div className="cfo-stat-val">$14.8M</div><div className="cfo-stat-label">YTD Payroll</div></div>
                  <div className="cfo-stat"><div className="cfo-stat-val">$1.24M</div><div className="cfo-stat-label">This Month</div></div>
                  <div className="cfo-stat"><div className="cfo-stat-val">+3.2%</div><div className="cfo-stat-label">vs. Budget</div></div>
                </div>
                <div className="cfo-chart">
                  <div className="cfo-chart-title">Payroll: Budget vs. Actual (Monthly)</div>
                  <div className="cfo-bars">
                    {[['Jul',50,48],['Aug',55,54],['Sep',58,60],['Oct',62,65],['Nov',68,72],['Dec',72,78]].map(([label,b,a],i)=>(
                      <div key={i} className="cfo-bar-group"><div className="cfo-bar-pair"><div className="cfo-bar budget" style={{height:`${b}px`}}></div><div className="cfo-bar actual" style={{height:`${a}px`}}></div></div><span className="cfo-bar-label">{label as string}</span></div>
                    ))}
                  </div>
                  <div className="cfo-legend"><span><span className="cfo-legend-dot" style={{ background: 'var(--cream-2)' }}></span> Budget</span><span><span className="cfo-legend-dot" style={{ background: 'var(--gold)' }}></span> Actual</span></div>
                </div>
                <div className="cfo-variance">
                  <div className="cfo-variance-title">Variance by Department</div>
                  <div className="cfo-var-row"><span className="cfo-var-dept">Engineering</span><span className="cfo-var-amount over">+$48K (unbudgeted hires)</span></div>
                  <div className="cfo-var-row"><span className="cfo-var-dept">Operations</span><span className="cfo-var-amount over">+$12.4K (contractor OT)</span></div>
                  <div className="cfo-var-row"><span className="cfo-var-dept">Sales</span><span className="cfo-var-amount on">+$0 (on budget)</span></div>
                  <div className="cfo-var-row"><span className="cfo-var-dept">Customer Success</span><span className="cfo-var-amount under">-$8.2K (vacancy savings)</span></div>
                  <div className="cfo-var-row"><span className="cfo-var-dept">FX Impact</span><span className="cfo-var-amount over">+$8.2K (GBP drift)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COO / OPS */}
      <section className="sol-section dark-sol" id="coo">
        <div className="noise" />
        <div className="sol-inner">
          <div className="sol-header dark-h reveal">
            <div className="eyebrow">COO / Operations</div>
            <h2>Maximize efficiency. <em>Eliminate waste.</em></h2>
            <p>Siloed departments working at cross-purposes. Unused real estate. Ghost assets. HiOps gives the COO a single operational layer that connects workspace, assets, IT, and goal execution.</p>
          </div>
          <div className="pain-grid stagger">
            <div className="pain-card dark-pain"><div className="pain-icon">🏢</div><div className="pain-title">Empty Office Space</div><div className="pain-desc">Paying for 200 desks but average utilization is 62%. No data to justify lease decisions.</div></div>
            <div className="pain-card dark-pain"><div className="pain-icon">💻</div><div className="pain-title">Ghost Assets</div><div className="pain-desc">Laptops assigned to departed employees. Software licenses paid for unused accounts. No tracking exists.</div></div>
            <div className="pain-card dark-pain"><div className="pain-icon">🎯</div><div className="pain-title">OKR Blind Spots</div><div className="pain-desc">Can&apos;t see which departments are hitting goals and which are stalling until quarterly reviews.</div></div>
            <div className="pain-card dark-pain"><div className="pain-icon">📦</div><div className="pain-title">Reactive Procurement</div><div className="pain-desc">Ordering equipment after the employee starts instead of predicting needs from the hiring pipeline.</div></div>
          </div>
          <div className="sol-grid">
            <div className="sol-text dark-t reveal-left">
              <h3>From guesswork <em>to data-driven operations.</em></h3>
              <p>HiOps provides workspace heatmaps, full asset lifecycle tracking, and OKR completion tracking. Connected to HiTalent, it predicts equipment needs. Connected to HiPeople, it triggers instant de-provisioning on exit.</p>
              <div className="sol-modules"><span className="sol-mod-tag dark-tag">HiOps</span><span className="sol-mod-tag dark-tag">HiTalent</span><span className="sol-mod-tag dark-tag">HiPeople</span></div>
              <div className="sol-outcomes">
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Real-time</span> workspace utilization heatmaps</div>
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Zero</span> ghost assets - every item tracked end-to-end</div>
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Predictive</span> equipment ordering from hiring pipeline</div>
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Instant</span> de-provisioning on employee exit</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold">See Your Ops Dashboard →</a>
            </div>
            <div className="sol-mockup reveal-right">
              <div className="sol-mockup-bar"><div className="sol-mockup-dots"><span></span><span></span><span></span></div><span className="sol-mockup-bar-title">Operations Command</span><span className="sol-mockup-bar-persona">COO View</span></div>
              <div className="coo-mock" style={{ color: '#111827', background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <div className="coo-grid">
                  <div className="coo-card" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px' }}>
                    <div className="coo-card-title" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', letterSpacing: '.05em', marginBottom: '6px' }}>Workspace Utilization</div>
                    <div className="coo-card-val" style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>72%</div>
                    <div className="coo-card-sub" style={{ fontSize: '12px', fontWeight: 600, color: '#047857', marginTop: '4px' }}>↑ 8% vs last month</div>
                    <div className="coo-heatmap">
                      <div className="coo-heat-cell h3"></div><div className="coo-heat-cell h4"></div><div className="coo-heat-cell h4"></div><div className="coo-heat-cell h3"></div><div className="coo-heat-cell h1"></div>
                      <div className="coo-heat-cell h2"></div><div className="coo-heat-cell h4"></div><div className="coo-heat-cell h3"></div><div className="coo-heat-cell h4"></div><div className="coo-heat-cell h0"></div>
                      <div className="coo-heat-cell h1"></div><div className="coo-heat-cell h3"></div><div className="coo-heat-cell h4"></div><div className="coo-heat-cell h2"></div><div className="coo-heat-cell h0"></div>
                      <div className="coo-heat-cell h0"></div><div className="coo-heat-cell h1"></div><div className="coo-heat-cell h2"></div><div className="coo-heat-cell h1"></div><div className="coo-heat-cell h0"></div>
                    </div>
                    <div className="coo-heat-labels" style={{ color: '#6B7280', fontWeight: 600 }}><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div>
                  </div>
                  <div className="coo-card" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '16px' }}>
                    <div className="coo-card-title" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', letterSpacing: '.05em', marginBottom: '6px' }}>OKR Completion</div>
                    <div className="coo-okr-list">
                      <div className="coo-okr" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}><div className="coo-okr-dept" style={{ color: '#111827', fontWeight: 700 }}>Engineering</div><div className="coo-okr-text" style={{ color: '#4B5563', fontWeight: 600 }}>Ship v3.0 by Q4</div><div className="coo-okr-bar" style={{ background: '#E5E7EB' }}><div className="coo-okr-fill" style={{ width: '78%' }}></div></div><div className="coo-okr-pct" style={{ color: '#111827', fontWeight: 700 }}>78%</div></div>
                      <div className="coo-okr" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}><div className="coo-okr-dept" style={{ color: '#111827', fontWeight: 700 }}>Sales</div><div className="coo-okr-text" style={{ color: '#4B5563', fontWeight: 600 }}>Hit $4M ARR</div><div className="coo-okr-bar" style={{ background: '#E5E7EB' }}><div className="coo-okr-fill" style={{ width: '62%' }}></div></div><div className="coo-okr-pct" style={{ color: '#111827', fontWeight: 700 }}>62%</div></div>
                      <div className="coo-okr" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}><div className="coo-okr-dept" style={{ color: '#111827', fontWeight: 700 }}>CS</div><div className="coo-okr-text" style={{ color: '#4B5563', fontWeight: 600 }}>NPS &gt; 50</div><div className="coo-okr-bar" style={{ background: '#E5E7EB' }}><div className="coo-okr-fill" style={{ width: '91%' }}></div></div><div className="coo-okr-pct" style={{ color: '#111827', fontWeight: 700 }}>91%</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL / COMPLIANCE */}
      <section className="sol-section" id="legal">
        <div className="sol-inner">
          <div className="sol-header reveal">
            <div className="eyebrow">Legal / Compliance</div>
            <h2>Hardcode compliance. <em>Eliminate liability.</em></h2>
            <p>Regulatory complexity multiplies with every country you enter. HiFive AI embeds labor law compliance into the architecture - not as an afterthought, but as a foundational constraint.</p>
          </div>
          <div className="pain-grid stagger">
            <div className="pain-card"><div className="pain-icon">🌍</div><div className="pain-title">Multi-Jurisdiction Chaos</div><div className="pain-desc">Employment laws differ by country, state, and sometimes city. Manual tracking is error-prone and doesn&apos;t scale.</div></div>
            <div className="pain-card"><div className="pain-icon">📝</div><div className="pain-title">Contract Generation Bottleneck</div><div className="pain-desc">Legal spends days drafting localized employment contracts for every new jurisdiction.</div></div>
            <div className="pain-card"><div className="pain-icon">🛂</div><div className="pain-title">Visa &amp; Permit Blind Spots</div><div className="pain-desc">Work permits expire without warning, exposing the company to fines and potential bans.</div></div>
            <div className="pain-card"><div className="pain-icon">⚠️</div><div className="pain-title">Audit Trail Gaps</div><div className="pain-desc">Disparate systems mean incomplete audit trails. Regulators don&apos;t accept &quot;the data is in another system.&quot;</div></div>
          </div>
          <div className="sol-grid">
            <div className="sol-text reveal-left">
              <h3>From reactive compliance <em>to architectural compliance.</em></h3>
              <p>HiGlobal generates localized contracts, tracks visa expiry, and monitors labor law changes in real time. HiAI flags compliance risks before they become violations. Every action is recorded in an immutable, tamper-proof audit log.</p>
              <div className="sol-modules"><span className="sol-mod-tag">HiGlobal</span><span className="sol-mod-tag">HiPay</span><span className="sol-mod-tag">HiPeople</span></div>
              <div className="sol-outcomes">
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Auto-generated</span> localized contracts per jurisdiction</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">90/60/30 day</span> visa expiry alerts</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Immutable</span> tamper-proof audit logs</div>
                <div className="sol-outcome"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Continuous</span> labor law monitoring across all jurisdictions</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-primary">See Your Compliance Dashboard →</a>
            </div>
            <div className="sol-mockup reveal-right">
              <div className="sol-mockup-bar"><div className="sol-mockup-dots"><span></span><span></span><span></span></div><span className="sol-mockup-bar-title">Compliance Command</span><span className="sol-mockup-bar-persona">Legal View</span></div>
              <div className="legal-mock">
                {/* Status Header */}
                <div className="legal-section-header">
                  <div className="legal-status-title">Compliance Status</div>
                  <div className="legal-live-pill">
                    <span className="legal-pulse-dot" />
                    <span>5/5 Monitored</span>
                  </div>
                </div>

                {/* Country Status Grid */}
                <div className="legal-status-grid">
                  <div className="legal-status-card">
                    <div className="legal-status-flag-row">
                      <span className="legal-status-country">🇺🇸 US</span>
                    </div>
                    <span className="legal-status-badge green">✓ Compliant</span>
                  </div>
                  <div className="legal-status-card">
                    <div className="legal-status-flag-row">
                      <span className="legal-status-country">🇬🇧 UK</span>
                    </div>
                    <span className="legal-status-badge green">✓ Compliant</span>
                  </div>
                  <div className="legal-status-card">
                    <div className="legal-status-flag-row">
                      <span className="legal-status-country">🇦🇪 UAE</span>
                    </div>
                    <span className="legal-status-badge green">✓ Compliant</span>
                  </div>
                  <div className="legal-status-card">
                    <div className="legal-status-flag-row">
                      <span className="legal-status-country">🇩🇪 DE</span>
                    </div>
                    <span className="legal-status-badge gold">⚠ 1 Visa Expiring</span>
                  </div>
                  <div className="legal-status-card">
                    <div className="legal-status-flag-row">
                      <span className="legal-status-country">🇮🇳 IN</span>
                    </div>
                    <span className="legal-status-badge green">✓ Compliant</span>
                  </div>
                </div>

                {/* Active Alerts */}
                <div className="legal-section-header">
                  <div className="legal-alerts-title">Active Alerts (2)</div>
                </div>

                <div className="legal-alerts-container">
                  <div className="legal-alert-card gold-border">
                    <span className="legal-pulse-dot gold" style={{ marginTop: 4 }} />
                    <div className="legal-alert-content">
                      <div className="legal-alert-text">
                        <strong>Alex Weber (DE)</strong> - Work permit expires in 23 days. Renewal initiated.
                      </div>
                      <div className="legal-alert-sub">Visa &amp; Work Permit Tracker · Auto-workflow active</div>
                    </div>
                  </div>

                  <div className="legal-alert-card green-border">
                    <span className="legal-pulse-dot" style={{ marginTop: 4 }} />
                    <div className="legal-alert-content">
                      <div className="legal-alert-text">
                        <strong>UAE labor law update (Dec 2025)</strong> - 2 contract templates auto-updated.
                      </div>
                      <div className="legal-alert-sub">HiGlobal Compliance Engine · Sync completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IT / SECURITY */}
      <section className="sol-section dark-sol" id="it">
        <div className="noise" />
        <div className="sol-inner">
          <div className="sol-header dark-h reveal">
            <div className="eyebrow">IT / Security</div>
            <h2>Provision instantly. <em>Revoke instantly.</em></h2>
            <p>IT teams spend 40% of their time on manual provisioning and de-provisioning. Orphaned accounts create security gaps. HiOps automates the entire lifecycle tied to people events.</p>
          </div>
          <div className="pain-grid stagger">
            <div className="pain-card dark-pain"><div className="pain-icon">🔑</div><div className="pain-title">Manual Provisioning</div><div className="pain-desc">Creating accounts across 10+ tools for every new hire takes 2-3 days. Mistakes are common.</div></div>
            <div className="pain-card dark-pain"><div className="pain-icon">👻</div><div className="pain-title">Orphaned Accounts</div><div className="pain-desc">Departed employees retain access to Slack, AWS, and Gmail for weeks after leaving - a ticking security bomb.</div></div>
            <div className="pain-card dark-pain"><div className="pain-icon">📋</div><div className="pain-title">Shadow IT</div><div className="pain-desc">Departments buy SaaS tools without IT approval. No central inventory exists.</div></div>
            <div className="pain-card dark-pain"><div className="pain-icon">🔍</div><div className="pain-title">Audit Complexity</div><div className="pain-desc">SOC 2 audits require demonstrating access controls across every system. Manual spreadsheets don&apos;t scale.</div></div>
          </div>
          <div className="sol-grid reverse">
            <div className="sol-text dark-t reveal-right">
              <h3>From manual tickets <em>to automated lifecycle.</em></h3>
              <p>HiOps auto-provisions accounts on hire (tied to HiPeople) and instantly revokes on exit. SSO integration ensures zero-day access. Every permission change is logged in an immutable audit trail.</p>
              <div className="sol-modules"><span className="sol-mod-tag dark-tag">HiOps</span><span className="sol-mod-tag dark-tag">HiPeople</span></div>
              <div className="sol-outcomes">
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Zero-day</span> provisioning for all new hires</div>
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Instant</span> revocation on employee exit</div>
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Immutable</span> audit trail for SOC 2 / ISO 27001</div>
                <div className="sol-outcome dark-o"><div className="sol-outcome-check">{checkSvg}</div><span className="sol-outcome-val">Complete</span> SaaS inventory and shadow IT detection</div>
              </div>
              <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold">See Your IT Dashboard →</a>
            </div>
            <div className="sol-mockup dark-mock reveal-left">
              <div className="sol-mockup-bar"><div className="sol-mockup-dots"><span></span><span></span><span></span></div><span className="sol-mockup-bar-title">Security &amp; Access Command</span><span className="sol-mockup-bar-persona">IT View</span></div>
              <div className="it-mock" style={{ color: '#FFFFFF', background: 'rgba(18,18,18,0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="it-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="it-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
                    <div className="it-card-title" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '.05em', marginBottom: '6px' }}>Active Sessions</div>
                    <div className="it-card-val" style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>138</div>
                    <div className="it-card-sub" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>of 142 employees</div>
                  </div>
                  <div className="it-card" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
                    <div className="it-card-title" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '.05em', marginBottom: '6px' }}>Orphaned Accounts</div>
                    <div className="it-card-val" style={{ fontSize: '28px', fontWeight: 800, color: '#22c55e' }}>0</div>
                    <div className="it-card-sub" style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Auto-revoked on exit</div>
                  </div>
                </div>
                <div className="it-activity" style={{ marginTop: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: '12px' }}>Recent Provisioning</div>
                  <div className="it-activity-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>✅ Sarah Kim - 8 accounts provisioned</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, marginLeft: 'auto' }}>2h ago</span>
                  </div>
                  <div className="it-activity-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>🔄 Alex Weber - SSO token rotated</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, marginLeft: 'auto' }}>6h ago</span>
                  </div>
                  <div className="it-activity-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>🚫 John Doe - All access revoked (exit)</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, marginLeft: 'auto' }}>1d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="cta-section">
        <div className="noise" />
        <div className="cta-glow" />
        <div className="cta-inner reveal">
          <h2>See it through <em>your lens.</em></h2>
          <p>Book a personalized demo tailored to your specific role and challenges. We&apos;ll show you exactly how HiFive AI maps to your KPIs.</p>
          <div className="cta-buttons">
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Book Free HR Audit →</a>
            <button onClick={() => onNavigate('platform')} className="btn btn-outline-light btn-lg">Explore the Platform →</button>
          </div>
        </div>
      </section>
    </>
  );
}
