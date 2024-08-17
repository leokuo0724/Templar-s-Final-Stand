import { SpriteClass } from "kontra";
import { COLOR } from "../../constants/color";

type GridProps = {
  x: number;
  y: number;
  coord: [number, number];
};

export const GRID_SIZE = 100;

export class Grid extends SpriteClass {
  public coord: [number, number];

  constructor({ x, y, coord }: GridProps) {
    super({
      x,
      y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: COLOR.GRAY_6,
    });
    this.coord = coord;
  }
}
