import { GameObjectClass } from "kontra";
import { drawPolygon, drawRect } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class PotionIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }

  draw() {
    drawRect(this.context, 6, 0, 6, 3, COLOR.WHITE_6);
    drawPolygon(
      this.context,
      "12 6 12 0 6 0 6 6 0 11 4 24 14 24 18 11 12 6",
      COLOR.WHITE_6,
      0,
      5
    );
  }
}
