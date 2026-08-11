'use client';

import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useToast } from '@/hooks/use-toast';

type RouteType = 'sales' | 'support' | 'press' | 'partnerships';

export default function ContactPage() {
  useReveal();
  const [activeRoute, setActiveRoute] = useState<RouteType>('sales');
  const [submittedForms, setSubmittedForms] = useState<Set<RouteType>>(new Set());
  const [submitting, setSubmitting] = useState<RouteType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent, type: RouteType) => {
    e.preventDefault();
    setError(null);
    setSubmitting(type);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Build the request body based on route type
      let name = '';
      let email = '';
      let company = '';
      let message = '';
      const data: Record<string, string> = {};

      if (type === 'sales') {
        const firstName = (formData.get('firstName') as string) || '';
        const lastName = (formData.get('lastName') as string) || '';
        name = `${firstName} ${lastName}`.trim();
        email = (formData.get('email') as string) || '';
        company = (formData.get('company') as string) || '';
        message = (formData.get('message') as string) || '';
        if (formData.get('companySize')) data.companySize = formData.get('companySize') as string;
        if (formData.get('role')) data.role = formData.get('role') as string;
      } else if (type === 'support') {
        name = (formData.get('name') as string) || '';
        email = (formData.get('email') as string) || '';
        company = (formData.get('company') as string) || '';
        message = (formData.get('message') as string) || '';
        if (formData.get('category')) data.category = formData.get('category') as string;
      } else if (type === 'press') {
        name = (formData.get('name') as string) || '';
        email = (formData.get('email') as string) || '';
        company = (formData.get('publication') as string) || '';
        message = (formData.get('message') as string) || '';
        if (formData.get('deadline')) data.deadline = formData.get('deadline') as string;
      } else if (type === 'partnerships') {
        name = (formData.get('name') as string) || '';
        email = (formData.get('email') as string) || '';
        company = (formData.get('company') as string) || '';
        message = (formData.get('message') as string) || '';
        if (formData.get('partnershipType')) data.partnershipType = formData.get('partnershipType') as string;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, email, company: company || undefined, message, data: Object.keys(data).length > 0 ? data : undefined }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Submission failed. Please try again.');
      }

      setSubmittedForms((prev) => new Set(prev).add(type));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      toast({ title: 'Submission Failed', description: errorMsg, variant: 'destructive' });
    } finally {
      setSubmitting(null);
    }
  };

  const routes: { id: RouteType; icon: string; name: string; desc: string }[] = [
    { id: 'sales', icon: '💬', name: 'Sales', desc: 'Demo requests, pricing, and implementation timelines' },
    { id: 'support', icon: '🛠️', name: 'Support', desc: 'Technical issues, feature requests, and bug reports' },
    { id: 'press', icon: '📰', name: 'Press', desc: 'Media inquiries, interview requests, and brand assets' },
    { id: 'partnerships', icon: '🤝', name: 'Partnerships', desc: 'EOR partnerships, integration partners, and consulting' },
  ];

  const faqs = [
    { q: 'What makes HiFive AI different from an ATS like Greenhouse or Lever?', a: 'An ATS is a data silo that manages one function: recruiting. HiFive AI is a People Operating System where Talent Acquisition is one of nine interconnected modules. When you open a requisition in HiFive, it validates budget against HiPay in real-time. When you hire someone, their candidate profile converts exactly into their employee profile in People Lifecycle - zero data re-entry. Ask AI reasons across recruiting, payroll, and operations simultaneously to answer questions no ATS can touch.' },
    { q: 'How long does implementation take?', a: 'For organizations under 150 employees, typical implementation is 4–6 weeks. This includes data migration from existing systems, SSO configuration, workflow customization, and manager training. For enterprise deployments with multiple entities and complex compliance requirements, 8–12 weeks. We provide a dedicated implementation specialist - not a self-serve portal.' },
    { q: 'Do you replace our existing payroll provider, or integrate with it?', a: 'Both. For countries where we have native payroll processing (150+ countries), we replace the provider. For specialized cases where you must retain a local provider (e.g., France with complex social charges), we integrate bidirectionally - HiFive remains the system of record, and the local provider handles disbursement. Either way, you see all payroll data in one dashboard.' },
    { q: 'What does "Ask AI" actually do? Is it just ChatGPT wrapped in your UI?', a: 'No. Ask AI is a reasoning engine that translates natural language into multi-table database queries across your organization\'s actual data. When you ask "Why is payroll 12% over budget in London?", it doesn\'t generate text - it queries HiTalent (unbudgeted hires), HiOps (contractor overtime), and HiPay (GBP/USD fluctuations), then synthesizes a data-backed answer with specific numbers. It can also take actions: posting jobs, scheduling interviews, generating documents, and approving requests - with supervised autonomy.' },
    { q: 'How does pricing work?', a: 'Pricing is based on headcount and the number of entities/countries you operate in. We don\'t charge per module - you get the entire platform. We also don\'t charge per seat for employees (only for admin/manager users). The goal is to make the TCO comparison against your current stack of 5+ tools obviously favorable. Book a demo and we\'ll provide a precise quote within 24 hours.' },
    { q: 'Is the platform suitable for companies under 20 employees?', a: 'Yes. HiFive AI is designed for companies between 5 and 150 employees who are outgrowing early processes - the moment when founders realize they\'re spending too much time collecting information instead of making decisions. The platform scales with you: you don\'t need to migrate to a "bigger" system as you grow. The same architecture that serves a 20-person startup serves a 500-person multi-entity enterprise.' },
    { q: 'What security certifications do you have?', a: 'SOC 2 Type II (all five Trust Service Criteria), ISO 27001, GDPR and CCPA compliance. Data at rest encrypted with AES-256, data in transit with TLS 1.3. Row-level security enforced at the database layer - not application-level filtering. SAML 2.0 and OIDC SSO. Immutable, tamper-proof audit logs. Automated offboarding that revokes access across all systems instantly.' },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema),
        }}
      />
      {/* CONTACT HERO */}
      <section id="hero" className="contact-hero">
        <div className="contact-hero-glow" />
        <div className="noise" />
        <div className="contact-hero-content">
          <div className="eyebrow reveal">Contact Us</div>
          <h1 className="reveal d1">Let&apos;s talk about <em>your operation.</em></h1>
          <p className="contact-hero-sub reveal d2">Every inquiry is routed directly to the correct department. No generic forms. No black holes. Just the right person, ready to help.</p>

          <div className="contact-hero-ctas reveal d3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('routeGrid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-gold btn-lg pulse"
            >
              Select Inquiry Type ↓
            </button>
            <a
              href="https://cal.com/hifiveai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg"
            >
              Book 1-on-1 Demo →
            </a>
          </div>
        </div>
      </section>

      {/* ROUTING CARDS */}
      <section className="route-section">
        <div className="route-inner">
          <div className="route-header">
            <div className="eyebrow reveal">How Can We Help?</div>
            <h2 className="reveal d1">Select your <em>inquiry type.</em></h2>
            <p className="reveal d2">We route your message directly to the specialist team. No general inbox. No delays.</p>
          </div>
          <div className="route-grid stagger" id="routeGrid">
            {routes.map((r) => (
              <div key={r.id} className={`route-card ${activeRoute === r.id ? 'active' : ''}`} onClick={() => setActiveRoute(r.id)}>
                <div className="route-icon">{r.icon}</div>
                <div className="route-name">{r.name}</div>
                <div className="route-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMS */}
      <section className="form-section">
        <div className="form-inner">
          <div className="form-container">
            {/* Sales Form */}
            <div className={`form-panel ${activeRoute === 'sales' ? 'active' : ''}`}>
              {submittedForms.has('sales') ? (
                <div className="form-success visible">
                  <div className="form-success-icon">✅</div>
                  <h3>Demo Request Received</h3>
                  <p>We&apos;ll send you a calendar link within 2 business hours. In the meantime, explore the <a href="#" style={{ color: 'var(--gold)' }}>platform</a> or read about <a href="#" style={{ color: 'var(--gold)' }}>solutions for your role</a>.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleFormSubmit(e, 'sales')}>
                  <div className="form-title">Book a Demo</div>
                  <div className="form-subtitle">See HiFive AI through the lens of your specific role and challenges. 30 minutes. No slides - live product.</div>
                  {error && activeRoute === 'sales' && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
                  <div className="form-row"><div className="form-group"><label className="form-label">First Name</label><input className="form-input" type="text" name="firstName" placeholder="Jane" required /></div><div className="form-group"><label className="form-label">Last Name</label><input className="form-input" type="text" name="lastName" placeholder="Smith" required /></div></div>
                  <div className="form-group"><label className="form-label">Work Email</label><input className="form-input" type="email" name="email" placeholder="jane@company.com" required /></div>
                  <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" type="text" name="company" placeholder="Acme Corp" required /></div>
                  <div className="form-row"><div className="form-group"><label className="form-label">Company Size</label><select className="form-select" name="companySize" required><option value="">Select range</option><option>5–20 employees</option><option>21–50 employees</option><option>51–150 employees</option><option>151–500 employees</option><option>500+ employees</option></select></div><div className="form-group"><label className="form-label">Your Role</label><select className="form-select" name="role" required><option value="">Select role</option><option>CEO / Founder</option><option>CFO / Finance</option><option>CHRO / HR Leader</option><option>COO / Operations</option><option>VP / Director</option><option>Recruiter</option><option>IT / Engineering</option><option>Other</option></select></div></div>
                  <div className="form-group"><label className="form-label">What&apos;s your biggest people operations challenge?</label><textarea className="form-textarea" name="message" placeholder="Tell us about the specific problem you're trying to solve..."></textarea></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting === 'sales'}>{submitting === 'sales' ? 'Submitting...' : 'Request Demo →'}</button>
                  <div className="form-note">You&apos;ll receive a calendar link within 2 business hours. No sales pressure - just a focused product walkthrough tailored to your role.</div>
                </form>
              )}
            </div>

            {/* Support Form */}
            <div className={`form-panel ${activeRoute === 'support' ? 'active' : ''}`}>
              {submittedForms.has('support') ? (
                <div className="form-success visible">
                  <div className="form-success-icon">🎫</div>
                  <h3>Ticket Submitted</h3>
                  <p>Our support team will respond within 4 business hours. You&apos;ll receive a confirmation email with your ticket number.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleFormSubmit(e, 'support')}>
                  <div className="form-title">Technical Support</div>
                  <div className="form-subtitle">Existing customer? We respond within 4 hours during business hours. Include as much detail as possible.</div>
                  {error && activeRoute === 'support' && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
                  <div className="form-row"><div className="form-group"><label className="form-label">Name</label><input className="form-input" type="text" name="name" placeholder="Your name" required /></div><div className="form-group"><label className="form-label">Company</label><input className="form-input" type="text" name="company" placeholder="Company name" required /></div></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" name="email" placeholder="you@company.com" required /></div>
                  <div className="form-group"><label className="form-label">Category</label><select className="form-select" name="category" required><option value="">Select category</option><option>Bug Report</option><option>Feature Request</option><option>Integration Issue</option><option>Payroll Question</option><option>Compliance Question</option><option>Account / Access</option><option>Other</option></select></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" name="message" placeholder="Please describe the issue in detail. Include steps to reproduce, expected vs. actual behavior, and any relevant screenshots." required></textarea></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting === 'support'}>{submitting === 'support' ? 'Submitting...' : 'Submit Ticket →'}</button>
                  <div className="form-note">For urgent issues (payroll failures, access lockouts), email <a href="mailto:support@hifiveai.co" style={{ color: 'var(--gold)' }}>support@hifiveai.co</a> directly with &quot;URGENT&quot; in the subject line.</div>
                </form>
              )}
            </div>

            {/* Press Form */}
            <div className={`form-panel ${activeRoute === 'press' ? 'active' : ''}`}>
              {submittedForms.has('press') ? (
                <div className="form-success visible">
                  <div className="form-success-icon">📰</div>
                  <h3>Inquiry Received</h3>
                  <p>Our communications team will respond within 1 business day. For deadline-sensitive requests, we&apos;ll prioritize accordingly.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleFormSubmit(e, 'press')}>
                  <div className="form-title">Press &amp; Media</div>
                  <div className="form-subtitle">For media inquiries, interview requests, speaking engagements, and brand asset requests.</div>
                  {error && activeRoute === 'press' && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
                  <div className="form-row"><div className="form-group"><label className="form-label">Your Name</label><input className="form-input" type="text" name="name" placeholder="Full name" required /></div><div className="form-group"><label className="form-label">Publication</label><input className="form-input" type="text" name="publication" placeholder="Publication name" required /></div></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" name="email" placeholder="you@publication.com" required /></div>
                  <div className="form-group"><label className="form-label">Deadline</label><input className="form-input" type="date" name="deadline" /></div>
                  <div className="form-group"><label className="form-label">Inquiry Details</label><textarea className="form-textarea" name="message" placeholder="What are you working on? What perspective or information do you need?" required></textarea></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting === 'press'}>{submitting === 'press' ? 'Submitting...' : 'Submit Inquiry →'}</button>
                  <div className="form-note">For brand assets (logos, screenshots, executive headshots), visit our press kit. For urgent deadline requests, mark your deadline above and we&apos;ll prioritize accordingly.</div>
                </form>
              )}
            </div>

            {/* Partnerships Form */}
            <div className={`form-panel ${activeRoute === 'partnerships' ? 'active' : ''}`}>
              {submittedForms.has('partnerships') ? (
                <div className="form-success visible">
                  <div className="form-success-icon">🤝</div>
                  <h3>Proposal Received</h3>
                  <p>Our partnerships team will review your proposal and respond within 5 business days with next steps or follow-up questions.</p>
                </div>
              ) : (
                <form onSubmit={(e) => handleFormSubmit(e, 'partnerships')}>
                  <div className="form-title">Partnership Program</div>
                  <div className="form-subtitle">EOR partnerships, implementation consulting, integration development, and channel partnerships.</div>
                  {error && activeRoute === 'partnerships' && <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px', padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
                  <div className="form-row"><div className="form-group"><label className="form-label">Your Name</label><input className="form-input" type="text" name="name" placeholder="Full name" required /></div><div className="form-group"><label className="form-label">Company</label><input className="form-input" type="text" name="company" placeholder="Company name" required /></div></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" name="email" placeholder="you@company.com" required /></div>
                  <div className="form-group"><label className="form-label">Partnership Type</label><select className="form-select" name="partnershipType" required><option value="">Select type</option><option>EOR Partner</option><option>Implementation Consultant</option><option>Integration / API Partner</option><option>Channel / Reseller</option><option>Technology Alliance</option><option>Other</option></select></div>
                  <div className="form-group"><label className="form-label">Tell us about your business and proposed partnership</label><textarea className="form-textarea" name="message" placeholder="What geography do you cover? What's your customer base? How would a partnership create mutual value?" required></textarea></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting === 'partnerships'}>{submitting === 'partnerships' ? 'Submitting...' : 'Submit Proposal →'}</button>
                  <div className="form-note">All partnership proposals are reviewed by our business development team. Qualified proposals receive a response within 5 business days with next steps.</div>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="contact-sidebar">
              <div className="contact-sidebar-card">
                <div className="contact-sidebar-title">Direct Contact</div>
                <div className="contact-sidebar-item"><div className="contact-sidebar-icon">✉️</div><div><div className="contact-sidebar-label">General Inquiries</div><div className="contact-sidebar-val"><a href="mailto:hello@hifiveai.co">hello@hifiveai.co</a></div></div></div>
                <div className="contact-sidebar-item"><div className="contact-sidebar-icon">🎯</div><div><div className="contact-sidebar-label">Sales</div><div className="contact-sidebar-val"><a href="mailto:sales@hifiveai.co">sales@hifiveai.co</a></div></div></div>
                <div className="contact-sidebar-item"><div className="contact-sidebar-icon">🛠️</div><div><div className="contact-sidebar-label">Support</div><div className="contact-sidebar-val"><a href="mailto:support@hifiveai.co">support@hifiveai.co</a></div></div></div>
                <div className="contact-sidebar-item"><div className="contact-sidebar-icon">🤝</div><div><div className="contact-sidebar-label">Partnerships</div><div className="contact-sidebar-val"><a href="mailto:partners@hifiveai.co">partners@hifiveai.co</a></div></div></div>
              </div>
              <div className="contact-sidebar-card">
                <div className="contact-sidebar-title">Book Directly</div>
                <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}>Book on Cal.com →</a>
                <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, textAlign: 'center' }}>Skip the form. Pick a time directly on our calendar. 30-minute product walkthrough.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="faq-inner">
          <div className="faq-header">
            <div className="eyebrow reveal">Frequently Asked</div>
            <h2 className="reveal d1">Questions we get <em>before the demo.</em></h2>
          </div>
          <div className="faq-search reveal">
            <span className="faq-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              aria-label="Search frequently asked questions"
            />
          </div>
          <div className="faq-list reveal" id="faqList">
            {filteredFaqs.length === 0 && (
              <div className="faq-no-results">No questions match your search. Try different keywords.</div>
            )}
            {filteredFaqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <div className="faq-q" onClick={() => toggleFaq(i)}>
                  <span>{faq.q}</span>
                  <span className="faq-q-icon"><svg viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></span>
                </div>
                <div className="faq-a" style={{ maxHeight: openFaq === i ? '500px' : '0' }}>
                  <div className="faq-a-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="noise" />
        <div className="cta-glow" />
        <div className="cta-inner">
          <div className="eyebrow reveal">Prefer a Calendar?</div>
          <h2 className="reveal d1">Skip the form.<br />Book directly.</h2>
          <p className="reveal d2">Pick a 30-minute slot on our calendar. We&apos;ll tailor the demo to your specific role, challenges, and current tech stack.</p>
          <div className="cta-buttons reveal d3">
            <a href="https://cal.com/hifiveai" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg pulse">Open Cal.com →</a>
            <a href="mailto:hello@hifiveai.co" className="btn btn-outline-light btn-lg">hello@hifiveai.co</a>
          </div>
        </div>
      </section>
    </>
  );
}
