import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT, WIDTH } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { Petals, Place, SceneFade, Sfx, usePop } from '../common.jsx';

// 片尾（90 帧）
export const Outro = () => {
  const frame = useCurrentFrame();
  const a = usePop(4);
  const b = usePop(22);
  const c = usePop(36);
  const fadeOut = interpolate(frame, [76, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <SceneFade bg={C.cream}>
      <AbsoluteFill style={{ background: 'linear-gradient(#FFD6E2, #FFF6E9)', opacity: fadeOut }}>
        <Petals count={24} speed={0.8} seed="outro" />
        <div style={{ position: 'absolute', top: 560, width: '100%', textAlign: 'center', transform: `scale(${a})`, fontFamily: FONT }}>
          <span style={{ fontSize: 100, fontWeight: 900, color: '#fff', WebkitTextStroke: `12px ${C.brown}`, paintOrder: 'stroke fill' }}>
            {TEXT.outro1}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 780, width: '100%', textAlign: 'center', opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
          <span style={{ background: C.pinkDeep, color: '#fff', fontSize: 58, fontWeight: 900, padding: '18px 44px', borderRadius: 44, border: `6px solid ${C.brown}`, fontFamily: FONT }}>
            {TEXT.outro2}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 960, width: '100%', textAlign: 'center', opacity: c, fontSize: 44, fontWeight: 700, color: C.brown, fontFamily: FONT }}>
          {TEXT.outro3}
        </div>
        <Place x={WIDTH / 2} y={1920 + 120 - c * 120 - 60}>
          <Cat size={480} expression="happy" arms="up" tail={Math.sin(frame / 5) * 16} />
        </Place>
      </AbsoluteFill>
      <Sfx at={30} name="meow" volume={0.8} />
    </SceneFade>
  );
};
