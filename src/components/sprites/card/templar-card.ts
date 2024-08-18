import { AttackDirection, Belongs, CardType } from "./type";

import { Templar } from "../templar";
import { CharacterCard } from "./character-card";

export class TemplarCard extends CharacterCard {
  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.TEMPLAR,
      x,
      y,
      belongs: Belongs.PLAYER,
      maxHealth: 10,
      health: 10,
      shield: 0,
      dodgeRate: 0,
      attack: 1,
      hitRate: 0.8,
      criticalRate: 0.2,
      attackDirection: AttackDirection.FRONT,
      hitBackAttack: 0,
    });
  }

  protected getMainIcon() {
    const templar = new Templar({
      x: -12,
      y: -20,
      scaleX: 0.33,
      scaleY: 0.33,
    });
    return templar;
  }
}
