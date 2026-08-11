'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './ScrollTypography.css';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface ScrollTypographyProps {
  onNavigate?: (page: PageId) => void;
}

interface HeadingData {
  text: string;
  icon: string;
  description: string;
}

const headings: HeadingData[] = [
  {
    text: 'Make informed data backed decisions like never before.',
    icon: '🧠',
    description:
      'HiAI turns raw data across every module into actionable decisions - no dashboards to stare at, just answers when you need them.',
  },
  {
    text: 'Five modules. One intelligence layer.',
    icon: '🔗',
    description:
      'HiTalent, HiPeople, HiPay, HiGlobal, and HiOps are connected by HiAI: a single reasoning engine so every insight is cross-functional by default.',
  },
  {
    text: 'Hire anywhere. Comply everywhere.',
    icon: '🌍',
    description:
      'HiGlobal handles employer-of-record, contractor compliance, and local labor law - so you can hire in 190+ countries without a local entity.',
  },
  {
    text: 'Every transition. One workflow.',
    icon: '👥',
    description:
      'From candidate → employee → alumni, HiPeople orchestrates the full lifecycle - onboarding, performance, offboarding - in one continuous flow.',
  },
  {
    text: 'Accurate payroll. Every country.',
    icon: '💸',
    description:
      'HiPay calculates, validates, and disburses payroll in local currency and compliance - eliminating the spreadsheet chaos of multi-country pay runs.',
  },
  {
    text: 'Workspace, assets, IT. One operational layer.',
    icon: '⚙️',
    description:
      'HiOps unifies equipment provisioning, IT requests, and facility management - so nothing falls between departments.',
  },
  {
    text: 'The cryptographic source of truth.',
    icon: '🔐',
    description:
      'Every record, decision, and transaction is immutably anchored - giving you an audit trail that regulators and auditors trust by default.',
  },
];

export default function ScrollTypography({ onNavigate }: ScrollTypographyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Calculate which heading is active based on scroll position
  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const totalScrollDistance = section.offsetHeight - viewportHeight;

    // How far we've scrolled into the section (0 → 1)
    const scrolledInto = Math.max(0, -rect.top) / totalScrollDistance;
    const clamped = Math.min(Math.max(scrolledInto, 0), 1);

    // Map scroll progress to heading index
    const newIndex = Math.min(
      Math.floor(clamped * headings.length),
      headings.length - 1
    );

    setActiveIndex(newIndex);
    setProgress(clamped);
  }, []);

  useEffect(() => {
    // Use IntersectionObserver to only listen to scroll when section is visible
    let ticking = false;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        // Trigger an immediate calculation when visibility changes
        if (isVisible) {
          handleScroll();
        }
      },
      { threshold: 0, rootMargin: '-10% 0px -10% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const onScroll = () => {
      if (!isVisible) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [handleScroll]);

  // Determine heading class based on distance from active
  const getHeadingClass = (index: number) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return 'scroll-typo-heading scroll-typo-heading--active';
    if (distance === 1) return 'scroll-typo-heading scroll-typo-heading--adjacent';
    return 'scroll-typo-heading';
  };

  // Determine preview card class
  const getPreviewClass = (index: number) => {
    if (index === activeIndex)
      return 'scroll-typo-preview-card scroll-typo-preview-card--active';
    return 'scroll-typo-preview-card';
  };

  return (
    <section ref={sectionRef} className="scroll-typo-section">
      <div className="scroll-typo-inner">
        <div className="scroll-typo-sticky">
          <div className="scroll-typo-layout">
            {/* Left column - heading stack */}
            <div className="scroll-typo-heading-col">
              {headings.map((heading, index) => (
                <h2 key={index} className={getHeadingClass(index)}>
                  {heading.text}
                </h2>
              ))}
            </div>

            {/* Right column - preview cards */}
            <div className="scroll-typo-preview-col">
              {headings.map((heading, index) => (
                <div key={index} className={getPreviewClass(index)}>
                  <span className="scroll-typo-preview-icon">{heading.icon}</span>
                  <p className="scroll-typo-preview-desc">{heading.description}</p>
                  <button
                    type="button"
                    className="scroll-typo-preview-link"
                    onClick={() => onNavigate?.('platform')}
                    aria-label={`Learn more about: ${heading.text}`}
                  >
                    Learn more
                    <span className="scroll-typo-preview-link-arrow">→</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="scroll-typo-progress" aria-hidden="true">
              <div
                className="scroll-typo-progress-fill"
                style={{ height: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
