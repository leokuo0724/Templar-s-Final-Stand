import { emit, GameObjectClass, on, Sprite } from "kontra";
import { Grid } from "./grid";
import { COLOR } from "../../constants/color";
import { GRID_SIZE } from "../../constants/size";
import { CardFactory } from "../sprites/card/card-factory";
import { CardType } from "../sprites/card/type";
import { BaseCard } from "../sprites/card/base-card";
import { EVENT } from "../../constants/event";
import { Direction } from "../../types/direction";
import { delay } from "../../utils/time-utils";
import { CharacterCard } from "../sprites/card/character-card";
import { ItemCard } from "../sprites/card/item-card";

const GAP = 4;
const PADDING = 8;
const GRIDS_IN_LINE = 5;
export const BOARD_SIZE =
  GRID_SIZE * GRIDS_IN_LINE + GAP * (GRIDS_IN_LINE - 1) + PADDING * 2;

export class Board extends GameObjectClass {
  private grids: Grid[] = [];
  private occupiedInfo: (BaseCard | null)[][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => null)
  );

  constructor(x: number, y: number) {
    super({ x, y });
    on(EVENT.SWIPE, this.onSwipe.bind(this));

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
    const templarCard = CardFactory.createCard({
      type: CardType.TEMPLAR,
      x: centerGrid.x,
      y: centerGrid.y,
    });
    this.addChild(templarCard);
    this.occupiedInfo[2][2] = templarCard;

    const tGrid = this.getGridByCoord([2, 3]);
    const weaponCard = CardFactory.createCard({
      type: CardType.WEAPON,
      x: tGrid.x,
      y: tGrid.y,
    });
    this.addChild(weaponCard);
    this.occupiedInfo[2][3] = weaponCard;

    const sGrid = this.getGridByCoord([3, 4]);
    const aeaponCard = CardFactory.createCard({
      type: CardType.WEAPON,
      x: sGrid.x,
      y: sGrid.y,
    });
    this.addChild(aeaponCard);
    this.occupiedInfo[3][4] = aeaponCard;
  }

  public getGridByCoord(coord: [number, number]): Grid {
    const grid = this.grids[coord[0] + coord[1] * GRIDS_IN_LINE];
    if (!grid) throw new Error(`Grid not found by coord: ${coord}`);
    return grid;
  }

  private onSwipe(direction: Direction) {
    this.moveCards(direction);
  }
  private async moveCards(direction: Direction) {
    const moveRight = direction === Direction.RIGHT;
    const moveLeft = direction === Direction.LEFT;
    const moveUp = direction === Direction.UP;
    const moveDown = direction === Direction.DOWN;

    const startI = moveRight ? GRIDS_IN_LINE - 2 : 1;
    const startJ = moveDown ? GRIDS_IN_LINE - 2 : 1;
    const endI = moveRight ? -1 : GRIDS_IN_LINE;
    const endJ = moveDown ? -1 : GRIDS_IN_LINE;
    const stepI = moveRight ? -1 : 1;
    const stepJ = moveDown ? -1 : 1;

    for (let i = moveUp || moveDown ? 0 : startI; i !== endI; i += stepI) {
      for (let j = moveLeft || moveRight ? 0 : startJ; j !== endJ; j += stepJ) {
        const card = this.occupiedInfo[j][i];
        if (!card) continue;

        let currI = i,
          currJ = j;

        while (true) {
          const nextI = currI + (moveRight ? 1 : moveLeft ? -1 : 0);
          const nextJ = currJ + (moveDown ? 1 : moveUp ? -1 : 0);

          if (
            nextI < 0 ||
            nextI >= GRIDS_IN_LINE ||
            nextJ < 0 ||
            nextJ >= GRIDS_IN_LINE
          )
            break;
          const occupiedCard = this.occupiedInfo[nextJ][nextI];
          if (occupiedCard) {
            if (
              card instanceof CharacterCard &&
              occupiedCard instanceof ItemCard
            ) {
              card.applyBuff(occupiedCard.buff);
              occupiedCard.equip(card);
              this.occupiedInfo[nextJ][nextI] = null;
              // TODO: move the card (templar)
              continue;
            }
            break;
          }

          currI = nextI;
          currJ = nextJ;
        }

        const targetGrid = this.getGridByCoord([currJ, currI]);
        await card.moveTo(targetGrid.x, targetGrid.y);
        this.occupiedInfo[j][i] = null;
        this.occupiedInfo[currJ][currI] = card;
      }
    }
    await delay(100);
    emit(EVENT.SWIPE_FINISH);
  }
}
