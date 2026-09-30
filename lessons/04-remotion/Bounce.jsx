import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// 练习 4：一个 3 秒的 Remotion 小视频
// Remotion 会从第 0 帧到最后一帧，一帧一帧地调用这个组件，截图后拼成视频。
// 你要做的只有一件事：根据 useCurrentFrame() 返回的帧号，决定这一帧画成什么样。

const Title = () => {
  const frame = useCurrentFrame(); // 在 <Sequence> 里面，帧号从这个片段开始时重新从 0 数
  // interpolate：第 0 帧时透明度为 0，第 15 帧时为 1，中间自动过渡
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontSize: 110, fontWeight: 900, color: '#6B4432', opacity }}>
      我学会做动画啦
    </div>
  );
};

export const Bounce = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // spring：像弹簧一样从 0 弹到 1，会稍微冲过头再回来，非常适合"弹出来"的效果
  const pop = spring({ frame, fps, config: { damping: 8 } });

  // Math.abs(Math.sin(...)) 在 0 到 1 之间反复变化，用来做弹跳
  const jump = Math.abs(Math.sin(frame / 8)) * 500;

  return (
    <AbsoluteFill style={{ background: '#FFE3EC' }}>
      <div
        style={{
          position: 'absolute',
          left: 540 - 120,
          top: 1400 - jump,
          width: 240,
          height: 240,
          borderRadius: 120,
          background: '#FF7FA3',
          border: '12px solid #6B4432',
          transform: `scale(${pop})`,
        }}
      />
      <div style={{ position: 'absolute', top: 1640, width: '100%', height: 280, background: '#E9B98C' }} />

      {/* Sequence：让标题从第 30 帧（第 1 秒）才开始出现 */}
      <Sequence from={30}>
        <Title />
      </Sequence>
    </AbsoluteFill>
  );
};

// 动手改一改：
// 1. 把 damping: 8 改成 20，弹簧会变"硬"，不再回弹
// 2. 把 frame / 8 改成 frame / 4，球会跳得更快
// 3. 把 <Sequence from={30}> 改成 from={60}，标题出现得更晚
// 改完用 npm run lesson:studio 预览，满意了再用 npm run lesson:render 导出视频
