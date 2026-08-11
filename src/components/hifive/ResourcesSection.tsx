'use client';

import { useReveal } from '@/hooks/useReveal';
import { Clock } from 'lucide-react';
import { articles } from './articleContent';

interface ResourceMeta {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  badgeColor: { bg: string; text: string };
}

const resourceOrder: string[] = [
  'hr-stack-cost',
  'eor-guide',
  'novapay-case',
  'ask-ai-vs-chatgpt',
  'crypto-truth',
  'implementation-playbook',
];

const resources: ResourceMeta[] = resourceOrder.map((id) => {
  const a = articles[id];
  const colorMap: Record<string, { bg: string; text: string }> = {
    Blog: { bg: 'rgba(176,125,46,0.12)', text: '#B07D2E' },
    Guide: { bg: 'rgba(34,197,94,0.12)', text: '#16A34A' },
    'Case Study': { bg: 'rgba(59,130,246,0.12)', text: '#2563EB' },
    Whitepaper: { bg: 'rgba(139,92,246,0.12)', text: '#7C3AED' },
  };
  return {
    id: a.id,
    category: a.category,
    title: a.title,
    description: a.description,
    readTime: a.readTime,
    badgeColor: colorMap[a.category] ?? colorMap.Blog,
  };
});

export default function ResourcesSection() {
  useReveal();

  return (
    <section className="resources-section">
      <div className="resources-inner">
        <div className="resources-header">
          <div className="eyebrow reveal">Resources &amp; Insights</div>
          <h2 className="reveal">
            Knowledge that <em>moves</em> you forward.
          </h2>
          <p className="reveal">
            Deep dives, practical guides, and real-world case studies to help you
            build a smarter people stack. Click any card to read the full article.
          </p>
        </div>
        <div className="resources-grid stagger">
          {resources.map((resource) => (
            <a
              className="resource-card"
              key={resource.id}
              href={`/articles/${resource.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open article: ${resource.title}`}
            >
              <span
                className="resource-card-badge"
                style={{
                  backgroundColor: resource.badgeColor.bg,
                  color: resource.badgeColor.text,
                }}
              >
                {resource.category}
              </span>
              <h3 className="resource-card-title">{resource.title}</h3>
              <p className="resource-card-desc">{resource.description}</p>
              <div className="resource-card-footer">
                <span className="resource-card-time">
                  <Clock size={13} />
                  {resource.readTime}
                </span>
                <span className="resource-card-link">Read More →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
