import React from 'react';
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from 'remotion';
import { C, FONT, WIDTH } from '../theme.js';
import { TEXT } from '../text.js';
import { Cat } from '../Cat.jsx';
import { Bouquet, Donut, MilkTea, ShoppingCart, Skateboard } from '../Props.jsx';
import { Caption, Place, SceneFade, Sfx, Sparkles, blinkAt } from '../common.jsx';

// 第二幕：踩着滑板、推着小推车去采购（420 帧）
// 视差：远处的楼走得慢，店铺走得中速，路面走得快，于是画面有了纵深感。

const GROUND = 1560;
const SHOP_PASS = [70, 160, 250];
const SLOW_START = 286;
const SLOW_END = 380;
const TEA_FLY = 292;
const CATCH = 340;
const LAND = 372;

const speedAt = (f) => {
  const slow = interpolate(f, [SLOW_START, SLOW_START + 8, SLOW_END - 6, SLOW_END + 4], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return 14 - slow * 12;
};

// 走过的总路程 = 把每一帧的速度加起来。速度可以变，路程依然连续，不会跳。
const distanceAt = (f) => {
  let d = 0;
  for (let i = 0; i < f; i++) d += speedAt(i);
  return d;
};

const SHOP_STYLE = [
  { color: '#FFB7C9', awning: C.pinkDeep },
  { color: '#C8F0D9', awning: '#52B889' },
  { color: '#FFE3B3', awning: '#E8964A' },
];
const SHOP_X = SHOP_PASS.map((t) => 560 + 14 * t);

const Shop = ({ i, x }) => {
  const s = SHOP_STYLE[i];
  return (
    <div style={{ position: 'absolute', left: x - 230, top: GROUND - 780, width: 460, height: 620 }}>
      <div style={{ position: 'absolute', left: 60, top: 0, width: 340, height: 110, borderRadius: 24, background: '#fff', border: `8px solid ${C.brown}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, fontWeight: 900, color: C.brown, fontFamily: FONT, zIndex: 2 }}>
        {TEXT.shopNames[i]}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 80, width: 460, height: 540, background: s.color, border: `8px solid ${C.brown}`, borderRadius: '20px 20px 0 0' }} />
      <div style={{ position: 'absolute', left: -20, top: 150, width: 500, height: 90, display: 'flex', border: `8px solid ${C.brown}`, borderRadius: 16, overflow: 'hidden' }}>
        {Array.from({ length: 7 }).map((_, k) => (
          <div key={k} style={{ flex: 1, background: k % 2 ? '#fff' : s.awning }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 40, top: 300, width: 190, height: 170, background: C.sky, border: `8px solid ${C.brown}`, borderRadius: 16 }} />
      <div style={{ position: 'absolute', left: 280, top: 300, width: 140, height: 320, background: '#C98A5B', border: `8px solid ${C.brown}`, borderRadius: '70px 70px 0 0' }} />
    </div>
  );
};

const ITEMS = [
  { el: <Donut size={150} />, h: 110 },
  { el: <Bouquet size={140} />, h: 150 },
  { el: <MilkTea size={110} />, h: 165 },
];

export const Shopping = () => {
  const frame = useCurrentFrame();
  const dist = distanceAt(frame);
  const slowAmt = interpolate(frame, [SLOW_START, SLOW_START + 8, SLOW_END - 6, SLOW_END + 4], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 路面小颠簸
  const bob = Math.sin(frame * 0.9) * 3 * (1 - slowAmt);

  // 小猫从滑板上跳起接奶茶
  const rise = interpolate(frame, [318, CATCH], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const fall = interpolate(frame, [CATCH + 10, LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
  const jumpUp = (rise - fall) * 240;
  const catX = 315 + (rise - fall) * 75;
  const catBottom = 1519 + bob - jumpUp;
  const jumping = frame >= 318 && frame < LAND;
  // 起跳前先蹲一下、起跳时拉长、落地时压扁
  const squash = interpolate(frame, [308, 314, 318, 330, LAND, LAND + 3, LAND + 10], [1, 0.82, 1.14, 1, 1, 0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const holdingTea = frame >= CATCH;

  let expression = 'determined';
  if (frame >= 262 && frame < TEA_FLY) expression = 'normal';
  if (frame >= TEA_FLY && frame < 318) expression = 'shock';
  if (holdingTea) expression = 'happy';

  // 推车里的物品堆，越多晃得越厉害
  const basketX = 600;
  const basketTop = 1363 + bob;
  const landed = SHOP_PASS.map((t) => frame >= t + 12);
  const count = landed.filter(Boolean).length;
  const amp = [0, 1, 4, 9][count] + interpolate(frame, [255, TEA_FLY], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sway = Math.sin(frame * 0.28) * amp * (frame >= TEA_FLY ? 0.3 : 1);
  const slotBottom = [basketTop + 50];
  slotBottom[1] = slotBottom[0] - ITEMS[0].h;
  slotBottom[2] = slotBottom[1] - ITEMS[1].h;

  const renderFlying = (i) => {
    const t0 = SHOP_PASS[i] - 10;
    const p = interpolate(frame, [t0, t0 + 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    if (frame < t0 || landed[i]) return null;
    const x = interpolate(p, [0, 1], [760, basketX]);
    const y = interpolate(p, [0, 1], [1100, slotBottom[i]]) - Math.sin(p * Math.PI) * 320;
    return (
      <Place key={`fly-${i}`} x={x} y={y} rotate={p * 360} origin="center" z={6}>
        {ITEMS[i].el}
      </Place>
    );
  };

  // 奶茶飞出去的抛物线；被接住后跟着小猫的爪子
  let teaX;
  let teaY;
  let teaRot = 0;
  if (frame >= TEA_FLY && !holdingTea) {
    const p = (frame - TEA_FLY) / 60;
    teaX = basketX - 260 * p;
    teaY = slotBottom[2] - 900 * p + 900 * p * p;
    teaRot = -400 * p;
  } else if (holdingTea) {
    teaX = catX;
    teaY = catBottom - 250;
  }

  return (
    <SceneFade>
      <AbsoluteFill style={{ background: 'linear-gradient(#BFE6FF, #FFF3DA)' }} />
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 420 - dist * 0.08) % 1680 + 1680) % 1680 - 300;
        return <div key={i} style={{ position: 'absolute', left: x, top: 160 + (i % 2) * 140, width: 260, height: 90, borderRadius: 60, background: '#fff', opacity: 0.9 }} />;
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const w = 200;
        const x = ((i * 230 - dist * 0.3) % 2300 + 2300) % 2300 - 250;
        const h = 300 + random(`bld-${i}`) * 350;
        const colors = ['#D9C8F5', '#C6E6F7', '#F7D6E0', '#D8EFD3'];
        return <div key={i} style={{ position: 'absolute', left: x, top: GROUND - 160 - h, width: w, height: h + 160, background: colors[i % 4], borderRadius: '18px 18px 0 0', opacity: 0.9 }} />;
      })}

      {SHOP_X.map((sx, i) => (
        <Shop key={i} i={i} x={sx - dist} />
      ))}

      <div style={{ position: 'absolute', left: 0, top: GROUND - 160, width: WIDTH, height: 90, background: '#EBD9C3', borderTop: `8px solid ${C.brown}` }} />
      <div style={{ position: 'absolute', left: 0, top: GROUND - 70, width: WIDTH, height: 500, background: '#8E9AAF' }} />
      {Array.from({ length: 6 }).map((_, i) => {
        const x = ((i * 300 - dist * 1.2) % 1800 + 1800) % 1800 - 300;
        return <div key={i} style={{ position: 'absolute', left: x, top: GROUND + 140, width: 160, height: 24, borderRadius: 12, background: '#fff', opacity: 0.8 }} />;
      })}

      <Place x={315} y={1570 + bob} z={3}>
        <Skateboard width={300} spin={dist * 3.2} />
      </Place>

      <Place x={catX} y={catBottom} z={4} rotate={jumping ? -10 : 3} sx={1 + (1 - squash) * 0.7} sy={squash}>
        <Cat
          size={360}
          expression={expression}
          arms={jumping || holdingTea ? 'up' : 'hold'}
          blink={blinkAt(frame, 60)}
          tail={Math.sin(frame / 5) * 14}
        />
      </Place>

      <div
        style={{
          position: 'absolute',
          left: basketX,
          top: slotBottom[0],
          width: 0,
          height: 0,
          zIndex: 5,
          transform: `rotate(${sway}deg)`,
          transformOrigin: '0 0',
        }}
      >
        {ITEMS.map((it, i) => {
          if (!landed[i]) return null;
          if (i === 2 && frame >= TEA_FLY) return null;
          return (
            <Place key={i} x={0} y={slotBottom[i] - slotBottom[0]}>
              {it.el}
            </Place>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: basketX - 178, top: basketTop - 19, zIndex: 5 }}>
        <ShoppingCart width={300} spin={dist * 2.4} />
      </div>

      {[0, 1, 2].map(renderFlying)}
      {teaX !== undefined && (
        <Place x={teaX} y={teaY} rotate={teaRot} origin="center" z={7}>
          <MilkTea size={110} />
        </Place>
      )}
      {holdingTea && <Sparkles x={teaX} y={teaY - 80} radius={150} count={7} start={CATCH} />}

      <AbsoluteFill
        style={{
          opacity: slowAmt,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(40,20,40,0.55) 100%)',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'absolute', top: 0, left: 0, width: WIDTH, height: 150 * slowAmt, background: '#111', zIndex: 9 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: WIDTH, height: 150 * slowAmt, background: '#111', zIndex: 9 }} />
      {slowAmt > 0.5 && (
        <div style={{ position: 'absolute', top: 210, width: '100%', textAlign: 'center', zIndex: 10, fontSize: 64, fontWeight: 900, color: '#fff', letterSpacing: 20, fontFamily: FONT, opacity: 0.6 + 0.4 * Math.sin(frame / 4) }}>
          {TEXT.slowmo}
        </div>
      )}

      <Caption y={330} from={36} dur={70}>{TEXT.shop1}</Caption>
      <Caption y={330} from={126} dur={70}>{TEXT.shop2}</Caption>
      <Caption y={330} from={216} dur={48}>{TEXT.shop3}</Caption>
      <Caption y={330} from={264} dur={26}>{TEXT.shopWobble}</Caption>
      <Caption y={330} from={LAND} dur={48}>{TEXT.shopSaved}</Caption>

      {SHOP_PASS.map((t) => (
        <Sfx key={t} at={t + 12} name="pop" />
      ))}
      <Sfx at={TEA_FLY} name="whoosh" />
      <Sfx at={318} name="boing" />
      <Sfx at={CATCH} name="ding" />
      <Sfx at={LAND} name="sparkle" />
      <Sfx at={LAND + 6} name="meow" volume={0.9} rate={1.15} />
    </SceneFade>
  );
};
