import { SpriteClass } from "kontra";
import { COLOR } from "../../constants/color";
import { GRID_SIZE } from "../../constants/size";

type GridProps = {
  x: number;
  y: number;
  coord: [number, number];
};

export class Grid extends SpriteClass {
  public coord: [number, number];

  constructor({ x, y, coord }: GridProps) {
    super({
      x,
      y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      color: COLOR.GRAY_6,
      anchor: { x: 0.5, y: 0.5 },
    });
    this.coord = coord;
  }
}
