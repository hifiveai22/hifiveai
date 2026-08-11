'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Send,
  Check,
  Loader2,
  Lock,
  Info,
  CalendarClock,
  FileDown,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import './HiAIConsoleDemo.css';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type PageId = 'home' | 'platform' | 'solutions' | 'why' | 'contact' | 'resources';

interface HiAIConsoleDemoProps {
  onNavigate?: (page: PageId) => void;
}

type PromptCategoryId =
  | 'talent'
  | 'comp'
  | 'compliance'
  | 'ops'
  | 'finance'
  | 'cross';

type ModuleRef =
  | 'HiTalent'
  | 'HiPeople'
  | 'HiPay'
  | 'HiGlobal'
  | 'HiOps';

interface ChartRow {
  label: string;
  value: string;
  pct: number; // 0..100 bar width
  sub?: string;
}

interface ConsoleTable {
  columns: string[];
  rows: string[][]; // each cell may contain safe HTML markup (see syntax-highlight classes)
  foot?: string;
}

interface ConsoleResponse {
  headline: string;
  chart?: ChartRow[];
  table?: ConsoleTable;
  bullets: string[]; // may contain safe HTML markup
  actions: string[];
}

interface Prompt {
  id: string;
  category: PromptCategoryId;
  label: string;
  modules: ModuleRef[]; // data-source modules; HiAI Reasoning is appended as synthesizer stage
  response: ConsoleResponse;
}

/* ================================================================== */
/*  Static prompt library + scripted responses                         */
/* ================================================================== */

const PROMPT_CATEGORIES: { id: PromptCategoryId; label: string; dot: string }[] = [
  { id: 'talent', label: 'HiTalent', dot: '#C99140' },
  { id: 'comp', label: 'HiPay', dot: '#E0A040' },
  { id: 'compliance', label: 'HiGlobal', dot: '#22C55E' },
  { id: 'ops', label: 'HiOps', dot: '#60A5FA' },
  { id: 'finance', label: 'Finance', dot: '#F87171' },
  { id: 'cross', label: 'HiAI Reasoning', dot: '#A78BFA' },
];

const PROMPTS: Prompt[] = [
  {
    id: 'hiring-velocity',
    category: 'talent',
    label: 'Show me hiring velocity for Q3 vs Q2 by team',
    modules: ['HiTalent', 'HiPeople'],
    response: {
      headline:
        'Q3 hiring velocity is up 23% vs Q2 - driven by Infrastructure (2.1×) and Design (1.4×).',
      chart: [
        { label: 'Infrastructure', value: '44 hires', pct: 100, sub: '↑ 110% QoQ' },
        { label: 'Platform', value: '22 hires', pct: 50, sub: '↑ 16% QoQ' },
        { label: 'Design', value: '18 hires', pct: 41, sub: '↑ 38% QoQ' },
        { label: 'Data', value: '14 hires', pct: 32, sub: '↑ 27% QoQ' },
        { label: 'Mobile', value: '9 hires', pct: 20, sub: '↑ 13% QoQ' },
      ],
      bullets: [
        'Median time-to-hire dropped from <span class="num">24d</span> → <span class="num">17d</span> - HiTalent auto-scheduling removed ~6 days per loop.',
        'Infra surge was unplanned: <span class="num">4</span> backfills + <span class="num">2</span> net-new roles opened mid-quarter; headcount plan flagged for revision.',
        'Design cycle (<span class="num">31d</span>) remains <span class="warn">1.8×</span> company avg - recruiting-ops review recommended.',
      ],
      actions: ['Schedule hiring review', 'Export funnel report'],
    },
  },
  {
    id: 'longest-tth',
    category: 'talent',
    label: 'Which roles have the longest time-to-hire right now?',
    modules: ['HiTalent'],
    response: {
      headline:
        '5 roles exceed the 30-day median - 4 of them senior or specialized ICs.',
      table: {
        columns: ['Role', 'Dept', 'Days open', 'Applicants', 'Bottleneck'],
        rows: [
          ['Staff SRE', 'Infra', '<span class="num">47</span>', '<span class="num">12</span>', '<span class="warn">Final scheduling</span>'],
          ['Principal Designer', 'Design', '<span class="num">41</span>', '<span class="num">8</span>', '<span class="warn">Portfolio backlog</span>'],
          ['Eng Manager · Platform', 'Eng', '<span class="num">38</span>', '<span class="num">21</span>', 'Committee quorum'],
          ['Sr. Security Eng', 'Security', '<span class="num">35</span>', '<span class="num">14</span>', '<span class="warn">Screen conversion</span>'],
          ['Head of GTM', 'Revenue', '<span class="num">33</span>', '<span class="num">6</span>', 'Exec alignment'],
        ],
      },
      bullets: [
        'All 5 roles require <span class="num">4+</span> interviewers per loop - panel-rotation gaps are delaying formation.',
        'Staff SRE pipeline is <span class="num">86%</span> screened-in but only <span class="num">17%</span> advanced - JD may be over-scoped.',
        'Recommend parallel-tracking <span class="num">2</span> backfills per role to reduce single-point slippage.',
      ],
      actions: ['Open pipeline dashboard', 'Notify hiring managers'],
    },
  },
  {
    id: 'comp-ratio',
    category: 'comp',
    label: "What's the comp ratio for engineers in Berlin vs SF?",
    modules: ['HiPay', 'HiGlobal'],
    response: {
      headline:
        'Berlin engineers sit 22% below SF market on parity-adjusted compa-ratio - concentrated at Staff and Senior bands.',
      table: {
        columns: ['Level', 'Berlin ratio', 'SF ratio', 'Parity-adjusted gap'],
        rows: [
          ['L3 · Mid', '<span class="num">0.92</span>', '<span class="num">1.05</span>', '<span class="warn">-13%</span>'],
          ['L4 · Senior', '<span class="num">0.84</span>', '<span class="num">1.02</span>', '<span class="warn">-18%</span>'],
          ['L5 · Staff', '<span class="num">0.78</span>', '<span class="num">0.98</span>', '<span class="warn">-20%</span>'],
          ['L6 · Principal', '<span class="num">0.81</span>', '<span class="num">1.01</span>', '<span class="warn">-20%</span>'],
        ],
      },
      bullets: [
        'Berlin Staff band is <span class="num">€138–165K</span>, but only <span class="num">2 of 8</span> Staff engineers sit above midpoint - band recalibration recommended.',
        'SF is benchmarked to Radford <span class="mod">T75</span>, Berlin to <span class="mod">T50</span> - explains most of the visible gap.',
        '<span class="num">2</span> Staff engineers in Berlin are <span class="warn">flight-risk</span> flagged (comp <span class="warn">14%+</span> below band).',
      ],
      actions: ['Run comp review', 'Export band analysis'],
    },
  },
  {
    id: 'eor-conversion',
    category: 'compliance',
    label: 'Which contractors in the EU need EOR conversion by Jan 1?',
    modules: ['HiGlobal', 'HiPay', 'HiPeople'],
    response: {
      headline:
        '8 EU contractors meet misclassification criteria and need EOR conversion by Jan 1 - €48.6K/yr incremental cost.',
      table: {
        columns: ['Contractor ID', 'Country', 'Tenure', 'Risk score', 'Conv. cost/yr'],
        rows: [
          ['C-0017', '🇩🇪 Germany', '<span class="num">18 mo</span>', '<span class="warn">0.86</span>', '<span class="num">€7,400</span>'],
          ['C-0024', '🇫🇷 France', '<span class="num">14 mo</span>', '<span class="warn">0.81</span>', '<span class="num">€6,200</span>'],
          ['C-0031', '🇳🇱 Netherlands', '<span class="num">12 mo</span>', '<span class="warn">0.78</span>', '<span class="num">€5,800</span>'],
          ['C-0019', '🇩🇪 Germany', '<span class="num">16 mo</span>', '<span class="warn">0.77</span>', '<span class="num">€6,900</span>'],
          ['C-0028', '🇮🇪 Ireland', '<span class="num">11 mo</span>', '<span class="warn">0.74</span>', '<span class="num">€5,400</span>'],
          ['C-0033', '🇪🇸 Spain', '<span class="num">10 mo</span>', '<span class="warn">0.71</span>', '<span class="num">€4,900</span>'],
          ['C-0012', '🇩🇪 Germany', '<span class="num">22 mo</span>', '<span class="warn">0.69</span>', '<span class="num">€6,600</span>'],
          ['C-0036', '🇫🇷 France', '<span class="num">9 mo</span>', '<span class="warn">0.67</span>', '<span class="num">€5,400</span>'],
        ],
        foot: 'Total incremental cost: <span class="num">€48.6K/yr</span> · Avoids est. <span class="num">€220K</span> in reclassification penalties.',
      },
      bullets: [
        'HiGlobal misclassification scanner flagged 3 signals on all 8: <span class="mod">fixed hours</span>, <span class="mod">company email</span>, <span class="mod">manager-directed work</span>.',
        'Jan 1 deadline aligns with EU PSC directive enforcement window - conversion avoids statutory penalties.',
        'Recommended path: <span class="mod">Deel EOR</span> for DE/NL/IE/ES, direct entity for FR (existing HiFive SAS).',
      ],
      actions: ['Generate conversion plan', 'Notify legal & finance'],
    },
  },
  {
    id: 'it-forecast',
    category: 'ops',
    label: 'Forecast IT asset needs for 50 new hires in Bangalore',
    modules: ['HiOps', 'HiTalent'],
    response: {
      headline:
        '50 Bangalore hires will need 78 devices and 412 license seats - place hardware PO by Dec 5 for Day-1 readiness.',
      chart: [
        { label: 'MacBook Pro 14" M4', value: '32 to order', pct: 100, sub: '14-day lead' },
        { label: 'Dell U2723QE 27"', value: '28 to order', pct: 88, sub: '21-day lead ⚠' },
        { label: 'iPhone 15 (on-call)', value: '4 to order', pct: 13, sub: '7-day lead' },
        { label: 'Magic Keyboard', value: '32 to order', pct: 100, sub: 'in stock' },
        { label: 'Magic Mouse', value: '32 to order', pct: 100, sub: 'in stock' },
        { label: 'MFA hardware keys', value: '0 to order', pct: 4, sub: 'stocked' },
      ],
      bullets: [
        'Dell display lead times have slipped <span class="num">12d → 21d</span> - PO must be placed this week.',
        '<span class="num">12</span> Figma seats align with the <span class="num">12</span> designers in the hiring plan; SSO and GitHub have ample seat buffer.',
        'Bangalore office has <span class="num">38</span> empty desks ready; IT provisioning workflow will auto-fire on HiPeople hire event.',
      ],
      actions: ['Draft purchase order', 'Notify procurement'],
    },
  },
  {
    id: 'eng-cost',
    category: 'finance',
    label: "What's the fully-loaded cost of the engineering org?",
    modules: ['HiPay', 'HiPeople', 'HiOps'],
    response: {
      headline:
        'Engineering org fully-loaded cost is $42.7M/yr - $312K/employee, 8% above industry benchmark.',
      chart: [
        { label: 'Salaries & benefits', value: '$29.0M · 68%', pct: 68, sub: 'in-line w/ T75' },
        { label: 'Equity / RSU', value: '$7.7M · 18%', pct: 18, sub: '↑ post-2023 refresh' },
        { label: 'Recruiting & onboarding', value: '$2.1M · 5%', pct: 5, sub: 'best-in-class' },
        { label: 'Tools & licenses', value: '$1.7M · 4%', pct: 4, sub: '↑ 22% vs peers' },
        { label: 'Real estate', value: '$1.3M · 3%', pct: 3, sub: 'hybrid avg' },
        { label: 'Training & conf', value: '$0.9M · 2%', pct: 2, sub: 'flat' },
      ],
      bullets: [
        'Salary cost is in-line with Radford <span class="mod">T75</span> benchmark - the <span class="num">8%</span> premium comes from elevated equity vesting.',
        'Tooling spend per engineer (<span class="num">$14.6K</span>) is <span class="warn">22%</span> above peer-set - portfolio rationalization flagged.',
        'Recruiting cost per hire (<span class="num">$8.4K</span>) is best-in-class vs peer median of <span class="num">$14K</span> - HiTalent automation ROI confirmed.',
      ],
      actions: ['Export board deck', 'Schedule finance review'],
    },
  },
  {
    id: 'eng-retention',
    category: 'cross',
    label: 'Why did engineering retention drop 8% last quarter?',
    modules: ['HiTalent', 'HiPeople', 'HiPay'],
    response: {
      headline:
        'Engineering retention fell 8% QoQ - 71% attributable to comp band erosion + manager span-of-control issues.',
      chart: [
        { label: 'Infra', value: '13.2% attrition', pct: 100, sub: '↑ 8.4 pts QoQ' },
        { label: 'Platform', value: '11.4% attrition', pct: 86, sub: '↑ 6.1 pts QoQ' },
        { label: 'Security', value: '9.1% attrition', pct: 69, sub: '↑ 4.2 pts QoQ' },
        { label: 'Data', value: '6.8% attrition', pct: 52, sub: '↑ 2.0 pts QoQ' },
        { label: 'Mobile', value: '4.2% attrition', pct: 32, sub: 'flat' },
      ],
      bullets: [
        '<span class="warn">Comp band erosion</span>: <span class="num">14</span> engineers (28% of departures) were ≥<span class="num">12%</span> below band - Q2 promo cycle missed.',
        '<span class="warn">Span-of-control</span>: Platform managers now average <span class="num">9</span> reports (target <span class="num">6–7</span>) - eNPS dropped <span class="num">-14 pts</span>.',
        '<span class="mod">Confounder</span>: <span class="num">3</span> departures were acquisition-vesting cliffs (not preventable) - adjusted drop is <span class="num">5.8%</span>.',
      ],
      actions: ['Open retention playbook', 'Schedule eng-leadership review'],
    },
  },
  {
    id: 'q4-risk',
    category: 'cross',
    label: 'Which teams are at risk of missing Q4 hiring targets?',
    modules: ['HiTalent', 'HiPay', 'HiOps'],
    response: {
      headline:
        '3 of 7 teams are at risk of missing Q4 hiring targets - projected 14-role shortfall.',
      table: {
        columns: ['Team', 'Target', 'Filled', 'In-pipe', 'Projected', 'Gap', 'Risk'],
        rows: [
          ['Design', '<span class="num">8</span>', '<span class="num">3</span>', '<span class="num">4</span>', '<span class="num">5</span>', '<span class="warn">-3</span>', '<span class="risk-hi">High</span>'],
          ['Security', '<span class="num">6</span>', '<span class="num">2</span>', '<span class="num">2</span>', '<span class="num">3</span>', '<span class="warn">-3</span>', '<span class="risk-hi">High</span>'],
          ['Infra', '<span class="num">12</span>', '<span class="num">7</span>', '<span class="num">6</span>', '<span class="num">10</span>', '<span class="warn">-2</span>', '<span class="risk-med">Medium</span>'],
          ['Platform', '<span class="num">14</span>', '<span class="num">11</span>', '<span class="num">5</span>', '<span class="num">14</span>', '<span class="num">0</span>', '<span class="risk-ok">On track</span>'],
          ['Data', '<span class="num">9</span>', '<span class="num">6</span>', '<span class="num">4</span>', '<span class="num">9</span>', '<span class="num">0</span>', '<span class="risk-ok">On track</span>'],
          ['Mobile', '<span class="num">5</span>', '<span class="num">4</span>', '<span class="num">2</span>', '<span class="num">5</span>', '<span class="num">0</span>', '<span class="risk-ok">On track</span>'],
          ['DevRel', '<span class="num">3</span>', '<span class="num">2</span>', '<span class="num">1</span>', '<span class="num">3</span>', '<span class="num">0</span>', '<span class="risk-ok">On track</span>'],
        ],
        foot: 'Projected shortfall: <span class="num">14 roles</span> · Risk concentration: Design, Security, Infra.',
      },
      bullets: [
        'Design & Security pipelines show <span class="warn">&lt;50%</span> final-round conversion - JD scope and comp bands flagged for review.',
        'Infra gap is recoverable: <span class="num">2</span> strong candidates in final round, offers expected by <span class="num">Nov 18</span>.',
        'Recommend diverting <span class="num">1</span> recruiter from Mobile (overstaffed by <span class="num">+1</span>) to Security for remainder of Q4.',
      ],
      actions: ['Rebalance recruiters', 'Trigger comp review'],
    },
  },
];

/* Demo-mode response for unknown typed queries */
const DEMO_MODE_RESPONSE: ConsoleResponse = {
  headline:
    'In live mode, HiAI would reason across your actual workspace data to answer this.',
  bullets: [
    'This demo runs on <span class="mod">scripted sample data</span> - pick any prompt from the library on the left to see a fully-rendered answer.',
    'In production, HiAI would <span class="mod">query HiTalent · HiPeople · HiPay · HiGlobal · HiOps</span> in parallel, then synthesize an answer with real numbers.',
    'Want a live walkthrough with your data? <span class="num">Book a free HR audit</span> - average setup time is 2 weeks.',
  ],
  actions: ['Book free HR audit', 'See more prompts'],
};

/* ================================================================== */
/*  Hooks                                                              */
/* ================================================================== */

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

/**
 * Typewriter hook. Returns the currently-displayed substring of `text`
 * and a `done` flag. The hook resets when `text` changes (using the
 * React-recommended "adjust state during render" pattern, not setState
 * in an effect body). When `prefersReduced` is true the full text is
 * shown after a 0ms timeout (deferred to avoid setState-in-effect-body).
 */
function useTypewriter(
  text: string,
  run: boolean,
  speed: number,
  prefersReduced: boolean,
): { displayed: string; done: boolean } {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [prevText, setPrevText] = useState(text);

  // Reset on text change - allowed React pattern for "adjusting state when a prop changes"
  if (text !== prevText) {
    setPrevText(text);
    setCount(0);
    setDone(false);
  }

  useEffect(() => {
    if (!run) return;

    if (prefersReduced) {
      const id = window.setTimeout(() => {
        setCount(text.length);
        setDone(true);
      }, 0);
      return () => window.clearTimeout(id);
    }

    let i = 0;
    const intervalId = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        window.clearInterval(intervalId);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(intervalId);
  }, [text, run, speed, prefersReduced]);

  return { displayed: text.slice(0, count), done };
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function categoryLabel(id: PromptCategoryId): string {
  return PROMPT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function actionIcon(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes('schedule') || lower.includes('review')) return <CalendarClock size={12} />;
  if (lower.includes('export') || lower.includes('report') || lower.includes('deck')) return <FileDown size={12} />;
  if (lower.includes('notify') || lower.includes('trigger') || lower.includes('open')) return <AlertCircle size={12} />;
  if (lower.includes('book') || lower.includes('audit')) return <CalendarClock size={12} />;
  return <ChevronRight size={12} />;
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function HiAIConsoleDemo({ onNavigate }: HiAIConsoleDemoProps) {
  const prefersReduced = usePrefersReducedMotion();

  const [activePromptId, setActivePromptId] = useState<string>(PROMPTS[0].id);
  const [activeCustom, setActiveCustom] = useState<{
    label: string;
    response: ConsoleResponse;
    modules: ModuleRef[];
  } | null>(null);
  const [thinking, setThinking] = useState(true);
  const [thinkingStage, setThinkingStage] = useState(0);
  const [showBody, setShowBody] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const actionTimerRef = useRef<number | null>(null);

  const activePrompt = useMemo(
    () => PROMPTS.find((p) => p.id === activePromptId) ?? null,
    [activePromptId],
  );

  const currentLabel = activeCustom?.label ?? activePrompt?.label ?? '';
  const currentResponse = activeCustom?.response ?? activePrompt?.response ?? null;
  const currentModules: ModuleRef[] = activeCustom?.modules ?? activePrompt?.modules ?? [];

  // Build the "thinking stages" array: each data-source module, then HiAI Reasoning as synthesizer.
  const thinkingStages = useMemo(() => {
    return [...currentModules, 'HiAI Reasoning' as const];
  }, [currentModules]);

  // Prompt "key" - changes when either the selected library prompt or the custom typed prompt changes.
  const promptKey = activeCustom ? `custom:${activeCustom.label}` : `prompt:${activePromptId}`;
  const [prevPromptKey, setPrevPromptKey] = useState(promptKey);

  // Reset per-prompt state when the prompt changes (React-recommended "adjust state during render").
  if (promptKey !== prevPromptKey) {
    setPrevPromptKey(promptKey);
    setThinking(true);
    setThinkingStage(0);
    setShowBody(false);
    setActionFeedback(null);
  }

  // Typewriter on the headline - only runs when thinking is complete and body not yet shown.
  const { displayed: typedHeadline, done: headlineDone } = useTypewriter(
    currentResponse?.headline ?? '',
    !thinking && !!currentResponse,
    60,
    prefersReduced,
  );

  /* ---- Effect: IntersectionObserver to trigger the first thinking animation when visible ---- */
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    if (prefersReduced) {
      const id = window.setTimeout(() => setHasBeenVisible(true), 0);
      return () => window.clearTimeout(id);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setHasBeenVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  /* ---- Effect: run thinking-stage timers when visible + thinking is active ---- */
  useEffect(() => {
    if (!hasBeenVisible || !thinking) return;

    const stageCount = thinkingStages.length;
    const stageDelay = prefersReduced ? 80 : 420;

    const newTimers: number[] = [];
    thinkingStages.forEach((_, i) => {
      newTimers.push(
        window.setTimeout(() => setThinkingStage(i + 1), stageDelay * (i + 1)),
      );
    });
    newTimers.push(
      window.setTimeout(
        () => setThinking(false),
        stageDelay * (stageCount + 1) + (prefersReduced ? 0 : 200),
      ),
    );

    return () => {
      newTimers.forEach((t) => window.clearTimeout(t));
    };
  }, [hasBeenVisible, thinking, thinkingStages, prefersReduced]);

  /* ---- Effect: reveal chart/table/bullets/actions after headline typed ---- */
  useEffect(() => {
    if (!headlineDone || !currentResponse) return;

    const delay = prefersReduced ? 0 : 240;
    const t = window.setTimeout(() => setShowBody(true), delay);
    return () => window.clearTimeout(t);
  }, [headlineDone, currentResponse, prefersReduced]);

  /* ---- Effect: auto-scroll the output panel as content grows ---- */
  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [typedHeadline, headlineDone, showBody, thinking, thinkingStage]);

  /* ---- Effect: cleanup the action-feedback timer on unmount ---- */
  useEffect(() => {
    return () => {
      if (actionTimerRef.current !== null) {
        window.clearTimeout(actionTimerRef.current);
      }
    };
  }, []);

  /* ---- Handlers ---- */
  const selectPrompt = useCallback(
    (id: string) => {
      if (id === activePromptId && !activeCustom) return;
      setActiveCustom(null);
      setActivePromptId(id);
    },
    [activePromptId, activeCustom],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed || thinking) return;

      // Try to match a known prompt (case-insensitive substring match on label)
      const lower = trimmed.toLowerCase();
      const match = PROMPTS.find((p) => {
        const labelLower = p.label.toLowerCase();
        return labelLower.includes(lower) || lower.includes(labelLower);
      });

      if (match) {
        setActiveCustom(null);
        setActivePromptId(match.id);
      } else {
        // Demo-mode response - use the typed text as the echoed prompt
        setActiveCustom({
          label: trimmed,
          modules: ['HiTalent', 'HiPeople', 'HiPay'],
          response: DEMO_MODE_RESPONSE,
        });
      }
      setInputValue('');
    },
    [inputValue, thinking],
  );

  const handleActionClick = useCallback(
    (action: string) => {
      const lower = action.toLowerCase();
      if (lower.includes('book') || lower.includes('audit')) {
        if (onNavigate) {
          onNavigate('contact');
          return;
        }
      }
      if (lower.includes('see more')) {
        const idx = PROMPTS.findIndex((p) => p.id === activePromptId);
        const next = PROMPTS[(idx + 1) % PROMPTS.length];
        selectPrompt(next.id);
        return;
      }
      if (actionTimerRef.current !== null) {
        window.clearTimeout(actionTimerRef.current);
      }
      setActionFeedback(`✓ ${action} - queued. HiAI will confirm via Slack #hifive-alerts.`);
      actionTimerRef.current = window.setTimeout(() => {
        setActionFeedback(null);
        actionTimerRef.current = null;
      }, 3200);
    },
    [onNavigate, activePromptId, selectPrompt],
  );

  /* ---- Render ---- */
  return (
    <section className="hiai-console-section" id="hiai-reasoning" aria-label="HiAI Console Demo">
      <div className="hiai-console-inner">
        <div className="hiai-console-header">
          <div className="eyebrow">HiAI · Cross-Module Reasoning</div>
          <h2>
            Reason across every detail of your workforce.
          </h2>
          <p>
            Pick a question a CXO would ask. Watch HiAI correlate hiring, payroll, compliance,
            and operations into one answer - in seconds.
          </p>
        </div>

        <div className="hiai-console-window reveal-scale" ref={windowRef}>
          {/* ── Window chrome ── */}
          <div className="hiai-console-chrome">
            <div className="hiai-console-dots" aria-hidden>
              <span className="red" />
              <span className="yellow" />
              <span className="green" />
            </div>
            <div className="hiai-console-chrome-title">
              <Sparkles size={12} />
              <span>HiAI Console</span>
            </div>
            <div className="hiai-console-urlbar" aria-hidden>
              <Lock size={10} />
              <span>hifive.ai/console</span>
            </div>
            <div className="hiai-console-connected" title="Connection status">
              <span className="hiai-console-connected-dot" />
              <span>Connected</span>
            </div>
          </div>

          {/* ── Body: prompt library + console output ── */}
          <div className="hiai-console-body">
            {/* Left: prompt library grouped by module */}
            <aside className="hiai-console-prompts" aria-label="Questions library">
              <div className="hiai-console-prompts-scroll">
                {PROMPT_CATEGORIES.map((cat) => {
                  const prompts = PROMPTS.filter((p) => p.category === cat.id);
                  if (prompts.length === 0) return null;
                  return (
                    <div key={cat.id} className="hiai-console-prompt-group">
                      <div className="hiai-console-prompt-cat">
                        <span className="hiai-console-cat-dot" style={{ background: cat.dot }} />
                        <span>{cat.label}</span>
                      </div>
                      {prompts.map((p) => {
                        const isActive = !activeCustom && p.id === activePromptId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className={`hiai-console-prompt-btn ${isActive ? 'active' : ''}`}
                            onClick={() => selectPrompt(p.id)}
                            disabled={thinking}
                            aria-pressed={isActive}
                          >
                            <span className="hiai-console-prompt-bullet" aria-hidden />
                            <span className="hiai-console-prompt-text">{p.label}</span>
                            <span className="hiai-console-prompt-cat-tag">{categoryLabel(p.category)}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Right: console output */}
            <div className="hiai-console-output" ref={outputRef} role="log" aria-live="polite">
              <div className="hiai-console-scanlines" aria-hidden />

              {/* Prompt echo */}
              <div className="hiai-console-prompt-echo">
                <span className="hiai-console-dollar">$</span>
                <span className="hiai-console-echo-text">{currentLabel}</span>
                {thinking && <span className="hiai-console-cursor" aria-hidden />}
              </div>

              {/* Thinking animation */}
              {thinking && (
                <div className="hiai-console-thinking">
                  <div className="hiai-console-thinking-label">
                    <Loader2 size={11} className="hiai-console-spin" />
                    <span>
                      Reasoning across <strong>{thinkingStages.length}</strong> modules
                      <span className="hiai-console-thinking-dots" aria-hidden>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </span>
                  </div>
                  <div className="hiai-console-thinking-stages">
                    {thinkingStages.map((mod, i) => {
                      const isDone = thinkingStage > i;
                      const isActive = thinkingStage === i;
                      return (
                        <div
                          key={mod}
                          className={`hiai-console-stage ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                        >
                          <span className="hiai-console-stage-icon">
                            {isDone ? (
                              <Check size={11} />
                            ) : isActive ? (
                              <Loader2 size={11} className="hiai-console-spin" />
                            ) : (
                              <span className="hiai-console-stage-pending" />
                            )}
                          </span>
                          <span className="hiai-console-stage-name">{mod}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Response */}
              {!thinking && currentResponse && (
                <div className="hiai-console-response">
                  <div className="hiai-console-resp-headline">
                    <span className="hiai-console-resp-arrow" aria-hidden>▸</span>
                    <span dangerouslySetInnerHTML={{ __html: typedHeadline }} />
                    {!headlineDone && <span className="hiai-console-headline-cursor" aria-hidden />}
                  </div>

                  {showBody && (
                    <div className="hiai-console-resp-body">
                      {/* Chart */}
                      {currentResponse.chart && (
                        <div className="hiai-console-chart">
                          <div className="hiai-console-chart-head">
                            <span className="hiai-console-chart-title">Data view</span>
                            <span className="hiai-console-chart-meta">simulated · last 90 days</span>
                          </div>
                          {currentResponse.chart.map((row, i) => (
                            <div
                              key={row.label}
                              className="hiai-console-chart-row"
                              style={{ animationDelay: prefersReduced ? '0ms' : `${i * 70}ms` }}
                            >
                              <div className="hiai-console-chart-label">
                                <span>{row.label}</span>
                                {row.sub && <span className="hiai-console-chart-sub">{row.sub}</span>}
                              </div>
                              <div className="hiai-console-chart-track">
                                <div
                                  className={`hiai-console-chart-bar ${showBody ? 'grow' : ''}`}
                                  style={
                                    {
                                      width: prefersReduced ? `${row.pct}%` : undefined,
                                      '--bar-pct': `${row.pct}%`,
                                    } as React.CSSProperties
                                  }
                                >
                                  <span
                                    className="hiai-console-chart-val"
                                    dangerouslySetInnerHTML={{ __html: row.value }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Table */}
                      {currentResponse.table && (
                        <div className="hiai-console-table-wrap">
                          <div className="hiai-console-chart-head">
                            <span className="hiai-console-chart-title">Data view</span>
                            <span className="hiai-console-chart-meta">simulated · workspace snapshot</span>
                          </div>
                          <div className="hiai-console-table-scroll">
                            <table className="hiai-console-table">
                              <thead>
                                <tr>
                                  {currentResponse.table.columns.map((c) => (
                                    <th key={c}>{c}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {currentResponse.table.rows.map((r, i) => (
                                  <tr
                                    key={i}
                                    style={{ animationDelay: prefersReduced ? '0ms' : `${i * 50}ms` }}
                                  >
                                    {r.map((cell, j) => (
                                      <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                              {currentResponse.table.foot && (
                                <tfoot>
                                  <tr>
                                    <td
                                      colSpan={currentResponse.table.columns.length}
                                      dangerouslySetInnerHTML={{ __html: currentResponse.table.foot }}
                                    />
                                  </tr>
                                </tfoot>
                              )}
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Bullets */}
                      {currentResponse.bullets.length > 0 && (
                        <ul className="hiai-console-bullets">
                          {currentResponse.bullets.map((b, i) => (
                            <li
                              key={i}
                              style={{ animationDelay: prefersReduced ? '0ms' : `${i * 90}ms` }}
                            >
                              <span className="hiai-console-bullet-marker" aria-hidden />
                              <span dangerouslySetInnerHTML={{ __html: b }} />
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Modules referenced */}
                      <div className="hiai-console-modules-ref">
                        <span className="hiai-console-modules-label">Reasoned across</span>
                        {currentModules.map((m) => (
                          <span key={m} className="hiai-console-mod-ref">{m}</span>
                        ))}
                        <span className="hiai-console-mod-ref reasoning">HiAI Reasoning</span>
                      </div>

                      {/* Action feedback banner */}
                      {actionFeedback && (
                        <div className="hiai-console-action-feedback" role="status">
                          <Check size={12} />
                          <span>{actionFeedback}</span>
                        </div>
                      )}

                      {/* Suggested actions */}
                      <div className="hiai-console-actions">
                        <span className="hiai-console-actions-label">Suggested actions</span>
                        <div className="hiai-console-actions-buttons">
                          {currentResponse.actions.map((a, i) => (
                            <button
                              key={i}
                              type="button"
                              className="hiai-console-action-btn"
                              onClick={() => handleActionClick(a)}
                            >
                              <span className="hiai-console-action-icon">{actionIcon(a)}</span>
                              <span>{a}</span>
                              <ChevronRight size={11} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom input bar ── */}
          <form className="hiai-console-input-bar" onSubmit={handleSubmit}>
            <span className="hiai-console-input-prompt" aria-hidden>{'>'}</span>
            <input
              className="hiai-console-input"
              type="text"
              placeholder="Ask HiAI anything…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Ask HiAI anything"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="hiai-console-send-btn"
              disabled={!inputValue.trim() || thinking}
              aria-label="Submit question"
            >
              <Send size={13} />
              <span className="hiai-console-send-text">Run</span>
            </button>
          </form>
        </div>

        <p className="hiai-console-footnote">
          <Info size={11} />
          <span>
            Demo mode - responses are scripted samples. Live console reasons over your actual workspace data,
            with row-level security and full audit logging.
          </span>
        </p>
      </div>
    </section>
  );
}
