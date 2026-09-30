import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, WIDTH } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { Hand } from '../Props.jsx';
import { Caption, Confetti, Petals, Place, SceneFade, Sfx, blinkAt } from '../common.jsx';

// 尾声（270 帧）："没有"按钮一直逃跑，手指只好点了"笑了"
const YES = { x: 320, y: 840 };
// "没有"按钮的逃跑路线：[从第几帧开始逃, 逃到的位置]
const NO_ROUTE = [
  [0, { x: 760, y: 840 }],
  [84, { x: 870, y: 1330 }],
  [124, { x: 190, y: 1300 }],
  [158, { x: 900, y: 400 }],
];
const HAND_ROUTE = [
  [56, { x: 1100, y: 1900 }],
  [80, { x: 790, y: 870 }],
  [112, { x: 900, y: 1360 }],
  [148, { x: 220, y: 1330 }],
  [178, { x: 220, y: 1330 }],
  [196, { x: YES.x + 30, y: YES.y + 30 }],
];
const CLICK = 198;

const lerp = (a, b, p) => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p });

// 按钮：到了某一帧就"嗖"地弹到下一个位置
const escapeAlong = (route, frame, fps) => {
  let pos = route[0][1];
  for (const [start, to] of route.slice(1)) {
    if (frame < start) break;
    pos = lerp(pos, to, spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 180 } }));
  }
  return pos;
};

// 手指：在相邻两个时间点之间平滑移动
const moveAlong = (route, frame) => {
  for (let i = 1; i < route.length; i++) {
    const [t0, from] = route[i - 1];
    const [t1, to] = route[i];
    if (frame < t1) {
      const p = interpolate(frame, [t0, t1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
      return lerp(from, to, p);
    }
  }
  return route[route.length - 1][1];
};

const Button = ({ x, y, label, color, scale = 1, z = 5 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${scale})`,
      padding: '26px 64px',
      borderRadius: 60,
      background: color,
      border: `8px solid ${C.brown}`,
      boxShadow: '0 12px 0 rgba(107,68,50,0.3)',
      color: '#fff',
      fontSize: 72,
      fontWeight: 900,
      fontFamily: FONT,
      zIndex: z,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

export const Ending = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sign = spring({ frame, fps, config: { damping: 11 } });
  const btns = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const no = escapeAlong(NO_ROUTE, frame, fps);
  const hand = moveAlong(HAND_ROUTE, frame);
  const handIn = frame >= 56 && frame < CLICK + 24;
  const pressed = interpolate(frame, [CLICK - 2, CLICK, CLICK + 6], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const confused = frame >= 158 && frame < 180;
  const done = frame >= CLICK;
  const spin = done ? interpolate(frame, [CLICK + 6, CLICK + 50], [0, 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const noShrink = frame >= 158 ? 0.7 : 1;

  let expression = 'normal';
  if (frame >= 84 && frame < CLICK) expression = 'shy';
  if (done) expression = 'happy';

  return (
    <SceneFade>
      <AbsoluteFill style={{ background: 'linear-gradient(#E4F7EE, #FFF6E9)' }} />
      <div style={{ position: 'absolute', left: 0, top: 1500, width: WIDTH, height: 420, background: '#CDEBD9', borderTop: `8px solid ${C.brown}` }} />

      <div style={{ position: 'absolute', left: WIDTH / 2, top: 560, transform: `translate(-50%,-50%) scale(${sign}) rotate(${Math.sin(frame / 12) * 2}deg)`, zIndex: 3 }}>
        <div style={{ position: 'absolute', left: 90, top: 150, width: 20, height: 560, background: '#C98A5B', border: `6px solid ${C.brown}`, borderRadius: 10, zIndex: -1 }} />
        <div style={{ position: 'absolute', right: 90, top: 150, width: 20, height: 560, background: '#C98A5B', border: `6px solid ${C.brown}`, borderRadius: 10, zIndex: -1 }} />
        <div style={{ padding: '36px 70px', background: '#fff', border: `10px solid ${C.brown}`, borderRadius: 36, fontSize: 96, fontWeight: 900, color: C.brown, fontFamily: FONT, whiteSpace: 'nowrap' }}>
          {TEXT.sign}
        </div>
      </div>

      <Place x={WIDTH / 2} y={1540} z={2}>
        <div style={{ transform: `scaleX(${Math.cos(spin * Math.PI)})` }}>
          <Cat size={520} expression={expression} arms="up" blink={blinkAt(frame)} tail={Math.sin(frame / 5) * 16} />
        </div>
      </Place>

      <Button x={YES.x} y={YES.y} label={TEXT.yes} color={C.pinkDeep} scale={btns * (1 - pressed * 0.15) * (done ? 1 + Math.sin((frame - CLICK) / 4) * 0.04 : 1)} />
      {frame < CLICK + 10 && (
        <Button x={no.x} y={no.y} label={TEXT.no} color="#A8A8B8" scale={btns * noShrink} />
      )}
      {frame >= 160 && frame < CLICK && (
        <div style={{ position: 'absolute', left: no.x - 40, top: no.y - 150, fontSize: 60, fontWeight: 900, color: C.brown, fontFamily: FONT, zIndex: 6, transform: `rotate(${Math.sin(frame / 3) * 10}deg)` }}>
          略略略
        </div>
      )}

      {handIn && (
        <div style={{ position: 'absolute', left: hand.x - 50, top: hand.y + (confused ? Math.sin(frame * 1.5) * 8 : 0), zIndex: 30 }}>
          <Hand size={150} pressed={pressed} />
          {confused && (
            <div style={{ position: 'absolute', left: 140, top: -40, fontSize: 90, fontWeight: 900, color: C.brown, fontFamily: FONT }}>？</div>
          )}
        </div>
      )}

      {done && <Petals count={36} start={CLICK} speed={1.4} seed="end" />}
      <Confetti x={YES.x} y={YES.y} start={CLICK} count={40} seed="yes" />

      <Caption from={128} dur={64}>{TEXT.endTease}</Caption>
      <Caption from={CLICK + 4} dur={66}>{TEXT.endDone}</Caption>

      <Sfx at={30} name="pop" />
      {NO_ROUTE.slice(1).map(([f]) => (
        <Sfx key={f} at={f} name="whoosh" />
      ))}
      <Sfx at={CLICK} name="click" volume={1} />
      <Sfx at={CLICK + 2} name="fanfare" />
    </SceneFade>
  );
};
