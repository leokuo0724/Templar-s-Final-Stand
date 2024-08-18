import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class WeightIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.setScale(0.4);
  }

  draw() {
    drawPolygon(
      this.context,
      "24 5 20 5 20 0 12 0 12 5 8 5 0 24 32 24 24 5",
      COLOR.WHITE_6,
      0,
      4
    );
  }
}
