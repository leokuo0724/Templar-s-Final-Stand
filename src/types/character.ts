export enum AttackDirection {
  FRONT = "front", // 1 grid
  LINE = "line", // 4 grid
  AROUND = "around", // 4 grid
}

export type CharacterProps = {
  maxHealth: number;
  health: number;
  shield: number;
  dodgeRate: number;
  attack: number;
  hitRate: number;
  criticalRate: number;
  attackDirection: AttackDirection;
  hitBackAttack: number;
};
export type OptionalCharacterProps = {
  [P in keyof CharacterProps]?: CharacterProps[P];
};
