import { GameObjectClass, Sprite } from "kontra";
import { Grid } from "./grid";
import { COLOR } from "../../constants/color";
import { GRID_SIZE } from "../../constants/size";
import { CardFactory } from "../sprites/card/card-factory";
import { CardType } from "../sprites/card/type";

const GAP = 4;
const PADDING = 8;
const GRIDS_IN_LINE = 5;
export const BOARD_SIZE =
  GRID_SIZE * GRIDS_IN_LINE + GAP * (GRIDS_IN_LINE - 1) + PADDING * 2;

export class Board extends GameObjectClass {
  private grids: Grid[] = [];

  constructor(x: number, y: number) {
    super({ x, y });

    const bg = Sprite({
      x: 0,
      y: 0,
      width: BOARD_SIZE,
      height: BOARD_SIZE,
      color: COLOR.GRAY_7,
    });
    this.addChild(bg);

    for (let i = 0; i < GRIDS_IN_LINE; i++) {
      for (let j = 0; j < GRIDS_IN_LINE; j++) {
        const grid = new Grid({
          x: PADDING + i * (GRID_SIZE + GAP) + GRID_SIZE / 2,
          y: PADDING + j * (GRID_SIZE + GAP) + GRID_SIZE / 2,
          coord: [j, i],
        });
        this.grids.push(grid);
        this.addChild(grid);
      }
    }

    const centerGrid = this.getGridByCoord([2, 2]);
    const a = CardFactory.createCard({
      type: CardType.TEMPLAR,
      x: centerGrid.x,
      y: centerGrid.y,
    });
    this.addChild(a);
  }

  public getGridByCoord(coord: [number, number]): Grid {
    const grid = this.grids[coord[0] * GRIDS_IN_LINE + coord[1]];
    if (!grid) throw new Error(`Grid not found by coord: ${coord}`);
    return grid;
  }
}
