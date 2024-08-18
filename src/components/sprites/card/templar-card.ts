import { BaseCard } from "./base-card";
import { CardType } from "./type";

import { Templar } from "../templar";

export class TemplarCard extends BaseCard {
  constructor({ x, y }: { x: number; y: number }) {
    super({ type: CardType.TEMPLAR, x, y });
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
