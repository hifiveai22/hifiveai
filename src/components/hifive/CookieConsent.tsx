'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hifive-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay for the page to load before showing banner
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setDismissed(true);
    // Wait for animation to finish before hiding
    setTimeout(() => setVisible(false), 400);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setDismissed(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`cookie-consent ${dismissed ? 'cookie-consent--dismissing' : 'cookie-consent--visible'}`}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="cookie-consent-inner">
        <div className="cookie-consent-content">
          <p>
            We use cookies to enhance your experience and analyze site traffic. By clicking &ldquo;Accept All,&rdquo; you consent to our use of cookies.{' '}
            <a href="#" className="cookie-consent-link">Learn more</a>
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button className="btn btn-primary cookie-consent-accept" onClick={handleAccept}>
            Accept All
          </button>
          <button className="btn btn-ghost cookie-consent-decline" onClick={handleDecline}>
            Decline Non-Essential
          </button>
        </div>
      </div>
    </div>
  );
}
