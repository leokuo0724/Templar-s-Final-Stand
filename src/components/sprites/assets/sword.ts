import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class Sword extends GameObjectClass {
  constructor(x: number, y: number, scale?: number) {
    super({ x, y });
    this.setScale(scale ?? 1);
  }

  draw() {
    drawPolygon(
      this.context,
      "12 0 0 0 0 3 4 3 4 13 7 13 7 3 12 3 12 0",
      COLOR.BROWN_7,
      0,
      74
    );
    drawPolygon(
      this.context,
      "5 0 0 15 1 74 5 74 8 74 10 15 5 0",
      COLOR.WHITE_6,
      1,
      0
    );
  }
}
