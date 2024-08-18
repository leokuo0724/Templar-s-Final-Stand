import { GameObject, Sprite, SpriteClass } from "kontra";
import { GRID_SIZE } from "../../../constants/size";

import { COLOR } from "../../../constants/color";
import { CardType } from "./type";

type CardProps = {
  type: CardType;
  x: number;
  y: number;
};

enum CardPart {
  BACKGROUND,
  CIRCLE,
}

export abstract class BaseCard extends SpriteClass {
  public type: CardType;
  protected main: Sprite;

  constructor({ type, x, y }: CardProps) {
    super({
      x,
      y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: COLOR.DARK_6, // shadow
      anchor: { x: 0.5, y: 0.5 },
    });
    this.type = type;
    this.setScale(0);

    this.main = Sprite({
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: getCardColor(type, CardPart.BACKGROUND),
      anchor: { x: 0.5, y: 0.5 },
    });
    this.addChild(this.main);

    const circle = Sprite({
      radius: 24,
      color: getCardColor(type, CardPart.CIRCLE),
      anchor: { x: 0.5, y: 0.5 },
    });
    const mainIcon = this.getMainIcon();
    this.main.addChild([circle, mainIcon]);
  }

  protected abstract getMainIcon(): GameObject;

  public destroy() {
    this.ttl = 0;
  }
  public reset() {
    // TODO: reset props
    this.ttl = Infinity;
  }

  private setChildrenOpacity(opacity: number) {
    this.children.forEach((child) => (child.opacity = opacity));
    this.main.children.forEach((child) => (child.opacity = opacity));
  }

  public update(): void {
    // When generating the card
    if (this.scaleX <= 1) {
      this.scaleX += 0.1;
      this.scaleY += 0.1;
      if (this.scaleX > 1) this.setScale(1);
    }
    // When destroying the card
    if (!this.isAlive() && this.opacity > 0) {
      this.opacity -= 0.1;
      this.setChildrenOpacity(this.opacity);
    }
    // When reactivating the card
    if (this.isAlive() && this.opacity < 1) {
      this.opacity += 0.1;
      this.setChildrenOpacity(this.opacity);
    }
  }

  public render(): void {
    if (this.opacity < 0) return;
    super.render();
  }
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
