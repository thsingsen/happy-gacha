import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { Bounce } from './Bounce.jsx';

// 注册一个视频：竖屏 1080x1920，每秒 30 帧，一共 90 帧（3 秒）
const Root = () => (
  <Composition id="Bounce" component={Bounce} durationInFrames={90} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
