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
  const shoulder = { x: 200 + s * 56, y: 276 };
  const paw = {
    down: { x: 200 + s * 56, y: 334 },
    up: { x: 200 + s * 140, y: 150 },
    hold: { x: 200 + s * 34, y: 272 },
    face: { x: 200 + s * 48, y: 196 },
  }[pose];
  return (
    <g>
      <line x1={shoulder.x} y1={shoulder.y} x2={paw.x} y2={paw.y} stroke={line} strokeWidth="34" strokeLinecap="round" />
      <line x1={shoulder.x} y1={shoulder.y} x2={paw.x} y2={paw.y} stroke={fur} strokeWidth="25" strokeLinecap="round" />
      <circle cx={paw.x} cy={paw.y} r="21" fill={fur} stroke={line} strokeWidth="5" />
      <g stroke={line} strokeWidth="3.5" strokeLinecap="round">
        <line x1={paw.x - 6} y1={paw.y + 10} x2={paw.x - 6} y2={paw.y + 17} />
        <line x1={paw.x + 6} y1={paw.y + 10} x2={paw.x + 6} y2={paw.y + 17} />
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
  const fur = floured ? '#FBF8F3' : C.catFur;
  const stripe = floured ? '#F3D9BC' : C.catStripe;
  const belly = floured ? '#FFFFFF' : C.catBelly;
  const line = C.brown;
  const mouthType = mouth ?? DEFAULT_MOUTH[expression];
  const armsInFront = arms === 'face' || arms === 'hold';

  return (
    <svg viewBox="0 0 400 450" width={size} height={size * 1.125} style={{ overflow: 'visible', ...style }}>
      {puffed && (
        <g fill={fur} stroke={line} strokeWidth="5" strokeLinejoin="round">
          <polygon points={spikes(200, 335, 112, 90, 16)} />
          <polygon points={spikes(200, 170, 150, 124, 20)} />
        </g>
      )}

      <g transform={`rotate(${tail} 262 395)`}>
        <path d="M262 395 Q372 392 356 262 Q352 232 376 222" fill="none" stroke={line} strokeWidth="26" strokeLinecap="round" />
        <path d="M262 395 Q372 392 356 262 Q352 232 376 222" fill="none" stroke={fur} strokeWidth="17" strokeLinecap="round" />
        <path d="M349 310 L367 306 M349 288 L367 286" stroke={stripe} strokeWidth="6" strokeLinecap="round" />
      </g>

      {[172, 228].map((x) => (
        <g key={x}>
          <line x1={x} y1="370" x2={x} y2="420" stroke={line} strokeWidth="34" strokeLinecap="round" />
          <line x1={x} y1="370" x2={x} y2="420" stroke={fur} strokeWidth="24" strokeLinecap="round" />
          <ellipse cx={x + (x < 200 ? -6 : 6)} cy="428" rx="27" ry="16" fill={fur} stroke={line} strokeWidth="5" />
        </g>
      ))}

      <ellipse cx="200" cy="332" rx="80" ry="98" fill={fur} stroke={line} strokeWidth="5" />
      <ellipse cx="200" cy="350" rx="46" ry="62" fill={belly} />
      <g stroke={stripe} strokeWidth="7" strokeLinecap="round">
        <line x1="126" y1="320" x2="144" y2="324" />
        <line x1="124" y1="344" x2="142" y2="346" />
        <line x1="274" y1="320" x2="256" y2="324" />
        <line x1="276" y1="344" x2="258" y2="346" />
      </g>

      {!armsInFront && <Arm side="left" pose={arms} fur={fur} line={line} />}
      {!armsInFront && <Arm side="right" pose={arms} fur={fur} line={line} />}

      <path d="M126 84 L112 14 L182 62 Z" fill={fur} stroke={line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M274 84 L288 14 L218 62 Z" fill={fur} stroke={line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M131 72 L121 34 L160 60 Z" fill={C.pinkDeep} />
      <path d="M269 72 L279 34 L240 60 Z" fill={C.pinkDeep} />

      <ellipse cx="200" cy="170" rx="120" ry="104" fill={fur} stroke={line} strokeWidth="5" />
      <g stroke={stripe} strokeWidth="8" strokeLinecap="round">
        <line x1="200" y1="72" x2="200" y2="98" />
        <line x1="178" y1="76" x2="182" y2="96" />
        <line x1="222" y1="76" x2="218" y2="96" />
      </g>
      <ellipse cx="200" cy="222" rx="62" ry="40" fill={belly} opacity="0.9" />

      <path d="M170 262 Q200 276 230 262" stroke="#E0566F" strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="200" cy="280" r="13" fill={C.gold} stroke={line} strokeWidth="4" />
      <line x1="200" y1="283" x2="200" y2="292" stroke={line} strokeWidth="3" />

      <Eyes expression={expression} blink={blink} />
      <ellipse
        cx="122" cy="218" rx="22" ry="12" fill="#FF5C8A"
        opacity={expression === 'shy' ? 0.8 : 0.4}
      />
      <ellipse
        cx="278" cy="218" rx="22" ry="12" fill="#FF5C8A"
        opacity={expression === 'shy' ? 0.8 : 0.4}
      />
      <path d="M192 206 L208 206 L200 216 Z" fill="#E0566F" stroke={line} strokeWidth="3" strokeLinejoin="round" />
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
