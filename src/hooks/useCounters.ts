'use client';

import { useEffect } from 'react';

export function useCounters() {
  useEffect(() => {
    let rafId: number | null = null;
    let scrollHandler: (() => void) | null = null;

    const animateCounters = () => {
      document.querySelectorAll('[data-count]').forEach((el) => {
        const element = el as HTMLElement;
        if ((element as any)._counted) return;

        const target = parseFloat(element.dataset.count || '0');
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        const dur = 1800;
        const start = performance.now();
        (element as any)._counted = true;

        function step(now: number) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          const val =
            target % 1 === 0
              ? Math.round(ease * target)
              : (ease * target).toFixed(1);
          element.textContent = prefix + val + suffix;
          if (p < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    };

    const isElementInViewport = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return rect.top <= windowHeight * 0.85 && rect.bottom >= 0;
    };

    const checkAndAnimate = () => {
      let anyVisible = false;
      document.querySelectorAll('[data-count]').forEach((el) => {
        if (!(el as any)._counted && isElementInViewport(el)) {
          anyVisible = true;
        }
      });
      if (anyVisible) {
        animateCounters();
      }
    };

    // Check immediately (delayed for DOM ready)
    const initialTimer = setTimeout(checkAndAnimate, 200);

    // Check on scroll
    scrollHandler = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkAndAnimate);
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Also use IntersectionObserver as backup
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
    );

    const counters = document.querySelectorAll('[data-count]');
    counters.forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(initialTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
      observer.disconnect();
    };
  }, []);
}
