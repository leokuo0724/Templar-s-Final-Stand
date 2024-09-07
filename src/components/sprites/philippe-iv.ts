import { GameObjectClass } from "kontra";
import { drawPolygon } from "../../utils/draw-utils";
import { COLOR } from "../../constants/color";

export class PhillippeIV extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }
  draw(): void {
    drawPolygon(
      this.context,
      "78 0 88 47 78 50 77 78 58 76 53 109 0 82 35 9 78 0",
      COLOR.WHITE_6,
      17,
      39
    );
    drawPolygon(
      this.context,
      "97 24 68 31 49 95 10 109 0 96 10 22 43 0 83 3 97 24",
      COLOR.DARK_6,
      3,
      14
    );
    drawPolygon(
      this.context,
      "93 27 89 0 76 22 54 25 38 0 38 29 19 38 0 28 10 56 98 36 93 27",
      COLOR.YELLOW_7
    );
    drawPolygon(this.context, "14 0 9 7 0 0 14 0", COLOR.DARK_6, 76, 62);
  }
}
