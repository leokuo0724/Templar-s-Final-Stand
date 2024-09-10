export enum AttackDirection {
  F = "front", // 1 grid
  A = "around", // 4 grid
  C = "cross", // 8 grid
}
export const DIRECTION_TIER_MAP = {
  [AttackDirection.F]: 2,
  [AttackDirection.A]: 1,
  [AttackDirection.C]: 0,
};

export enum AttackType {
  N = "normal",
  P = "penetrate",
}

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
