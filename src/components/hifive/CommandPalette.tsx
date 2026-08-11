'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Home,
  Layers,
  Users,
  HelpCircle,
  Mail,
  Calculator,
  FileText,
  TrendingUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigation' | 'Resources' | 'Tools';
  icon: React.ComponentType<{ size?: number }>;
  keywords?: string[];
  action: () => void;
}

interface CommandPaletteProps {
  onNavigate: (page: PageId) => void;
}

export default function CommandPalette({
  onNavigate,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Helper: navigate to a page, then scroll to a section after a delay
  const navigateAndScroll = useCallback(
    (page: PageId, sectionId?: string) => {
      onNavigate(page);
      if (sectionId) {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 450);
      }
    },
    [onNavigate]
  );

  // Helper: open an article in a new tab
  const openArticle = useCallback((articleId: string) => {
    window.open(`/articles/${articleId}`, '_blank', 'noopener,noreferrer');
  }, []);

  // Lock body scroll + focus input when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const openPalette = useCallback(() => {
    setQuery('');
    setActiveIdx(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Toggle via keyboard (Cmd/Ctrl+K to open, ESC to close)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, close]);

  const items: CommandItem[] = [
    {
      id: 'nav-home',
      label: 'Go to Home',
      hint: 'Overview of HiFive AI',
      group: 'Navigation',
      icon: Home,
      keywords: ['home', 'overview', 'main', 'start'],
      action: () => { onNavigate('home'); close(); },
    },
    {
      id: 'nav-platform',
      label: 'Go to Platform',
      hint: 'Architecture & module details',
      group: 'Navigation',
      icon: Layers,
      keywords: ['platform', 'architecture', 'modules', 'hiops', 'hit'],
      action: () => { onNavigate('platform'); close(); },
    },
    {
      id: 'nav-solutions',
      label: 'Go to Solutions',
      hint: 'Role-based use cases',
      group: 'Navigation',
      icon: Users,
      keywords: ['solutions', 'personas', 'roles', 'chro', 'ceo', 'cfo'],
      action: () => { onNavigate('solutions'); close(); },
    },
    {
      id: 'nav-why',
      label: 'Go to Advantage',
      hint: 'Philosophy, TCO & outcomes',
      group: 'Navigation',
      icon: HelpCircle,
      keywords: ['why', 'advantage', 'philosophy', 'tco', 'outcomes', 'principles'],
      action: () => { onNavigate('why'); close(); },
    },
    {
      id: 'nav-contact',
      label: 'Go to Contact',
      hint: 'Talk to our team',
      group: 'Navigation',
      icon: Mail,
      keywords: ['contact', 'email', 'sales', 'demo', 'book'],
      action: () => { onNavigate('contact'); close(); },
    },
    {
      id: 'nav-resources',
      label: 'Go to Resources',
      hint: 'Blog, guides & case studies',
      group: 'Navigation',
      icon: BookOpen,
      keywords: ['resources', 'blog', 'guides', 'case studies', 'library'],
      action: () => { onNavigate('resources'); close(); },
    },
    {
      id: 'tool-pricing',
      label: 'Open Pricing Tiers',
      hint: 'Starter · Growth · Enterprise',
      group: 'Tools',
      icon: Calculator,
      keywords: ['pricing', 'plans', 'tiers', 'cost', 'subscribe'],
      action: () => { navigateAndScroll('why', 'pricing'); close(); },
    },
    {
      id: 'tool-roi',
      label: 'Open ROI Calculator',
      hint: 'Quantify your savings',
      group: 'Tools',
      icon: TrendingUp,
      keywords: ['roi', 'savings', 'calculator', 'tco', 'return'],
      action: () => { navigateAndScroll('why', 'roi'); close(); },
    },
    {
      id: 'tool-tco',
      label: 'Open TCO Estimator',
      hint: 'Quick slider-based estimate',
      group: 'Tools',
      icon: Calculator,
      keywords: ['tco', 'estimator', 'cost', 'slider'],
      action: () => { navigateAndScroll('why', 'tco'); close(); },
    },
    {
      id: 'res-tco',
      label: 'Read: Why Your HR Stack Costs 40% More',
      hint: 'Blog · 8 min',
      group: 'Resources',
      icon: FileText,
      keywords: ['hr stack', 'tco', 'cost', 'blog'],
      action: () => { openArticle('hr-stack-cost'); close(); },
    },
    {
      id: 'res-eor',
      label: 'Read: Complete Guide to Global EOR 2025',
      hint: 'Guide · 15 min',
      group: 'Resources',
      icon: FileText,
      keywords: ['eor', 'global', 'employer of record', 'guide'],
      action: () => { openArticle('eor-guide'); close(); },
    },
    {
      id: 'res-novapay',
      label: 'Read: How NovaPay Saved $120K/Year',
      hint: 'Case Study · 6 min',
      group: 'Resources',
      icon: Sparkles,
      keywords: ['novapay', 'case study', 'savings', 'fintech'],
      action: () => { openArticle('novapay-case'); close(); },
    },
    {
      id: 'res-ai',
      label: 'Read: Ask AI vs. ChatGPT',
      hint: 'Blog · 10 min',
      group: 'Resources',
      icon: FileText,
      keywords: ['ai', 'chatgpt', 'reasoning', 'context'],
      action: () => { openArticle('ask-ai-vs-chatgpt'); close(); },
    },
  ];

  const filtered = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.hint?.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.includes(q))
    );
  });

  // Group items
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  // Clamp activeIdx into filtered range during render (no setState in effect)
  const safeActiveIdx = Math.min(activeIdx, Math.max(0, filtered.length - 1));

  // Scroll active item into view
  useEffect(() => {
    if (!open) return;
    const container = listRef.current;
    if (!container) return;
    const active = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [safeActiveIdx, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[safeActiveIdx]?.action();
    }
  };

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  // Trigger button (visible floating chip in bottom corner)
  const TriggerButton = (
    <button
      type="button"
      className="cmd-trigger"
      onClick={openPalette}
      aria-label="Open command palette"
    >
      <Search size={13} />
      <span>Quick Jump</span>
      <kbd className="cmd-trigger-kbd">⌘K</kbd>
    </button>
  );

  if (typeof document === 'undefined') return TriggerButton;

  return (
    <>
      {TriggerButton}
      {open &&
        createPortal(
          <div className="cmd-overlay" onClick={handleBackdropClick}>
            <div className="cmd-modal" role="dialog" aria-modal="true" aria-label="Command palette">
              <div className="cmd-input-wrap">
                <Search size={18} className="cmd-input-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  className="cmd-input"
                  placeholder="Search pages, tools, resources…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIdx(0);
                  }}
                  onKeyDown={handleKeyDown}
                  aria-label="Search commands"
                />
                <kbd className="cmd-input-esc">ESC</kbd>
              </div>

              <div className="cmd-list" ref={listRef}>
                {filtered.length === 0 && (
                  <div className="cmd-empty">
                    <Search size={24} />
                    <div>No results for &quot;{query}&quot;</div>
                    <div className="cmd-empty-hint">Try &quot;pricing&quot;, &quot;roi&quot;, or &quot;contact&quot;</div>
                  </div>
                )}

                {Object.entries(grouped).map(([group, groupItems]) => (
                  <div key={group} className="cmd-group">
                    <div className="cmd-group-label">{group}</div>
                    {groupItems.map((item) => {
                      const idx = filtered.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`cmd-item ${idx === safeActiveIdx ? 'active' : ''}`}
                          data-active={idx === safeActiveIdx}
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={item.action}
                        >
                          <span className="cmd-item-icon">
                            <Icon size={15} />
                          </span>
                          <span className="cmd-item-text">
                            <span className="cmd-item-label">{item.label}</span>
                            {item.hint && (
                              <span className="cmd-item-hint">{item.hint}</span>
                            )}
                          </span>
                          {idx === safeActiveIdx && (
                            <kbd className="cmd-item-enter">
                              <CornerDownLeft size={11} />
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="cmd-footer">
                <div className="cmd-footer-hint">
                  <kbd><ArrowUp size={9} /></kbd>
                  <kbd><ArrowDown size={9} /></kbd>
                  <span>navigate</span>
                </div>
                <div className="cmd-footer-hint">
                  <kbd><CornerDownLeft size={9} /></kbd>
                  <span>select</span>
                </div>
                <div className="cmd-footer-hint">
                  <kbd>ESC</kbd>
                  <span>close</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
