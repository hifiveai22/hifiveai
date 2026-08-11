'use client';

import { useState, useRef, useEffect, useCallback, ReactNode, useId } from 'react';
import { useSyncExternalStore } from 'react';
import { BookOpen } from 'lucide-react';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  /** Optional longer explanation shown on hover */
  extended?: string;
  children?: ReactNode;
}

const emptySubscribe = () => () => {};

export default function GlossaryTooltip({
  term,
  definition,
  extended,
  children,
}: GlossaryTooltipProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 320;
    const padding = 12;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    // Clamp within viewport
    if (left < padding) left = padding;
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    const top = rect.bottom + 8;
    setCoords({ top, left });
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
    // Defer position calc to next frame so element exists
    requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  const handleClose = useCallback(() => setOpen(false), []);

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    const handle = () => updatePosition();
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [open, updatePosition]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, handleClose]);

  return (
    <span className="glossary-wrap">
      <span
        ref={triggerRef}
        className="glossary-trigger"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
          if (!open) requestAnimationFrame(updatePosition);
        }}
        role="button"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        aria-label={`Term: ${term}. Activate for definition.`}
      >
        <span className="glossary-term-text">{children || term}</span>
        <BookOpen size={11} className="glossary-icon" />
      </span>

      {mounted && open && coords && (
        <span
          id={tooltipId}
          role="tooltip"
          className="glossary-tooltip"
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          <span className="glossary-tooltip-term">{term}</span>
          <span className="glossary-tooltip-def">{definition}</span>
          {extended && <span className="glossary-tooltip-extended">{extended}</span>}
          <span className="glossary-tooltip-arrow" />
        </span>
      )}
    </span>
  );
}

/**
 * Convenience: a small inline glossary of common HiFive AI terms.
 * Can be rendered as a reference list inside an article or footer.
 */
export function GlossaryReference() {
  return (
    <div className="glossary-reference">
      <div className="glossary-reference-title">Key Terms</div>
      <ul>
        <li><strong>EOR</strong> - Employer of Record. A legal entity that employs staff on behalf of another company in countries where the company has no subsidiary.</li>
        <li><strong>TCO</strong> - Total Cost of Ownership. The full cost of a system including licenses, integration, reconciliation labor, and opportunity cost.</li>
        <li><strong>Cryptographic source of truth</strong> - Every authoritative record is signed with a content hash. Wrong numbers cannot be displayed because the hash check fails.</li>
        <li><strong>Reasoning engine</strong> - Translates natural language into multi-table queries, executes them, and synthesizes an auditable answer with citations.</li>
        <li><strong>SCIM</strong> - System for Cross-domain Identity Management. Automated user provisioning and de-provisioning protocol.</li>
        <li><strong>WORM storage</strong> - Write Once Read Many. Immutable storage for audit logs that cannot be tampered with after writing.</li>
      </ul>
    </div>
  );
}
