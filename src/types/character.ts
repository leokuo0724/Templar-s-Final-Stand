export type AttackDirection =
  | "front"
  | "around"
  | "cross";
export const DIRECTION_TIER_MAP = {
  ["front"]: 2,
  ["around"]: 1,
  ["cross"]: 0,
};

export type AttackType =
  | "normal"
  | "penetrate";

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
