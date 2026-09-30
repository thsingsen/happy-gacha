import React, { useRef, useState } from 'react';
import { Cat } from '../video/Cat.jsx';
import { Capsule, Flower, GachaMachine } from '../video/Props.jsx';
import { COMPLIMENTS, FOODS, TEXT } from '../video/text.js';
import { C } from '../video/theme.js';
import { playSfx } from './sound.js';

const FLOWER_COLORS = [C.pinkDeep, '#FFB7C9', C.yellow, '#fff', C.mint, '#C7A6FF'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 在 requestAnimationFrame 里逐帧推进一个 0~1 的进度，这就是网页里"手写动画"的基本做法
const tween = (duration, onFrame, onDone) => {
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration);
    onFrame(p);
    if (p < 1) requestAnimationFrame(step);
    else onDone?.();
  };
  requestAnimationFrame(step);
};

const drawPrize = () => {
  const r = Math.random();
  if (r < 0.08) return { kind: 'hidden', title: TEXT.prize2Title, text: TEXT.prize2Text };
  if (r < 0.42) return { kind: 'compliment', title: TEXT.prize1Title, text: pick(COMPLIMENTS) };
  if (r < 0.78) {
    const food = pick(FOODS);
    return { kind: 'food', title: food.name, text: food.text };
  }
  return { kind: 'flower', title: '小花海', text: '送佳佳一整片小花' };
};

const Confetti = () => (
  <div className="confetti">
    {Array.from({ length: 40 }).map((_, i) => (
      <span
        key={i}
        style={{
          '--dx': `${(Math.random() - 0.5) * 700}px`,
          '--dy': `${-200 - Math.random() * 400}px`,
          '--r': `${Math.random() * 720}deg`,
          background: FLOWER_COLORS[i % FLOWER_COLORS.length],
          animationDelay: `${Math.random() * 0.1}s`,
        }}
      />
    ))}
  </div>
);

const GachaStation = ({ onFlowers }) => {
  const [phase, setPhase] = useState('idle');
  const [knob, setKnob] = useState(0);
  const [jiggle, setJiggle] = useState(0);
  const [prize, setPrize] = useState(null);
  const [count, setCount] = useState(0);
  const [shy, setShy] = useState(false);
  const [hop, setHop] = useState(0);
  const taps = useRef([]);

  const spin = () => {
    if (phase === 'spinning' || phase === 'drop') return;
    const next = drawPrize();
    setPrize(null);
    setPhase('spinning');
    playSfx('click');
    const turns = next.kind === 'hidden' ? 2 : 1;
    tween(
      1100 * turns,
      (p) => {
        setKnob(p * 360 * turns);
        setJiggle(Math.sin(p * Math.PI) * (next.kind === 'hidden' ? 1.4 : 0.6));
      },
      () => {
        setPhase('drop');
        playSfx('pop');
        setTimeout(() => {
          setPrize(next);
          setPhase('reveal');
          setCount((c) => c + 1);
          playSfx(next.kind === 'hidden' ? 'fanfare' : 'ding');
          if (next.kind === 'flower') onFlowers(24);
        }, 800);
      },
    );
  };

  // 连续点小猫 5 次触发害羞彩蛋
  const tapCat = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 1500), now];
    setHop((h) => h + 1);
    playSfx('pop', 0.4);
    if (taps.current.length >= 5 && !shy) {
      taps.current = [];
      setShy(true);
      playSfx('boing');
      setTimeout(() => setShy(false), 2600);
    }
  };

  const catExpression = shy ? 'shy' : phase === 'spinning' ? 'determined' : phase === 'reveal' ? 'happy' : 'normal';

  return (
    <div className="station">
      <div className="station-row">
        <div className={`cat-wrap ${shy ? 'cat-roll' : ''}`} key={shy ? 'shy' : `hop-${hop}`} onClick={tapCat}>
          <Cat size={150} expression={catExpression} arms={shy ? 'face' : 'up'} tail={10} />
          {shy && <div className="shy-bubble">被、被发现了……</div>}
        </div>
        <div className="machine-wrap">
          <GachaMachine size={200} knob={knob} jiggle={jiggle} phase={knob / 20} glow={prize?.kind === 'hidden' ? 1 : 0} />
          {(phase === 'drop' || phase === 'reveal') && (
            <div className="capsule-drop">
              <Capsule size={60} gold={prize?.kind === 'hidden'} open={phase === 'reveal' ? 1 : 0} />
            </div>
          )}
        </div>
      </div>

      <button className="big-btn" onClick={spin} disabled={phase === 'spinning' || phase === 'drop'}>
        {count === 0 ? '扭一下！' : '再扭一次！'}
      </button>
      <div className="count">已经扭了 {count} 次</div>

      {phase === 'reveal' && prize && (
        <div className={`prize-card ${prize.kind === 'hidden' ? 'gold' : ''}`} onClick={() => setPhase('idle')}>
          <div className="prize-title">{prize.title}</div>
          <div className="prize-text">{prize.text}</div>
          <div className="prize-tip">点卡片收下</div>
          {prize.kind === 'hidden' && <Confetti />}
        </div>
      )}
    </div>
  );
};

const SmileQuestion = () => {
  const boxRef = useRef(null);
  const [noPos, setNoPos] = useState({ left: 68, top: 50 });
  const [escapes, setEscapes] = useState(0);
  const [done, setDone] = useState(false);
  const lastEscape = useRef(0);

  const runAway = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastEscape.current < 350) return;
    lastEscape.current = now;
    playSfx('whoosh', 0.5);
    setEscapes((n) => n + 1);
    setNoPos(() => {
      let left;
      let top;
      do {
        left = 10 + Math.random() * 78;
        top = 15 + Math.random() * 75;
      } while (left < 45 && top > 30 && top < 70);
      return { left, top };
    });
  };

  const yes = () => {
    setDone(true);
    playSfx('fanfare');
  };

  return (
    <div className="question no-bloom" ref={boxRef}>
      <div className="question-title">{TEXT.sign}</div>
      {!done ? (
        <div className="question-area">
          <button className="answer yes" style={{ left: '28%', top: '50%' }} onClick={yes}>
            {TEXT.yes}
          </button>
          <button
            className="answer no"
            style={{ left: `${noPos.left}%`, top: `${noPos.top}%` }}
            onPointerEnter={runAway}
            onPointerDown={runAway}
            onClick={runAway}
          >
            {TEXT.no}
          </button>
          {escapes >= 3 && <div className="tease">略略略～抓不到我</div>}
        </div>
      ) : (
        <div className="question-area done">
          <div className="done-text">那今天的任务就完成啦<br />明天继续～</div>
          <Confetti />
        </div>
      )}
    </div>
  );
};

export const Playground = ({ onReplay }) => {
  const [flowers, setFlowers] = useState([]);
  const idRef = useRef(0);

  const addFlower = (x, y) => {
    const id = idRef.current++;
    const flower = { id, x, y, color: pick(FLOWER_COLORS), size: 40 + Math.random() * 40, rot: Math.random() * 360 };
    setFlowers((list) => [...list, flower]);
    setTimeout(() => setFlowers((list) => list.filter((f) => f.id !== id)), 2600);
  };

  const bloom = (e) => {
    if (e.target.closest('button, .no-bloom, .prize-card, .cat-wrap')) return;
    addFlower(e.clientX, e.clientY);
  };

  const flowerRain = (n) => {
    for (let i = 0; i < n; i++) {
      setTimeout(() => addFlower(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.8), i * 60);
    }
  };

  return (
    <div className="screen play-screen" onPointerDown={bloom}>
      <h1 className="play-title">佳佳的快乐扭蛋机</h1>
      <div className="play-sub">随便点点屏幕，会开花哦</div>
      <GachaStation onFlowers={flowerRain} />
      <SmileQuestion />
      <button className="ghost-btn" onClick={onReplay}>再看一遍短片</button>

      <div className="flower-layer">
        {flowers.map((f) => (
          <div key={f.id} className="flower-pop" style={{ left: f.x, top: f.y, '--rot': `${f.rot}deg` }}>
            <Flower size={f.size} color={f.color} />
          </div>
        ))}
      </div>
    </div>
  );
};
