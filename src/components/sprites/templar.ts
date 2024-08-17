import { GameObjectClass } from "kontra";
import { drawPolygon, drawRect } from "./draw-utils";
import { COLOR } from "../../constants/color";

export class Templar extends GameObjectClass {
  constructor() {
    super({ scaleX: 2, scaleY: 2 });
  }

  draw() {
    drawPolygon(
      this.context,
      "64 61 72 61 71 70 65 73 55 73 64 61",
      COLOR.RED_7
    );
    drawPolygon(
      this.context,
      "54 77 56 75 64 62 52 34 19 34 0 67 16 75 16 108 26 108 27 105 43 96 55 108 66 108 54 77",
      COLOR.GRAY_7
    );
    drawPolygon(
      this.context,
      "16 120 23 120 26 108 16 108 16 120",
      COLOR.RED_7
    );
    drawPolygon(
      this.context,
      "55 108 60 114 60 120 67 120 67 109 66 108 55 108",
      COLOR.RED_7
    );
    drawPolygon(
      this.context,
      "57 83 56 46 54 34 48 34 51 46 24 46 24 34 18 34 16 83 15 98 62 98 57 83",
      COLOR.YELLOW_7
    );
    drawPolygon(
      this.context,
      "60 7 51 0 25 0 18 8 18 36 32 42 56 42 60 38 60 7",
      COLOR.GRAY_6
    );
    drawPolygon(
      this.context,
      "37 14 50 14 56 14 60 14 60 19 56 19 56 36 50 36 50 19 37 19 37 14",
      COLOR.BROWN_8
    );
    drawPolygon(
      this.context,
      "50 55 46 55 46 51 42 51 42 55 38 55 38 58 42 58 42 68 46 68 46 58 50 58 50 55",
      COLOR.RED_7
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
