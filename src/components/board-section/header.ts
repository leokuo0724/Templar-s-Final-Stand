import { GameObjectClass, getCanvas, on, Sprite, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";
import { tween } from "../../utils/tween-utils";
import { delay } from "../../utils/time-utils";
import { FONT } from "../../constants/text";
import { CustomButton } from "../dialog/shared-ui";

export class Header extends GameObjectClass {
  constructor() {
    super();
    const { width, height } = getCanvas();
    const title = Text({
      text: "MOVE 0",
      x: width / 2,
      y: 42,
      color: COLOR.GRAY_7,
      font: `36px ${FONT}`,
      anchor: { x: 0.5, y: 0.5 },
    });
    const enemyIndicator = Sprite({
      x: width / 2,
      y: height / 2,
      color: COLOR.BROWN_8,
      width: 600,
      height: 100,
      anchor: { x: 0.5, y: 0.5 },
      opacity: 0,
    });
    const enemyText = Text({
      text: "Powerful Enemy Coming!",
      color: COLOR.WHITE_6,
      font: `36px ${FONT}`,
      anchor: { x: 0.5, y: 0.5 },
      opacity: 0,
    });
    enemyIndicator.addChild(enemyText);
    const gm = GameManager.gI();
    const soundButton = new GhostButton(width - 78, 60, "Sound: ON");
    soundButton.bindClick(() => {
      gm.toggleBGM();
      soundButton.text.text = `Sound: ${gm.music ? "ON" : "OFF"}`;
    });
    const speedButton = new GhostButton(78, 60, "Speed: 1x");
    speedButton.bindClick(() => {
      gm.toggleSpeed();
      speedButton.text.text = `Speed: ${gm.speed}x`;
    });
    this.addChild([title, enemyIndicator, soundButton, speedButton]);

    on(EVENT.SWIPE, async () => {
      const gm = GameManager.gI();
      const move = gm.move;
      title.text = `MOVE ${move}`;
      if (gm.isElite) {
        this.color = COLOR.RED_7;
        enemyText.opacity = 1;
        await tween(enemyIndicator, { opacity: 0.9 }, 500);
        await delay(800);
        await tween(enemyIndicator, { opacity: 0 }, 400);
        enemyText.opacity = 0;
      } else {
        this.color = COLOR.GRAY_7;
      }
    });
  }
}

class GhostButton extends CustomButton {
  constructor(x: number, y: number, text: string) {
    super(x, y, text);
    this.color = COLOR.WHITE_6;
    this.text.color = COLOR.GRAY_7;
  }
}
