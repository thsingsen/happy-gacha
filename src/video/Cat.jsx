import React from 'react';
import { C } from './theme.js';

// 小猫店长。它本身不会动，所有动作都通过参数控制：
// 视频里由"当前帧"算出参数，网页里由点击和计时器改变参数，所以两边都能复用。
//
// expression: normal | sleepy | happy | shock | shy | determined
// mouth: w | open | o | flat（不传时跟随表情）
// arms: down | up | hold | face
// blink: 0 睁眼 ~ 1 闭眼
// tail: 尾巴摆动角度（度）
// floured: 被面粉扑成白猫
// puffed: 炸毛

const DEFAULT_MOUTH = {
  normal: 'w',
  sleepy: 'w',
  happy: 'open',
  shock: 'o',
  shy: 'w',
  determined: 'flat',
};

function spikes(cx, cy, r1, r2, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n;
    const r = i % 2 === 0 ? r1 : r2;
    pts.push(`${cx + Math.cos(a) * r * 0.85},${cy + Math.sin(a) * r}`);
  }
  return pts.join(' ');
}

function Eyes({ expression, blink }) {
  const ink = C.brown;
  if (expression === 'sleepy') {
    return (
      <g stroke={ink} strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M128 182 Q150 198 172 182" />
        <path d="M228 182 Q250 198 272 182" />
      </g>
    );
  }
  if (expression === 'happy') {
    return (
      <g stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round">
        <path d="M128 192 Q150 162 172 192" />
        <path d="M228 192 Q250 162 272 192" />
      </g>
    );
  }
  if (expression === 'shy') {
    return (
      <g stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M132 168 L166 182 L132 196" />
        <path d="M268 168 L234 182 L268 196" />
      </g>
    );
  }
  if (expression === 'shock') {
    return (
      <g>
        {[150, 250].map((x) => (
          <g key={x}>
            <circle cx={x} cy="180" r="30" fill="#fff" stroke={ink} strokeWidth="6" />
            <circle cx={x} cy="180" r="9" fill={ink} />
          </g>
        ))}
      </g>
    );
  }
  const sy = Math.max(0.08, 1 - blink);
  return (
    <g>
      {[150, 250].map((x) => (
        <g key={x} transform={`translate(${x} 182) scale(1 ${sy})`}>
          <ellipse rx="17" ry="23" fill={ink} />
          <circle cx="6" cy="-9" r="6.5" fill="#fff" />
          <circle cx="-5" cy="7" r="3" fill="#fff" opacity="0.8" />
        </g>
      ))}
      {expression === 'determined' && (
        <g stroke={ink} strokeWidth="8" strokeLinecap="round">
          <line x1="122" y1="140" x2="172" y2="152" />
          <line x1="278" y1="140" x2="228" y2="152" />
        </g>
      )}
    </g>
  );
}

function Mouth({ type }) {
  const ink = C.brown;
  if (type === 'open') {
    return (
      <g>
        <path d="M176 222 Q200 262 224 222 Z" fill="#E0566F" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        <path d="M188 238 Q200 250 212 238" fill="#FF9EB0" />
      </g>
    );
  }
  if (type === 'o') {
    return <ellipse cx="200" cy="238" rx="14" ry="18" fill="#E0566F" stroke={ink} strokeWidth="5" />;
  }
  if (type === 'flat') {
    return <line x1="184" y1="230" x2="216" y2="230" stroke={ink} strokeWidth="6" strokeLinecap="round" />;
  }
  return (
    <path d="M178 222 Q189 236 200 222 Q211 236 222 222" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
  );
}

function Arm({ side, pose, fur, line }) {
  const s = side === 'left' ? -1 : 1;
  const shoulder = { x: 200 + s * 70, y: 272 };
  const paw = {
    down: { x: 200 + s * 62, y: 318 },
    up: { x: 200 + s * 150, y: 150 },
    hold: { x: 200 + s * 38, y: 268 },
    face: { x: 200 + s * 48, y: 196 },
  }[pose];
  return (
    <g>
      <line x1={shoulder.x} y1={shoulder.y} x2={paw.x} y2={paw.y} stroke={line} strokeWidth="50" strokeLinecap="round" />
      <line x1={shoulder.x} y1={shoulder.y} x2={paw.x} y2={paw.y} stroke={fur} strokeWidth="40" strokeLinecap="round" />
      <circle cx={paw.x} cy={paw.y} r="30" fill={fur} stroke={line} strokeWidth="5" />
      <g stroke={line} strokeWidth="4" strokeLinecap="round">
        <line x1={paw.x - 9} y1={paw.y + 14} x2={paw.x - 9} y2={paw.y + 24} />
        <line x1={paw.x + 9} y1={paw.y + 14} x2={paw.x + 9} y2={paw.y + 24} />
      </g>
    </g>
  );
}

export const Cat = ({
  expression = 'normal',
  mouth,
  arms = 'down',
  blink = 0,
  tail = 0,
  floured = false,
  puffed = false,
  size = 400,
  style,
}) => {
  const fur = floured ? '#FBF8F3' : C.orange;
  const stripe = floured ? '#F3D9BC' : C.orangeDark;
  const belly = floured ? '#FFFFFF' : C.catCream;
  const line = C.brown;
  const mouthType = mouth ?? DEFAULT_MOUTH[expression];
  const armsInFront = arms === 'face' || arms === 'hold';

  return (
    <svg viewBox="0 0 400 450" width={size} height={size * 1.125} style={{ overflow: 'visible', ...style }}>
      {puffed && (
        <g fill={fur} stroke={line} strokeWidth="5" strokeLinejoin="round">
          <polygon points={spikes(200, 330, 150, 118, 18)} />
          <polygon points={spikes(200, 170, 172, 140, 20)} />
        </g>
      )}

      <g transform={`rotate(${tail} 300 380)`}>
        <path d="M300 380 Q390 360 372 250" fill="none" stroke={line} strokeWidth="40" strokeLinecap="round" />
        <path d="M300 380 Q390 360 372 250" fill="none" stroke={fur} strokeWidth="30" strokeLinecap="round" />
        <path d="M380 290 L365 285 M384 270 L368 268" stroke={stripe} strokeWidth="8" strokeLinecap="round" />
      </g>

      <ellipse cx="145" cy="425" rx="40" ry="22" fill={fur} stroke={line} strokeWidth="5" />
      <ellipse cx="255" cy="425" rx="40" ry="22" fill={fur} stroke={line} strokeWidth="5" />

      <ellipse cx="200" cy="335" rx="122" ry="100" fill={fur} stroke={line} strokeWidth="5" />
      <ellipse cx="200" cy="350" rx="72" ry="64" fill={belly} />

      {!armsInFront && <Arm side="left" pose={arms} fur={fur} line={line} />}
      {!armsInFront && <Arm side="right" pose={arms} fur={fur} line={line} />}

      <path d="M112 76 L100 12 L176 60 Z" fill={fur} stroke={line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M288 76 L300 12 L224 60 Z" fill={fur} stroke={line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M118 66 L110 30 L152 58 Z" fill={C.pink} />
      <path d="M282 66 L290 30 L248 58 Z" fill={C.pink} />

      <ellipse cx="200" cy="170" rx="138" ry="116" fill={fur} stroke={line} strokeWidth="5" />
      <g stroke={stripe} strokeWidth="9" strokeLinecap="round">
        <line x1="200" y1="62" x2="200" y2="92" />
        <line x1="176" y1="66" x2="180" y2="90" />
        <line x1="224" y1="66" x2="220" y2="90" />
      </g>
      <ellipse cx="200" cy="222" rx="62" ry="40" fill={belly} opacity="0.9" />

      <path d="M170 262 Q200 276 230 262" stroke="#E0566F" strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="200" cy="280" r="13" fill={C.gold} stroke={line} strokeWidth="4" />
      <line x1="200" y1="283" x2="200" y2="292" stroke={line} strokeWidth="3" />

      <Eyes expression={expression} blink={blink} />
      <ellipse
        cx="110" cy="218" rx="24" ry="13" fill={C.pinkDeep}
        opacity={expression === 'shy' ? 0.85 : 0.45}
      />
      <ellipse
        cx="290" cy="218" rx="24" ry="13" fill={C.pinkDeep}
        opacity={expression === 'shy' ? 0.85 : 0.45}
      />
      <path d="M192 206 L208 206 L200 216 Z" fill={C.pinkDeep} stroke={line} strokeWidth="3" strokeLinejoin="round" />
      <Mouth type={mouthType} />
      <g stroke={line} strokeWidth="3.5" strokeLinecap="round">
        <line x1="62" y1="200" x2="112" y2="208" />
        <line x1="58" y1="226" x2="110" y2="224" />
        <line x1="338" y1="200" x2="288" y2="208" />
        <line x1="342" y1="226" x2="290" y2="224" />
      </g>

      {floured && (
        <g fill="#fff" opacity="0.95">
          <circle cx="120" cy="120" r="14" />
          <circle cx="280" cy="250" r="10" />
          <circle cx="240" cy="110" r="8" />
          <circle cx="160" cy="370" r="12" />
          <circle cx="268" cy="330" r="9" />
        </g>
      )}

      {armsInFront && <Arm side="left" pose={arms} fur={fur} line={line} />}
      {armsInFront && <Arm side="right" pose={arms} fur={fur} line={line} />}
    </svg>
  );
};
