import { GameObjectClass } from "kontra";
import { drawPolygon, drawRect } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class WarningIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }

  draw() {
    drawPolygon(this.context, "10 0 0 17 20 17 10 0", COLOR.YELLOW_7);
    drawRect(this.context, 9, 6, 2, 6, COLOR.DARK_6);
    drawRect(this.context, 9, 13, 2, 2, COLOR.DARK_6);
  }
}
