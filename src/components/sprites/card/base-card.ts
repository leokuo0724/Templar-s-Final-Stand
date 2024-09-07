import { GameObject, Sprite, SpriteClass } from "kontra";
import { GRID_SIZE } from "../../../constants/size";

import { COLOR } from "../../../constants/color";
import { CardType } from "./type";
import { tween } from "../../../utils/tween-utils";

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
  public isActive: boolean = true;
  protected mainIcon: GameObject;

  constructor({ type, x, y }: CardProps) {
    super({
      x,
      y,
      width: GRID_SIZE,
      height: GRID_SIZE,
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

    const isTemplar = type === CardType.TEMPLAR;
    const circle = Sprite({
      radius: isTemplar ? 28 : 24,
      color: getCardColor(type, CardPart.CIRCLE),
      anchor: { x: 0.5, y: 0.5 },
      y: isTemplar ? 0 : this.type === CardType.ENEMY ? -14 : -20,
    });
    this.mainIcon = this.getMainIcon();
    this.main.addChild([circle, this.mainIcon]);
  }

  protected abstract getMainIcon(): GameObject;

  public async moveTo(x: number, y: number) {
    await tween(this, { targetX: x, targetY: y }, 100);
  }

  public async setInactive(ms: number = 200) {
    await this.setChildrenOpacity(0, ms);
    this.isActive = false;
  }
  public async setActive(x: number, y: number) {
    this.x = x;
    this.y = y;
    await this.setChildrenOpacity(1, 200);
    this.isActive = true;
  }
  public reset() {
    this.isActive = true;
    this.setChildrenOpacity(1, 0);
    this.setScale(0);
    this.resetProps();
  }
  protected abstract resetProps(): void;

  protected async setChildrenOpacity(opacity: number, duration: number) {
    await Promise.all([
      tween(this, { opacity }, duration),
      tween(this.main, { opacity }, duration),
      ...this.children.map((child) => tween(child, { opacity }, duration)),
      ...this.main.children.map((child) => tween(child, { opacity }, duration)),
    ]);
  }

  public update(): void {
    // When generating the card
    if (this.scaleX <= 1) {
      this.scaleX += 0.1;
      this.scaleY += 0.1;
      if (this.scaleX > 1) this.setScale(1);
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
    case CardType.ENEMY:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.RED_7;
        case CardPart.CIRCLE:
          return COLOR.RED_6;
      }
    case CardType.WEAPON:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.BLUE_7;
        case CardPart.CIRCLE:
          return COLOR.BLUE_6;
      }
    case CardType.SHIELD:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.BROWN_7;
        case CardPart.CIRCLE:
          return COLOR.BROWN_6;
      }
    case CardType.POTION:
      switch (part) {
        case CardPart.BACKGROUND:
          return COLOR.GREEN_6;
        case CardPart.CIRCLE:
          return COLOR.GREEN_5;
      }
  }
}
