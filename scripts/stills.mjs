// 一次性导出多张关键帧截图，用来快速检查画面
// 用法：node scripts/stills.mjs 100 300 650
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const frames = process.argv.slice(2).map(Number);
mkdirSync('out/stills', { recursive: true });

const serveUrl = await bundle({ entryPoint: resolve('src/video/index.js') });
const composition = await selectComposition({ serveUrl, id: 'Jiajia' });

for (const frame of frames) {
  const output = `out/stills/f${String(frame).padStart(4, '0')}.png`;
  await renderStill({ composition, serveUrl, frame, output, scale: 0.4 });
  console.log(output);
}
