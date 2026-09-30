const cache = {};

export const playSfx = (name, volume = 0.7) => {
  const src = `audio/${name}.wav`;
  if (!cache[src]) cache[src] = new Audio(src);
  const a = cache[src].cloneNode();
  a.volume = volume;
  a.play().catch(() => {});
};
