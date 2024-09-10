import { GameObjectClass } from "kontra";
import { drawPolygon, drawShield, drawSword } from "../../utils/draw-utils";
import { COLOR } from "../../constants/color";
import { EnemyCharacter } from "./card/enemy-card";

export class Enemy extends GameObjectClass {
  private c: EnemyCharacter | null = null;

  constructor(x: number, y: number, character: EnemyCharacter | null) {
    super({ x, y });
    this.setScale(0.6);
    this.c = character;
  }
  draw(): void {
    drawPolygon(this.context, "7 0 0 26 13 26 7 0", COLOR.GRAY_6, 6, 48);
    drawPolygon(
      this.context,
      "24 0 0 10 7 47 24 54 42 47 49 10 24 0",
      COLOR.GRAY_7,
      14,
      40
    );
    drawPolygon(this.context, "18 0 0 18 33 9 18 0", COLOR.GRAY_6, 3, 39);
    drawPolygon(this.context, "15 0 33 18 0 9 15 0", COLOR.GRAY_6, 41, 39);
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
    drawPolygon(this.context, "11 16 0 10 6 0 16 7 11 16", COLOR.RED_7, 0, 66);
    drawPolygon(this.context, "6 0 13 26 0 26 6 0", COLOR.GRAY_6, 58, 48);
    drawPolygon(this.context, "5 16 16 10 10 0 0 7 5 16", COLOR.RED_7, 61, 66);

    if (this.c === null) {
      // knife
      drawPolygon(
        this.context,
        "0 11 20 0 32 0 25 8 1 16 0 11",
        COLOR.WHITE_6,
        7,
        61
      );
    } else {
      const isWhirlstriker = this.c === EnemyCharacter.WHIRLSTRIKER;
      const isSpearman = this.c === EnemyCharacter.SPEARMAN;
      const isLancer = this.c === EnemyCharacter.LANCEPIERCER;
      const isGuardian = this.c === EnemyCharacter.GUARDIAN;
      const isCounterstriker = this.c === EnemyCharacter.COUNTERSTRIKER;
      const isCrossblade = this.c === EnemyCharacter.CROSSBLADE;

      if (isWhirlstriker || isSpearman || isLancer) {
        // stick
        drawPolygon(
          this.context,
          "0 32 2 38 63 6 59 0 0 32",
          COLOR.YELLOW_7,
          8,
          38
        );
      }
      if (isGuardian || isCounterstriker) {
        drawShield(this.context, COLOR.YELLOW_7, 30, 38);
      }

      if (isWhirlstriker) {
        // axe
        drawPolygon(
          this.context,
          "0 8 1 30 19 24 31 15 15 0 0 8",
          COLOR.DARK_6,
          50,
          36
        );
      }
      if (isCounterstriker) {
        // spikes
        const xOffset = 64;
        const yOffset = 36;
        drawPolygon(
          this.context,
          "0 16 16 0 9 21 0 16",
          COLOR.DARK_6,
          0 + xOffset,
          0 + yOffset
        );
        drawPolygon(
          this.context,
          "0 0 20 5 0 10 0 0",
          COLOR.DARK_6,
          9 + xOffset,
          28 + yOffset
        );
        drawPolygon(
          this.context,
          "8 0 0 8 17 16 8 0",
          COLOR.DARK_6,
          1 + xOffset,
          48 + yOffset
        );
      }
      if (isSpearman) {
        // spear
        drawPolygon(
          this.context,
          "0 11 7 4 29 0 13 15 3 17 0 11",
          COLOR.DARK_6,
          68,
          30
        );
      }
      if (isLancer) {
        // lance
        drawPolygon(
          this.context,
          "0 34 84 0 9 50 2 44 0 34",
          COLOR.DARK_6,
          17,
          23
        );
      }
      if (isCrossblade) {
        drawSword(this.context, COLOR.YELLOW_7, 8, 50);
        drawPolygon(
          this.context,
          "9 11 59 34 62 26 15 1 0 0 9 11",
          COLOR.DARK_6,
          8,
          44
        );
      }
    }
  }
}
