'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navigation from '@/components/hifive/Navigation';
import Footer from '@/components/hifive/Footer';
import FloatingCTA from '@/components/hifive/FloatingCTA';
import ScrollBar from '@/components/hifive/ScrollBar';
import BackToTop from '@/components/hifive/BackToTop';
import PageTransition from '@/components/hifive/PageTransition';
import CookieConsent from '@/components/hifive/CookieConsent';
import AskAIChat from '@/components/hifive/AskAIChat';
import NewsletterSignup from '@/components/hifive/NewsletterSignup';
import CommandPalette from '@/components/hifive/CommandPalette';
import FeatureTour from '@/components/hifive/FeatureTour';
import HomePage from '@/components/hifive/HomePage';
import PlatformPage from '@/components/hifive/PlatformPage';
import SolutionsPage from '@/components/hifive/SolutionsPage';
import WhyPage from '@/components/hifive/WhyPage';
import ContactPage from '@/components/hifive/ContactPage';
import ResourcesPage from '@/components/hifive/ResourcesPage';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

const breadcrumbLabels: Record<PageId, string> = {
  home: 'Home',
  platform: 'Platform',
  solutions: 'Solutions',
  why: 'Why HiFive',
  contact: 'Contact',
  resources: 'Resources',
};

function getBreadcrumbSchema(pageId: PageId) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://hifiveai.co",
    },
  ];

  if (pageId !== 'home') {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: breadcrumbLabels[pageId],
      item: `https://hifiveai.co/${pageId}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export default function HiFiveAI() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef<NodeJS.Timeout | null>(null);

  const handleNavigate = useCallback((page: PageId) => {
    if (page === activePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTransitioning(true);

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setActivePage(page);
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTransitioning(false);
    }, 300);
  }, [activePage]);

  // Scroll to top when activePage changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activePage]);

  // Re-initialize reveals when page changes
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const elements = document.querySelectorAll(
      '.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur,.stagger,.gold-underline,.reveal-scale-up,.reveal-fade'
    );

    // Make elements near/in viewport visible immediately
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('visible');
      }
    });

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              if (observer) observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0 }
      );

      elements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          observer?.observe(el);
        }
      });
    }, 50);

    // Fallback safety timer to ensure all content becomes visible on mobile
    const fallbackTimer = setTimeout(() => {
      elements.forEach((el) => el.classList.add('visible'));
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      if (observer) observer.disconnect();
    };
  }, [activePage]);

  // Keyboard navigation (Alt+1 through Alt+6)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const pages: PageId[] = ['home', 'platform', 'solutions', 'why', 'contact', 'resources'];
        const idx = parseInt(e.key) - 1;
        if (pages[idx]) handleNavigate(pages[idx]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNavigate]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'platform':
        return <PlatformPage onNavigate={handleNavigate} />;
      case 'solutions':
        return <SolutionsPage onNavigate={handleNavigate} />;
      case 'why':
        return <WhyPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'resources':
        return <ResourcesPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema(activePage)),
        }}
      />
      <ScrollBar />
      <Navigation activePage={activePage} onNavigate={handleNavigate} />
      <main className="flex-1">
        <div key={activePage} className={transitioning ? 'page-fading-out' : 'page-fading-in'}>
          {renderPage()}
        </div>
        <NewsletterSignup />
      </main>
      <Footer onNavigate={handleNavigate} />
      <FloatingCTA />
      <BackToTop />
      <PageTransition active={transitioning} />
      <CookieConsent />
      <AskAIChat />
      <CommandPalette onNavigate={handleNavigate} />
      <FeatureTour />
    </div>
  );
}
