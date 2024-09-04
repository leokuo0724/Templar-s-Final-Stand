import { GameObjectClass, on } from "kontra";
import { drawPolygon, drawRect } from "../../utils/draw-utils";
import { COLOR } from "../../constants/color";
import { tween } from "../../utils/tween-utils";
import { delay } from "../../utils/time-utils";
import { EVENT } from "../../constants/event";
import { GameManager, GameState } from "../../managers/game-manager";

type TemplarCondition = "b" | "i" | "d";
type TemplarProps = {
  x: number;
  y: number;
  condition: TemplarCondition;
};

export class Templar extends GameObjectClass {
  private head: TemplarHead;
  private frontHand: TemplarFrontHand;
  private backHand: TemplarBackHand;
  private condition: TemplarCondition;

  constructor({ x, y, condition }: TemplarProps) {
    super({ x, y });
    this.condition = condition;
    this.setScale(condition === "b" ? 0.5 : 1);
    this.backHand = new TemplarBackHand(46, 60);
    this.head = new TemplarHead(14, 2);
    this.frontHand = new TemplarFrontHand(4, 58);
    this.addChild([
      this.backHand,
      new TemplarBody(0, 32),
      new TemplarShoes(11, 101),
      this.head,
      this.frontHand,
    ]);

    on(EVENT.TEMPLAR_ATTACK, this.onTemplarAttack.bind(this));
    on(EVENT.GAME_OVER, this.onGameOver.bind(this));
  }

  private async onGameOver() {
    if (this.condition !== "d") return;
    const x = this.head.x;
    const y = this.head.y;
    await tween(this.head, { targetY: y - 12 }, 100);
    await delay(100);
    await tween(this.head, { targetY: y + 72 }, 250);
    await tween(this.head, { targetX: x + 3, targetY: y + 46 }, 100);
    await tween(this.head, { targetX: x + 6, targetY: y + 52 }, 200);
    await tween(this.head, { targetX: x + 9, targetY: y + 72 }, 300);
  }

  private async onTemplarAttack() {
    if (this.condition === "d") return;
    const { isKnight, isDefender, isWizard } = GameManager.getInstance();
    if (isKnight) {
      const fCurrX = this.frontHand.x;
      const fCurrY = this.frontHand.y;
      await tween(
        this.frontHand,
        { targetX: fCurrX + 14, targetY: fCurrY - 5 },
        50
      );
      await delay(200);
      await tween(this.frontHand, { targetX: fCurrX, targetY: fCurrY }, 400);
    }

    const bCurrX = this.backHand.x;
    const bCurrY = this.backHand.y;
    if (isDefender) {
      await tween(this.backHand, { targetX: bCurrX + 12 }, 50);
      await delay(200);
      await tween(this.backHand, { targetX: bCurrX }, 400);
    }
    if (isWizard) {
      await tween(
        this.backHand,
        { targetX: bCurrX + 6, targetY: bCurrY - 10 },
        50
      );
      await delay(200);
      await tween(this.backHand, { targetX: bCurrX, targetY: bCurrY }, 400);
    }
  }

  render(): void {
    const gm = GameManager.getInstance();
    if (gm.state === GameState.GAME_OVER && this.condition === "b") return;
    super.render();
  }
}

class TemplarHead extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }

  draw(): void {
    drawPolygon(
      this.context,
      "39 7 31 0 7 0 0 7 0 34 13 40 36 40 39 36 39 7",
      COLOR.GRAY_6
    );
    drawPolygon(
      this.context,
      "0 0 12 0 17 0 21 0 21 5 17 5 17 21 12 21 12 5 0 5 0 0",
      COLOR.BROWN_8,
      18,
      13
    );
  }
}

class TemplarBody extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.play();
  }
  private async play() {
    while (true) {
      await tween(this, { targetY: this.y + 2 }, 1000);
      await tween(this, { targetY: this.y - 2 }, 1000);
    }
  }
  draw(): void {
    drawPolygon(
      this.context,
      "48 40 59 23 46 0 14 3 0 32 12 39 12 69 22 69 23 66 38 58 49 69 60 69 48 40",
      COLOR.GRAY_7,
      0,
      1
    );
    drawPolygon(
      this.context,
      "39 47 39 12 37 0 31 0 34 12 8 12 8 0 3 0 0 61 45 61 39 47",
      COLOR.YELLOW_7,
      11
    );
    drawRect(this.context, 12, 40, 38, 7, "#ae5d40");
    drawPolygon(
      this.context,
      "11 4 7 4 7 0 4 0 4 4 0 4 0 7 4 7 4 17 7 17 7 7 11 7 11 4",
      COLOR.RED_7,
      33,
      16
    );
  }
}

class TemplarShoes extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }
  draw(): void {
    drawPolygon(this.context, "1 12 7 12 11 0 0 0 1 12", COLOR.RED_7);
    drawPolygon(this.context, "0 0 6 6 6 12 13 12 13 0 0 0", COLOR.RED_7, 36);
  }
}

class TemplarFrontHand extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }
  draw(): void {
    const { isKnight } = GameManager.getInstance();
    if (isKnight) {
      drawPolygon(
        this.context,
        "66 1 50 0 0 19 1 23 3 27 54 11 66 1",
        COLOR.WHITE_6,
        16,
        -20
      );
    }

    drawPolygon(this.context, "2 2 0 10 13 12 19 7 16 0 10 0 2 2", COLOR.RED_7);
  }
}

class TemplarBackHand extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
  }
  draw(): void {
    const { isDefender, isWizard } = GameManager.getInstance();
    if (isDefender) {
      drawPolygon(
        this.context,
        "28 0 0 7 0 42 7 54 28 68 48 54 55 42 55 7 28 0",
        COLOR.BROWN_7,
        -14,
        -28
      );
    }
    if (isWizard) {
      drawPolygon(
        this.context,
        "3 95 0 94 25 0 32 2 3 95",
        COLOR.BROWN_6,
        -2,
        -41
      );
      drawPolygon(
        this.context,
        "11 0 2 2 0 10 6 16 14 14 16 6 11 0",
        COLOR.BLUE_6,
        20,
        -54
      );
    }
    // shield
    drawPolygon(this.context, "6 0 19 0 19 8 12 11 0 11 6 0", COLOR.RED_7);
  }
}
