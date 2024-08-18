import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class ClockIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.setScale(0.5);
  }

  draw() {
    drawPolygon(
      this.context,
      "7 7 0 7 0 0 2 0 2 5 7 5 7 7",
      COLOR.WHITE_6,
      11,
      6
    );
    drawPolygon(
      this.context,
      "22 3 15 0 12 0 12 2 13 2 20 5 22 10 22 14 20 19 13 22 11 22 4 19 2 14 2 10 4 5 11 2 12 2 12 0 9 0 2 3 0 8 0 16 2 21 9 24 15 24 22 21 24 16 24 8 22 3",
      COLOR.WHITE_6
    );
  }
}
