'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Clock,
  Share2,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ThumbsUp,
  BookOpen,
} from 'lucide-react';
import GlossaryTooltip from '@/components/hifive/GlossaryTooltip';

export interface GlossaryTerm {
  term: string;
  definition: string;
  extended?: string;
}

export interface ArticleContent {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  author: string;
  authorRole: string;
  publishDate: string;
  heroGradient: string;
  image: string;
  sections: { heading: string; body: string[] }[];
  keyTakeaways: string[];
  glossaryTerms?: GlossaryTerm[];
  nextArticle?: { id: string; title: string };
  prevArticle?: { id: string; title: string };
}

interface ArticleReaderModalProps {
  article: ArticleContent | null;
  onClose: () => void;
  onSelectArticle?: (id: string) => void;
}

const emptySubscribe = () => () => {};

export default function ArticleReaderModal({
  article,
  onClose,
  onSelectArticle,
}: ArticleReaderModalProps) {
  // SSR-safe mounted flag (returns false on server, true on client) without setState-in-effect
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [article]);

  // ESC + arrow key navigation
  useEffect(() => {
    if (!article) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && article.prevArticle && onSelectArticle) {
        onSelectArticle(article.prevArticle.id);
      }
      if (e.key === 'ArrowRight' && article.nextArticle && onSelectArticle) {
        onSelectArticle(article.nextArticle.id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [article, onClose, onSelectArticle]);

  const handleShare = useCallback(async () => {
    if (!article) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.description });
      } else {
        await navigator.clipboard.writeText(article.title);
      }
    } catch {
      /* user dismissed */
    }
  }, [article]);

  if (!mounted || !article) return null;

  return createPortal(
    <div
      className="article-reader-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-reader-title"
      onClick={onClose}
    >
      <div className="article-reader-backdrop" />
      <article
        className="article-reader-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <header className="article-reader-header">
          <div className="article-reader-header-left">
            <span className="article-reader-category">{article.category}</span>
            <span className="article-reader-time">
              <Clock size={12} />
              {article.readTime}
            </span>
          </div>
          <div className="article-reader-header-actions">
            <button
              type="button"
              className={`article-reader-icon-btn ${liked ? 'active' : ''}`}
              onClick={() => setLiked((v) => !v)}
              aria-label="Like article"
            >
              <ThumbsUp size={15} />
            </button>
            <button
              type="button"
              className={`article-reader-icon-btn ${bookmarked ? 'active' : ''}`}
              onClick={() => setBookmarked((v) => !v)}
              aria-label="Bookmark article"
            >
              <Bookmark size={15} />
            </button>
            <button
              type="button"
              className="article-reader-icon-btn"
              onClick={handleShare}
              aria-label="Share article"
            >
              <Share2 size={15} />
            </button>
            <button
              type="button"
              className="article-reader-close"
              onClick={onClose}
              aria-label="Close article"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="article-reader-body">
          {/* Hero */}
          <div
            className="article-reader-hero"
            style={{ background: article.heroGradient }}
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="article-reader-hero-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="article-reader-hero-overlay" />
            <div className="article-reader-hero-inner">
              <h1 id="article-reader-title">{article.title}</h1>
              <p className="article-reader-lede">{article.description}</p>
              <div className="article-reader-byline">
                <div className="article-reader-author-avatar">
                  {article.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="article-reader-author-name">{article.author}</div>
                  <div className="article-reader-author-meta">
                    {article.authorRole} · {article.publishDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div className="article-reader-content">
            {article.sections.map((section, idx) => (
              <section key={idx} className="article-reader-section">
                <h2>{section.heading}</h2>
                {section.body.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </section>
            ))}

            {/* Key takeaways */}
            {article.keyTakeaways.length > 0 && (
              <aside className="article-reader-takeaways">
                <div className="article-reader-takeaways-title">Key Takeaways</div>
                <ul>
                  {article.keyTakeaways.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Glossary terms */}
            {article.glossaryTerms && article.glossaryTerms.length > 0 && (
              <aside
                className="article-reader-glossary"
                style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#B07D2E',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  <BookOpen size={14} />
                  Key Terms
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {article.glossaryTerms.map((g, idx) => (
                    <li key={idx}>
                      <GlossaryTooltip term={g.term} definition={g.definition} extended={g.extended} />
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Action bar */}
            <div className="article-reader-actions-bar">
              <button
                type="button"
                className={`article-reader-action-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked((v) => !v)}
              >
                <ThumbsUp size={14} />
                {liked ? 'Helpful' : 'Mark as helpful'}
              </button>
              <button
                type="button"
                className={`article-reader-action-btn ${bookmarked ? 'bookmarked' : ''}`}
                onClick={() => setBookmarked((v) => !v)}
              >
                <Bookmark size={14} />
                {bookmarked ? 'Saved' : 'Save for later'}
              </button>
              <button
                type="button"
                className="article-reader-action-btn"
                onClick={handleShare}
              >
                <Share2 size={14} />
                Share
              </button>
            </div>

            {/* Prev / Next navigation */}
            <nav className="article-reader-nav">
              {article.prevArticle ? (
                <button
                  type="button"
                  className="article-reader-nav-btn prev"
                  onClick={() => onSelectArticle?.(article.prevArticle!.id)}
                >
                  <ArrowLeft size={14} />
                  <div>
                    <div className="article-reader-nav-label">Previous</div>
                    <div className="article-reader-nav-title">{article.prevArticle.title}</div>
                  </div>
                </button>
              ) : (
                <span />
              )}
              {article.nextArticle ? (
                <button
                  type="button"
                  className="article-reader-nav-btn next"
                  onClick={() => onSelectArticle?.(article.nextArticle!.id)}
                >
                  <div>
                    <div className="article-reader-nav-label">Next</div>
                    <div className="article-reader-nav-title">{article.nextArticle.title}</div>
                  </div>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </div>
      </article>
    </div>,
    document.body
  );
}
