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
    });
    this.resetProps();
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

  protected resetProps(): void {
    this.health = 10;
    this.shield = 0;
    this.attack = 5;
    this.hitRate = 1;
    this.criticalRate = 0.2;
    this.attackDirection = AttackDirection.FRONT;
    this.hitBackAttack = 0;
    this.refreshText();
  }
}
