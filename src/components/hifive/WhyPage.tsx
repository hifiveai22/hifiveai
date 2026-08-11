'use client';

import { useReveal } from '@/hooks/useReveal';
import PricingCalculator from './PricingCalculator';
import ComparisonTable from './ComparisonTable';
import CompetitorComparison from './CompetitorComparison';
import ROICalculator from './ROICalculator';
import HRAssessment from './HRAssessment';
import OnboardingWizard from './OnboardingWizard';
import PlanComparisonMatrix from './PlanComparisonMatrix';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface WhyPageProps {
  onNavigate: (page: PageId) => void;
}

export default function WhyPage({ onNavigate }: WhyPageProps) {
  useReveal();

  return (
    <>
      {/* WHY HERO */}
      <section className="why-hero" id="hero">
        <div className="why-hero-glow" />
        <div className="noise" />
        <div className="why-hero-content">
          <div className="why-hero-eyebrow eyebrow reveal">Why HiFive</div>
          <h1 className="reveal d1">We believe leaders<br />should <em>lead,</em><br />not manage data.</h1>
          <p className="why-hero-sub reveal d2">HiFive AI is not an HR software. Not another ATS. Not another payroll system. Not another employee management platform. HiFive AI is an AI-native People Operating System.</p>
          <div className="why-hero-quote reveal d3">
            <p>&quot;The fundamental problem is not missing data. The problem is fragmented intelligence. Every feature, workflow, dashboard, automation, report, recommendation, and AI capability exists to reinforce one rule.&quot;</p>
            <cite>Founding Principle</cite>
          </div>
          <div className="why-hero-ctas reveal d4">
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">
              Book Free TCO Audit →
            </a>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('philosophy');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-outline-light btn-lg"
            >
              Explore Philosophy ↓
            </button>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="phil-section" id="philosophy">
        <div className="phil-inner">
          <div className="phil-header">
            <div className="eyebrow reveal">Core Philosophy</div>
            <h2 className="reveal d1">The rules that govern<br /><em>every decision we make.</em></h2>
            <p className="reveal d2">These are not marketing statements. They are engineering constraints. Every feature must satisfy all of them before it ships.</p>
          </div>
          <div className="phil-grid stagger">
            <div className="phil-card"><div className="phil-card-num">01</div><h3>The Invisible Platform</h3><p>Users should never think about modules; they should think about outcomes. The platform must feel invisible - like electricity. You don&apos;t think about the grid; you turn on the light.</p></div>
            <div className="phil-card"><div className="phil-card-num">02</div><h3>Outcomes, Not Features</h3><p>Companies do not buy recruiting software; they buy faster hiring. They do not buy dashboards; they buy clarity. They do not buy AI; they buy better decisions.</p></div>
            <div className="phil-card"><div className="phil-card-num">03</div><h3>Decisions Over Collection</h3><p>Executives should spend their time making decisions - not collecting information. If a feature requires a human to gather data before acting, it is not finished.</p></div>
            <div className="phil-card"><div className="phil-card-num">04</div><h3>Cross-Module Intelligence</h3><p>No module is an island. Talent connects to Payroll for budget validation. Payroll connects to Legal for compliance. Operations connects to Finance for fully loaded costs. Everything connects.</p></div>
            <div className="phil-card"><div className="phil-card-num">05</div><h3>Educational Imperative</h3><p>Every paragraph must teach something useful. Every feature must exist because it solves a measurable business problem. We explain the reasoning - not just describe the feature.</p></div>
            <div className="phil-card"><div className="phil-card-num">06</div><h3>Zero Startup Clichés</h3><p>We never use words like &quot;disrupt,&quot; &quot;ninja,&quot; &quot;game-changer,&quot; or &quot;revolutionary.&quot; We never say &quot;leverage synergistic machine learning.&quot; We say what the system does, in plain language.</p></div>
            <div className="phil-card"><div className="phil-card-num">07</div><h3>The Cryptographic Source of Truth</h3><p>There can only be one source of truth for any piece of data. If headcount in Talent differs from headcount in Finance, the system is broken. HiFive AI maintains a single, cryptographic source of truth for all headcount and financial data. Every other system is a downstream consumer - never an independent authority.</p></div>
            <div className="phil-card"><div className="phil-card-num">08</div><h3>Supervised Autonomy &amp; Governance</h3><p>AI should execute multi-step workflows across systems, but never in a black box. Every agentic action is backed by verifiable data, audited in real-time, and bound by human oversight for critical financial and compliance thresholds.</p></div>
          </div>
        </div>
      </section>

      {/* NOT SOFTWARE */}
      <section className="notsw-section">
        <div className="noise" />
        <div className="notsw-inner">
          <div className="eyebrow reveal" style={{ color: 'var(--gold)' }}>The Category We Created</div>
          <h2 className="reveal d1">What companies buy<br /><em>vs. what they actually need.</em></h2>
          <div className="notsw-grid reveal-blur">
            <div className="notsw-card"><div className="notsw-card-strike">Recruiting software</div><div className="notsw-card-replace"><span>Faster hiring</span> - 40% reduction in time-to-fill</div></div>
            <div className="notsw-card"><div className="notsw-card-strike">Payroll software</div><div className="notsw-card-replace"><span>Accurate global payroll</span> - 99.9% accuracy across 150+ countries</div></div>
            <div className="notsw-card"><div className="notsw-card-strike">HRIS software</div><div className="notsw-card-replace"><span>Organizational visibility</span> - single source of truth for every entity</div></div>
            <div className="notsw-card"><div className="notsw-card-strike">Dashboard software</div><div className="notsw-card-replace"><span>Clarity</span> - cross-functional answers in seconds, not days</div></div>
            <div className="notsw-card"><div className="notsw-card-strike">AI chatbot</div><div className="notsw-card-replace"><span>Better decisions</span> - a Chief of Staff that reasons across all your data</div></div>
            <div className="notsw-card"><div className="notsw-card-strike">Compliance tool</div><div className="notsw-card-replace"><span>Zero liability</span> - labor laws hardcoded into the architecture</div></div>
          </div>
          <div className="notsw-bottom reveal d2">
            <p>HiFive AI is the category that absorbs all of these outcomes into one system. Not a bundle. Not an integration. One architecture. One intelligence layer. One truth.</p>
          </div>
        </div>
      </section>

      {/* MEASURABLE OUTCOMES */}
      <section className="outcomes-full-section" id="outcomes">
        <div className="outcomes-full-inner">
          <div className="outcomes-full-header">
            <div className="eyebrow reveal">Measurable Outcomes</div>
            <h2 className="reveal d1">Every capability maps<br /><em>to a business result.</em></h2>
            <p className="reveal d2">These are not aspirations. They are measurable outcomes that every module within HiFive AI is designed to deliver. If a feature doesn&apos;t map to at least one of these, it doesn&apos;t ship.</p>
          </div>
          <div className="outcomes-full-grid stagger">
            <div className="outcome-full-card"><span className="outcome-full-num">01</span><span className="outcome-full-text"><strong>Reduce operational friction</strong> - Eliminate manual data entry and cross-system reconciliations.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">02</span><span className="outcome-full-text"><strong>Improve executive decision making</strong> - Instantaneous, cross-functional answers to strategic questions.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">03</span><span className="outcome-full-text"><strong>Increase hiring efficiency</strong> - AI parses, ranks, and schedules candidates autonomously.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">04</span><span className="outcome-full-text"><strong>Improve workforce productivity</strong> - Automate administrative burdens across IT, HR, and Operations.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">05</span><span className="outcome-full-text"><strong>Improve organizational visibility</strong> - Single, cryptographic source of truth for all headcount and financial data.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">06</span><span className="outcome-full-text"><strong>Optimize workforce planning</strong> - Predictive scenarios on compensation and hiring globally.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">07</span><span className="outcome-full-text"><strong>Improve resource allocation</strong> - Maximize workspace and asset utilization through data-driven tracking.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">08</span><span className="outcome-full-text"><strong>Improve workforce engagement</strong> - Consumer-grade, frictionless employee experience.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">09</span><span className="outcome-full-text"><strong>Improve compliance</strong> - Hardcode global labor laws and tax regulations into the foundational architecture.</span></div>
            <div className="outcome-full-card"><span className="outcome-full-num">10</span><span className="outcome-full-text"><strong>Improve organizational transparency</strong> - Democratize access to non-sensitive data across the company.</span></div>
          </div>
        </div>
      </section>

      {/* TCO */}
      <section className="tco-section" id="tco">
        <div className="tco-inner">
          <div className="tco-header">
            <div className="eyebrow reveal">Total Cost of Ownership</div>
            <h2 className="reveal d1">Consolidate your stack.<br /><em>Reduce your TCO.</em></h2>
            <p className="reveal d2">The real cost of fragmented tools isn&apos;t just the license fees. It&apos;s the reconciliation time, the data errors, the security gaps, and the decisions delayed. Frame the cost as a net-negative expense due to software consolidation.</p>
          </div>
          <div className="tco-table-wrap reveal-scale">
            <table className="tco-table">
              <thead>
                <tr><th>Capability</th><th>5 Disparate Tools</th><th style={{ color: 'var(--gold)' }}>HiFive AI</th></tr>
              </thead>
              <tbody>
                <tr><td style={{ fontWeight: 600 }}>Talent Acquisition</td><td><div className="tco-tools"><span className="tco-tool">Greenhouse - $12K/yr</span><span className="tco-tool">LinkedIn Recruiter - $8K/yr</span></div></td><td className="tco-hi">Included</td></tr>
                <tr><td style={{ fontWeight: 600 }}>HRIS / People</td><td><div className="tco-tools"><span className="tco-tool">BambooHR - $8K/yr</span><span className="tco-tool">Lattice - $6K/yr</span></div></td><td className="tco-hi">Included</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Payroll</td><td><div className="tco-tools"><span className="tco-tool">Deel / Remote - $15K/yr</span><span className="tco-tool">ADP - $10K/yr</span></div></td><td className="tco-hi">Included</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Legal / Compliance</td><td><div className="tco-tools"><span className="tco-tool">DocuSign - $4K/yr</span><span className="tco-tool">Manual tracking</span></div></td><td className="tco-hi">Included</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Operations / IT</td><td><div className="tco-tools"><span className="tco-tool">Snipe-IT - $3K/yr</span><span className="tco-tool">Okta - $6K/yr</span></div></td><td className="tco-hi">Included</td></tr>
                <tr><td style={{ fontWeight: 600 }}>AI / Analytics</td><td><div className="tco-tools"><span className="tco-tool">ChatGPT Enterprise - $30/seat/mo</span><span className="tco-tool">Tableau - $15K/yr</span></div></td><td className="tco-hi">Included</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Cross-Module Reasoning</td><td><span className="tco-x">Impossible</span></td><td className="tco-check">Native</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Single Source of Truth</td><td><span className="tco-x">Impossible</span></td><td className="tco-check">Cryptographic</td></tr>
                <tr className="tco-highlight"><td style={{ fontSize: '16px' }}>Estimated Annual Cost</td><td style={{ fontSize: '16px', color: 'var(--red)' }}>$120K–$180K+</td><td className="tco-hi">Ask for quote</td></tr>
                <tr className="tco-highlight"><td style={{ fontSize: '16px' }}>Hidden Costs</td><td style={{ fontSize: '14px', color: 'var(--red)' }}>Reconciliation, errors, delays, security gaps, shadow IT</td><td style={{ fontSize: '14px', color: 'var(--green)' }}>None - one system, one truth</td></tr>
              </tbody>
            </table>
          </div>
          <p className="tco-note reveal d1">Pricing varies by headcount and entity complexity. The comparison above reflects typical mid-market costs for organizations with 100–300 employees across 3+ countries. Schedule a demo for a precise TCO analysis of your current stack.</p>
        </div>
      </section>

      {/* COMPETITOR COMPARISON */}
      <ComparisonTable />

      {/* COMPETITOR COMPARISON MATRIX (interactive) */}
      <CompetitorComparison onNavigate={onNavigate} />

      {/* HR MATURITY ASSESSMENT */}
      <HRAssessment />

      {/* PLAN COMPARISON MATRIX (interactive) */}
      <PlanComparisonMatrix onNavigate={onNavigate} />

      {/* PRICING CALCULATOR */}
      <PricingCalculator />

      {/* ONBOARDING WIZARD - Find Your Perfect Plan */}
      <OnboardingWizard onNavigate={onNavigate} />

      {/* ROI CALCULATOR */}
      <ROICalculator />


      {/* CTA */}
      <section className="cta-section">
        <div className="noise" />
        <div className="cta-glow" />
        <div className="cta-inner">
          <div className="eyebrow reveal">See the Difference</div>
          <h2 className="reveal d1">Stop buying tools.<br />Start building intelligence.</h2>
          <p className="reveal d2">Book a personalized TCO analysis. We&apos;ll quantify exactly what you&apos;re spending on fragmented tools - and what you&apos;d save with one unified system.</p>
          <div className="cta-buttons reveal d3">
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Book Free TCO Analysis →</a>
            <button onClick={() => onNavigate('platform')} className="btn btn-outline-light btn-lg">Explore the Platform →</button>
          </div>
        </div>
      </section>
    </>
  );
}
