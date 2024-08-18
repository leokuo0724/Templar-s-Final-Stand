import { GRID_SIZE } from "../../../constants/size";
import { BaseCard } from "./base-card";
import { CardType } from "./type";

import { Templar } from "../templar";

export class TemplarCard extends BaseCard {
  constructor() {
    super({ type: CardType.TEMPLAR });
  }

  protected getMainIcon() {
    const templar = new Templar({
      x: GRID_SIZE / 4 + 10,
      y: GRID_SIZE / 4 + 4,
      scaleX: 0.33,
      scaleY: 0.33,
    });
    return templar;
  }
}
