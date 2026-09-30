// 把扭蛋记录存在她手机浏览器里（localStorage），下次打开还在
const KEY = 'happy-gacha-v1';

const DEFAULT = { collected: [], spins: 0, sinceHidden: 0, completed: false, fortune: null };

export const loadSave = () => {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULT };
  }
};

export const writeSave = (save) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // 无痕模式等情况下存不了，不影响玩
  }
};

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

// 按日期算今天是第几支签。乘 7 再取余，20 天内每天都不一样
export const fortuneIndexForToday = (count) => {
  const d = new Date();
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  return (day * 7) % count;
};

// 必须在点击事件里同步调用：微信等内置浏览器只允许"用户刚点完"时写剪贴板
const copyBySelection = (text) => {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  Object.assign(ta.style, { position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', fontSize: '16px', opacity: '0.01' });
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
};

export const copyText = async (text) => {
  if (copyBySelection(text)) return true;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
