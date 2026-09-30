import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { C, FONT } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { AlarmClock } from '../Props.jsx';
import { BigWord, Caption, Place, SceneFade, Sfx, SpeedLines, usePop } from '../common.jsx';

// 第一幕：闹钟响 -> 看日历 -> 炸毛 -> 冲出门（240 帧）
const Room = () => (
  <>
    <AbsoluteFill style={{ background: 'linear-gradient(#FFE9D6, #FFDCC4)' }} />
    <div style={{ position: 'absolute', left: 90, top: 260, width: 380, height: 420, borderRadius: 30, background: C.sky, border: `10px solid ${C.brown}` }}>
      <div style={{ position: 'absolute', left: 175, top: 0, width: 10, height: '100%', background: C.brown }} />
      <div style={{ position: 'absolute', top: 195, left: 0, height: 10, width: '100%', background: C.brown }} />
      <div style={{ position: 'absolute', left: 40, top: 40, width: 110, height: 110, borderRadius: 55, background: '#FFE58A' }} />
    </div>
    <div style={{ position: 'absolute', left: 0, top: 1380, width: '100%', height: 540, background: '#E9B98C' }} />
    <div style={{ position: 'absolute', left: 0, top: 1380, width: '100%', height: 14, background: C.brown, opacity: 0.4 }} />
  </>
);

const Calendar = ({ scale = 1, x = 800, y = 560 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${scale})`,
      zIndex: scale > 1.01 ? 10 : 0,
      width: 360,
      whiteSpace: 'nowrap',
      background: '#fff',
      border: `8px solid ${C.brown}`,
      borderRadius: 24,
      overflow: 'hidden',
      fontFamily: FONT,
      textAlign: 'center',
      boxShadow: '0 12px 0 rgba(107,68,50,0.2)',
    }}
  >
    <div style={{ background: C.pinkDeep, color: '#fff', fontSize: 40, fontWeight: 900, padding: '10px 0', borderBottom: `6px solid ${C.brown}` }}>
      {TEXT.calendarTitle}
    </div>
    <div style={{ fontSize: 42, fontWeight: 900, color: C.brown, padding: '26px 8px', lineHeight: 1.3 }}>
      <span style={{ border: `6px solid #F0435E`, borderRadius: 60, padding: '4px 10px' }}>{TEXT.calendarTask}</span>
    </div>
  </div>
);

export const WakeUp = () => {
  const frame = useCurrentFrame();

  const ringing = frame >= 45 && frame < 110;
  const clockShake = ringing ? Math.sin(frame * 2.2) * 14 : 0;
  const clockHop = ringing ? Math.abs(Math.sin(frame * 1.1)) * 26 : 0;

  const zoom = interpolate(frame, [118, 136, 168, 178], [1, 2.3, 2.3, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const calX = interpolate(zoom, [1, 2.3], [800, 540]);
  const calY = interpolate(zoom, [1, 2.3], [560, 800]);

  const jump = usePop(178, { damping: 8, stiffness: 200 });
  const jumpY = frame >= 178 && frame < 200 ? -Math.sin(((frame - 178) / 22) * Math.PI) * 260 : 0;
  const dash = interpolate(frame, [206, 228], [0, 1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  let expression = 'sleepy';
  if (frame >= 100) expression = 'normal';
  if (frame >= 178) expression = 'shock';
  if (frame >= 200) expression = 'determined';

  const breathe = frame < 100 ? Math.sin(frame / 10) * 0.02 : 0;
  const halfOpen = frame >= 100 && frame < 118 ? 0.55 : 0;

  return (
    <SceneFade>
      <Room />
      <Calendar scale={zoom} x={calX} y={calY} />

      <div style={{ position: 'absolute', left: 80, top: 1180, width: 820, height: 200, borderRadius: 40, background: '#fff', border: `10px solid ${C.brown}` }} />
      <div style={{ position: 'absolute', left: 60, top: 1100, width: 60, height: 300, borderRadius: 20, background: '#C98A5B', border: `10px solid ${C.brown}` }} />

      <Place x={420 + dash} y={1310 + jumpY} scale={(1 + breathe) * (frame >= 178 ? 0.9 + jump * 0.1 : 1)} rotate={frame < 100 ? -8 : 0} z={2}>
        <Cat
          size={560}
          expression={expression}
          blink={halfOpen}
          puffed={frame >= 178 && frame < 206}
          arms={frame >= 178 && frame < 206 ? 'up' : 'down'}
          tail={Math.sin(frame / 8) * 10}
        />
      </Place>
      {frame < 205 && (
        <div style={{ position: 'absolute', left: 80, top: 1020, width: 660, height: 330, borderRadius: '40px 40px 20px 20px', background: '#9FD4F5', border: `10px solid ${C.brown}`, zIndex: 3, transform: `translateY(${frame >= 178 ? 120 : 0}px)` }} />
      )}

      {frame < 100 &&
        [0, 1, 2].map((i) => {
          const t = (frame + i * 22) % 66;
          return (
            <div
              key={i}
              style={{ position: 'absolute', left: 640 + t * 1.5, top: 900 - t * 4, fontSize: 60 + i * 16, fontWeight: 900, color: C.brown, opacity: 1 - t / 66, fontFamily: FONT }}
            >
              Z
            </div>
          );
        })}

      <Place x={930} y={1080 - clockHop} rotate={clockShake}>
        <AlarmClock size={200} />
      </Place>
      {ringing && <BigWord x={780} y={820} scale={1 + Math.sin(frame) * 0.05}>{TEXT.alarm}</BigWord>}

      {frame >= 178 && frame < 206 && <BigWord x={540} y={420} size={200} color={C.yellow} rotate={0}>！！</BigWord>}
      {frame >= 204 && <SpeedLines opacity={interpolate(frame, [204, 210], [0, 1], { extrapolateRight: 'clamp' })} />}

      <Caption from={4} dur={96}>{TEXT.wake1}</Caption>
      <Caption from={112} dur={62}>{TEXT.wake2}</Caption>
      <Caption from={180} dur={60}>{TEXT.wake3}</Caption>

      <Sfx at={45} name="alarm" volume={0.5} />
      <Sfx at={120} name="whoosh" volume={0.5} />
      <Sfx at={178} name="boing" />
      <Sfx at={204} name="whoosh" />
    </SceneFade>
  );
};
