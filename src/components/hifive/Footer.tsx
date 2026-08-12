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
