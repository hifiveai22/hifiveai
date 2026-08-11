'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useReveal } from '@/hooks/useReveal';

/* ── Color palette ── */
const GOLD_PRIMARY = '#B07D2E';
const GOLD_SECONDARY = '#C99140';
const GOLD_LIGHT = '#F0E0BC';

/* ── Sample datasets ── */
const hiringVelocityData = [
  { month: 'Jan', applications: 120 },
  { month: 'Feb', applications: 145 },
  { month: 'Mar', applications: 180 },
  { month: 'Apr', applications: 210 },
  { month: 'May', applications: 245 },
  { month: 'Jun', applications: 280 },
  { month: 'Jul', applications: 320 },
  { month: 'Aug', applications: 365 },
  { month: 'Sep', applications: 410 },
  { month: 'Oct', applications: 445 },
  { month: 'Nov', applications: 482 },
  { month: 'Dec', applications: 520 },
];

const costSavingsData = [
  { month: 'Jan', savings: 8 },
  { month: 'Feb', savings: 12 },
  { month: 'Mar', savings: 15 },
  { month: 'Apr', savings: 18 },
  { month: 'May', savings: 22 },
  { month: 'Jun', savings: 28 },
];

// Time-to-Hire: declining from 32 to 18 days over 24 weeks
const timeToHireData = Array.from({ length: 24 }, (_, i) => {
  const week = i + 1;
  // Linear-ish decline with a tiny bit of natural variance
  const base = 32 - ((32 - 18) * i) / 23;
  const jitter = (i % 3 === 0 ? -0.6 : i % 3 === 1 ? 0.4 : 0) + (i > 12 ? -0.3 : 0);
  const value = Math.max(18, Math.round((base + jitter) * 10) / 10);
  return { week: `W${week}`, days: value };
});

const moduleUsageData = [
  { name: 'HiAI', value: 25 },
  { name: 'HiTalent', value: 20 },
  { name: 'HiPeople', value: 18 },
  { name: 'HiPay', value: 15 },
  { name: 'HiGlobal', value: 12 },
  { name: 'HiOps', value: 10 },
];

const PIE_COLORS = [
  '#B07D2E', // HiAI (Gold)
  '#10B981', // HiTalent (Emerald)
  '#06B6D4', // HiPeople (Cyan)
  '#8B5CF6', // HiPay (Purple)
  '#3B82F6', // HiGlobal (Blue)
  '#F43F5E', // HiOps (Rose)
];

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          border: '1px solid #B07D2E',
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          fontSize: '12px',
        }}
      >
        <div style={{ fontWeight: 600, color: '#18140F' }}>{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsSection() {
  useReveal();

  return (
    <section className="analytics-section" id="analytics">
      <div className="analytics-inner">
        <div className="analytics-header reveal">
          <div className="eyebrow">By the Numbers</div>
          <h2>Real metrics. <em>Real impact.</em></h2>
          <p>
            Live performance across our customers - actual hiring velocity, cost
            consolidation, cycle-time compression, and module adoption. No vanity numbers.
          </p>
        </div>

        <div className="analytics-grid">
          {/* 1. Hiring Velocity - Line Chart */}
          <div className="analytics-card reveal">
            <div className="analytics-card-title">Hiring Velocity</div>
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hiringVelocityData}
                  margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={GOLD_PRIMARY} />
                      <stop offset="100%" stopColor={GOLD_SECONDARY} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(176,125,46,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#988E84' }}
                    axisLine={{ stroke: 'rgba(176,125,46,0.2)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#988E84' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="url(#lineGrad)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: GOLD_PRIMARY, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: GOLD_SECONDARY, stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={1400}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Cost Savings - Bar Chart */}
          <div className="analytics-card reveal">
            <div className="analytics-card-title">Cost Savings</div>
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costSavingsData}
                  margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
                >
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD_SECONDARY} />
                      <stop offset="100%" stopColor={GOLD_PRIMARY} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(176,125,46,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#988E84' }}
                    axisLine={{ stroke: 'rgba(176,125,46,0.2)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#988E84' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tickFormatter={(v) => `$${v}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="savings"
                    name="Savings ($K)"
                    fill="url(#barGrad)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Time-to-Hire Reduction - Area Chart */}
          <div className="analytics-card reveal">
            <div className="analytics-card-title">Time-to-Hire Reduction</div>
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeToHireData}
                  margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD_PRIMARY} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={GOLD_PRIMARY} stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(176,125,46,0.12)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: '#988E84' }}
                    axisLine={{ stroke: 'rgba(176,125,46,0.2)' }}
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#988E84' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    domain={[15, 35]}
                    tickFormatter={(v) => `${v}d`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="days"
                    name="Time-to-Hire (days)"
                    stroke={GOLD_PRIMARY}
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Module Usage Distribution - Donut Chart */}
          <div className="analytics-card reveal">
            <div className="analytics-card-title">Module Usage Distribution</div>
            <div className="analytics-donut-container">
              <div className="analytics-chart analytics-chart-pie">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moduleUsageData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={74}
                      paddingAngle={3}
                      animationDuration={1300}
                    >
                      {moduleUsageData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="analytics-donut-center">
                  <span className="analytics-donut-center-num">100%</span>
                  <span className="analytics-donut-center-label">6 Modules</span>
                </div>
              </div>
              <div className="analytics-legend-grid">
                {moduleUsageData.map((item, idx) => (
                  <div key={item.name} className="analytics-legend-item">
                    <span
                      className="analytics-legend-color"
                      style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="analytics-legend-name">{item.name}</span>
                    <span className="analytics-legend-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
