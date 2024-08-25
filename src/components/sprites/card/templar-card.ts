import { Belongs, CardType } from "./type";

import { Templar } from "../templar";
import { CharacterCard } from "./character-card";
import { AttackDirection } from "../../../types/character";
import { Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { WeightIcon } from "../icons/weight-icon";

export class TemplarCard extends CharacterCard {
  public weight = 0;
  protected weightText: Text;

  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.TEMPLAR,
      x,
      y,
      belongs: Belongs.PLAYER,
    });
    this.resetProps();
    this.weightText = Text({
      text: `${this.weight}`,
      x: -24,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.main.addChild([new WeightIcon(-46, 32), this.weightText]);
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
    this.attack = 4;
    this.hitRate = 1;
    this.criticalRate = 0.2;
    this.attackDirection = AttackDirection.FRONT;
    this.hitBackAttack = 0;
    this.refreshText();
  }

  public updateWeight(value: number): void {
    this.weight += value;
    this.weightText.text = `${this.weight}`;
  }
}
