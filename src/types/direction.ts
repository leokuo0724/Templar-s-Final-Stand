export const Direction = {
  U: 0,
  D: 1,
  L: 2,
  R: 3,
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];
