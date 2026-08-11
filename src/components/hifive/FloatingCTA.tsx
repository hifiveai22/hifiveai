'use client';

import { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`floating-cta ${visible ? 'visible' : ''}`}>
      <a
        href="https://cal.com/hifiveai"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-gold btn-sm"
        style={{ boxShadow: '0 8px 32px rgba(176,125,46,.35)' }}
      >
        Book Free HR Audit →
      </a>
    </div>
  );
}
