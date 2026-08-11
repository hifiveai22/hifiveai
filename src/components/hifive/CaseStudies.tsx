'use client';

import { useReveal } from '@/hooks/useReveal';

interface CaseStudy {
  company: string;
  industry: string;
  size: string;
  challenge: string;
  solution: string;
  metrics: { icon: string; value: string; label: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    company: 'NovaPay',
    industry: 'Fintech',
    size: '40 employees · 3 countries',
    challenge:
      'NovaPay was juggling five separate tools for HRIS, payroll, ATS, performance reviews, and engagement surveys. Data silos meant reports took days, and hiring managers couldn\'t see the full picture of any candidate or employee.',
    solution:
      'HiFive AI consolidated all five tools into a single People Operating System. Cross-module data flows eliminated manual sync, and Ask AI gave hiring managers instant answers grounded in real-time data across every module.',
    metrics: [
      { icon: '⚡', value: '40%', label: 'Faster hiring' },
      { icon: '💰', value: '$84K', label: 'Annual savings' },
      { icon: '🔧', value: '5→1', label: 'Tools replaced' },
    ],
  },
  {
    company: 'MedVista Health',
    industry: 'Healthcare',
    size: '150 employees',
    challenge:
      'Compliance incidents were rising as MedVista scaled across multiple states. Each compliance check required pulling data from three disconnected systems, and cross-referencing was manual and error-prone.',
    solution:
      'HiFive AI\'s Ask AI cross-module reasoning automatically correlates compliance signals across HR, payroll, and legal modules. Real-time alerts flag risks before they become incidents, and audit trails are generated automatically.',
    metrics: [
      { icon: '📉', value: '60%', label: 'Fewer compliance incidents' },
      { icon: '🤖', value: '100%', label: 'Audit trail coverage' },
      { icon: '⏱️', value: '4hrs→20min', label: 'Compliance check time' },
    ],
  },
  {
    company: 'CloudStack',
    industry: 'SaaS',
    size: '80 employees · 4 countries',
    challenge:
      'Running payroll across four countries meant four vendors, four timelines, and four sets of compliance risk. Month-end close consumed five full days, and errors in currency conversion and tax withholding were routine.',
    solution:
      'HiFive AI unified multi-country payroll into a single platform with built-in local tax and labor law compliance. Automated reconciliation and real-time currency handling replaced manual spreadsheets and vendor coordination.',
    metrics: [
      { icon: '🎯', value: '99.8%', label: 'Payroll accuracy' },
      { icon: '🗓️', value: '5→1 day', label: 'Month-end close' },
      { icon: '🌍', value: '4→1', label: 'Payroll vendors' },
    ],
  },
  {
    company: 'CartBloom',
    industry: 'E-commerce',
    size: '60 employees',
    challenge:
      'CartBloom\'s ops team was drowning in manual workflows - onboarding checklists, asset provisioning, vendor coordination, and performance tracking all lived in different tools. Nothing talked to each other.',
    solution:
      'HiFive AI automated 70% of operational workflows out of the box. The unified platform connects onboarding, IT provisioning, and performance management into a single flow, letting the ops team focus on improvement instead of execution.',
    metrics: [
      { icon: '🔄', value: '8→1', label: 'Platforms consolidated' },
      { icon: '🤖', value: '70%', label: 'Workflows automated' },
      { icon: '📦', value: '0', label: 'Manual sync errors' },
    ],
  },
];

export default function CaseStudies() {
  useReveal();

  return (
    <section className="case-studies-section">
      <div className="case-studies-inner">
        <div className="case-studies-header reveal">
          <div className="eyebrow">Success Stories</div>
          <h2>
            Real results from <em>real companies.</em>
          </h2>
          <p>
            See how organizations across industries and geographies have transformed their people operations with HiFive AI.
          </p>
        </div>

        <div className="case-studies-grid stagger">
          {caseStudies.map((cs, i) => (
            <div className="case-study-card" key={i}>
              <div className="case-study-badge">{cs.industry}</div>
              <h3>{cs.company}</h3>
              <p className="case-study-size">{cs.size}</p>

              <div className="case-study-block">
                <h4>Challenge</h4>
                <p>{cs.challenge}</p>
              </div>

              <div className="case-study-block">
                <h4>Solution</h4>
                <p>{cs.solution}</p>
              </div>

              <div className="case-study-metrics">
                {cs.metrics.map((m, j) => (
                  <div className="case-study-metric" key={j}>
                    <span className="case-study-metric-icon">{m.icon}</span>
                    <span className="case-study-metric-value">{m.value}</span>
                    <span className="case-study-metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
