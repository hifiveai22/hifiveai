'use client';

import { useEffect, useRef } from 'react';

export function useReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const initReveal = () => {
      if (observerRef.current) observerRef.current.disconnect();

      const elements = document.querySelectorAll(
        '.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur,.stagger,.gold-underline,.reveal-scale-up,.reveal-fade'
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('visible');
        }
      });

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0 }
      );

      elements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          observerRef.current?.observe(el);
        }
      });
    };

    const timer = setTimeout(initReveal, 50);
    const fallback = setTimeout(() => {
      document.querySelectorAll(
        '.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur,.stagger,.gold-underline,.reveal-scale-up,.reveal-fade'
      ).forEach((el) => el.classList.add('visible'));
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);
}
