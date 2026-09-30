import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame } from 'remotion';
import { C, FONT, WIDTH } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { Place, SceneFade, Sfx, Sparkles, blinkAt, usePop } from '../common.jsx';

// 片头：星空切到清晨，频道标题弹出，小猫从底部探头
export const Intro = () => {
  const frame = useCurrentFrame();
  const dawn = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const top = interpolateColors(dawn, [0, 1], ['#1E2256', '#FFD6E2']);
  const bottom = interpolateColors(dawn, [0, 1], ['#3B3F8C', '#FFF3DA']);
  const title = usePop(32);
  const sub = usePop(50);
  const peek = usePop(66, { damping: 10 });

  return (
    <SceneFade>
      <AbsoluteFill style={{ background: `linear-gradient(${top}, ${bottom})` }} />
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: random(`star-x-${i}`) * WIDTH,
            top: random(`star-y-${i}`) * 1100,
            width: 8,
            height: 8,
            borderRadius: 4,
            background: '#fff',
            opacity: (1 - dawn) * (0.5 + 0.5 * Math.sin(frame / 4 + i)),
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: WIDTH / 2 - 170,
          top: interpolate(dawn, [0, 1], [1500, 1180]),
          width: 340,
          height: 340,
          borderRadius: 170,
          background: 'radial-gradient(#FFE58A, #FFB96B)',
          opacity: dawn,
          boxShadow: '0 0 160px 60px rgba(255,210,120,0.5)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 520,
          width: '100%',
          textAlign: 'center',
          transform: `scale(${title}) rotate(${(1 - title) * -10}deg)`,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: 118,
            fontWeight: 900,
            color: '#fff',
            WebkitTextStroke: `14px ${C.brown}`,
            paintOrder: 'stroke fill',
            letterSpacing: 6,
            textShadow: '0 12px 0 rgba(107,68,50,0.25)',
          }}
        >
          {TEXT.channel}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 720,
          width: '100%',
          textAlign: 'center',
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
        }}
      >
        <span
          style={{
            background: C.pinkDeep,
            color: '#fff',
            fontSize: 52,
            fontWeight: 900,
            padding: '16px 40px',
            borderRadius: 40,
            border: `6px solid ${C.brown}`,
          }}
        >
          {TEXT.episode}
        </span>
      </div>
      <Sparkles x={WIDTH / 2} y={600} radius={460} count={10} start={36} />

      <Place x={WIDTH / 2} y={1920 + 380 - peek * 380}>
        <Cat size={560} expression="happy" arms="up" blink={blinkAt(frame)} tail={Math.sin(frame / 6) * 12} />
      </Place>

      <Sfx at={32} name="ding" />
      <Sfx at={66} name="boing" volume={0.6} />
    </SceneFade>
  );
};
