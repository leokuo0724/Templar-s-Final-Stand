export enum AttackDirection {
  FRONT = "front", // 1 grid
  LINE = "line", // 4 grid
  AROUND = "around", // 4 grid
}

export type CharacterProps = {
  health: number;
  shield: number;
  attack: number;
  hitRate: number;
  criticalRate: number;
  attackDirection: AttackDirection;
  hitBackAttack: number;
};
export type OptionalCharacterProps = {
  [P in keyof CharacterProps]?: CharacterProps[P];
};
