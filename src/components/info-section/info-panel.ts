import { GameObjectClass, Sprite } from "kontra";
import { COLOR } from "../../constants/color";

export const INFO_PANEL_HEIGHT = 184;

export class InfoPanel extends GameObjectClass {
  constructor(x: number, y: number) {
    super();

    const bg = Sprite({
      x: 0,
      y: 0,
      color: COLOR.YELLOW_6,
      width: this.context.canvas.width,
      height: INFO_PANEL_HEIGHT,
    });

    this.addChild([bg]);
    this.x = x;
    this.y = y;
  }
}
