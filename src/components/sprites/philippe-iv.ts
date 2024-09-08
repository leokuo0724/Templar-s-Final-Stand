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
      // "78 0 88 47 78 50 77 78 58 76 53 109 0 82 35 9 78 0",
      "53 9 87 82 35 109 30 76 11 78 10 50 0 47 10 0 53 9",
      COLOR.WHITE_6,
      // 17,
      0,
      39
    );
    drawPolygon(
      this.context,
      // "97 24 68 31 49 95 10 109 0 96 10 22 43 0 83 3 97 24",
      "13 3 54 0 87 22 97 96 87 109 48 95 28 31 0 24 13 3",
      COLOR.DARK_6,
      // 3,
      5,
      14
    );
    drawPolygon(
      this.context,
      // "93 27 89 0 76 22 54 25 38 0 38 29 19 38 0 28 10 56 98 36 93 27",
      "0 36 87 56 98 28 79 38 60 29 60 0 44 25 22 22 8 0 5 27 0 36",
      COLOR.YELLOW_7,
      // 0,
      7
    );
    drawPolygon(
      this.context,
      // "14 0 9 7 0 0 14 0",
      "15 0 5 7 0 0 15 0",
      COLOR.DARK_6,
      // 76,
      14,
      62
    );
  }
}
