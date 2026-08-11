'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticle } from '@/lib/getArticle';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  ThumbsUp,
  BookOpen,
} from 'lucide-react';
import GlossaryTooltip from '@/components/hifive/GlossaryTooltip';
import Footer from '@/components/hifive/Footer';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function DedicatedArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  const article = getArticle(id);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="sap-page">
        <header className="sap-header">
          <div className="sap-header-brand">
            <Link href="/" className="sap-logo">
              HiFive<span>.ai</span>
            </Link>
          </div>
          <a href="/#resources" className="sap-back-link">
            <ArrowLeft size={16} /> Back to Resources
          </a>
        </header>
        <main className="sap-main" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Article Not Found</h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '32px' }}>
            The article you are looking for does not exist or may have been moved.
          </p>
          <a href="/#resources" className="btn btn-gold">
            Browse All Articles →
          </a>
        </main>
        <Footer onNavigate={(page) => { window.location.href = `/#${page}`; }} />
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.description });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Article link copied to clipboard!');
      }
    } catch {
      /* user dismissed */
    }
  };

  const authorInitials = article.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="sap-page">
      {/* Sticky Navigation Header */}
      <header className="sap-header">
        <div className="sap-header-brand">
          <Link href="/" className="sap-logo">
            HiFive<span>.ai</span>
          </Link>
          <span className="sap-header-divider" />
          <a href="/#resources" className="sap-back-link">
            <ArrowLeft size={16} /> Back to Resources
          </a>
          <span className="sap-category-pill">{article.category}</span>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className={`sap-action-btn ${liked ? 'active' : ''}`}
            onClick={() => setLiked((v) => !v)}
            title="Like article"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            type="button"
            className={`sap-action-btn ${bookmarked ? 'active' : ''}`}
            onClick={() => setBookmarked((v) => !v)}
            title="Bookmark article"
          >
            <Bookmark size={16} />
          </button>
          <button
            type="button"
            className="sap-action-btn"
            onClick={handleShare}
            title="Share article"
          >
            <Share2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Centered Content Container */}
      <main className="sap-main">
        {/* Editorial Hero Banner */}
        <div
          className="sap-hero"
          style={{ background: article.heroGradient || 'linear-gradient(135deg, #18140F 0%, #383026 100%)' }}
        >
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="sap-hero-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="sap-hero-overlay" />
          <div className="sap-hero-content">
            <div className="sap-hero-meta">
              <span className="sap-hero-meta-badge">{article.category}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={13} /> {article.readTime}
              </span>
            </div>
            <h1 className="sap-hero-title">{article.title}</h1>
            <p className="sap-hero-desc">{article.description}</p>

            <div className="sap-hero-author">
              <div className="sap-author-avatar">{authorInitials}</div>
              <div>
                <div className="sap-author-name">{article.author}</div>
                <div className="sap-author-sub">
                  {article.authorRole} • {article.publishDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <article className="sap-body">
          {article.sections.map((section, idx) => (
            <section key={idx} className="sap-section">
              <h2 className="sap-section-h2">{section.heading}</h2>
              {section.body.map((para, pIdx) => (
                <p key={pIdx} className="sap-p">
                  {para}
                </p>
              ))}
            </section>
          ))}

          {/* Key Takeaways Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="sap-takeaways">
              <div className="sap-takeaways-title">
                ✦ Key Takeaways
              </div>
              <ul className="sap-takeaways-list">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="sap-takeaways-item">
                    <span className="sap-takeaways-bullet">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Glossary Terms Box */}
          {article.glossaryTerms && article.glossaryTerms.length > 0 && (
            <div className="sap-glossary">
              <div className="sap-glossary-title">
                <BookOpen size={15} /> Key Glossary Terms
              </div>
              <div className="sap-glossary-chips">
                {article.glossaryTerms.map((g, idx) => (
                  <GlossaryTooltip
                    key={idx}
                    term={g.term}
                    definition={g.definition}
                    extended={g.extended}
                  />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Prev / Next Article Navigation Cards */}
        <nav className="sap-nav">
          {article.prevArticle ? (
            <a
              href={`/articles/${article.prevArticle.id}`}
              className="sap-nav-card prev"
            >
              <ArrowLeft size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div className="sap-nav-label">Previous Article</div>
                <div className="sap-nav-title">{article.prevArticle.title}</div>
              </div>
            </a>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {article.nextArticle && (
            <a
              href={`/articles/${article.nextArticle.id}`}
              className="sap-nav-card next"
            >
              <div style={{ minWidth: 0 }}>
                <div className="sap-nav-label">Next Article</div>
                <div className="sap-nav-title">{article.nextArticle.title}</div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
            </a>
          )}
        </nav>
      </main>

      {/* Footer */}
      <Footer onNavigate={(page) => { window.location.href = `/#${page}`; }} />
    </div>
  );
}
