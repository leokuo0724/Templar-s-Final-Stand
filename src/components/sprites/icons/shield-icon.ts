import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class ShieldIcon extends GameObjectClass {
  constructor(
    x: number,
    y: number,
    scale?: number,
    color: string = COLOR.BROWN_7
  ) {
    super({ x, y });
    this.setScale(scale ?? 1);
    this.color = color;
  }

  draw() {
    drawPolygon(
      this.context,
      "10 0 0 3 0 15 2 19 10 23 17 19 19 15 19 3 10 0",
      this.color
    );
  }
}
