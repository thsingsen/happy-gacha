import React from 'react';
import {
  AbsoluteFill,
  Easing,
  getRemotionEnvironment,
  Html5Audio,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { C, FONT, WIDTH, HEIGHT } from './theme.js';
import { Flower, Star } from './Props.jsx';

// 以"底部中点"为锚点摆放元素，方便让角色站在地面上
// sx / sy 用来做挤压和拉伸：落地时横向变宽、纵向变扁，起跳时反过来
export const Place = ({ x, y, scale = 1, sx = 1, sy = 1, rotate = 0, origin = 'bottom center', opacity = 1, z, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      zIndex: z,
      transform: `translate(-50%, -100%) rotate(${rotate}deg) scale(${scale * sx}, ${scale * sy})`,
      transformOrigin: origin,
    }}
  >
    {children}
  </div>
);

// 弹簧动画的小封装：从 delay 帧开始，数值从 0 弹到 1
export const usePop = (delay = 0, config = { damping: 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

// 网页版可能部署在子路径下（如 /happy-gacha/），staticFile 只认根目录，所以网页里改用相对路径
export const asset = (path) =>
  getRemotionEnvironment().isPlayer ? new URL(path, document.baseURI).href : staticFile(path);

// rate 是播放速度：大于 1 声音更高更快（开心），小于 1 更低更慢（懒洋洋、委屈）
export const Sfx = ({ at, name, volume = 0.8, rate = 1 }) => (
  <Sequence from={at} durationInFrames={90} layout="none">
    <Html5Audio src={asset(`audio/${name}.mp3`)} volume={volume} playbackRate={rate} />
  </Sequence>
);

// 每一幕的底色和字体
export const SceneFade = ({ children, bg = C.cream }) => (
  <AbsoluteFill style={{ backgroundColor: bg, fontFamily: FONT }}>{children}</AbsoluteFill>
);

// 卡通片式的圆形转场：开头从一个小圆展开，结尾缩成一个圆消失
// circle() 的半径是百分比，约 71% 时正好盖住整个画面，这里用 75% 留点余量
export const Iris = ({ frames, irisIn = true, irisOut = true, children }) => {
  const frame = useCurrentFrame();
  const open = irisIn
    ? interpolate(frame, [0, 12], [0, 75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
    : 75;
  const close = irisOut
    ? interpolate(frame, [frames - 10, frames - 1], [75, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) })
    : 75;
  const r = Math.min(open, close);
  return (
    <AbsoluteFill style={{ backgroundColor: C.brown }}>
      <AbsoluteFill style={{ clipPath: r >= 75 ? undefined : `circle(${r}% at 50% 45%)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const CaptionInner = ({ children, dur, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const out = interpolate(frame, [dur - 6, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        opacity: out,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + s * 0.2})`,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.94)',
          border: `6px solid ${C.brown}`,
          borderRadius: 48,
          padding: '22px 44px',
          fontSize: 56,
          fontWeight: 900,
          color: C.brown,
          fontFamily: FONT,
          maxWidth: 940,
          textAlign: 'center',
          boxShadow: '0 10px 0 rgba(107,68,50,0.18)',
          whiteSpace: 'pre-line',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 底部字幕：from 第几帧出现，dur 持续多少帧
export const Caption = ({ from, dur, children, y = 1600 }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <CaptionInner dur={dur} y={y}>
      {children}
    </CaptionInner>
  </Sequence>
);

// 漫画式大字（比如"叮铃铃！"）
export const BigWord = ({ x, y, children, size = 110, color = C.pinkDeep, rotate = -8, scale = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
      zIndex: 20,
      fontSize: size,
      fontWeight: 900,
      color,
      fontFamily: FONT,
      WebkitTextStroke: `10px ${C.brown}`,
      paintOrder: 'stroke fill',
      whiteSpace: 'nowrap',
      letterSpacing: 4,
    }}
  >
    {children}
  </div>
);

// 满屏飘落的花瓣。random(种子) 每次返回同一个值，保证每次导出画面完全一样
const PETAL_COLORS = [C.pinkDeep, '#FFB7C9', C.yellow, '#fff', C.mint];
export const Petals = ({ count = 30, start = 0, speed = 1, seed = 'petal' }) => {
  const frame = useCurrentFrame() - start;
  if (frame < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const x0 = random(`${seed}-x-${i}`) * WIDTH;
        const delay = random(`${seed}-d-${i}`) * 60;
        const v = (3 + random(`${seed}-v-${i}`) * 4) * speed;
        const t = Math.max(0, frame - delay);
        const y = -80 + t * v;
        const x = x0 + Math.sin((t + i * 20) / 18) * 50;
        const size = 40 + random(`${seed}-s-${i}`) * 40;
        if (y > HEIGHT + 100 || t === 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${t * 3 + i * 40}deg)` }}>
            <Flower size={size} color={PETAL_COLORS[i % PETAL_COLORS.length]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 从某点炸开的彩纸
const CONFETTI_COLORS = [C.pinkDeep, C.yellow, C.mint, '#8FD0FF', '#C7A6FF', '#fff'];
export const Confetti = ({ x, y, start = 0, count = 40, seed = 'conf', power = 1 }) => {
  const frame = useCurrentFrame() - start;
  if (frame < 0 || frame > 90) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => {
        const a = random(`${seed}-a-${i}`) * Math.PI * 2;
        const v = (14 + random(`${seed}-v-${i}`) * 22) * power;
        const px = x + Math.cos(a) * v * frame * 0.9;
        const py = y + Math.sin(a) * v * frame * 0.9 + 0.9 * frame * frame;
        const opacity = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: 'clamp' });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: 22,
              height: 36,
              borderRadius: 6,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              border: `3px solid ${C.brown}`,
              opacity,
              transform: `rotate(${frame * (8 + i)}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// 一圈一闪一闪的星星
export const Sparkles = ({ x, y, radius = 220, count = 8, start = 0, color = C.gold, seed = 'spark' }) => {
  const frame = useCurrentFrame() - start;
  if (frame < 0) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + random(`${seed}-${i}`) * 0.5;
        const r = radius * (0.7 + random(`${seed}-r-${i}`) * 0.5);
        const tw = Math.sin((frame + i * 7) / 5);
        const s = Math.max(0, tw) * Math.min(1, frame / 8);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * r,
              top: y + Math.sin(a) * r,
              transform: `translate(-50%,-50%) scale(${s})`,
            }}
          >
            <Star size={70} color={color} />
          </div>
        );
      })}
    </>
  );
};

// 横向速度线，表现"冲出去"
export const SpeedLines = ({ opacity = 1, seed = 'speed' }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const y = random(`${seed}-y-${i}`) * HEIGHT;
        const len = 200 + random(`${seed}-l-${i}`) * 400;
        const x = WIDTH - ((frame * 80 + random(`${seed}-x-${i}`) * 2000) % (WIDTH + len * 2));
        return (
          <div
            key={i}
            style={{ position: 'absolute', left: x, top: y, width: len, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.8)' }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// 小猫眨眼：每隔一段时间闭一下眼，返回 0~1
export const blinkAt = (frame, every = 70, offset = 0) => {
  const t = (frame + offset) % every;
  return t < 3 ? 1 - Math.abs(t - 1.5) / 1.5 : 0;
};
