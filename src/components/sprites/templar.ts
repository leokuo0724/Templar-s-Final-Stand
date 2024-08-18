import { GameObjectClass } from "kontra";
import { drawPolygon, drawRect } from "../../utils/draw-utils";
import { COLOR } from "../../constants/color";

type TemplarProps = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export class Templar extends GameObjectClass {
  constructor({ x, y, scaleX, scaleY }: TemplarProps) {
    super({ x, y, scaleX, scaleY });
  }

  draw() {
    drawPolygon(
      this.context,
      "9 0 17 0 16 9 10 12 0 12 9 0",
      COLOR.RED_7,
      55,
      61
    );
    drawPolygon(
      this.context,
      "54 43 56 41 64 28 52 0 19 0 0 33 16 41 16 74 26 74 27 71 43 62 55 74 66 74 54 43",
      COLOR.GRAY_7,
      0,
      34
    );
    drawPolygon(this.context, "0 12 7 12 10 0 0 0 0 12", COLOR.RED_7, 16, 108);
    drawPolygon(
      this.context,
      "0 0 5 6 5 12 12 12 12 1 11 0 0 0",
      COLOR.RED_7,
      55,
      108
    );
    drawPolygon(
      this.context,
      "42 49 41 12 39 0 33 0 36 12 9 12 9 0 3 0 1 49 0 64 47 64 42 49",
      COLOR.YELLOW_7,
      15,
      34
    );
    drawPolygon(
      this.context,
      "42 7 33 0 7 0 0 8 0 36 14 42 38 42 42 38 42 7",
      COLOR.GRAY_6,
      18,
      0
    );
    drawPolygon(
      this.context,
      "0 0 13 0 19 0 23 0 23 5 19 5 19 22 13 22 13 5 0 5 0 0",
      COLOR.BROWN_8,
      37,
      14
    );
    drawPolygon(
      this.context,
      "12 4 8 4 8 0 4 0 4 4 0 4 0 7 4 7 4 17 8 17 8 7 12 7 12 4",
      COLOR.RED_7,
      38,
      51
    );
    drawRect(this.context, 16, 75, 40, 7, "#ae5d40");

    // TODO: weapon if needed
    drawPolygon(
      this.context,
      "2 3 0 11 14 13 20 8 18 1 10 0 2 3",
      COLOR.RED_7,
      7,
      59
    );
  }
}
