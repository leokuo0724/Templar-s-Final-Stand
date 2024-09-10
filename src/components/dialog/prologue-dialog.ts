import { getCanvas, Text } from "kontra";
import { OverlayDialog } from "./shared-ui";
import { COLOR } from "../../constants/color";
import { PhillippeIV } from "../sprites/philippe-iv";
import { COMMON_TEXT_CONFIG, FONT } from "../../constants/text";
import { delay } from "../../utils/time-utils";
import { tween } from "../../utils/tween-utils";
import { GameManager, GameState } from "../../managers/game-manager";

export class PrologueDialog extends OverlayDialog {
  private isClicked: boolean = false;
  private clickCallback: () => void = () => {};
  private tapCallback: () => void = () => {};

  constructor() {
    const canvas = getCanvas();
    const { width: w, height: h } = canvas;
    super(w, h);
    this.wrapper.color = COLOR.RED_7;

    const philippe = new PhillippeIV(w / 2 - 48, h / 2 - 220);
    this.addChild([philippe]);

    this.initialize();
  }

  private async initialize() {
    const paragraphs = [
      "It’s 1307.",
      "As a Templar, you’ve learned King Philip IV isn’t a fan.",
      "Now his army is after you, and survival is your only goal.",
      "Sword ready? Let’s see how long you last.",
      "Tap to start",
    ];
    const canvas = getCanvas();
    this.clickCallback = this.onClick.bind(this);
    canvas.addEventListener("pointerdown", this.clickCallback);
    for (let i = 0; i < paragraphs.length; i++) {
      const last = i === paragraphs.length - 1;
      const content = Text({
        ...COMMON_TEXT_CONFIG,
        font: `18px ${FONT}`,
        text: paragraphs[i],
        textAlign: "center",
        lineHeight: 1.5,
        x: canvas.width / 2,
        y: canvas.height / 2 + i * (last ? 60 : 30),
        opacity: 0,
      });
      this.addChild(content);
      await delay(this.isClicked ? 0 : 200);
      await tween(content, { opacity: 1 }, this.isClicked && !last ? 0 : 1000);
    }
    this.tapCallback = this.onTapStart.bind(this);
    canvas.addEventListener("pointerdown", this.tapCallback);
  }

  private async onClick() {
    this.isClicked = true;
    getCanvas().removeEventListener("pointerdown", this.clickCallback);
  }

  private async onTapStart() {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.PROLOGUE) return;
    gm.state = GameState.INIT;
    await Promise.all([
      tween(this, { opacity: 0 }, 500),
      ...this.children.map((child) => tween(child, { opacity: 0 }, 500)),
    ]);
    gm.toggleBGM();
    getCanvas().removeEventListener("pointerdown", this.tapCallback);
  }

  public render(): void {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.PROLOGUE && gm.state !== GameState.INIT) return;
    super.render();
  }
}
