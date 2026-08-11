'use client';

import Link from 'next/link';
import { type PageId } from '@/lib/routes';

interface FooterProps {
  onNavigate?: (page: PageId, sectionId?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <Link href="/" className="footer-brand-name">
            HiFive<span>AI</span>
          </Link>
          <p className="footer-brand-desc">
            The AI-native People Operating System for the modern enterprise. Five
            interconnected modules. One continuously learning intelligence layer.
          </p>
          <div className="footer-geo">
            <span className="footer-geo-pill">🇦🇪 UAE</span>
            <span className="footer-geo-pill">🇬🇧 United Kingdom</span>
            <span className="footer-geo-pill">🇸🇬 Singapore</span>
            <span className="footer-geo-pill">🇮🇳 India</span>
            <span className="footer-geo-pill">🇺🇸 United States</span>
            <span className="footer-geo-pill">🌐 Global</span>
          </div>
          <div className="footer-social">
            <a href="https://linkedin.com/company/hifiveai" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://twitter.com/hifiveai" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter / X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
            </a>
            <a href="https://github.com/hifiveai" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Platform</div>
          <Link href="/platform#askai" className="footer-col-link" onClick={() => onNavigate?.('platform', 'askai')}>
            HiAI
          </Link>
          <Link href="/platform#talent" className="footer-col-link" onClick={() => onNavigate?.('platform', 'talent')}>
            HiTalent
          </Link>
          <Link href="/platform#lifecycle" className="footer-col-link" onClick={() => onNavigate?.('platform', 'lifecycle')}>
            HiPeople
          </Link>
          <Link href="/platform#payroll" className="footer-col-link" onClick={() => onNavigate?.('platform', 'payroll')}>
            HiPay
          </Link>
          <Link href="/platform#global" className="footer-col-link" onClick={() => onNavigate?.('platform', 'global')}>
            HiGlobal
          </Link>
          <Link href="/platform#operations" className="footer-col-link" onClick={() => onNavigate?.('platform', 'operations')}>
            HiOps
          </Link>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <Link href="/solutions" className="footer-col-link" onClick={() => onNavigate?.('solutions')}>
            Solutions
          </Link>
          <Link href="/advantage" className="footer-col-link" onClick={() => onNavigate?.('advantage')}>
            Advantage
          </Link>
          <Link href="/resources" className="footer-col-link" onClick={() => onNavigate?.('resources')}>
            Resources
          </Link>
          <Link href="/contact" className="footer-col-link" onClick={() => onNavigate?.('contact')}>
            Contact
          </Link>
        </div>
        <div>
          <div className="footer-col-title">Get Started</div>
          <a
            href="https://cal.com/hifiveai"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-col-link"
          >
            Book Free HR Audit
          </a>
          <a href="mailto:hello@hifiveai.co" className="footer-col-link">
            hello@hifiveai.co
          </a>
          <a
            href="https://linkedin.com/company/hifiveai"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-col-link"
          >
            LinkedIn
          </a>
          <a
            href="https://hifiveai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-col-link"
          >
            hifiveai.co
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-bottom-copy">
          © 2026 HiFive AI. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" className="footer-bottom-link">
            Privacy Policy
          </a>
          <a href="#" className="footer-bottom-link">
            Terms
          </a>
          <a href="#" className="footer-bottom-link">
            Security
          </a>
        </div>
      </div>
    </footer>
  );
}
