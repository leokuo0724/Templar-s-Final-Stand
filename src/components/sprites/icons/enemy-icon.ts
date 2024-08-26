import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../../utils/draw-utils";
import { COLOR } from "../../../constants/color";

export class EnemyIcon extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.setScale(0.9);
  }

  draw() {
    drawPolygon(
      this.context,
      "10 0 0 8 0 25 5 32 6 16 2 15 3 12 8 13 8 23 10 25 11 23 11 13 16 12 17 15 13 16 14 32 19 25 19 8 10 0",
      COLOR.WHITE_6
    );
  }
}
