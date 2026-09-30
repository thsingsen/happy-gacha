import React from 'react';
import { Composition } from 'remotion';
import { Movie, TOTAL_FRAMES } from './Movie.jsx';
import { FPS, WIDTH, HEIGHT } from './theme.js';

export const RemotionRoot = () => (
  <Composition id="Jiajia" component={Movie} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
