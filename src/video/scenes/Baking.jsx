import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, WIDTH } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { Cake } from '../Props.jsx';
import { BigWord, Caption, Place, SceneFade, Sfx, Sparkles, blinkAt } from '../common.jsx';

// 第三幕：做蛋糕（300 帧）。面粉扑脸 -> 变成白猫 -> 蛋糕完成插旗
const COUNTER = 1250;
const POOF = 95;
const CAKE = 205;
const FLAG = 228;

const Bowl = ({ whisk }) => (
  <svg viewBox="0 0 240 200" width={300} height={250} style={{ overflow: 'visible' }}>
    <g transform={`rotate(${whisk} 120 90)`}>
      <line x1="120" y1="90" x2="160" y2="-40" stroke={C.brown} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="116" cy="96" rx="22" ry="40" fill="none" stroke="#9AA" strokeWidth="6" />
      <ellipse cx="116" cy="96" rx="10" ry="40" fill="none" stroke="#9AA" strokeWidth="6" />
    </g>
    <path d="M10 90 L230 90 Q220 190 120 196 Q20 190 10 90 Z" fill="#9EDFC9" stroke={C.brown} strokeWidth="7" strokeLinejoin="round" />
    <ellipse cx="120" cy="90" rx="110" ry="22" fill="#FFF1DB" stroke={C.brown} strokeWidth="7" />
  </svg>
);

const FlourBag = () => (
  <svg viewBox="0 0 160 200" width={200} height={250} style={{ overflow: 'visible' }}>
    <path d="M20 40 L140 40 L150 190 L10 190 Z" fill="#F4EBDD" stroke={C.brown} strokeWidth="7" strokeLinejoin="round" />
    <path d="M20 40 Q40 10 60 40 Q80 10 100 40 Q120 10 140 40" fill="#F4EBDD" stroke={C.brown} strokeWidth="7" />
    <text x="80" y="130" fontSize="40" fontWeight="900" fill={C.brown} fontFamily={FONT} textAnchor="middle">面粉</text>
  </svg>
);

export const Baking = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const floured = frame >= POOF + 10;
  const shake = frame >= POOF && frame < POOF + 16 ? Math.sin(frame * 3) * 18 : 0;
  const bagTilt = interpolate(frame, [80, POOF], [0, -35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cake = spring({ frame: frame - CAKE, fps, config: { damping: 10 } });
  const flag = spring({ frame: frame - FLAG, fps, config: { damping: 9 } });

  let expression = 'determined';
  let mouth;
  if (frame >= POOF - 8) expression = 'shock';
  if (floured) {
    expression = 'normal';
    mouth = 'flat';
  }
  if (frame >= FLAG) {
    expression = 'happy';
    mouth = undefined;
  }
  const blink = floured && frame < FLAG ? Math.max(blinkAt(frame, 20, 5), 0) : blinkAt(frame);

  return (
    <SceneFade>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
        <AbsoluteFill
          style={{
            background: '#FFF4E4',
            backgroundImage:
              'linear-gradient(rgba(255,160,180,0.25) 4px, transparent 4px), linear-gradient(90deg, rgba(255,160,180,0.25) 4px, transparent 4px)',
            backgroundSize: '120px 120px',
          }}
        />
        <div style={{ position: 'absolute', left: 120, top: 220, width: 300, height: 90, borderRadius: 20, background: '#fff', border: `8px solid ${C.brown}`, fontSize: 52, fontWeight: 900, color: C.pinkDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
          小猫厨房
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 620 + i * 120, top: 240, width: 26, height: 150, background: C.brown, borderRadius: 13 }}>
            <div style={{ position: 'absolute', left: -27, top: 120, width: 80, height: 80, borderRadius: 40, background: ['#FFB7C9', '#9EDFC9', '#FFD95A'][i], border: `7px solid ${C.brown}` }} />
          </div>
        ))}

        <Place x={540} y={COUNTER + 120} z={1}>
          <Cat
            size={600}
            expression={expression}
            mouth={mouth}
            floured={floured}
            arms={frame < POOF - 8 ? 'hold' : frame >= FLAG ? 'up' : 'down'}
            blink={blink}
            tail={Math.sin(frame / 7) * 10}
          />
        </Place>

        <div style={{ position: 'absolute', left: 0, top: COUNTER, width: WIDTH, height: 60, background: '#E4B477', border: `8px solid ${C.brown}`, zIndex: 2 }} />
        <div style={{ position: 'absolute', left: 0, top: COUNTER + 60, width: WIDTH, height: 700, background: '#F7C8A4', zIndex: 2 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 40 + i * 340, top: 60, width: 300, height: 260, borderRadius: 20, border: `8px solid ${C.brown}`, background: '#FAD7BC' }}>
              <div style={{ position: 'absolute', left: 120, top: 30, width: 60, height: 16, borderRadius: 8, background: C.brown }} />
            </div>
          ))}
        </div>

        {frame < CAKE + 4 && (
          <Place x={440} y={COUNTER + 20} z={3} scale={1 - cake}>
            <Bowl whisk={frame < POOF - 8 ? Math.sin(frame / 2.5) * 25 : 0} />
          </Place>
        )}
        <Place x={860} y={COUNTER + 16} rotate={bagTilt} z={3}>
          <FlourBag />
        </Place>

        {frame >= CAKE && (
          <Place x={500} y={COUNTER + 40} scale={cake} z={4}>
            <Cake size={420} flag={TEXT.flag} flagProgress={frame >= FLAG ? flag : 0} />
          </Place>
        )}
        {frame >= FLAG && <Sparkles x={500} y={COUNTER - 200} radius={300} count={9} start={FLAG + 6} />}

        {frame >= POOF &&
          frame < 175 &&
          Array.from({ length: 26 }).map((_, i) => {
            const grow = interpolate(frame, [POOF + random(`pf-d-${i}`) * 6, POOF + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const fade = interpolate(frame, [120, 172], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const x = 300 + random(`pf-x-${i}`) * 560;
            const y = 700 + random(`pf-y-${i}`) * 520 - (frame - POOF) * 1.2;
            const r = 90 + random(`pf-r-${i}`) * 120;
            return (
              <div
                key={i}
                style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: '#fff', opacity: fade * 0.95, transform: `scale(${grow})`, zIndex: 6 }}
              />
            );
          })}
        {frame >= POOF && frame < POOF + 34 && <BigWord x={640} y={560} size={170} color="#fff">{TEXT.bake2}</BigWord>}
      </AbsoluteFill>

      <Caption from={6} dur={80}>{TEXT.bake1}</Caption>
      <Caption from={134} dur={68}>{TEXT.bake3}</Caption>
      <Caption from={FLAG - 4} dur={76}>{TEXT.bake4}</Caption>

      <Sfx at={POOF} name="poof" volume={1} />
      <Sfx at={CAKE} name="pop" />
      <Sfx at={FLAG} name="ding" />
      <Sfx at={FLAG + 8} name="sparkle" />
    </SceneFade>
  );
};
