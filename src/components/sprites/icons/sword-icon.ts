import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class SwordIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.setScale(0.5);
  }

  draw() {
    drawPolygon(
      this.context,
      "10 19 23 6 24 0 19 1 5 15 4 13 1 16 4 18 0 23 1 24 2 25 6 21 9 23 11 21 10 19",
      COLOR.WHITE_6,
      4,
      3
    );
  }
}
