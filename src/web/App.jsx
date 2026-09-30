import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Player } from '@remotion/player';
import { Movie, TOTAL_FRAMES } from '../video/Movie.jsx';
import { FPS, WIDTH, HEIGHT } from '../video/theme.js';
import { Cat } from '../video/Cat.jsx';
import { Playground } from './Playground.jsx';
import { preloadAudio } from './sound.js';

// 网页版分三步：开播页 -> 播放短片 -> 互动结尾
export const App = () => {
  const [stage, setStage] = useState('cover');
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onEnded = () => setStage('play');
    player.addEventListener('ended', onEnded);
    return () => player.removeEventListener('ended', onEnded);
  }, [stage]);

  useLayoutEffect(() => {
    if (stage !== 'movie') return;
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
  }, [stage]);

  // 网速太慢时最多等 10 秒，之后也允许开播，播放器会边播边等
  const [loaded, setLoaded] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const ready = loaded >= 1 || timedOut;
  useEffect(() => {
    preloadAudio(setLoaded);
    const t = setTimeout(() => setTimedOut(true), 10000);
    return () => clearTimeout(t);
  }, []);

  const start = () => setStage('movie');

  if (stage === 'play') {
    return <Playground onReplay={start} />;
  }

  return (
    <div className="screen movie-screen">
      <div className="player-box">
        <Player
          ref={playerRef}
          component={Movie}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          compositionWidth={WIDTH}
          compositionHeight={HEIGHT}
          style={{ width: '100%', height: '100%' }}
          controls={stage === 'movie'}
          clickToPlay={stage === 'movie'}
          pauseWhenBuffering
          numberOfSharedAudioTags={16}
          acknowledgeRemotionLicense
        />
        {stage === 'cover' && (
          <div className="cover" onClick={ready ? start : undefined}>
            <div className="cover-title">佳佳专属快乐频道</div>
            <div className="cover-sub">第 1 集 · 小猫店长的秘密任务</div>
            <button className="big-btn" disabled={!ready}>
              {ready ? '点我开播' : `小猫准备中 ${Math.round(loaded * 100)}%`}
            </button>
            {!ready && (
              <div className="load-bar">
                <div style={{ width: `${loaded * 100}%` }} />
              </div>
            )}
            <div className="cover-tip">记得打开声音哦</div>
            <div className="cover-cat">
              <Cat size={220} expression="happy" arms="up" />
            </div>
          </div>
        )}
      </div>
      {stage === 'movie' && (
        <button className="skip-btn" onClick={() => setStage('play')}>
          跳过，直接玩 →
        </button>
      )}
    </div>
  );
};
