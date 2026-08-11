'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';
import ScrollBar from './ScrollBar';
import BackToTop from './BackToTop';
import CookieConsent from './CookieConsent';
import AskAIChat from './AskAIChat';
import NewsletterSignup from './NewsletterSignup';
import CommandPalette from './CommandPalette';
import FeatureTour from './FeatureTour';
import { PAGE_ROUTES, type PageId } from '@/lib/routes';

const breadcrumbLabels: Record<string, string> = {
  home: 'Home',
  platform: 'Platform',
  solutions: 'Solutions',
  why: 'Advantage',
  advantage: 'Advantage',
  contact: 'Contact',
  resources: 'Resources',
};

function getBreadcrumbSchema(pageId: string) {
  const canonicalPath = PAGE_ROUTES[pageId] || '/';
  const items: any[] = [
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
      name: breadcrumbLabels[pageId] || pageId,
      item: `https://hifiveai.co${canonicalPath}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export default function MainLayout({
  activePage,
  children,
}: {
  activePage: PageId;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleNavigate = (page: PageId | string, sectionId?: string) => {
    const targetRoute = PAGE_ROUTES[page] || '/';
    if (sectionId) {
      router.push(`${targetRoute}#${sectionId}`);
    } else {
      router.push(targetRoute);
    }
  };

  // Scroll to top on fresh page mount without hash
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activePage]);

  // Handle hash scrolling when mounting or route changing
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.substring(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

  // Re-initialize reveals when page changes
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const elements = document.querySelectorAll(
      '.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur,.stagger,.gold-underline,.reveal-scale-up,.reveal-fade'
    );

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
        const pages: PageId[] = ['home', 'platform', 'solutions', 'advantage', 'resources', 'contact'];
        const idx = parseInt(e.key) - 1;
        if (pages[idx]) handleNavigate(pages[idx]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
        <div key={activePage} className="page-fading-in">
          {children}
        </div>
        <NewsletterSignup />
      </main>
      <Footer onNavigate={handleNavigate} />
      <FloatingCTA />
      <BackToTop />
      <CookieConsent />
      <AskAIChat />
      <CommandPalette onNavigate={handleNavigate} />
      <FeatureTour />
    </div>
  );
}
