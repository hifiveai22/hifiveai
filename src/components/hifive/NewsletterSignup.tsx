'use client';

import { useState, useRef, FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react';
import NewsletterCount from './NewsletterCount';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    // Abort any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'footer' }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.success) {
        setStatus('success');
        setMessage("You're subscribed! Check your inbox.");
        setEmail('');
        return;
      }

      setStatus('error');
      setMessage(
        data?.error ||
          'Something went wrong. Please try again in a moment.'
      );
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-heading">
      <div className="newsletter-inner">
        <div className="newsletter-content">
          <h2 id="newsletter-heading">
            Stay <em>ahead of the curve.</em>
          </h2>
          <p>
            Get weekly insights on AI-native people operations, compliance
            updates, and product news.
          </p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <NewsletterCount />
          <div className="newsletter-input-row">
            <div style={{ position: 'relative', flex: 1 }}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Mail
                size={16}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error' || status === 'success') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                disabled={status === 'loading' || status === 'success'}
                className="newsletter-input"
                style={{ paddingLeft: 38 }}
                aria-invalid={status === 'error'}
                aria-describedby="newsletter-message"
              />
            </div>
            <button
              type="submit"
              className="newsletter-btn"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                    style={{ display: 'inline', marginRight: 6 }}
                    aria-hidden="true"
                  />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          <p className="newsletter-privacy">
            No spam. Unsubscribe anytime.
          </p>

          {(status === 'success' || status === 'error') && message && (
            <div
              id="newsletter-message"
              role={status === 'error' ? 'alert' : 'status'}
              className={`newsletter-message ${status}`}
            >
              {status === 'success' ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : (
                <AlertCircle size={16} aria-hidden="true" />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
