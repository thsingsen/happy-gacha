// 所有台词和字幕都在这里，想改成只有你们俩懂的梗，直接改引号里的字就行。
// 注意：字太长会换行或挤出画面，改完用 npm run studio 预览一下。

export const TEXT = {
  channel: '佳佳专属快乐频道',
  episode: '第 1 集 · 小猫店长的秘密任务',

  wake1: '早上七点，小猫还在呼呼大睡……',
  alarm: '叮铃铃！',
  wake2: '（迷迷糊糊看了一眼日历）',
  calendarTitle: '今日任务',
  calendarTask: '让佳佳笑一下',
  wake3: '！！！这可是头等大事！',

  shopNames: ['甜品店', '花店', '奶茶店'],
  shop1: '第一站：甜品店',
  shop2: '第二站：花店',
  shop3: '第三站：奶茶店',
  shopWobble: '好像……装得有点多了',
  slowmo: '慢 动 作',
  shopSaved: '呼……佳佳的奶茶保住了！',

  bake1: '第二步：亲手做蛋糕！',
  bake2: '噗——',
  bake3: '……变成了一只白猫',
  bake4: '没关系，蛋糕完美！',
  flag: '佳佳专属',

  gacha1: '最后一个惊喜：快乐扭蛋机！',
  prize1Title: '夸夸券',
  prize1Text: '佳佳今天也超级可爱\n这是事实',
  gacha2: '咦？机器好像有点激动……',
  prize2Title: '隐藏款！',
  prize2Text: '好运一整天',

  sign: '佳佳笑了没？',
  yes: '笑了',
  no: '没有',
  endTease: '“没有”按钮：抓不到我～',
  endDone: '任务完成！',

  outro1: '任务完成，明天继续～',
  outro2: '想自己扭蛋？戳链接 →',
  outro3: '佳佳专属快乐频道 · 第 1 集 完',
};

// 网页互动版扭蛋机的奖池。\n 是换行，每行 10 个字以内最好看
export const COMPLIMENTS = [
  '佳佳今天也超级可爱\n这是事实',
  '佳佳笑起来\n比奶茶还甜',
  '佳佳笑起来的时候\n天气都会变好',
  '佳佳又聪明又温柔\n是满分选手',
  '佳佳认真的样子\n闪闪发光',
  '佳佳的品味\n一级棒',
  '佳佳今天也很努力\n超厉害的',
  '佳佳的笑容\n有治愈一切的魔法',
];

// 网页互动版的每日一签：每天换一支，20 天内不重复
export const FORTUNES = [
  { level: '大吉', text: '今日宜：喝一杯全糖奶茶' },
  { level: '上上签', text: '今天会有一件小小的好事发生' },
  { level: '大吉', text: '今日宜：早点睡觉，梦里有小猫' },
  { level: '超吉', text: '今天的佳佳，颜值满分' },
  { level: '大吉', text: '今日宜：吃点甜的，烦恼自动退散' },
  { level: '上上签', text: '今天做的决定都是对的' },
  { level: '大吉', text: '今日宜：出门晒晒太阳' },
  { level: '超吉', text: '今天说的话都会被温柔对待' },
  { level: '大吉', text: '今日宜：给自己放个小假' },
  { level: '上上签', text: '今天的运气，比昨天多一点' },
  { level: '大吉', text: '今日宜：听一首喜欢的歌' },
  { level: '超吉', text: '今天的佳佳，闪闪发光' },
  { level: '大吉', text: '今日宜：拍一张好看的照片' },
  { level: '上上签', text: '遇到的烦心事，都会顺利解决' },
  { level: '大吉', text: '今日宜：大笑三次' },
  { level: '超吉', text: '今天出门，一路都是绿灯' },
  { level: '大吉', text: '今日宜：点一份想吃很久的外卖' },
  { level: '上上签', text: '今天会被人偷偷夸' },
  { level: '大吉', text: '今日宜：抱一抱喜欢的东西' },
  { level: '小猫认证', text: '今天也是被小猫守护的一天' },
];

// 图鉴集齐后的奖励
export const COMPLETE_TITLE = '集齐啦！';
export const COMPLETE_TEXT = '小猫店长颁发：\n佳佳年度最可爱奖';

export const FOODS = [
  { name: '奶茶', text: '今日份甜度已补充' },
  { name: '草莓蛋糕', text: '热量归小猫，快乐归佳佳' },
  { name: '小布丁', text: 'Q 弹 Q 弹，心情也 Q 弹' },
  { name: '烤红薯', text: '暖乎乎的，捧在手里刚刚好' },
];
