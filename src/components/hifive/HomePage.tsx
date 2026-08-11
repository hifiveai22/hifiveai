'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useCounters } from '@/hooks/useCounters';
import TestimonialsCarousel from './TestimonialsCarousel';
import PartnerLogos from './PartnerLogos';
import LiveActivityFeed from './LiveActivityFeed';
import ModuleIcon, { ModuleName } from './ModuleIcons';
import HiAIConsoleDemo from './HiAIConsoleDemo';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

function AnimatedWord({
  word,
  visibleCount,
  showCursor,
}: {
  word: string;
  visibleCount: number;
  showCursor: boolean;
}) {
  return (
    <em className="animated-word-container">
      {word.split('').map((char, index) => {
        const isVisible = index < visibleCount;
        const isCursorHere =
          showCursor &&
          ((visibleCount === 0 && index === 0) ||
            (visibleCount > 0 && index === Math.min(visibleCount - 1, word.length - 1)));

        return (
          <span key={index} className="animated-char-span">
            <span style={{ opacity: isVisible ? 1 : 0 }}>{char}</span>
            {isCursorHere && (
              <span
                className="typing-cursor-abs"
                style={{
                  left: visibleCount === 0 ? '0' : '100%',
                }}
                aria-hidden="true"
              >
                |
              </span>
            )}
          </span>
        );
      })}
    </em>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  useReveal();
  useCounters();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heroReady, setHeroReady] = useState(false);

  // Hero animation sequence
  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const mouse = { x: 0, y: 0 };
    let w = 0, h = 0;

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.3 + 0.1,
      });
    }

    canvas.addEventListener('mousemove', (e) => {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(176,125,46,${p.o})`;
        ctx!.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(176,125,46,${0.06 * (1 - d / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200 && d > 0) {
          p.vx += (dx / d) * 0.01;
          p.vy += (dy / d) * 0.01;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);





  const checkSvg = (
    <svg viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero">
        <canvas className="hero-particles" ref={canvasRef} />
        <div className="hero-glow" />
        <div className="hero-gradient-bg" />
        <div className="hero-content">

          <h1 className="hero-title">
            <span className="line"><span className="line-inner line-1" style={{ transform: heroReady ? 'translateY(0)' : 'translateY(110%)', transition: 'transform .8s cubic-bezier(.16,1,.3,1)' }}>Make informed data backed decisions</span></span>
            <span className="line"><span className="line-inner line-2" style={{ transform: heroReady ? 'translateY(0)' : 'translateY(110%)', transition: 'transform .8s cubic-bezier(.16,1,.3,1) .12s' }}><em>like never before.</em></span></span>
          </h1>
          <p className="hero-sub" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease .8s' }}>
            The AI-native People Operating System. Five interconnected modules that replace your fragmented HR stack with one continuously learning intelligence layer.
          </p>
          <div className="hero-ctas" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease 1s' }}>
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Book Free HR Audit →</a>
            <button onClick={() => document.getElementById('hiai-reasoning')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-outline-light btn-lg">Explore the Platform ↓</button>
          </div>
        </div>
        <div className="hero-scroll" style={{ opacity: heroReady ? 1 : 0, transition: 'opacity .6s ease 1.2s' }}>
          <div className="hero-scroll-line" />
          <span className="hero-scroll-label">Scroll</span>
        </div>
      </section>

      {/* HIAI CONSOLE DEMO */}
      <HiAIConsoleDemo onNavigate={onNavigate} />


      {/* THE PROBLEM: FRAGMENTATION */}
      <section className="frag-section" id="problem">
        <div className="noise" />
        <div className="frag-inner">
          <div className="frag-grid">
            <div className="frag-text reveal-left">
              <div className="eyebrow">The Problem</div>
              <h2>
                Make your systems <em>talk.</em><br />
                Let your intelligence <em>compound.</em>
              </h2>
              <p>Modern organizations suffer from profound <strong>information fragmentation</strong>. Recruiting operates in one system. Payroll in another. Finance in a third. Operations in a fourth. Legal in a fifth.</p>
              <p>The fundamental problem is not missing data. The problem is <strong>fragmented intelligence</strong>. Leadership spends enormous time collecting information before they can make a single decision.</p>
              <p>Companies do not buy recruiting software; they buy faster hiring. They do not buy dashboards; they buy clarity. They do not buy AI; they buy better decisions.</p>
            </div>

          </div>
        </div>
      </section>

      {/* THE SOLUTION: 5 MODULES + 1 INTELLIGENCE LAYER */}
      <section className="modules-section" id="solution">
        <div className="modules-inner">
          <div className="modules-header reveal">
            <div className="eyebrow">The Solution</div>
            <h2>Five modules. <em>One intelligence layer.</em></h2>
            <p>Five core modules connected by HiAI: sharing a single data fabric so changes propagate instantly across your entire organization.</p>
          </div>
          
          {/* HiAI Intelligence Layer Banner */}
          <div className="reveal" style={{ marginBottom: '2rem' }}>
            <div className="mod-card hiai-featured-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ModuleIcon name="hiai" size={32} />
                <div>
                  <div className="mod-card-name" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Hi<span>AI</span> - Intelligence Layer</div>
                  <div className="mod-card-sub" style={{ color: 'var(--gold)' }}>Cross-Module Cognitive Engine</div>
                </div>
              </div>
              <div className="mod-card-desc" style={{ maxWidth: '900px' }}>
                HiAI is not a standalone module - it is the intelligence layer connecting all five operational modules. It runs natural language queries, cross-functional reasoning, scenario modeling, and autonomous execution across your whole company.
              </div>
              <div className="mod-card-feats" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <span className="mod-card-feat">{checkSvg}Connects all 5 modules</span>
                <span className="mod-card-feat">{checkSvg}Cross-module reasoning</span>
                <span className="mod-card-feat">{checkSvg}What-if scenario modeling</span>
                <span className="mod-card-feat">{checkSvg}Agentic workflows</span>
              </div>
            </div>
          </div>

          <div className="modules-grid stagger">
            <div className="mod-card"><div className="mod-card-icon"><ModuleIcon name="hitalent" size={28} /></div><div className="mod-card-name">Hi<span>Talent</span></div><div className="mod-card-sub">Talent Acquisition</div><div className="mod-card-desc">Personalized AI-native recruitment process. Candidates ranked against job requirements and historical success patterns.</div><div className="mod-card-feats"><span className="mod-card-feat">{checkSvg}AI match scoring</span><span className="mod-card-feat">{checkSvg}Anonymized screening</span><span className="mod-card-feat">{checkSvg}Auto scheduling</span></div><button onClick={() => onNavigate('platform')} className="mod-card-link">Explore HiTalent →</button></div>
            <div className="mod-card"><div className="mod-card-icon"><ModuleIcon name="hipeople" size={28} /></div><div className="mod-card-name">Hi<span>People</span></div><div className="mod-card-sub">People Lifecycle</div><div className="mod-card-desc">Every transition orchestrated through one workflow engine. Onboarding, promotions, transfers, performance reviews, exits - zero manual handoffs.</div><div className="mod-card-feats"><span className="mod-card-feat">{checkSvg}Zero-day onboarding</span><span className="mod-card-feat">{checkSvg}OKR &amp; performance</span><span className="mod-card-feat">{checkSvg}Succession planning</span></div><button onClick={() => onNavigate('platform')} className="mod-card-link">Explore HiPeople →</button></div>
            <div className="mod-card"><div className="mod-card-icon"><ModuleIcon name="hipay" size={28} /></div><div className="mod-card-name">Hi<span>Pay</span></div><div className="mod-card-sub">Payroll &amp; Rewards</div><div className="mod-card-desc">Global payroll with 100+ country tax engines. Connects to hiring, lifecycle, and global modules - eliminating reconciliation entirely.</div><div className="mod-card-feats"><span className="mod-card-feat">{checkSvg}100+ country tax engines</span><span className="mod-card-feat">{checkSvg}Pay equity auditing</span><span className="mod-card-feat">{checkSvg}Real-time variance</span></div><button onClick={() => onNavigate('platform')} className="mod-card-link">Explore HiPay →</button></div>
            <div className="mod-card"><div className="mod-card-icon"><ModuleIcon name="higlobal" size={28} /></div><div className="mod-card-name">Hi<span>Global</span></div><div className="mod-card-sub">Global Workforce</div><div className="mod-card-desc">EOR cost calculators, contractor misclassification scanning, visa tracking, and localized contract generation - all from one dashboard.</div><div className="mod-card-feats"><span className="mod-card-feat">{checkSvg}EOR cost calculator</span><span className="mod-card-feat">{checkSvg}Misclassification scanning</span><span className="mod-card-feat">{checkSvg}Visa expiry tracking</span></div><button onClick={() => onNavigate('platform')} className="mod-card-link">Explore HiGlobal →</button></div>
            <div className="mod-card"><div className="mod-card-icon"><ModuleIcon name="hiops" size={28} /></div><div className="mod-card-name">Hi<span>Ops</span></div><div className="mod-card-sub">Operations</div><div className="mod-card-desc">Workspace heatmaps, asset lifecycle tracking, automated IT provisioning, and instant de-provisioning on exit - closing security gaps.</div><div className="mod-card-feats"><span className="mod-card-feat">{checkSvg}Workspace heatmaps</span><span className="mod-card-feat">{checkSvg}Asset lifecycle</span><span className="mod-card-feat">{checkSvg}Auto de-provisioning</span></div><button onClick={() => onNavigate('platform')} className="mod-card-link">Explore HiOps →</button></div>
          </div>
        </div>
      </section>





      {/* OUTCOMES */}
      <section className="outcomes-enhanced" id="outcomes">
        <div className="outcomes-enhanced-inner">
          <div className="outcomes-enhanced-header reveal">
            <div className="eyebrow">Measurable Outcomes</div>
            <h2>Every feature maps <em>to a result.</em></h2>
            <p>HiFive AI is not built to add features. It is built to deliver specific, quantifiable business outcomes. Here&apos;s what our customers measure.</p>
          </div>

          <div className="outcomes-detail stagger">
            <div className="outcome-detail"><div className="outcome-detail-icon">⚡</div><div className="outcome-detail-title">Reduce Operational Friction</div><div className="outcome-detail-desc">Eliminate manual data entry and cross-system reconciliations. One data fabric replaces five sync pipelines.</div></div>
            <div className="outcome-detail"><div className="outcome-detail-icon">🎯</div><div className="outcome-detail-title">Improve Decision Speed</div><div className="outcome-detail-desc">Executives get instant, cross-functional answers to strategic questions - no waiting for departmental reports.</div></div>
            <div className="outcome-detail"><div className="outcome-detail-icon">📈</div><div className="outcome-detail-title">Increase Hiring Efficiency</div><div className="outcome-detail-desc">AI parses, ranks, and schedules candidates autonomously. Recruiters decide, not data-entry.</div></div>
            <div className="outcome-detail"><div className="outcome-detail-icon">🔒</div><div className="outcome-detail-title">Hardcode Compliance</div><div className="outcome-detail-desc">Global labor laws and tax regulations built into the foundational architecture - not bolted on as an afterthought.</div></div>
            <div className="outcome-detail"><div className="outcome-detail-icon">💰</div><div className="outcome-detail-title">Optimize Workforce Costs</div><div className="outcome-detail-desc">Predictive scenario modeling for compensation, geographic expansion, and contractor vs. EOR decisions.</div></div>
            <div className="outcome-detail"><div className="outcome-detail-icon">🔮</div><div className="outcome-detail-title">Predict &amp; Prevent Attrition</div><div className="outcome-detail-desc">Flight-risk scoring based on engagement, compensation parity, and manager changes - intervene before the resignation.</div></div>
          </div>
        </div>
      </section>

      {/* LIVE ACTIVITY FEED - simulated real-time dashboard */}
      <LiveActivityFeed onNavigate={onNavigate} />

      {/* PARTNER LOGOS */}
      <PartnerLogos />

      {/* TESTIMONIALS CAROUSEL */}
      <TestimonialsCarousel />

      {/* PERSONA QUICK LINKS */}
      <section className="personas-strip" id="personas">
        <div className="personas-strip-inner">
          <div className="personas-strip-header reveal">
            <h2>See it through <em>your lens.</em></h2>
            <p>Every role gets a tailored dashboard with specific KPIs and workflows.</p>
          </div>
          <div className="personas-grid stagger">
            <button onClick={() => onNavigate('solutions')} className="persona-card"><div className="persona-card-icon">👔</div><div className="persona-card-name">CEO / Founder</div><div className="persona-card-desc">Growth, efficiency, culture</div></button>
            <button onClick={() => onNavigate('solutions')} className="persona-card"><div className="persona-card-icon">👥</div><div className="persona-card-name">CHRO / HR</div><div className="persona-card-desc">Talent, retention, equity</div></button>
            <button onClick={() => onNavigate('solutions')} className="persona-card"><div className="persona-card-icon">💰</div><div className="persona-card-name">CFO / Finance</div><div className="persona-card-desc">Payroll, forecasting, TCO</div></button>
            <button onClick={() => onNavigate('solutions')} className="persona-card"><div className="persona-card-icon">⚙️</div><div className="persona-card-name">COO / Ops</div><div className="persona-card-desc">Workspace, assets, OKRs</div></button>
            <button onClick={() => onNavigate('solutions')} className="persona-card"><div className="persona-card-icon">⚖️</div><div className="persona-card-name">Legal</div><div className="persona-card-desc">Compliance, visas, contracts</div></button>
            <button onClick={() => onNavigate('solutions')} className="persona-card"><div className="persona-card-icon">🔐</div><div className="persona-card-name">IT / Security</div><div className="persona-card-desc">Provisioning, audit, SSO</div></button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="noise" />
        <div className="cta-glow" />
        <div className="cta-inner reveal">
          <h2>Replace your stack.<br /><em>Not add to it.</em></h2>
          <p>Book a free HR audit. We'll demonstrate how HiFive AI unifies all your HR processes into a single, intelligent People Operating System, delivering customized ROI projections for your organization.</p>
          <div className="cta-buttons">
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Book Free HR Audit →</a>
            <button onClick={() => onNavigate('platform')} className="btn btn-outline-light btn-lg">Explore the Platform →</button>
          </div>
        </div>
      </section>
    </>
  );
}
