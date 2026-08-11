'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Clock, Calendar, Search, ArrowRight, X, RefreshCw } from 'lucide-react';
import { newsArticles } from './newsArticles';
import './ResourcesPage.css';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface ResourcesPageProps {
  onNavigate?: (page: PageId) => void;
}

/* ── Derive unique categories from data ── */

const DATA_CATEGORIES = [...new Set(newsArticles.map((a) => a.category))].sort();

const CATEGORIES = ['All', ...DATA_CATEGORIES] as const;

type Category = (typeof CATEGORIES)[number];

/* ── Category style mapping ── */

interface CategoryStyle {
  bg: string;
  text: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Company News':      { bg: 'rgba(176,125,46,0.12)',  text: '#B07D2E' },
  'AI in HR':          { bg: 'rgba(139,92,246,0.12)',  text: '#7C3AED' },
  'Hiring Trends':     { bg: 'rgba(249,115,22,0.12)',  text: '#EA580C' },
  'Product Updates':   { bg: 'rgba(34,197,94,0.12)',   text: '#16A34A' },
  'Industry News':     { bg: 'rgba(59,130,246,0.12)',  text: '#2563EB' },
  'Compliance & HR Laws': { bg: 'rgba(239,68,68,0.12)', text: '#DC2626' },
  'Research Reports':  { bg: 'rgba(168,85,247,0.12)',  text: '#9333EA' },
  'Customer Stories':  { bg: 'rgba(14,165,233,0.12)',  text: '#0284C7' },
  // Fallbacks for any task-specified categories that might appear
  'Product Update':    { bg: 'rgba(34,197,94,0.12)',   text: '#16A34A' },
  'Industry Analysis': { bg: 'rgba(59,130,246,0.12)',  text: '#2563EB' },
  'Compliance':        { bg: 'rgba(239,68,68,0.12)',   text: '#DC2626' },
  'Case Study':        { bg: 'rgba(14,165,233,0.12)',  text: '#0284C7' },
  'Guide':             { bg: 'rgba(34,197,94,0.12)',   text: '#16A34A' },
  'Research':          { bg: 'rgba(168,85,247,0.12)',  text: '#9333EA' },
  'Technology':        { bg: 'rgba(6,182,212,0.12)',   text: '#0891B2' },
  'Trends':            { bg: 'rgba(249,115,22,0.12)',  text: '#EA580C' },
  'Market Report':     { bg: 'rgba(236,72,153,0.12)',  text: '#DB2777' },
  'Ethics':            { bg: 'rgba(245,158,11,0.12)',  text: '#D97706' },
  'Funding':           { bg: 'rgba(16,185,129,0.12)',  text: '#059669' },
};

const DEFAULT_STYLE: CategoryStyle = { bg: 'rgba(176,125,46,0.12)', text: '#B07D2E' };

const ITEMS_PER_PAGE = 12;

/* ── Component ── */

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  useReveal();

  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Filtered & paginated articles ── */

  const filteredArticles = useMemo(() => {
    let result = [...newsArticles];

    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchTerm]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  /* ── Handlers ── */

  const handleCategoryChange = useCallback((cat: Category) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveCategory('All');
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  /* ── Render ── */

  return (
    <>
      {/* HERO */}
      <section id="hero" className="resources-page-hero">
        <div className="resources-page-hero-glow" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow reveal">Resources &amp; Insights</div>
          <h1 className="reveal d1">
            Knowledge that <em>moves</em> you forward.
          </h1>
          <p className="reveal d2">
            Deep dives, practical guides, real-world case studies, and industry
            analysis - articles to help you build a smarter people stack.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="resources-page-content">
        <div className="resources-page-inner">
          {/* Category Filters */}
          <div className="resources-page-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`resources-page-filter-btn ${
                  activeCategory === cat ? 'active' : ''
                }`}
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toolbar: Search + Count */}
          <div className="resources-page-toolbar">
            <div className="resources-page-search-wrap">
              <Search className="resources-page-search-icon" />
              <input
                type="text"
                className="resources-page-search-input"
                placeholder="Search articles by title or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search articles"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="resources-page-count">
              Showing{' '}
              <strong>{paginatedArticles.length}</strong>{' '}
              of <strong>{filteredArticles.length}</strong> articles
              {activeCategory !== 'All' && (
                <span style={{ marginLeft: 8, color: 'var(--gold)' }}>
                  in {activeCategory}
                </span>
              )}
            </div>
          </div>

          {/* Article Grid or Empty State */}
          {paginatedArticles.length > 0 ? (
            <>
              <div className="resources-page-grid stagger">
                {paginatedArticles.map((article) => {
                  const catStyle = CATEGORY_STYLES[article.category] ?? DEFAULT_STYLE;
                  return (
                    <a
                      href={`/articles/${article.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resources-page-card"
                      key={article.id}
                      aria-label={`Open article: ${article.title}`}
                    >
                      {/* Top: badge + emoji icon */}
                      <div className="resources-page-card-top">
                        <span
                          className="resources-page-card-badge"
                          style={{
                            backgroundColor: catStyle.bg,
                            color: catStyle.text,
                          }}
                        >
                          {article.category}
                        </span>
                        <span className="resources-page-card-icon">
                          {article.icon}
                        </span>
                      </div>

                      {/* Image */}
                      <div className="resources-page-card-image-wrap">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="resources-page-card-image"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Date */}
                      <div className="resources-page-card-date">
                        <Calendar size={13} />
                        {article.publishedDate}
                      </div>

                      {/* Title */}
                      <h3 className="resources-page-card-title">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="resources-page-card-desc">
                        {article.description}
                      </p>

                      {/* Footer */}
                      <div className="resources-page-card-footer">
                        <span className="resources-page-card-time">
                          <Clock size={13} />
                          {article.readTime}
                        </span>
                        <span className="resources-page-card-link">
                          Read More <ArrowRight size={12} style={{ marginLeft: 2, verticalAlign: 'middle' }} />
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="resources-page-pagination">
                  {currentPage > 1 && (
                    <button
                      type="button"
                      className="resources-page-page-btn"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      aria-label="Previous page"
                    >
                      ←
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                      return false;
                    })
                    .reduce<(number | 'gap')[]>((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) acc.push('gap');
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) => {
                      if (item === 'gap') {
                        return (
                          <span
                            key={`gap-${idx}`}
                            style={{ color: 'var(--muted)', fontSize: '14px', padding: '0 4px' }}
                          >
                            …
                          </span>
                        );
                      }
                      return (
                        <button
                          key={item}
                          type="button"
                          className={`resources-page-page-btn ${currentPage === item ? 'active' : ''}`}
                          onClick={() => setCurrentPage(item)}
                          aria-label={`Page ${item}`}
                          aria-current={currentPage === item ? 'page' : undefined}
                        >
                          {item}
                        </button>
                      );
                    })}

                  {currentPage < totalPages && (
                    <button
                      type="button"
                      className="resources-page-page-btn"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      aria-label="Next page"
                    >
                      →
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="resources-page-empty">
              <div className="resources-page-empty-icon">🔍</div>
              <h3 className="resources-page-empty-title">No articles found</h3>
              <p className="resources-page-empty-desc">
                {searchTerm
                  ? `We couldn't find any articles matching "${searchTerm}". Try a different search term or browse by category.`
                  : `There are no articles in the "${activeCategory}" category yet. Try browsing a different category.`}
              </p>
              <button
                type="button"
                className="resources-page-empty-btn"
                onClick={handleResetFilters}
              >
                <RefreshCw size={14} />
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="resources-page-cta">
        <div className="noise" />
        <div className="resources-page-cta-glow" />
        <div className="resources-page-cta-inner">
          <div className="eyebrow reveal">Stay Informed</div>
          <h2 className="reveal d1">
            Never miss an <em>insight.</em>
          </h2>
          <p className="reveal d2">
            Subscribe to our newsletter for the latest research, guides, and
            industry analysis delivered straight to your inbox.
          </p>
          <div className="resources-page-cta-buttons reveal d3">
            <a
              href="https://cal.com/hifiveai"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-lg pulse"
            >
              Subscribe to Newsletter →
            </a>
            <button
              onClick={() => onNavigate?.('platform')}
              className="btn btn-outline-light btn-lg"
            >
              Explore the Platform →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
