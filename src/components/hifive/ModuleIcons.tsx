'use client';

import React from 'react';

export type ModuleName = 'hiai' | 'hitalent' | 'hipeople' | 'hipay' | 'higlobal' | 'hiops';

interface IconProps {
  size?: number;
  className?: string;
}

const GOLD = '#B07D2E';

/* ── HiAI: Brain / Neural Network ─────────────────────── */
function HiAIIcon({ size = 24, className }: IconProps) {
  // Pentagon vertices at radius 9 centered at 12,12
  const vertices = [
    { x: 12, y: 3 },   // top
    { x: 20.6, y: 9.3 }, // top-right
    { x: 17.3, y: 19.2 }, // bottom-right
    { x: 6.7, y: 19.2 },  // bottom-left
    { x: 3.4, y: 9.3 },   // top-left
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`module-icon-svg ${className ?? ''}`}
    >
      {/* Lines from center to each vertex */}
      {vertices.map((v, i) => (
        <line
          key={i}
          x1={12}
          y1={12}
          x2={v.x}
          y2={v.y}
          stroke={GOLD}
          strokeWidth={0.8}
          opacity={0.5}
        />
      ))}
      {/* Pentagon outline */}
      <polygon
        points={vertices.map((v) => `${v.x},${v.y}`).join(' ')}
        stroke={GOLD}
        strokeWidth={1.2}
        fill="none"
        opacity={0.6}
      />
      {/* Vertex nodes */}
      {vertices.map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r={2.5} fill={GOLD} opacity={0.7} />
      ))}
      {/* Center node with pulse animation */}
      <circle cx={12} cy={12} r={3.5} fill={GOLD} opacity={0.8} style={{ animation: 'hiaiPulse 2s ease-in-out infinite' }} />
    </svg>
  );
}

/* ── HiTalent: Target / Bullseye ─────────────────────── */
function HiTalentIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`module-icon-svg ${className ?? ''}`}
    >
      {/* Outer ring */}
      <circle cx={12} cy={12} r={9} stroke={GOLD} strokeWidth={1.2} opacity={0.5} />
      {/* Middle ring */}
      <circle cx={12} cy={12} r={6} stroke={GOLD} strokeWidth={1.2} opacity={0.7} />
      {/* Inner ring */}
      <circle cx={12} cy={12} r={3} stroke={GOLD} strokeWidth={1.2} opacity={0.9} />
      {/* Center dot */}
      <circle cx={12} cy={12} r={1.5} fill={GOLD} />
      {/* Animated targeting dot */}
      <circle cx={12} cy={12} r={2.5} fill={GOLD} opacity={0} style={{ animation: 'hitalentTarget 2s ease-in-out infinite' }} />
      {/* Crosshair lines */}
      <line x1={12} y1={1.5} x2={12} y2={5} stroke={GOLD} strokeWidth={0.8} opacity={0.4} />
      <line x1={12} y1={19} x2={12} y2={22.5} stroke={GOLD} strokeWidth={0.8} opacity={0.4} />
      <line x1={1.5} y1={12} x2={5} y2={12} stroke={GOLD} strokeWidth={0.8} opacity={0.4} />
      <line x1={19} y1={12} x2={22.5} y2={12} stroke={GOLD} strokeWidth={0.8} opacity={0.4} />
    </svg>
  );
}

/* ── HiPeople: People / Group ─────────────────────── */
function HiPeopleIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`module-icon-svg ${className ?? ''}`}
      style={{ animation: 'hipeoplePulse 3s ease-in-out infinite' }}
    >
      {/* Center person (slightly larger) */}
      <circle cx={12} cy={8} r={3} fill={GOLD} opacity={0.9} />
      <path
        d="M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5"
        stroke={GOLD}
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
        opacity={0.9}
      />

      {/* Left person */}
      <circle cx={4.5} cy={9.5} r={2.2} fill={GOLD} opacity={0.5} />
      <path
        d="M1 19.5c0-2 1.6-3.5 3.5-3.5S8 17.5 8 19.5"
        stroke={GOLD}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />

      {/* Right person */}
      <circle cx={19.5} cy={9.5} r={2.2} fill={GOLD} opacity={0.5} />
      <path
        d="M16 19.5c0-2 1.6-3.5 3.5-3.5S23 17.5 23 19.5"
        stroke={GOLD}
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
    </svg>
  );
}

/* ── HiPay: Dollar / Coin ─────────────────────── */
function HiPayIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`module-icon-svg ${className ?? ''}`}
    >
      {/* Coin circle */}
      <circle cx={12} cy={12} r={9} stroke={GOLD} strokeWidth={1.4} fill="none" />
      {/* Inner ring */}
      <circle cx={12} cy={12} r={7.5} stroke={GOLD} strokeWidth={0.6} fill="none" opacity={0.4} />
      {/* Dollar sign with spin animation */}
      <g style={{ animation: 'hipaySpin 4s ease-in-out infinite', transformOrigin: '12px 12px' }}>
        <path
          d="M12 5.5v13M9.5 8c0-1 1.1-1.8 2.5-1.8s2.5.8 2.5 1.8-1.1 1.8-2.5 1.8S9.5 11 9.5 12s1.1 1.8 2.5 1.8 2.5.8 2.5 1.8-1.1 1.8-2.5 1.8S9.5 17 9.5 16"
          stroke={GOLD}
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/* ── HiGlobal: Globe with Orbital Ring ─────────────────────── */
function HiGlobalIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`module-icon-svg ${className ?? ''}`}
    >
      {/* Globe circle */}
      <circle cx={12} cy={12} r={9} stroke={GOLD} strokeWidth={1.2} fill="none" />
      {/* Latitude lines */}
      <ellipse cx={12} cy={12} rx={9} ry={4} stroke={GOLD} strokeWidth={0.8} fill="none" opacity={0.4} />
      <ellipse cx={12} cy={8} rx={7.5} ry={2.5} stroke={GOLD} strokeWidth={0.6} fill="none" opacity={0.3} />
      <ellipse cx={12} cy={16} rx={7.5} ry={2.5} stroke={GOLD} strokeWidth={0.6} fill="none" opacity={0.3} />
      {/* Longitude line (vertical) */}
      <ellipse cx={12} cy={12} rx={4} ry={9} stroke={GOLD} strokeWidth={0.8} fill="none" opacity={0.4} />
      {/* Rotating orbital ring */}
      <g style={{ animation: 'higlobalOrbit 8s linear infinite', transformOrigin: '12px 12px' }}>
        <ellipse
          cx={12}
          cy={12}
          rx={10}
          ry={4}
          stroke={GOLD}
          strokeWidth={1}
          fill="none"
          opacity={0.7}
          transform="rotate(-25 12 12)"
        />
        {/* Small satellite dot */}
        <circle cx={22} cy={11} r={1.5} fill={GOLD} opacity={0.9} />
      </g>
    </svg>
  );
}

/* ── HiOps: Gear / Cog ─────────────────────── */
function HiOpsIcon({ size = 24, className }: IconProps) {
  // Gear shape: center at 12,12, outer radius 9, inner radius 6.5, 8 teeth
  const teeth = 8;
  const outerR = 9;
  const innerR = 6.5;
  const toothW = 0.25; // half-angle as fraction of PI/teeth

  // Round to 4 decimal places to guarantee server/client produce identical strings
  // (floating-point cos/sin can vary in the last bits between V8 isolates)
  const r4 = (n: number) => Math.round(n * 10000) / 10000;

  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const baseAngle = (2 * Math.PI * i) / teeth - Math.PI / 2;
    const step = Math.PI / teeth;

    // Outer tooth start
    const a1 = baseAngle - step * toothW;
    points.push(`${r4(12 + outerR * Math.cos(a1))},${r4(12 + outerR * Math.sin(a1))}`);
    // Outer tooth end
    const a2 = baseAngle + step * toothW;
    points.push(`${r4(12 + outerR * Math.cos(a2))},${r4(12 + outerR * Math.sin(a2))}`);
    // Valley start
    const a3 = baseAngle + step * (1 - toothW);
    points.push(`${r4(12 + innerR * Math.cos(a3))},${r4(12 + innerR * Math.sin(a3))}`);
    // Valley end
    const a4 = baseAngle + step * (1 + toothW);
    points.push(`${r4(12 + innerR * Math.cos(a4))},${r4(12 + innerR * Math.sin(a4))}`);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`module-icon-svg ${className ?? ''}`}
    >
      <g style={{ animation: 'hiopsGear 10s linear infinite', transformOrigin: '12px 12px' }}>
        {/* Gear body */}
        <polygon
          points={points.join(' ')}
          stroke={GOLD}
          strokeWidth={1.2}
          fill="none"
          opacity={0.8}
        />
        {/* Center hole */}
        <circle cx={12} cy={12} r={3} stroke={GOLD} strokeWidth={1.2} fill="none" opacity={0.9} />
        {/* Center dot */}
        <circle cx={12} cy={12} r={1} fill={GOLD} opacity={0.6} />
      </g>
    </svg>
  );
}

/* ── Main ModuleIcon Component ─────────────────────── */
interface ModuleIconProps {
  name: ModuleName;
  size?: number;
  className?: string;
}

const iconMap: Record<ModuleName, React.FC<IconProps>> = {
  hiai: HiAIIcon,
  hitalent: HiTalentIcon,
  hipeople: HiPeopleIcon,
  hipay: HiPayIcon,
  higlobal: HiGlobalIcon,
  hiops: HiOpsIcon,
};

export default function ModuleIcon({ name, size = 24, className }: ModuleIconProps) {
  const IconComponent = iconMap[name];
  return <IconComponent size={size} className={className} />;
}

export { HiAIIcon, HiTalentIcon, HiPeopleIcon, HiPayIcon, HiGlobalIcon, HiOpsIcon };
