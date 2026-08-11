'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  size: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "We replaced five separate tools - HRIS, payroll, ATS, performance, and engagement - with HiFive AI. The consolidation alone saved us $120K a year, but the real win is having every people decision grounded in real-time data across all modules.",
    name: "Marcus Chen",
    title: "CEO",
    company: "NovaPay",
    size: "40 employees · 3 countries",
  },
  {
    quote: "Ask AI doesn't just answer questions - it reasons across modules. I asked about attrition risk in our nursing staff, and it correlated compensation data, shift patterns, and engagement scores in one response. That's impossible with separate systems.",
    name: "Dr. Amara Osei",
    title: "CHRO",
    company: "MedVista Health",
    size: "150 employees",
  },
  {
    quote: "Running payroll across four countries used to mean four vendors, four timelines, and four sets of compliance risk. HiFive AI unified it all. Month-end close went from five days to one, and we haven't had a single compliance flag since deployment.",
    name: "Lena Kowalski",
    title: "CFO",
    company: "CloudStack",
    size: "80 employees · 4 countries",
  },
  {
    quote: "Our ops team was drowning in manual workflows - onboarding checklists, asset provisioning, vendor coordination. HiFive AI automated 70% of it out of the box. My team now focuses on process improvement instead of process execution.",
    name: "Raj Patel",
    title: "COO",
    company: "CartBloom",
    size: "60 employees",
  },
  {
    quote: "Compliance across six jurisdictions is a nightmare with spreadsheets and point solutions. HiFive AI keeps us audit-ready 365 days a year. When local labor law changes, the system flags it before our legal team even hears about it.",
    name: "Ingrid Svensson",
    title: "VP People",
    company: "Meridian Consulting",
    size: "200 employees · 6 countries",
  },
  {
    quote: "The API-first architecture sealed it for us. We connected HiFive AI to our existing finance stack and identity provider in under a week. Webhooks, SCIM provisioning, SSO - it just works. This is how enterprise software should be built.",
    name: "Tomás Reyes",
    title: "CTO",
    company: "Stratos Labs",
    size: "120 employees",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const maxIndex = Math.max(0, testimonials.length - getCardsPerView());

  const scrollToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
    if (scrollRef.current) {
      const card = scrollRef.current.children[clamped] as HTMLElement;
      if (card) {
        scrollRef.current.scrollTo({
          left: card.offsetLeft - (scrollRef.current.offsetLeft || 0),
          behavior: 'smooth',
        });
      }
    }
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex >= maxIndex) {
      scrollToIndex(0);
    } else {
      scrollToIndex(activeIndex + 1);
    }
  }, [activeIndex, maxIndex, scrollToIndex]);

  // Autoplay
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        if (scrollRef.current) {
          const card = scrollRef.current.children[next] as HTMLElement;
          if (card) {
            scrollRef.current.scrollTo({
              left: card.offsetLeft - (scrollRef.current.offsetLeft || 0),
              behavior: 'smooth',
            });
          }
        }
        return next;
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, maxIndex]);

  // Sync active index on manual scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth || 300;
    const gap = 24;
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex <= maxIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, maxIndex]);

  // Update maxIndex on resize
  useEffect(() => {
    const handleResize = () => {
      const newMax = Math.max(0, testimonials.length - getCardsPerView());
      if (activeIndex > newMax) {
        setActiveIndex(newMax);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, getCardsPerView]);

  return (
    <section
      className="testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonials-inner">
        <div className="testimonials-header reveal">
          <div className="eyebrow">Trusted by Leaders</div>
          <h2>
            What our customers <em>actually say.</em>
          </h2>
          <p>
            Real teams, real results. Here&apos;s how HiFive AI is transforming people operations across industries and geographies.
          </p>
        </div>

        <div className="testimonials-carousel-wrap">
          <button
            className="testimonials-nav testimonials-nav-prev"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="testimonials-track"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-quote-mark">&ldquo;</div>
                <blockquote className="testimonial-quote">{t.quote}</blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">
                      {t.title}, {t.company}
                    </div>
                  </div>
                  <div className="testimonial-size-badge">{t.size}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="testimonials-nav testimonials-nav-next"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="testimonials-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`testimonials-dot ${i === activeIndex ? 'is-active' : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to testimonial group ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
