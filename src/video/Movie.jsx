import React from 'react';
import { AbsoluteFill, Html5Audio, Series, interpolate, staticFile } from 'remotion';
import { C } from './theme.js';
import { Intro } from './scenes/Intro.jsx';
import { WakeUp } from './scenes/WakeUp.jsx';
import { Shopping } from './scenes/Shopping.jsx';
import { Baking } from './scenes/Baking.jsx';
import { Gacha } from './scenes/Gacha.jsx';
import { Ending } from './scenes/Ending.jsx';
import { Outro } from './scenes/Outro.jsx';

// 每一幕的长度（帧）。30 帧 = 1 秒。
// 注意：各幕内部的动作是按帧号写死的，缩短某一幕时要同时检查那一幕里的时间点。
export const SCENES = [
  { name: '片头', component: Intro, frames: 120 },
  { name: '起床', component: WakeUp, frames: 240 },
  { name: '采购', component: Shopping, frames: 420 },
  { name: '做蛋糕', component: Baking, frames: 300 },
  { name: '扭蛋机', component: Gacha, frames: 360 },
  { name: '尾声', component: Ending, frames: 270 },
  { name: '片尾', component: Outro, frames: 90 },
];

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0);

export const Movie = () => (
  <AbsoluteFill style={{ backgroundColor: C.cream }}>
    <Series>
      {SCENES.map(({ name, component: Scene, frames }) => (
        <Series.Sequence key={name} name={name} durationInFrames={frames}>
          <Scene />
        </Series.Sequence>
      ))}
    </Series>
    <Html5Audio
      src={staticFile('audio/bgm.wav')}
      volume={(f) => interpolate(f, [0, 20, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.32, 0.32, 0], { extrapolateRight: 'clamp' })}
    />
  </AbsoluteFill>
);
