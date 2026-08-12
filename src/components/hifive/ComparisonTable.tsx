'use client';

import { useReveal } from '@/hooks/useReveal';
import { Check, X, Minus } from 'lucide-react';

type CellType = 'check' | 'x' | 'partial' | 'text';

interface Cell {
  type: CellType;
  label: string;
  href?: string;
}

interface Row {
  criterion: string;
  hifive: Cell;
  point: Cell;
  legacy: Cell;
}

const ROWS: Row[] = [
  {
    criterion: 'Single source of truth',
    hifive: { type: 'check', label: 'Cryptographic' },
    point: { type: 'x', label: 'Impossible' },
    legacy: { type: 'partial', label: 'Partial' },
  },
  {
    criterion: 'Cross-module AI reasoning',
    hifive: { type: 'check', label: 'Native' },
    point: { type: 'x', label: 'None' },
    legacy: { type: 'x', label: 'None' },
  },
  {
    criterion: 'Implementation time',
    hifive: { type: 'text', label: '4–6 weeks' },
    point: { type: 'text', label: '12–24 weeks' },
    legacy: { type: 'text', label: '6–18 months' },
  },
  {
    criterion: 'Modules included',
    hifive: { type: 'text', label: '5 unified' },
    point: { type: 'text', label: '5–8 separate' },
    legacy: { type: 'text', label: '3–4' },
  },
  {
    criterion: 'Total cost (100 emp)',
    hifive: { type: 'text', label: 'Ask for quote', href: 'https://cal.com/hifiveai' },
    point: { type: 'text', label: '$120–180K/yr' },
    legacy: { type: 'text', label: '$80–150K/yr' },
  },
  {
    criterion: 'Real-time data sync',
    hifive: { type: 'check', label: 'Instant' },
    point: { type: 'x', label: 'Batch/scheduled' },
    legacy: { type: 'x', label: 'Batch' },
  },
  {
    criterion: 'Global payroll',
    hifive: { type: 'text', label: '150+ countries' },
    point: { type: 'text', label: '30–50 countries' },
    legacy: { type: 'text', label: '20–40 countries' },
  },
  {
    criterion: 'Compliance automation',
    hifive: { type: 'check', label: 'Built-in' },
    point: { type: 'partial', label: 'Partial' },
    legacy: { type: 'partial', label: 'Add-on' },
  },
  {
    criterion: 'AI-powered recruiting',
    hifive: { type: 'check', label: 'Semantic' },
    point: { type: 'partial', label: 'Keyword' },
    legacy: { type: 'x', label: 'Manual' },
  },
  {
    criterion: 'Agentic workflows',
    hifive: { type: 'check', label: 'Native' },
    point: { type: 'x', label: 'None' },
    legacy: { type: 'x', label: 'None' },
  },
  {
    criterion: 'Custom reporting',
    hifive: { type: 'check', label: 'Natural language' },
    point: { type: 'partial', label: 'Builder tools' },
    legacy: { type: 'partial', label: 'IT required' },
  },
  {
    criterion: 'Employee experience',
    hifive: { type: 'check', label: 'Consumer-grade' },
    point: { type: 'partial', label: 'Inconsistent' },
    legacy: { type: 'x', label: 'Clunky' },
  },
];

function CellContent({ cell }: { cell: Cell }) {
  if (cell.type === 'text') {
    if (cell.href) {
      return (
        <span className="comparison-icon">
          <a href={cell.href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
            {cell.label} →
          </a>
        </span>
      );
    }
    return <span className="comparison-icon">{cell.label}</span>;
  }

  const iconClass =
    cell.type === 'check'
      ? 'comparison-icon-check'
      : cell.type === 'x'
        ? 'comparison-icon-x'
        : 'comparison-icon-partial';

  const Icon = cell.type === 'check' ? Check : cell.type === 'x' ? X : Minus;

  return (
    <span className={`comparison-icon ${iconClass}`}>
      <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
      <span>{cell.label}</span>
    </span>
  );
}

export default function ComparisonTable() {
  useReveal();

  return (
    <section className="comparison-section" id="comparison">
      <div className="comparison-inner">
        <div className="comparison-header">
          <div className="eyebrow reveal">Head-to-Head</div>
          <h2 className="reveal d1">
            Why switch to <em>HiFive AI?</em>
          </h2>
          <p className="reveal d2">
            One unified People Operating System vs. five+ fragmented tools vs. a legacy HRIS.
            The differences are structural - not cosmetic.
          </p>
        </div>

        <div className="comparison-table-wrap reveal-scale">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Comparison</th>
                <th scope="col" className="hifive-col">HiFive AI</th>
                <th scope="col">Point Solutions (5+ tools)</th>
                <th scope="col">Legacy HRIS (Workday, SAP)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.criterion}>
                  <td className="criterion" data-label="Criterion">{row.criterion}</td>
                  <td className="hifive-col" data-label="HiFive AI">
                    <CellContent cell={row.hifive} />
                  </td>
                  <td data-label="Point Solutions">
                    <CellContent cell={row.point} />
                  </td>
                  <td data-label="Legacy HRIS">
                    <CellContent cell={row.legacy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
