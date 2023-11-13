export function randomInt(min: number, max: number) {
  min = min ?? 0;
  max = max ?? 1;

  if (min === max) return min;
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomFloat(min: number, max: number) {
  min = min ?? 0;
  max = max ?? 1;

  if (min === max) return min;
  return Math.random() * (max - min) + min;
}
