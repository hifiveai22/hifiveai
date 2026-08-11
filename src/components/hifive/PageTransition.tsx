'use client';

interface PageTransitionProps {
  active: boolean;
}

export default function PageTransition({ active }: PageTransitionProps) {
  return (
    <div className={`page-transition-overlay ${active ? 'active' : ''}`}>
      <div className="page-transition-bar" />
    </div>
  );
}
