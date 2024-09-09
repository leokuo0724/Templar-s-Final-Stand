import { GameObjectClass } from "kontra";
import { drawPolygon, drawShield, drawSword } from "../../utils/draw-utils";
import { COLOR } from "../../constants/color";

export class Enemy extends GameObjectClass {
  private isElite: boolean;

  constructor(x: number, y: number, isElite: boolean = false) {
    super({ x, y });
    this.setScale(0.45);
    this.isElite = isElite;
  }
  draw(): void {
    drawPolygon(this.context, "7 0 0 26 13 26 7 0", COLOR.GRAY_6, 6, 48);
    drawPolygon(
      this.context,
      "24 0 0 10 7 47 24 50 42 47 24 0",
      COLOR.GRAY_7,
      14,
      40
    );
    drawPolygon(this.context, "18 0 0 18 33 9 18 0", COLOR.GRAY_6, 3, 39);
    drawPolygon(
      this.context,
      "7 27 14 30 22 27 29 0 0 0 7 27",
      COLOR.DARK_6,
      24,
      15
    );
    drawPolygon(
      this.context,
      "17 0 0 7 0 36 9 47 11 26 5 24 7 19 15 21 15 37 20 37 20 21 28 19 30 24 24 26 25 47 35 36 35 7 17 0",
      COLOR.WHITE_6,
      21
    );

    drawShield(this.context, this.isElite ? COLOR.YELLOW_7 : "#77492a", 30, 38);
    drawPolygon(this.context, "6 0 0 10 10 17 16 7 6 0", COLOR.RED_7, 0, 66);
    if (this.isElite) {
      drawSword(this.context, COLOR.WHITE_6, 8, 50);
    } else {
      drawPolygon(
        this.context,
        "0 11 20 0 32 0 25 8 1 16 0 11",
        COLOR.WHITE_6,
        7,
        61
      );
    }
  }
}
