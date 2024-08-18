import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class HeartIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }

  draw() {
    drawPolygon(
      this.context,
      "20 0 13 3 7 0 0 9 13 23 26 9 20 0",
      COLOR.BROWN_8
    );
  }
}
