export function getRandomPropertyKeys<T extends object>(
  obj: T,
  count: number = 1
): Array<keyof T> {
  const keys = Object.keys(obj) as Array<keyof T>;
  const shuffled = [...keys].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, keys.length));
}

export function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
