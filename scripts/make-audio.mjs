// 用纯代码合成背景音乐和音效，输出 mp3 到 public/audio/
// 运行：npm run audio（需要电脑上装有 ffmpeg）
//
// 声音的本质是空气振动。数字音频就是每秒记录几万个"振动位置"的数字（采样）。
// 这里我们自己算出这些数字：正弦波听起来柔和，方波像老游戏机，随机噪声像"沙沙"声。
// 算出来的是未压缩的 wav，再用 ffmpeg 压成 mp3，体积能小 5 倍以上，手机打开更快。

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
const TMP_DIR = join(tmpdir(), 'happy-gacha-audio');
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const midiToFreq = (m) => 440 * 2 ** ((m - 69) / 12);

let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

const wave = {
  sine: (p) => Math.sin(p),
  triangle: (p) => (2 / Math.PI) * Math.asin(Math.sin(p)),
  square: (p) => (Math.sin(p) >= 0 ? 0.6 : -0.6),
};

// 往 buf 里叠加一个音：freq 可以是数字，也可以是 (t) => 频率 的函数（用来做滑音）
function addTone(buf, sr, { t0, dur, freq, type = 'sine', gain = 0.2, attack = 0.005, decay = 0.2 }) {
  const start = Math.floor(t0 * sr);
  const len = Math.floor(dur * sr);
  let phase = 0;
  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / sr;
    const f = typeof freq === 'function' ? freq(t) : freq;
    phase += (2 * Math.PI * f) / sr;
    const env = t < attack ? t / attack : Math.exp(-(t - attack) / decay);
    buf[start + i] += wave[type](phase) * env * gain;
  }
}

// 叠加一段噪声。lowpass 越小声音越闷（像"噗"），highpass 为 true 时声音更尖（像"嚓"）
function addNoise(buf, sr, { t0, dur, gain = 0.2, attack = 0.005, decay = 0.1, lowpass = 1, lowpassFn, highpass = false }) {
  const start = Math.floor(t0 * sr);
  const len = Math.floor(dur * sr);
  let lp = 0;
  let prev = 0;
  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / sr;
    const x = rand() * 2 - 1;
    const k = lowpassFn ? lowpassFn(t) : lowpass;
    lp += (x - lp) * k;
    let y = lp;
    if (highpass) {
      y = x - prev;
      prev = x;
    }
    const env = t < attack ? t / attack : Math.exp(-(t - attack) / decay);
    buf[start + i] += y * env * gain;
  }
}

function writeWav(name, buf, sr, { peak = 0.85, fadeOut = 0.02 } = {}) {
  let max = 0;
  for (const v of buf) max = Math.max(max, Math.abs(v));
  const scale = max > 0 ? peak / max : 1;
  const fadeLen = Math.floor(fadeOut * sr);
  const data = Buffer.alloc(44 + buf.length * 2);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + buf.length * 2, 4);
  data.write('WAVE', 8);
  data.write('fmt ', 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(sr, 24);
  data.writeUInt32LE(sr * 2, 28);
  data.writeUInt16LE(2, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(buf.length * 2, 40);
  for (let i = 0; i < buf.length; i++) {
    const fade = i > buf.length - fadeLen ? (buf.length - i) / fadeLen : 1;
    const v = Math.max(-1, Math.min(1, buf[i] * scale * fade));
    data.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  const wavPath = join(TMP_DIR, name);
  const mp3Name = name.replace(/\.wav$/, '.mp3');
  writeFileSync(wavPath, data);
  const bitrate = name === 'bgm.wav' ? '64k' : '80k';
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wavPath, '-codec:a', 'libmp3lame', '-b:a', bitrate, join(OUT_DIR, mp3Name)]);
  if (r.status !== 0) throw new Error(`ffmpeg 转换 ${name} 失败：${r.stderr}`);
  console.log(`已生成 public/audio/${mp3Name}`);
}

// ---------------- 背景音乐：120 拍/分钟，C - Am - F - G 循环 ----------------
function makeBgm() {
  const sr = 22050;
  const seconds = 62;
  const buf = new Float32Array(sr * seconds);
  const beat = 0.5;
  const bar = beat * 4;
  const eighth = beat / 2;

  const chords = [
    { root: 36, tones: [60, 64, 67] },
    { root: 33, tones: [57, 60, 64] },
    { root: 29, tones: [53, 57, 60] },
    { root: 31, tones: [55, 59, 62] },
  ];
  const _ = null;
  const phraseA = [
    72, _, 76, 79, 76, _, 74, 72,
    69, _, 72, 76, 74, _, 72, 69,
    65, 69, 72, _, 74, 72, 69, _,
    67, _, 71, 74, 79, _, 77, 74,
  ];
  const phraseB = [
    76, 76, 79, _, 84, _, 79, 76,
    81, _, 79, 76, 72, _, 76, _,
    77, 76, 74, 72, 69, 72, 74, _,
    74, _, 76, 74, 71, 67, _, _,
  ];

  const bars = Math.floor(seconds / bar);
  for (let b = 0; b < bars; b++) {
    const t = b * bar;
    const chord = chords[b % 4];
    const isLast = b === bars - 1;

    for (let k = 0; k < 4; k++) {
      const tb = t + k * beat;
      if (k % 2 === 0) {
        addTone(buf, sr, { t0: tb, dur: 0.5, freq: midiToFreq(chord.root + 12), type: 'triangle', gain: 0.22, decay: 0.35 });
        addTone(buf, sr, { t0: tb, dur: 0.18, freq: (x) => 110 - x * 350, type: 'sine', gain: 0.25, decay: 0.08 });
      } else {
        for (const n of chord.tones) {
          addTone(buf, sr, { t0: tb, dur: 0.4, freq: midiToFreq(n), type: 'sine', gain: 0.06, decay: 0.22 });
        }
      }
      addNoise(buf, sr, { t0: tb + eighth, dur: 0.05, gain: 0.05, decay: 0.015, highpass: true });
    }

    if (b >= 2 && !isLast) {
      const phrase = Math.floor((b - 2) / 4) % 2 === 0 ? phraseA : phraseB;
      const barInPhrase = (b - 2) % 4;
      for (let e = 0; e < 8; e++) {
        const n = phrase[barInPhrase * 8 + e];
        if (n == null) continue;
        const t0 = t + e * eighth;
        addTone(buf, sr, { t0, dur: 0.45, freq: midiToFreq(n), type: 'triangle', gain: 0.16, decay: 0.2 });
        addTone(buf, sr, { t0, dur: 0.3, freq: midiToFreq(n), type: 'square', gain: 0.035, decay: 0.12 });
      }
    }
    if (isLast) {
      for (const n of [72, 76, 79, 84]) {
        addTone(buf, sr, { t0: t, dur: 2, freq: midiToFreq(n), type: 'triangle', gain: 0.1, decay: 0.8 });
      }
    }
  }
  writeWav('bgm.wav', buf, sr, { peak: 0.7, fadeOut: 2 });
}

// ---------------- 音效 ----------------
const SR = 44100;
const sfx = (seconds) => new Float32Array(Math.floor(SR * seconds));

function makeDing() {
  const buf = sfx(1.2);
  addTone(buf, SR, { t0: 0, dur: 1, freq: 1318.5, gain: 0.5, decay: 0.35 });
  addTone(buf, SR, { t0: 0, dur: 1, freq: 2637, gain: 0.12, decay: 0.2 });
  addTone(buf, SR, { t0: 0.09, dur: 1.1, freq: 1760, gain: 0.45, decay: 0.4 });
  writeWav('ding.wav', buf, SR);
}

function makePop() {
  const buf = sfx(0.25);
  addTone(buf, SR, { t0: 0, dur: 0.2, freq: (t) => 900 - t * 4000, gain: 0.6, attack: 0.002, decay: 0.05 });
  writeWav('pop.wav', buf, SR);
}

function makePoof() {
  const buf = sfx(1);
  addNoise(buf, SR, { t0: 0, dur: 1, gain: 0.8, attack: 0.01, decay: 0.25, lowpass: 0.08 });
  addTone(buf, SR, { t0: 0, dur: 0.3, freq: (t) => 160 - t * 300, gain: 0.4, decay: 0.08 });
  writeWav('poof.wav', buf, SR);
}

function makeWhoosh() {
  const buf = sfx(0.5);
  addNoise(buf, SR, {
    t0: 0, dur: 0.5, gain: 0.8, attack: 0.15, decay: 0.08,
    lowpassFn: (t) => 0.02 + t * 0.5,
  });
  writeWav('whoosh.wav', buf, SR);
}

function makeAlarm() {
  const buf = sfx(2);
  for (let t = 0; t < 1.9; t += 0.12) {
    addTone(buf, SR, { t0: t, dur: 0.08, freq: 1568, type: 'square', gain: 0.3, decay: 0.05 });
    addTone(buf, SR, { t0: t, dur: 0.08, freq: 2093, type: 'sine', gain: 0.2, decay: 0.05 });
  }
  writeWav('alarm.wav', buf, SR);
}

function makeClick() {
  const buf = sfx(0.1);
  addTone(buf, SR, { t0: 0, dur: 0.06, freq: 1800, gain: 0.5, attack: 0.001, decay: 0.015 });
  addNoise(buf, SR, { t0: 0, dur: 0.04, gain: 0.3, attack: 0.001, decay: 0.01, highpass: true });
  writeWav('click.wav', buf, SR);
}

function makeBoing() {
  const buf = sfx(0.5);
  addTone(buf, SR, {
    t0: 0, dur: 0.45, type: 'triangle', gain: 0.6, decay: 0.2,
    freq: (t) => 220 + t * 900 + Math.sin(t * 60) * 40,
  });
  writeWav('boing.wav', buf, SR);
}

function makeFanfare() {
  const buf = sfx(1.8);
  const notes = [72, 76, 79, 84];
  notes.forEach((n, i) => {
    const last = i === notes.length - 1;
    addTone(buf, SR, { t0: i * 0.1, dur: last ? 1.4 : 0.3, freq: midiToFreq(n), type: 'triangle', gain: 0.4, decay: last ? 0.6 : 0.15 });
    addTone(buf, SR, { t0: i * 0.1, dur: last ? 1.2 : 0.2, freq: midiToFreq(n), type: 'square', gain: 0.08, decay: last ? 0.4 : 0.1 });
  });
  for (let i = 0; i < 10; i++) {
    addTone(buf, SR, { t0: 0.4 + i * 0.08, dur: 0.3, freq: 2500 + rand() * 2000, gain: 0.08, decay: 0.08 });
  }
  writeWav('fanfare.wav', buf, SR);
}

function makeSparkle() {
  const buf = sfx(0.9);
  for (let i = 0; i < 9; i++) {
    addTone(buf, SR, { t0: i * 0.07, dur: 0.25, freq: 2000 + rand() * 2500, gain: 0.25, attack: 0.002, decay: 0.07 });
  }
  writeWav('sparkle.wav', buf, SR);
}

// 猫叫"喵"：一个音高先升后降的声音，叠加很多泛音，
// 再让"共振峰"（声音最亮的频段）从 i 滑到 a 再滑到 u，听起来就像 mi-a-u
function makeMeow() {
  const dur = 0.62;
  const buf = sfx(dur + 0.1);
  const lerpKeys = (keys, p) => {
    for (let i = 1; i < keys.length; i++) {
      if (p <= keys[i][0]) {
        const [p0, v0] = keys[i - 1];
        const [p1, v1] = keys[i];
        return v0 + ((v1 - v0) * (p - p0)) / (p1 - p0);
      }
    }
    return keys[keys.length - 1][1];
  };
  const pitch = [[0, 560], [0.3, 820], [0.7, 640], [1, 470]];
  const f1 = [[0, 300], [0.25, 450], [0.55, 850], [1, 380]];
  const f2 = [[0, 1800], [0.25, 2300], [0.55, 1400], [1, 850]];
  const phases = new Float64Array(14);
  const len = Math.floor(dur * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const p = t / dur;
    const f0 = lerpKeys(pitch, p) * (1 + Math.sin(t * 38) * 0.012);
    const F1 = lerpKeys(f1, p);
    const F2 = lerpKeys(f2, p);
    const env = Math.min(1, t / 0.07) * Math.min(1, (dur - t) / 0.18);
    let s = 0;
    for (let k = 1; k <= 14; k++) {
      const f = f0 * k;
      phases[k - 1] += (2 * Math.PI * f) / SR;
      const a = Math.exp(-(((f - F1) / 220) ** 2)) + 0.55 * Math.exp(-(((f - F2) / 320) ** 2)) + 0.05 / k;
      s += Math.sin(phases[k - 1]) * a;
    }
    buf[i] += s * env * 0.3;
  }
  writeWav('meow.wav', buf, SR);
}

makeBgm();
makeMeow();
makeDing();
makePop();
makePoof();
makeWhoosh();
makeAlarm();
makeClick();
makeBoing();
makeFanfare();
makeSparkle();
