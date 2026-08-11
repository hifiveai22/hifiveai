'use client';

import { useReveal } from '@/hooks/useReveal';

const steps = [
  {
    phase: 'Phase 1',
    title: 'Discovery & Audit',
    desc: 'We map your current tech stack, data flows, and pain points. No generic templates - a precise audit of your people operations.',
    duration: 'Week 1–2',
  },
  {
    phase: 'Phase 2',
    title: 'Configuration & Migration',
    desc: 'Data migration from existing systems, SSO setup, workflow customization, and compliance rule configuration for every entity.',
    duration: 'Week 3–5',
  },
  {
    phase: 'Phase 3',
    title: 'Testing & Validation',
    desc: 'Parallel-run period: HiFive AI runs alongside your current tools. Payroll runs are cross-verified. Zero-risk cutover.',
    duration: 'Week 5–6',
  },
  {
    phase: 'Phase 4',
    title: 'Training & Go-Live',
    desc: 'Role-specific training sessions (not generic tutorials). Managers learn their dashboards. Admins learn their workflows.',
    duration: 'Week 6–7',
  },
  {
    phase: 'Phase 5',
    title: 'Optimization & Scale',
    desc: 'Post-launch: Ask AI learns your patterns. Custom automations activate. Your People Operating System gets smarter every week.',
    duration: 'Week 8+',
  },
];

export default function ImplementationTimeline() {
  useReveal();

  return (
    <section className="timeline-section">
      <div className="timeline-inner">
        <div className="timeline-header reveal">
          <div className="eyebrow">Implementation</div>
          <h2>
            From contract to <em>live in weeks.</em>
          </h2>
          <p>
            A dedicated implementation specialist guides every step. No self-serve portal. No generic onboarding. Just a precise, low-risk path to your People Operating System.
          </p>
        </div>

        <div className="timeline-track reveal">
          {steps.map((step, i) => (
            <div className="timeline-step" key={i}>
              <div className="timeline-step-content">
                <div className="timeline-step-phase">{step.phase}</div>
                <div className="timeline-step-title">{step.title}</div>
                <div className="timeline-step-desc">{step.desc}</div>
                <span className="timeline-step-duration">{step.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
