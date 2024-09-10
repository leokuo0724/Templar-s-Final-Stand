import {
  emit,
  GameObjectClass,
  getCanvas,
  on,
  SpriteClass,
  Text,
} from "kontra";
import { COLOR } from "../../constants/color";
import { COMMON_TEXT_CONFIG, FONT } from "../../constants/text";
import { detectCanvasClick } from "./shared-ui";
import { drawPolygon } from "../../utils/draw-utils";
import { tween } from "../../utils/tween-utils";
import {
  GameManager,
  GameState,
  TemplarClass,
} from "../../managers/game-manager";
import { EVENT } from "../../constants/event";

export class IntroDialog extends SpriteClass {
  private currI: number = 0;
  private clickCallback: ((event: PointerEvent) => void) | null = null;
  private content: Text;
  private paragraphs = [
    "Move up, down, left, or right.\nI can move toward enemies or items\nto attack or equip.",
    "Same items combine into something stronger\n—except potions.\nMight become buff or debuff.",
    "Everything but potions adds weight,\nand if it hits 13,\nmy triskaidekaphobia makes every step hurt\n until the item's duration ends.",
  ];

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: 500,
      height: 200,
      color: COLOR.DARK_6,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.content = Text({
      text: this.paragraphs[this.currI],
      ...COMMON_TEXT_CONFIG,
      font: `18px ${FONT}`,
      textAlign: "center",
      lineHeight: 1.5,
    });
    this.addChild([this.content, new Triangle(224, 76)]);

    const canvas = getCanvas();
    this.clickCallback = this.onClick.bind(this);
    canvas.addEventListener("pointerdown", this.clickCallback);
    on(EVENT.UPDATE_TEMPLAR_CLASS, this.onCls.bind(this));
  }

  onCls(cls: TemplarClass) {
    const map = {
      [TemplarClass.K]: `I'm nothing fancy\n—just balanced and ready to fight!`,
      [TemplarClass.W]: "I'm weak\nbut can attack all foes with potions!",
      [TemplarClass.D]: "I get hit\nand hit back harder!",
    };
    this.paragraphs.push(`As a ${cls}\n` + map[cls]);
  }

  onClick(event: PointerEvent) {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INTRO) return;
    const canvas = getCanvas();
    const isClicked = detectCanvasClick(event, this);
    if (isClicked) {
      if (this.currI === this.paragraphs.length - 1) {
        if (this.clickCallback) {
          canvas.removeEventListener("pointerdown", this.clickCallback);
          gm.state = GameState.IDLE;
          emit(EVENT.GAME_START);
        }
      } else {
        this.currI++;
        this.content.text = this.paragraphs[this.currI];
      }
    }
  }

  render(): void {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INTRO) return;
    super.render();
  }
}

class Triangle extends GameObjectClass {
  constructor(x: number, y: number) {
    super({ x, y });
    this.play();
  }
  async play() {
    while (true) {
      await tween(this, { targetY: this.y - 5 }, 800);
      await tween(this, { targetY: this.y + 5 }, 800);
    }
  }
  draw(): void {
    drawPolygon(this.context, "6.3 11 12.6 0 0 0 6.3 11", COLOR.WHITE_6);
  }
}
