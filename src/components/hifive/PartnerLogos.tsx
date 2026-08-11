'use client';

import { useState, useRef } from 'react';

interface LogoItem {
  name: string;
  color: string;
}

const partners: LogoItem[] = [
  { name: 'Slack', color: '#E01E5A' },
  { name: 'BambooHR', color: '#73C41D' },
  { name: 'Greenhouse', color: '#2DA44E' },
  { name: 'LinkedIn', color: '#0A66C2' },
  { name: 'Okta', color: '#007DC1' },
  { name: 'DocuSign', color: '#FFD700' },
  { name: 'Xero', color: '#13B5EA' },
  { name: 'QuickBooks', color: '#2CA01C' },
  { name: 'Gusto', color: '#F45D48' },
  { name: 'Rippling', color: '#6B47ED' },
  { name: 'Workday', color: '#F26522' },
  { name: 'SAP', color: '#0FAAFF' },
  { name: 'Salesforce', color: '#00A1E0' },
  { name: 'Jira', color: '#0052CC' },
  { name: 'HubSpot', color: '#FF7A59' },
  { name: 'Zoom', color: '#2D8CFF' },
  { name: 'Notion', color: '#000000' },
  { name: 'Stripe', color: '#635BFF' },
];

export default function PartnerLogos() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <section className="partner-section">
      <div className="partner-inner">
        <div className="partner-header">
          <div className="eyebrow">Integrations &amp; Partners</div>
          <p>Connects with the tools you already use.</p>
        </div>
        <div
          className="partner-marquee-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); setHoveredIndex(null); }}
        >
          <div
            ref={marqueeRef}
            className="partner-marquee"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {[...partners, ...partners, ...partners].map((partner, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  className="partner-logo"
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                    opacity: isHovered ? 1 : 0.55,
                    color: isHovered ? partner.color : 'inherit',
                    transition: 'filter 0.4s ease, opacity 0.4s ease, color 0.4s ease',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    cursor: 'default',
                  }}
                >
                  {partner.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="partner-accent-line" />
      </div>
    </section>
  );
}
