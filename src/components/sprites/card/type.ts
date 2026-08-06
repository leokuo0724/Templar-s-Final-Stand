export const CardType = {
  T: 0, // Templar
  E: 1, // Enemy
  W: 2, // Weapon
  S: 3, // Shield
  P: 4, // Potion
} as const;
export type CardType = (typeof CardType)[keyof typeof CardType];

export const Belongs = {
  PLAYER: 0,
  ENEMY: 1,
} as const;
export type Belongs = (typeof Belongs)[keyof typeof Belongs];
