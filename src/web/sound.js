import { AUDIO_FILES } from '../video/audioFiles.js';

const cache = {};

export const playSfx = (name, volume = 0.7, rate = 1) => {
  const src = `audio/${name}.mp3`;
  if (!cache[src]) cache[src] = new Audio(src);
  const a = cache[src].cloneNode();
  a.volume = volume;
  a.playbackRate = rate;
  a.play().catch(() => {});
};

// 提前把所有声音下载进浏览器缓存，onProgress 收到 0~1 的进度
export const preloadAudio = async (onProgress) => {
  let done = 0;
  await Promise.all(
    AUDIO_FILES.map((src) =>
      fetch(src)
        .then((r) => r.blob())
        .catch(() => null)
        .finally(() => onProgress(++done / AUDIO_FILES.length)),
    ),
  );
};
