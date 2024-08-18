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
          x: PADDING + i * (GRID_SIZE + GAP),
          y: PADDING + j * (GRID_SIZE + GAP),
          coord: [j, i],
        });
        this.grids.push(grid);
        this.addChild(grid);
      }
    }

    this.addChild(CardFactory.createCard(CardType.TEMPLAR));
  }
}
