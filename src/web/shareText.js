// 点"复制战绩，发给他"时复制的那句话。奖品文案里的 \n 在这里要拼成一行

const ENDS_WITH_MARK = /[：，。！？、…~～]$/;

// 前一行已经以标点结尾时不再补逗号，避免出现"颁发：，佳佳"这种情况
export const oneLine = (s) =>
  s.split('\n').reduce((acc, line) => (!acc ? line : ENDS_WITH_MARK.test(acc) ? acc + line : `${acc}，${line}`), '');

const exclaim = (s) => (ENDS_WITH_MARK.test(s) ? s : `${s}！`);

export const fortuneShare = (fortune) => `我抽到了今日签【${fortune.level}】${exclaim(fortune.text)}`;

export const prizeShare = (prize, collected, total) =>
  `我在「快乐扭蛋机」抽到了【${prize.title.replace(/！$/, '')}】${exclaim(oneLine(prize.text))}图鉴已收集 ${collected}/${total}`;

export const secretShare = (prize) =>
  `我找到了「快乐扭蛋机」不在图鉴里的隐藏款！【${prize.title}】${exclaim(oneLine(prize.text))}`;

export const completeShare = (total, text) => `我集齐了「快乐扭蛋机」全部 ${total} 款扭蛋！${exclaim(oneLine(text))}`;

export const smileShare = '报告小猫店长：佳佳笑了，任务完成！';
