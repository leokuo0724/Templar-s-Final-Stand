import { emit, GameObjectClass, on, Sprite } from "kontra";
import { Grid } from "./grid";
import { COLOR } from "../../constants/color";
import { GRID_SIZE } from "../../constants/size";
import { CardFactory } from "../sprites/card/card-factory";
import { CardType } from "../sprites/card/type";
import { BaseCard } from "../sprites/card/base-card";
import { EVENT } from "../../constants/event";
import { Direction } from "../../types/direction";
import { CharacterCard } from "../sprites/card/character-card";
import { ItemCard } from "../sprites/card/item-card";
import { TemplarCard } from "../sprites/card/templar-card";
import { GameManager } from "../../managers/game-manager";
import { AttackDirection, AttackType } from "../../types/character";
import { EnemyCard } from "../sprites/card/enemy-card";

type BattleInfo = {
  attacker: CharacterCard;
  target: CharacterCard;
  direction: Direction;
};

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
  private templarCard: TemplarCard;

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
    this.templarCard = CardFactory.factory({
      type: CardType.TEMPLAR,
      x: centerGrid.x,
      y: centerGrid.y,
    }) as TemplarCard;
    this.addChild(this.templarCard);
    this.occupiedInfo[2][2] = this.templarCard;
    this.spawnCards();

    on(EVENT.REMOVE_ENEMY_DEAD, this.onRemoveEnemyDead.bind(this));
  }

  public getGridByCoord(coord: [number, number]): Grid {
    const grid = this.grids[coord[0] + coord[1] * GRIDS_IN_LINE];
    if (!grid) throw new Error(`Grid not found by coord: ${coord}`);
    return grid;
  }

  private onRemoveEnemyDead(card: EnemyCard) {
    for (let i = 0; i < GRIDS_IN_LINE; i++) {
      let found = false;
      for (let j = 0; j < GRIDS_IN_LINE; j++) {
        const c = this.occupiedInfo[j][i];
        if (c === card) {
          this.occupiedInfo[j][i] = null;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    this.removeChild(card);
  }

  private async onSwipe(direction: Direction) {
    await this.checkOverweight();
    await this.moveCards(direction);
    await this.checkAttack(direction);
    await this.checkDuration();
    this.spawnCards();
    emit(EVENT.SWIPE_FINISH);
  }

  private async checkOverweight() {
    if (this.templarCard.weight < 13) return;
    this.templarCard.applyOverweightDamage();
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

    // Move cards
    const moveInfos: { card: BaseCard; x: number; y: number }[] = [];
    for (let i = moveUp || moveDown ? 0 : startI; i !== endI; i += stepI) {
      for (let j = moveLeft || moveRight ? 0 : startJ; j !== endJ; j += stepJ) {
        const card = this.occupiedInfo[j][i];
        if (!card) continue;

        let currI = i,
          currJ = j;

        while (true) {
          const nextI = currI + (moveRight ? 1 : moveLeft ? -1 : 0);
          const nextJ = currJ + (moveDown ? 1 : moveUp ? -1 : 0);

          const occupiedCard = this.occupiedInfo?.[nextJ]?.[nextI];
          if (
            nextI < 0 ||
            nextI >= GRIDS_IN_LINE ||
            nextJ < 0 ||
            nextJ >= GRIDS_IN_LINE ||
            occupiedCard
          )
            break;
          currI = nextI;
          currJ = nextJ;
        }

        const targetGrid = this.getGridByCoord([currJ, currI]);
        moveInfos.push({ card, x: targetGrid.x, y: targetGrid.y });
        this.occupiedInfo[j][i] = null;
        this.occupiedInfo[currJ][currI] = card;
      }
    }
    await Promise.all(moveInfos.map(({ card, x, y }) => card.moveTo(x, y)));

    // Equip cards
    const equippedItems: ItemCard[] = [];
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
          const occupiedCard = this.occupiedInfo?.[nextJ]?.[nextI];
          if (occupiedCard) {
            const isTemplarEquip =
              card.type === CardType.TEMPLAR &&
              occupiedCard instanceof ItemCard;
            const isItemUpgrade =
              card.type === occupiedCard.type && card instanceof ItemCard;

            if (isTemplarEquip || isItemUpgrade) {
              isTemplarEquip && card.applyBuff(occupiedCard.buff);
              isItemUpgrade && card.upgrade(occupiedCard as ItemCard);
              await occupiedCard.equip();
              this.occupiedInfo[nextJ][nextI] = null;
              // anim effect
              if (
                card instanceof TemplarCard &&
                occupiedCard.type !== CardType.POTION
              ) {
                card.updateWeight(occupiedCard.weight);
                // @ts-ignore
                equippedItems.push(occupiedCard);
              } else {
                await occupiedCard.setInactive();
              }
              this.removeChild(occupiedCard);
              const targetGrid = this.getGridByCoord([nextJ, nextI]);
              await card.moveTo(targetGrid.x, targetGrid.y);
              continue;
            } else {
              break;
            }
          }
          currI = nextI;
          currJ = nextJ;
        }
        const targetGrid = this.getGridByCoord([currJ, currI]);
        await card.moveTo(targetGrid.x, targetGrid.y);
        this.occupiedInfo[j][i] = null;
        if (card instanceof CharacterCard && card.health <= 0) continue;
        this.occupiedInfo[currJ][currI] = card;
      }
    }
    if (equippedItems.length) {
      const gm = GameManager.getInstance();
      gm.addItems(equippedItems);
    }
  }

  private spawnCards() {
    const gm = GameManager.getInstance();
    const isDual = gm.moveCount % 5 === 1 || gm.moveCount % 5 === 3;
    for (let i = 0; i < (isDual ? 2 : 1); i++) {
      const emptyIndices = [];
      for (let i = 0; i < GRIDS_IN_LINE; i++) {
        for (let j = 0; j < GRIDS_IN_LINE; j++) {
          if (!this.occupiedInfo[j][i]) {
            emptyIndices.push([j, i]);
          }
        }
      }

      const randomIndex = Math.floor(Math.random() * emptyIndices.length);
      const [j, i] = emptyIndices[randomIndex];
      const grid = this.getGridByCoord([j, i]);
      const card = CardFactory.createCard(grid.x, grid.y);
      this.addChild(card);
      this.occupiedInfo[j][i] = card;
    }
  }

  private async checkAttack(direction: Direction) {
    const battleInfos: BattleInfo[] = [];
    for (let i = 0; i < GRIDS_IN_LINE; i++) {
      for (let j = 0; j < GRIDS_IN_LINE; j++) {
        const card = this.occupiedInfo[j][i];
        if (!(card instanceof CharacterCard)) continue;
        const { attackDirection } = card;
        const isNormalCase = attackDirection === AttackDirection.FRONT;
        const isAroundCase = attackDirection === AttackDirection.AROUND;
        const isLineCase = attackDirection === AttackDirection.LINE;

        if (isNormalCase) {
          const targetJ =
            j +
            (direction === Direction.UP
              ? -1
              : direction === Direction.DOWN
              ? 1
              : 0);
          const targetI =
            i +
            (direction === Direction.LEFT
              ? -1
              : direction === Direction.RIGHT
              ? 1
              : 0);
          const targetCard = this.occupiedInfo?.[targetJ]?.[targetI];
          if (
            targetI < 0 ||
            targetI >= GRIDS_IN_LINE ||
            targetJ < 0 ||
            targetJ >= GRIDS_IN_LINE ||
            !targetCard ||
            !(targetCard instanceof CharacterCard) ||
            targetCard.belongs === card.belongs
          )
            continue;
          battleInfos.push({ attacker: card, target: targetCard, direction });
        } else if (isAroundCase) {
          // check 4 directions
          const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
          ];
          for (const [di, dj] of directions) {
            const targetJ = j + di;
            const targetI = i + dj;
            const targetCard = this.occupiedInfo?.[targetJ]?.[targetI];
            if (
              targetCard instanceof CharacterCard &&
              targetCard.belongs !== card.belongs
            ) {
              const direction =
                di === 0 && dj === 1
                  ? Direction.RIGHT
                  : di === 1 && dj === 0
                  ? Direction.DOWN
                  : di === 0 && dj === -1
                  ? Direction.LEFT
                  : Direction.UP;
              battleInfos.push({
                attacker: card,
                target: targetCard,
                direction,
              });
            }
          }
        } else if (isLineCase) {
          // check the same direction of the card
          const isVertical =
            direction === Direction.UP || direction === Direction.DOWN;
          const fixedIndex = isVertical ? i : j;
          const variableIndex = isVertical ? j : i;

          for (let k = 0; k < GRIDS_IN_LINE; k++) {
            if (k === variableIndex) continue;
            const targetCard = isVertical
              ? this.occupiedInfo[k][fixedIndex]
              : this.occupiedInfo[fixedIndex][k];

            if (
              targetCard instanceof CharacterCard &&
              targetCard.belongs !== card.belongs
            ) {
              battleInfos.push({
                attacker: card,
                target: targetCard,
                direction:
                  k < variableIndex && isVertical
                    ? Direction.UP
                    : k < variableIndex && !isVertical
                    ? Direction.LEFT
                    : k > variableIndex && isVertical
                    ? Direction.DOWN
                    : Direction.RIGHT,
              });
            }
          }
        }
      }
    }

    for (const { attacker, target, direction } of battleInfos) {
      await attacker.execAttack(
        direction,
        target,
        false,
        attacker.attackType === AttackType.PENETRATE
      );
    }
  }

  private async checkDuration() {
    const gm = GameManager.getInstance();

    const deprecated = [];
    // items on board
    for (let i = 0; i < GRIDS_IN_LINE; i++) {
      for (let j = 0; j < GRIDS_IN_LINE; j++) {
        const card = this.occupiedInfo[j][i];
        if (card instanceof ItemCard) {
          const isAlive = card.updateDuration(-1);
          if (!isAlive) {
            deprecated.push(card);
            this.occupiedInfo[j][i] = null;
          }
        }
      }
    }
    // items equipped on the templar
    const removed = []; // any item that should be removed from templar
    for (const item of gm.currentItems) {
      const isAlive = item.updateDuration(-1);
      if (!isAlive) {
        removed.push(item);
        deprecated.push(item);
        const debuff: any = {};
        Object.entries(item.buff).forEach(([key, value]) => {
          if (key === "attackDirection") {
            debuff[key] = AttackDirection.FRONT;
          } else if (key === "attackType") {
            debuff[key] = AttackType.NORMAL;
          } else if (key !== "shield") {
            debuff[key] = (value as number) * -1;
          }
        });
        this.templarCard.applyBuff(debuff);
        this.templarCard.updateWeight(-item.weight);
      }
    }
    if (removed.length) gm.removeItems(removed);
    await Promise.all(deprecated.map((item) => item.setInactive()));
  }
}
