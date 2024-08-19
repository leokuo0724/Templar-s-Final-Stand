import { GameObjectClass, Sprite } from "kontra";
import { COLOR } from "../../constants/color";
import { Templar } from "../sprites/templar";
import { ItemPanel } from "./item-panel";

export const INFO_PANEL_HEIGHT = 184;

export class InfoPanel extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });

    const bg = Sprite({
      x: 0,
      y: 0,
      color: COLOR.YELLOW_6,
      width: this.context.canvas.width,
      height: INFO_PANEL_HEIGHT,
    });

    this.addChild([
      bg,
      new Templar({ x: 8, y: 42, withWeapon: true }),
      new ItemPanel(120, 30),
    ]);
  }
}
