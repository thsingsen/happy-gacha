import React, { useRef, useState } from 'react';
import { Cat } from '../video/Cat.jsx';
import { Capsule, Flower, GachaMachine } from '../video/Props.jsx';
import {
  COMPLETE_TEXT,
  COMPLETE_TITLE,
  COMPLIMENTS,
  FOODS,
  FORTUNES,
  SECRET_FOUND,
  SECRET_HINT_COMPLETE,
  SECRET_HINTS,
  SECRET_PRIZE,
  SECRET_READY,
  TEXT,
} from '../video/text.js';
import { C } from '../video/theme.js';
import { playSfx } from './sound.js';
import { copyText, fortuneIndexForToday, loadSave, todayKey, writeSave } from './storage.js';
import { completeShare, fortuneShare, prizeShare, secretShare, smileShare } from './shareText.js';

const FLOWER_COLORS = [C.pinkDeep, '#FFB7C9', C.yellow, '#fff', C.mint, '#C7A6FF'];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// 图鉴里的全部奖品。隐藏款不在这里，图鉴里也不给它留格子
const PRIZES = [
  ...COMPLIMENTS.map((text, i) => ({ id: `c${i}`, kind: 'compliment', title: TEXT.prize1Title, text, label: `夸夸 ${i + 1}` })),
  ...FOODS.map((f, i) => ({ id: `f${i}`, kind: 'food', title: f.name, text: f.text, label: f.name })),
  { id: 'flower', kind: 'flower', title: '小花海', text: '送佳佳一整片小花', label: '小花海' },
];
const SECRET = { id: 'secret', kind: 'hidden', ...SECRET_PRIZE };

// 隐藏款只有触发秘密操作（连戳小猫 5 下）之后的下一颗才会出，普通扭蛋永远抽不到
const drawPrize = (save) => {
  if (save.secretReady && !save.collected.includes(SECRET.id)) return SECRET;
  const missing = PRIZES.filter((p) => !save.collected.includes(p.id));
  // 更容易抽到还没收集过的，集图鉴不会太折磨
  if (missing.length && Math.random() < 0.65) return pick(missing);
  return pick(PRIZES);
};

const secretHint = (save) => {
  if (save.collected.includes(SECRET.id)) return SECRET_FOUND;
  if (save.secretReady) return '快去扭下一颗！';
  if (save.completed) return SECRET_HINT_COMPLETE;
  const hint = [...SECRET_HINTS].reverse().find((h) => save.spins >= h.spins);
  return hint ? hint.text : '集齐全部，会有惊喜哦';
};

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

const ShareButton = ({ text, onShare }) => (
  <button
    className="share-btn"
    onClick={(e) => {
      e.stopPropagation();
      onShare(text);
    }}
  >
    复制战绩，发给他
  </button>
);

const DailyFortune = ({ save, updateSave, onShare }) => {
  const today = todayKey();
  const drawn = save.fortune?.date === today;
  const [shaking, setShaking] = useState(false);
  const fortune = FORTUNES[drawn ? save.fortune.index : fortuneIndexForToday(FORTUNES.length)];

  const draw = () => {
    if (drawn || shaking) return;
    setShaking(true);
    playSfx('click');
    setTimeout(() => {
      setShaking(false);
      updateSave((s) => ({ ...s, fortune: { date: today, index: fortuneIndexForToday(FORTUNES.length) } }));
      playSfx('ding');
    }, 1200);
  };

  return (
    <div className="panel fortune">
      <div className="panel-title">今日签</div>
      {!drawn ? (
        <>
          <div className={`tube ${shaking ? 'tube-shake' : ''}`} onClick={draw}>
            <div className="sticks">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ height: 34 + (i % 3) * 8 }} />
              ))}
            </div>
            <div className="tube-body">签</div>
          </div>
          <button className="big-btn small" onClick={draw} disabled={shaking}>
            {shaking ? '摇呀摇……' : '抽今天的签'}
          </button>
        </>
      ) : (
        <div className="fortune-result">
          <div className="fortune-level">{fortune.level}</div>
          <div className="fortune-text">{fortune.text}</div>
          <div className="fortune-tip">明天再来抽新的哦</div>
          <ShareButton text={fortuneShare(fortune)} onShare={onShare} />
        </div>
      )}
    </div>
  );
};

const GachaStation = ({ save, updateSave, onFlowers, onShare }) => {
  const [phase, setPhase] = useState('idle');
  const [knob, setKnob] = useState(0);
  const [jiggle, setJiggle] = useState(0);
  const [prize, setPrize] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [shy, setShy] = useState(false);
  const [hop, setHop] = useState(0);
  const taps = useRef([]);

  const collectedCount = PRIZES.filter((p) => save.collected.includes(p.id)).length;
  const hasSecret = save.collected.includes(SECRET.id);

  const spin = () => {
    if (phase === 'spinning' || phase === 'drop') return;
    const next = drawPrize(save);
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
          const fresh = !save.collected.includes(next.id);
          const collected = fresh ? [...save.collected, next.id] : save.collected;
          const allNormal = PRIZES.every((p) => collected.includes(p.id));
          const justCompleted = allNormal && !save.completed;
          updateSave((s) => ({
            ...s,
            collected,
            spins: s.spins + 1,
            secretReady: next.kind === 'hidden' ? false : s.secretReady,
            completed: s.completed || justCompleted,
          }));
          setPrize(next);
          setIsNew(fresh);
          setPhase('reveal');
          playSfx(next.kind === 'hidden' ? 'fanfare' : 'ding');
          if (next.kind === 'flower') onFlowers(24);
          if (next.kind === 'hidden') onFlowers(40);
          if (justCompleted) setTimeout(() => setCelebrate(true), 900);
        }, 800);
      },
    );
  };

  const openFromBook = (p) => {
    if (phase === 'spinning' || phase === 'drop') return;
    setPrize(p);
    setIsNew(false);
    setPhase('reveal');
    playSfx('pop', 0.5);
  };

  // 连续点小猫 5 次触发害羞彩蛋；还没拿过隐藏款的话，下一颗扭蛋就是它
  const tapCat = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2000), now];
    setHop((h) => h + 1);
    playSfx('meow', 0.6, 0.9 + Math.random() * 0.4);
    if (taps.current.length >= 5 && !shy) {
      taps.current = [];
      setShy(true);
      playSfx('boing');
      if (!hasSecret && !save.secretReady) {
        updateSave((s) => ({ ...s, secretReady: true }));
        setTimeout(() => playSfx('sparkle'), 500);
      }
      setTimeout(() => setShy(false), 2600);
    }
  };

  const catExpression = shy ? 'shy' : phase === 'spinning' ? 'determined' : phase === 'reveal' ? 'happy' : 'normal';

  return (
    <>
      <div className="panel station">
        <div className="panel-title">{TEXT.gacha1.replace('最后一个惊喜：', '')}</div>
        <div className="station-row">
          <div className={`cat-wrap ${shy ? 'cat-roll' : ''}`} key={shy ? 'shy' : `hop-${hop}`} onClick={tapCat}>
            <Cat size={150} expression={catExpression} arms={shy ? 'face' : 'up'} tail={10} />
            {shy && <div className="shy-bubble">被、被发现了……</div>}
          </div>
          <div className="machine-wrap">
            <GachaMachine size={200} knob={knob} jiggle={jiggle} phase={knob / 20} glow={(prize?.kind === 'hidden' && phase === 'reveal') || (save.secretReady && phase === 'idle') ? 1 : 0} />
            {(phase === 'drop' || phase === 'reveal') && (
              <div className="capsule-drop">
                <Capsule size={60} gold={prize?.kind === 'hidden'} open={phase === 'reveal' ? 1 : 0} />
              </div>
            )}
          </div>
        </div>

        <button className="big-btn" onClick={spin} disabled={phase === 'spinning' || phase === 'drop'}>
          {save.spins === 0 ? '扭一下！' : '再扭一次！'}
        </button>
        <div className="count">
          已经扭了 {save.spins} 次
          {save.secretReady && !hasSecret && `，${SECRET_READY}`}
        </div>

        {phase === 'reveal' && prize && (
          <div className={`prize-card ${prize.kind === 'hidden' ? 'gold' : ''}`} onClick={() => setPhase('idle')}>
            {isNew && <div className="new-badge">新收集</div>}
            <div className="prize-title">{prize.title}</div>
            <div className="prize-text">{prize.text}</div>
            <ShareButton
              text={prize.kind === 'hidden' ? secretShare(prize) : prizeShare(prize, collectedCount, PRIZES.length)}
              onShare={onShare}
            />
            <div className="prize-tip">点卡片收下</div>
            {prize.kind === 'hidden' && <Confetti />}
          </div>
        )}
      </div>

      <div className="panel book">
        <div className="panel-title">
          扭蛋图鉴{' '}
          <span className="book-count">
            {collectedCount}/{PRIZES.length}
            {hasSecret && ' +★'}
          </span>
        </div>
        <div className="book-grid">
          {PRIZES.map((p) => {
            const got = save.collected.includes(p.id);
            return (
              <button key={p.id} className={`book-tile ${got ? 'got' : ''}`} onClick={() => got && openFromBook(p)}>
                {got ? p.label : '?'}
              </button>
            );
          })}
          {hasSecret && (
            <button className="book-tile got hidden-tile" onClick={() => openFromBook(SECRET)}>
              {SECRET.label}
            </button>
          )}
        </div>
        <div className="book-tip">{secretHint(save)}</div>
      </div>

      {celebrate && (
        <div className="modal no-bloom" onClick={() => setCelebrate(false)}>
          <div className="prize-card gold static">
            <div className="prize-title">{COMPLETE_TITLE}</div>
            <div className="prize-text">{COMPLETE_TEXT}</div>
            <Cat size={120} expression="happy" arms="up" />
            <ShareButton text={completeShare(PRIZES.length, COMPLETE_TEXT)} onShare={onShare} />
            {!hasSecret && <div className="prize-tip">P.S. 听说还有一颗扭蛋不在图鉴里……</div>}
            <div className="prize-tip">点一下关闭</div>
            <Confetti />
          </div>
        </div>
      )}
    </>
  );
};

const SmileQuestion = ({ onShare }) => {
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
    setTimeout(() => playSfx('meow', 0.8, 1.2), 500);
  };

  return (
    <div className="panel question no-bloom">
      <div className="panel-title">{TEXT.sign}</div>
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
          <div className="done-text">
            那今天的任务就完成啦
            <br />
            明天继续～
          </div>
          <ShareButton text={smileShare} onShare={onShare} />
          <Confetti />
        </div>
      )}
    </div>
  );
};

export const Playground = ({ onReplay }) => {
  const [save, setSave] = useState(loadSave);
  const [flowers, setFlowers] = useState([]);
  const [toast, setToast] = useState('');
  const idRef = useRef(0);
  const toastTimer = useRef(null);

  const updateSave = (fn) =>
    setSave((s) => {
      const next = fn(s);
      writeSave(next);
      return next;
    });

  const [manualCopy, setManualCopy] = useState('');

  const share = async (text) => {
    const ok = await copyText(text);
    playSfx('pop', 0.5);
    if (!ok) {
      setManualCopy(text);
      return;
    }
    setToast('已复制，去微信粘贴给他吧');
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  };

  const addFlower = (x, y) => {
    const id = idRef.current++;
    const flower = { id, x, y, color: pick(FLOWER_COLORS), size: 40 + Math.random() * 40, rot: Math.random() * 360 };
    setFlowers((list) => [...list, flower]);
    setTimeout(() => setFlowers((list) => list.filter((f) => f.id !== id)), 2600);
  };

  const bloom = (e) => {
    if (e.target.closest('button, .no-bloom, .prize-card, .cat-wrap, .tube')) return;
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
      <DailyFortune save={save} updateSave={updateSave} onShare={share} />
      <GachaStation save={save} updateSave={updateSave} onFlowers={flowerRain} onShare={share} />
      <SmileQuestion onShare={share} />
      <button className="ghost-btn" onClick={onReplay}>
        再看一遍短片
      </button>

      <div className="flower-layer">
        {flowers.map((f) => (
          <div key={f.id} className="flower-pop" style={{ left: f.x, top: f.y, '--rot': `${f.rot}deg` }}>
            <Flower size={f.size} color={f.color} />
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
      {manualCopy && (
        <div className="modal no-bloom" onClick={() => setManualCopy('')}>
          <div className="prize-card static copy-card" onClick={(e) => e.stopPropagation()}>
            <div className="prize-title">长按下面的字复制</div>
            <div className="copy-text">{manualCopy}</div>
            <button className="share-btn" onClick={() => setManualCopy('')}>
              好了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
