import { GameObject, Sprite, SpriteClass } from "kontra";
import { GRID_SIZE } from "../../../constants/size";

import { COLOR } from "../../../constants/color";
import { CardType } from "./type";

type CardProps = {
  type: CardType;
};

enum CardPart {
  BACKGROUND,
  CIRCLE,
}

export abstract class BaseCard extends SpriteClass {
  public type: CardType;
  protected main: Sprite;

  constructor({ type }: CardProps) {
    super({
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: COLOR.DARK_6, // shadow
    });
    this.type = type;

    this.main = Sprite({
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: getCardColor(type, CardPart.BACKGROUND),
    });
    this.addChild(this.main);

    const circle = Sprite({
      x: GRID_SIZE / 4,
      y: GRID_SIZE / 4,
      radius: 24,
      color: getCardColor(type, CardPart.CIRCLE),
    });
    const mainIcon = this.getMainIcon();
    this.main.addChild([circle, mainIcon]);
  }

  protected abstract getMainIcon(): GameObject;
}

// Utils
function getCardColor(type: CardType, part: CardPart) {
  switch (type) {
    case CardType.TEMPLAR:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.YELLOW_7;
        case CardPart.CIRCLE:
          return COLOR.YELLOW_6;
      }
    case CardType.WEAPON:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.BLUE_7;
        case CardPart.CIRCLE:
          return COLOR.BLUE_6;
      }
  }
}
