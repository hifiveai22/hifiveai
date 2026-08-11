'use client';

import { useState, useEffect } from 'react';

export default function ScrollBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const p =
        window.scrollY /
        (document.body.scrollHeight - window.innerHeight);
      setWidth(Math.min(p, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="scroll-bar"
      style={{ width: `${width}%` }}
    />
  );
}
