import { Belongs, CardType } from "./type";

import { Templar } from "../templar";
import { CharacterCard } from "./character-card";
import { AttackDirection } from "../../../types/character";

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
      attack: 5,
      hitRate: 0.8,
      criticalRate: 0.2,
      attackDirection: AttackDirection.LINE,
      hitBackAttack: 1,
    });
  }

  protected getMainIcon() {
    const templar = new Templar({
      x: -12,
      y: -20,
      scale: 0.33,
    });
    return templar;
  }

  protected deathCallback() {}
}
