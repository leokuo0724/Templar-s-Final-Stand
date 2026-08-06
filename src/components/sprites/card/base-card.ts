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

type CardPart =
  | 0
  | 1;

export abstract class BaseCard extends SpriteClass {
  public type: CardType;
  protected main: Sprite;
  public isActive: boolean = true;
  protected circle: Sprite;

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
      color: getCardColor(type, 0),
      anchor: { x: 0.5, y: 0.5 },
    });
    this.addChild(this.main);

    const isTemplar = type === 0;
    this.circle = Sprite({
      radius: isTemplar ? 28 : 24,
      color: getCardColor(type, 1),
      anchor: { x: 0.5, y: 0.5 },
      y: isTemplar ? -4 : this.type === 1 ? -14 : -20,
    });
    const mainIcon = this.getMainIcon();
    this.main.addChild([this.circle, mainIcon]);
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
    case 0:
      switch (part) {
        case 0:
          return COLOR.YELLOW_7;
        case 1:
          return COLOR.YELLOW_6;
      }
    case 1:
      switch (part) {
        case 0:
          return COLOR.RED_7;
        case 1:
          return COLOR.RED_6;
      }
    case 2:
      switch (part) {
        case 0:
          return COLOR.BLUE_7;
        case 1:
          return COLOR.BLUE_6;
      }
    case 3:
      switch (part) {
        case 0:
          return COLOR.BROWN_7;
        case 1:
          return COLOR.BROWN_6;
      }
    case 4:
      switch (part) {
        case 0:
          return COLOR.GREEN_6;
        case 1:
          return COLOR.GREEN_5;
      }
  }
}
