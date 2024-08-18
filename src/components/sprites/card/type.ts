export enum CardType {
  TEMPLAR,
  WEAPON,
}

export enum Belongs {
  TEMPLAR,
  ENEMY,
}
export enum AttackDirection {
  FORWARD,
  AROUND,
  LINE,
}

export interface ICharacter {
  belongs: Belongs;
  // defense related
  health: number;
  shield: number;
  dodgeRate: number;
  // attack related
  attack: number;
  hitRate: number;
  criticalRate: number;
  attackDirection: AttackDirection;
  // hit back mechanism
  isHitBack: boolean;
  hitBackAttack: number;
  // methods
  setHealth: (health: number) => void;
  setShield: (shield: number) => void;
  takeDamage: (
    damage: number,
    isCritical: boolean,
    isPuncture: boolean
  ) => void;
}
