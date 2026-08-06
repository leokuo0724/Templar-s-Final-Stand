export const AttackDirection = {
  F: "front", // 1 grid
  A: "around", // 4 grid
  C: "cross", // 8 grid
} as const;
export type AttackDirection = (typeof AttackDirection)[keyof typeof AttackDirection];
export const DIRECTION_TIER_MAP = {
  [AttackDirection.F]: 2,
  [AttackDirection.A]: 1,
  [AttackDirection.C]: 0,
};

export const AttackType = {
  N: "normal",
  P: "penetrate",
} as const;
export type AttackType = (typeof AttackType)[keyof typeof AttackType];

export type CharacterProps = {
  health: number;
  shield: number;
  attack: number;
  hitRate: number;
  critical: number;
  attackDirection: AttackDirection;
  attackType: AttackType;
  hitBack: number;
};
export type OptionalCharacterProps = {
  [P in keyof CharacterProps]?: CharacterProps[P];
};
