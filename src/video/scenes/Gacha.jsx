import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, WIDTH } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { Capsule, GachaMachine } from '../Props.jsx';
import { Caption, Confetti, Place, SceneFade, Sfx, Sparkles, blinkAt } from '../common.jsx';

// 第四幕：快乐扭蛋机（360 帧）。第一颗开出夸夸券，第二颗是金色隐藏款
const SPIN1 = 50;
const OPEN1 = 104;
const SPIN2 = 196;
const OPEN2 = 262;

const PrizeCard = ({ title, text, gold, s }) => (
  <div
    style={{
      position: 'absolute',
      left: WIDTH / 2,
      top: 820,
      transform: `translate(-50%, -50%) scale(${s}) rotate(${(1 - s) * 20}deg)`,
      width: 820,
      padding: '44px 30px 50px',
      borderRadius: 50,
      background: gold ? 'linear-gradient(#FFF3B0, #FFD24D)' : '#fff',
      border: `10px solid ${C.brown}`,
      boxShadow: '0 16px 0 rgba(107,68,50,0.25)',
      textAlign: 'center',
      fontFamily: FONT,
      zIndex: 20,
    }}
  >
    <div style={{ display: 'inline-block', padding: '10px 40px', borderRadius: 40, background: gold ? '#F2A900' : C.pinkDeep, color: '#fff', fontSize: 64, fontWeight: 900, border: `6px solid ${C.brown}` }}>
      {title}
    </div>
    <div style={{ marginTop: 30, fontSize: gold ? 110 : 68, fontWeight: 900, color: C.brown, lineHeight: 1.35, whiteSpace: 'pre-line' }}>
      {text}
    </div>
  </div>
);

export const Gacha = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 12 } });
  const knob =
    interpolate(frame, [SPIN1, SPIN1 + 28], [0, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) }) +
    interpolate(frame, [SPIN2, SPIN2 + 40], [0, 720], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });

  const wild = frame >= SPIN2 && frame < OPEN2 - 20;
  const shakeAmt = wild ? interpolate(frame, [SPIN2, OPEN2 - 26], [4, 22], { extrapolateRight: 'clamp' }) : frame >= SPIN1 && frame < SPIN1 + 28 ? 3 : 0;
  const shake = Math.sin(frame * 2.7) * shakeAmt;
  const jiggle = frame >= SPIN1 && frame < OPEN2 - 20 ? (wild ? 1 : frame < SPIN1 + 28 ? 0.4 : 0) : 0;
  const glow = interpolate(frame, [SPIN2 + 10, OPEN2 - 20, OPEN2 + 60], [0, 1, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const capsuleAt = (dropFrame, openFrame) => {
    const drop = interpolate(frame, [dropFrame, dropFrame + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bounce });
    const roll = interpolate(frame, [dropFrame + 12, openFrame - 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
    const open = interpolate(frame, [openFrame - 4, openFrame + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { x: 680 - roll * 180, y: 1290 + drop * 160, rot: -roll * 360, open };
  };
  const cap1 = capsuleAt(SPIN1 + 26, OPEN1);
  const cap2 = capsuleAt(OPEN2 - 26, OPEN2);
  const card1 = spring({ frame: frame - OPEN1, fps, config: { damping: 11 } });
  const card1Out = interpolate(frame, [SPIN2 - 14, SPIN2 - 2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const card2 = spring({ frame: frame - OPEN2, fps, config: { damping: 9 } });

  let expression = 'happy';
  if (frame >= SPIN1 && frame < OPEN1) expression = 'determined';
  if (frame >= SPIN2 && frame < OPEN2) expression = 'shock';

  const rays = frame >= OPEN2 - 20;

  return (
    <SceneFade>
      <AbsoluteFill
        style={{
          background: '#FFE3EC',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 14px, transparent 15px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `${frame * 1.5}px ${frame * 1.5}px`,
        }}
      />
      {rays && (
        <div
          style={{
            position: 'absolute',
            left: WIDTH / 2 - 1100,
            top: 820 - 1100,
            width: 2200,
            height: 2200,
            borderRadius: '50%',
            background: 'repeating-conic-gradient(rgba(255,210,77,0.55) 0deg 12deg, rgba(255,255,255,0) 12deg 24deg)',
            transform: `rotate(${frame * 1.2}deg)`,
            opacity: interpolate(frame, [OPEN2 - 20, OPEN2], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        />
      )}
      <div style={{ position: 'absolute', left: 0, top: 1420, width: WIDTH, height: 500, background: '#FFC7D6', borderTop: `8px solid ${C.brown}` }} />

      <Place x={620 + shake} y={1440} scale={enter} z={2}>
        <GachaMachine size={520} knob={knob} jiggle={jiggle} phase={frame} glow={glow} />
      </Place>

      <Place x={230} y={1460} z={3} rotate={frame >= SPIN2 && frame < OPEN2 ? Math.sin(frame) * 4 : 0}>
        <Cat size={380} expression={expression} arms={frame >= SPIN1 && frame < SPIN1 + 28 ? 'hold' : 'up'} blink={blinkAt(frame)} tail={Math.sin(frame / 5) * 14} puffed={frame >= SPIN2 + 20 && frame < OPEN2} />
      </Place>

      {frame >= SPIN1 + 26 && frame < OPEN1 + 20 && (
        <Place x={cap1.x} y={cap1.y} rotate={cap1.open > 0 ? 0 : cap1.rot} origin="center" z={4} opacity={interpolate(frame, [OPEN1 + 8, OPEN1 + 20], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Capsule size={130} color={C.pinkDeep} open={cap1.open} />
        </Place>
      )}
      {frame >= OPEN2 - 26 && frame < OPEN2 + 20 && (
        <Place x={cap2.x} y={cap2.y} rotate={cap2.open > 0 ? 0 : cap2.rot} origin="center" z={4} opacity={interpolate(frame, [OPEN2 + 8, OPEN2 + 20], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Capsule size={150} gold open={cap2.open} />
        </Place>
      )}

      {frame >= OPEN1 && frame < SPIN2 && (
        <PrizeCard title={TEXT.prize1Title} text={TEXT.prize1Text} s={card1 * card1Out} />
      )}
      {frame >= OPEN2 && <PrizeCard title={TEXT.prize2Title} text={TEXT.prize2Text} gold s={card2} />}
      <Confetti x={WIDTH / 2} y={820} start={OPEN2} count={50} seed="gold" />
      {frame >= OPEN2 && <Sparkles x={WIDTH / 2} y={820} radius={480} count={10} start={OPEN2 + 4} />}

      <Caption from={6} dur={44}>{TEXT.gacha1}</Caption>
      <Caption from={SPIN2 + 4} dur={OPEN2 - SPIN2 - 10}>{TEXT.gacha2}</Caption>

      <Sfx at={SPIN1} name="click" />
      <Sfx at={SPIN1 + 26} name="pop" />
      <Sfx at={OPEN1} name="ding" />
      <Sfx at={SPIN2} name="click" />
      <Sfx at={SPIN2 + 20} name="alarm" volume={0.25} />
      <Sfx at={OPEN2} name="fanfare" volume={0.9} />
    </SceneFade>
  );
};
