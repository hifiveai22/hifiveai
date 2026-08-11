'use client';

import { useState, useEffect, useRef } from 'react';
import ModuleIcon, { type ModuleName } from './ModuleIcons';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface NavigationProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const intelligenceItem = {
  icon: '🧠',
  label: 'HiAI',
  desc: 'Reasoning engine & cross-module intelligence',
  page: 'platform' as PageId,
  moduleName: 'hiai' as ModuleName,
  sectionId: 'askai',
};

const moduleItems = [
  { icon: '🎯', label: 'HiTalent', desc: 'Talent acquisition & candidate intelligence', page: 'platform' as PageId, moduleName: 'hitalent' as ModuleName, sectionId: 'talent' },
  { icon: '👥', label: 'HiPeople', desc: 'People lifecycle, onboarding & performance', page: 'platform' as PageId, moduleName: 'hipeople' as ModuleName, sectionId: 'lifecycle' },
  { icon: '💸', label: 'HiPay', desc: 'Global payroll, compensation & rewards', page: 'platform' as PageId, moduleName: 'hipay' as ModuleName, sectionId: 'payroll' },
  { icon: '🌍', label: 'HiGlobal', desc: 'EOR, contractors & cross-border compliance', page: 'platform' as PageId, moduleName: 'higlobal' as ModuleName, sectionId: 'global' },
  { icon: '⚙️', label: 'HiOps', desc: 'Workspace, assets & IT operations', page: 'platform' as PageId, moduleName: 'hiops' as ModuleName, sectionId: 'operations' },
];

export default function Navigation({ activePage, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [darkNav, setDarkNav] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const hero = document.getElementById('hero') || document.querySelector('.resources-page-hero') || document.querySelector('.contact-hero');
      if (hero) {
        setDarkNav(window.scrollY < (hero as HTMLElement).offsetHeight - 100);
      } else {
        setDarkNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-toggle')) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
    setMegaOpen(false);
  };

  const handleNavClickWithScroll = (page: PageId, sectionId?: string) => {
    onNavigate(page);
    setMobileOpen(false);
    setMegaOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  };

  const navClass = [
    scrolled ? 'scrolled' : '',
    darkNav ? 'dark-nav' : '',
  ].filter(Boolean).join(' ');

  const pages: { id: PageId; label: string; mega?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'platform', label: 'Platform', mega: true },
    { id: 'solutions', label: 'Solutions' },
    { id: 'why', label: 'Advantage' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
  ];

  // Show keyboard hint on first hover of nav
  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let hintShown = false;
    const showHint = () => {
      if (hintShown) return;
      hintShown = true;
      let hint = document.querySelector('.kbd-hint') as HTMLElement;
      if (!hint) {
        hint = document.createElement('div');
        hint.className = 'kbd-hint';
        hint.innerHTML = 'Switch pages <span class="kbd">Alt</span><span class="kbd">1-6</span>';
        document.body.appendChild(hint);
      }
      requestAnimationFrame(() => hint.classList.add('visible'));
      setTimeout(() => hint.classList.remove('visible'), 4000);
    };
    nav.addEventListener('mouseenter', showHint, { once: true });
    return () => nav.removeEventListener('mouseenter', showHint);
  }, []);

  return (
    <>
      <nav id="nav" className={navClass}>
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
        >
          HiFive<span>AI</span>
        </a>

        <div className="nav-links">
          {pages.map((p) =>
            p.mega ? (
              <div
                className="nav-item"
                key={p.id}
                onMouseEnter={() => {
                  if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
                  setMegaOpen(true);
                }}
                onMouseLeave={() => {
                  megaTimeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
                }}
              >
                <button
                  className={`nav-link ${activePage === p.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(p.id)}
                >
                  {p.label}
                  <svg viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className={`nav-mega ${megaOpen ? 'open' : ''}`}>
                  <div className="nav-mega-inner">
                    <div className="nav-mega-section nav-mega-intelligence">
                      <div className="nav-mega-header">Intelligence Layer</div>
                      <button
                        className="nav-mega-item nav-mega-item-highlight"
                        onClick={() => handleNavClickWithScroll(intelligenceItem.page, intelligenceItem.sectionId)}
                      >
                        <span className="nav-mega-icon">
                          <ModuleIcon name={intelligenceItem.moduleName} size={20} />
                        </span>
                        <span>
                          <div className="nav-mega-label">{intelligenceItem.label}</div>
                          <div className="nav-mega-desc">{intelligenceItem.desc}</div>
                        </span>
                      </button>
                    </div>

                    <div className="nav-mega-divider" />

                    <div className="nav-mega-section nav-mega-modules">
                      <div className="nav-mega-header">Modules</div>
                      <div className="nav-mega-grid">
                        {moduleItems.map((m) => (
                          <button
                            key={m.label}
                            className="nav-mega-item"
                            onClick={() => handleNavClickWithScroll(m.page, m.sectionId)}
                          >
                            <span className="nav-mega-icon">
                              <ModuleIcon name={m.moduleName} size={20} />
                            </span>
                            <span>
                              <div className="nav-mega-label">{m.label}</div>
                              <div className="nav-mega-desc">{m.desc}</div>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="nav-item" key={p.id}>
                <button
                  className={`nav-link ${activePage === p.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(p.id)}
                >
                  {p.label}
                </button>
              </div>
            )
          )}
        </div>

        <a
          href="https://cal.com/hifiveai"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm nav-cta"
        >
          Book Free HR Audit →
        </a>

        <button
          className="mobile-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setMobileOpen(!mobileOpen);
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M1.5 3h12M1.5 7.5h12M1.5 12h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Menu
        </button>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {pages.map((p) => (
          <button
            key={p.id}
            className={`mobile-link ${activePage === p.id ? 'active' : ''}`}
            onClick={() => handleNavClick(p.id)}
          >
            {p.label}
          </button>
        ))}
        <div className="mobile-divider" />
        <a
          href="https://cal.com/hifiveai"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
        >
          Book Free HR Audit →
        </a>
      </div>
    </>
  );
}
