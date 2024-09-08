export enum AttackDirection {
  FRONT = "front", // 1 grid
  AROUND = "around", // 4 grid
  CROSS = "cross", // 8 grid
}
export const DIRECTION_TIER_MAP = {
  [AttackDirection.FRONT]: 2,
  [AttackDirection.AROUND]: 1,
  [AttackDirection.CROSS]: 0,
};

export enum AttackType {
  NORMAL = "normal",
  PENETRATE = "penetrate",
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
