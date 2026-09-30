import React from 'react';
import { C, FONT } from './theme.js';

const INK = C.brown;

export const MilkTea = ({ size = 160, style }) => (
  <svg viewBox="0 0 100 150" width={size} height={size * 1.5} style={{ overflow: 'visible', ...style }}>
    <line x1="58" y1="0" x2="50" y2="40" stroke="#FF7FA3" strokeWidth="7" strokeLinecap="round" />
    <path d="M14 38 Q50 20 86 38 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M12 40 L88 40 L78 140 Q50 148 22 140 Z" fill="#E9C9A5" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M17 70 L83 70 L78 140 Q50 148 22 140 Z" fill="#C99A72" />
    {[30, 44, 58, 70, 38, 52, 64].map((x, i) => (
      <circle key={i} cx={x} cy={i < 4 ? 128 : 116} r="5.5" fill="#4A2C1E" />
    ))}
    <rect x="30" y="80" width="40" height="22" rx="8" fill="#fff" opacity="0.85" />
    <path d="M42 91 m-4 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 q0 6 -8 11 q-8 -5 -8 -11" fill="#FF7FA3" />
  </svg>
);

export const Donut = ({ size = 140, style }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible', ...style }}>
    <circle cx="50" cy="52" r="44" fill="#E8B777" stroke={INK} strokeWidth="4" />
    <path d="M10 48 Q14 12 50 10 Q88 12 90 48 Q84 62 74 54 Q64 66 54 58 Q42 70 34 58 Q22 66 10 48 Z" fill="#FF9EC0" />
    <circle cx="50" cy="48" r="13" fill={C.cream} stroke={INK} strokeWidth="4" />
    {[[30, 28, '#fff'], [66, 26, C.yellow], [74, 42, C.mint], [26, 44, C.mint], [48, 22, '#8FD0FF']].map(([x, y, c], i) => (
      <rect key={i} x={x} y={y} width="8" height="3.5" rx="2" fill={c} transform={`rotate(${i * 50} ${x} ${y})`} />
    ))}
  </svg>
);

export const Bouquet = ({ size = 160, style }) => (
  <svg viewBox="0 0 100 130" width={size} height={size * 1.3} style={{ overflow: 'visible', ...style }}>
    <path d="M30 60 L50 128 L70 60 Z" fill="#9EDFC9" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {[[30, 40, C.pinkDeep], [52, 28, C.yellow], [72, 42, '#FF9EC0'], [42, 56, '#fff'], [62, 58, C.pinkDeep]].map(([x, y, c], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} rx="7" ry="11" cy="-9" fill={c} stroke={INK} strokeWidth="2.5" transform={`rotate(${a})`} />
        ))}
        <circle r="5" fill={C.gold} stroke={INK} strokeWidth="2" />
      </g>
    ))}
    <path d="M40 92 Q50 100 60 92 L56 104 L50 98 L44 104 Z" fill={C.pinkDeep} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const Cake = ({ size = 360, flag = '', flagProgress = 1, style }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: 'visible', ...style }}>
    <ellipse cx="100" cy="188" rx="92" ry="12" fill="#fff" stroke={INK} strokeWidth="4" />
    <path d="M22 110 L22 176 Q100 196 178 176 L178 110 Z" fill="#FFF1DB" stroke={INK} strokeWidth="4" />
    <path d="M22 140 Q100 158 178 140 L178 152 Q100 170 22 152 Z" fill="#FF9EC0" />
    <ellipse cx="100" cy="110" rx="78" ry="22" fill="#fff" stroke={INK} strokeWidth="4" />
    <path d="M22 110 Q30 130 40 114 Q52 134 64 116 Q78 136 90 118 Q104 138 116 118 Q130 136 142 116 Q156 134 166 114 Q174 128 178 110" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {[[58, 104], [84, 96], [112, 96], [140, 104], [100, 112]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <path d="M0 -12 Q12 -10 10 2 Q6 14 0 16 Q-6 14 -10 2 Q-12 -10 0 -12 Z" fill="#F0435E" stroke={INK} strokeWidth="2.5" />
        <path d="M-6 -12 L0 -6 L6 -12 L0 -16 Z" fill="#5CC08A" />
      </g>
    ))}
    {flag && (
      <g transform={`translate(100 ${30 - (1 - flagProgress) * 140})`} opacity={flagProgress > 0.01 ? 1 : 0}>
        <line x1="0" y1="-10" x2="0" y2="70" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M2 -10 L96 -10 L96 26 L2 26 Z" fill={C.pinkDeep} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <text x="49" y="14" fontSize="19" fontWeight="900" fill="#fff" fontFamily={FONT} textAnchor="middle">
          {flag}
        </text>
      </g>
    )}
  </svg>
);

export const Capsule = ({ size = 140, color = C.pinkDeep, open = 0, gold = false, style }) => {
  const top = gold ? '#FFD84D' : color;
  const bottom = gold ? '#F2A900' : '#fff';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible', ...style }}>
      <g transform={`translate(${-open * 30} ${-open * 40}) rotate(${-open * 40} 50 50)`}>
        <path d="M8 50 A42 42 0 0 1 92 50 Z" fill={top} stroke={INK} strokeWidth="4" />
        <ellipse cx="34" cy="30" rx="10" ry="6" fill="#fff" opacity="0.6" />
      </g>
      <g transform={`translate(${open * 30} ${open * 30}) rotate(${open * 30} 50 50)`}>
        <path d="M8 50 A42 42 0 0 0 92 50 Z" fill={bottom} stroke={INK} strokeWidth="4" />
      </g>
    </svg>
  );
};

const BALL_COLORS = [C.pinkDeep, C.yellow, C.mint, '#8FD0FF', '#C7A6FF', '#FF9EC0'];
const BALLS = [
  [60, 130], [100, 150], [140, 128], [180, 150], [220, 132], [80, 100], [124, 104], [168, 100], [210, 106],
  [100, 72], [150, 70], [190, 78],
];

// jiggle: 扭蛋球抖动幅度（0~1），phase: 抖动相位（传入不断增长的数，比如帧号）
export const GachaMachine = ({ size = 520, knob = 0, jiggle = 0, phase = 0, glow = 0, style }) => (
  <svg viewBox="0 0 280 400" width={size} height={size * (400 / 280)} style={{ overflow: 'visible', ...style }}>
    {glow > 0 && (
      <circle cx="140" cy="120" r="150" fill={C.gold} opacity={glow * 0.35} />
    )}
    <rect x="120" y="0" width="40" height="22" rx="8" fill={C.pinkDeep} stroke={INK} strokeWidth="4" />
    <circle cx="140" cy="120" r="108" fill="#E8F7FF" stroke={INK} strokeWidth="6" />
    <clipPath id="dome">
      <circle cx="140" cy="120" r="104" />
    </clipPath>
    <g clipPath="url(#dome)">
      {BALLS.map(([x, y], i) => (
        <g key={i} transform={`translate(${Math.sin(phase * 1.3 + i) * 12 * jiggle} ${Math.cos(phase * 1.7 + i * 2) * 12 * jiggle})`}>
          <circle cx={x} cy={y + 30} r="24" fill={BALL_COLORS[i % BALL_COLORS.length]} stroke={INK} strokeWidth="4" />
          <path d={`M${x - 24} ${y + 30} L${x + 24} ${y + 30}`} stroke={INK} strokeWidth="3" />
          <path d={`M${x - 24} ${y + 30} A24 24 0 0 0 ${x + 24} ${y + 30} Z`} fill="#fff" opacity="0.85" />
        </g>
      ))}
    </g>
    <ellipse cx="100" cy="68" rx="30" ry="16" fill="#fff" opacity="0.7" transform="rotate(-30 100 68)" />
    <path d="M40 200 L240 200 L256 390 L24 390 Z" fill={C.pinkDeep} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <rect x="30" y="200" width="220" height="24" fill="#FF5C8A" stroke={INK} strokeWidth="6" />
    <text x="140" y="262" fontSize="28" fontWeight="900" fill="#fff" fontFamily={FONT} textAnchor="middle">
      快乐扭蛋
    </text>
    <g transform={`rotate(${knob} 90 312)`}>
      <circle cx="90" cy="312" r="34" fill="#fff" stroke={INK} strokeWidth="6" />
      <rect x="82" y="282" width="16" height="60" rx="8" fill={C.yellow} stroke={INK} strokeWidth="5" />
    </g>
    <rect x="160" y="290" width="70" height="60" rx="12" fill="#6B2440" stroke={INK} strokeWidth="6" />
  </svg>
);

export const Hand = ({ size = 160, pressed = 0, style }) => (
  <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={{ overflow: 'visible', ...style }}>
    <g transform={`scale(${1 - pressed * 0.1})`} style={{ transformOrigin: '30px 0px' }}>
      <path
        d="M24 6 Q24 -4 34 -4 Q44 -4 44 6 L44 48 Q50 40 58 44 Q64 38 72 44 Q80 40 86 48 L88 84 Q86 112 60 116 L40 116 Q18 110 12 88 L4 62 Q2 52 12 52 Q20 52 24 62 Z"
        fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round"
      />
      <path d="M58 46 L58 70 M72 46 L72 72" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
);

export const Bicycle = ({ size = 620, spin = 0, style }) => {
  const wheel = (cx) => (
    <g transform={`translate(${cx} 150)`}>
      <circle r="62" fill="none" stroke={INK} strokeWidth="12" />
      <circle r="62" fill="none" stroke="#555" strokeWidth="5" />
      <g transform={`rotate(${spin})`} stroke={INK} strokeWidth="4">
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1="-58" y1="0" x2="58" y2="0" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r="9" fill={INK} />
    </g>
  );
  return (
    <svg viewBox="0 0 400 230" width={size} height={size * (230 / 400)} style={{ overflow: 'visible', ...style }}>
      {wheel(80)}
      {wheel(320)}
      <g stroke={C.pinkDeep} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M80 150 L170 150 L250 70 L140 70 Z" />
        <path d="M170 150 L130 40" />
        <path d="M250 70 L320 150" />
        <path d="M250 70 L268 20" />
      </g>
      <path d="M105 36 L160 36" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <path d="M252 20 L292 14" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <circle cx="170" cy="150" r="22" fill="#fff" stroke={INK} strokeWidth="5" />
      <g transform={`rotate(${spin * 0.5} 170 150)`}>
        <line x1="136" y1="150" x2="204" y2="150" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <rect x="190" y="143" width="26" height="14" rx="4" fill={C.yellow} stroke={INK} strokeWidth="4" transform={`rotate(${-spin * 0.5} 203 150)`} />
        <rect x="124" y="143" width="26" height="14" rx="4" fill={C.yellow} stroke={INK} strokeWidth="4" transform={`rotate(${-spin * 0.5} 137 150)`} />
      </g>
    </svg>
  );
};

export const Basket = ({ width = 240, style }) => (
  <svg viewBox="0 0 120 70" width={width} height={width * (70 / 120)} style={{ overflow: 'visible', ...style }}>
    <path d="M4 6 L116 6 L104 66 L16 66 Z" fill="#E4B477" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {[26, 46, 66, 86].map((x) => (
      <line key={x} x1={x} y1="8" x2={x - 2 + (x - 60) * -0.05} y2="64" stroke="#B9854A" strokeWidth="3" />
    ))}
    <line x1="10" y1="30" x2="110" y2="30" stroke="#B9854A" strokeWidth="3" />
    <rect x="0" y="0" width="120" height="12" rx="6" fill="#D19A5B" stroke={INK} strokeWidth="4" />
  </svg>
);

export const AlarmClock = ({ size = 200, style }) => (
  <svg viewBox="0 0 120 130" width={size} height={size * (130 / 120)} style={{ overflow: 'visible', ...style }}>
    <circle cx="26" cy="22" r="18" fill={C.yellow} stroke={INK} strokeWidth="5" />
    <circle cx="94" cy="22" r="18" fill={C.yellow} stroke={INK} strokeWidth="5" />
    <line x1="30" y1="110" x2="20" y2="126" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <line x1="90" y1="110" x2="100" y2="126" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    <circle cx="60" cy="70" r="50" fill={C.pinkDeep} stroke={INK} strokeWidth="6" />
    <circle cx="60" cy="70" r="38" fill="#fff" stroke={INK} strokeWidth="4" />
    <line x1="60" y1="70" x2="60" y2="44" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <line x1="60" y1="70" x2="78" y2="70" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <circle cx="60" cy="70" r="5" fill={INK} />
  </svg>
);

export const Flower = ({ size = 60, color = C.pinkDeep, style }) => (
  <svg viewBox="-30 -30 60 60" width={size} height={size} style={{ overflow: 'visible', ...style }}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} rx="10" ry="15" cy="-12" fill={color} transform={`rotate(${a})`} />
    ))}
    <circle r="8" fill={C.gold} />
  </svg>
);

export const Star = ({ size = 60, color = C.gold, style }) => (
  <svg viewBox="-50 -50 100 100" width={size} height={size} style={{ overflow: 'visible', ...style }}>
    <path d="M0 -46 Q8 -8 46 0 Q8 8 0 46 Q-8 8 -46 0 Q-8 -8 0 -46 Z" fill={color} />
  </svg>
);

export const Heart = ({ size = 60, color = C.pinkDeep, style }) => (
  <svg viewBox="0 0 100 90" width={size} height={size * 0.9} style={{ overflow: 'visible', ...style }}>
    <path d="M50 88 Q4 56 4 28 Q4 4 28 4 Q42 4 50 18 Q58 4 72 4 Q96 4 96 28 Q96 56 50 88 Z" fill={color} />
  </svg>
);
