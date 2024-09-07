import { on, Text, TextClass } from "kontra";
import { COLOR } from "../../constants/color";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";
import { tween } from "../../utils/tween-utils";
import { delay } from "../../utils/time-utils";

export class Header extends TextClass {
  constructor(x: number, y: number) {
    super({
      text: "MOVE 0",
      x,
      y,
      color: COLOR.GRAY_7,
      font: "36px Gill Sans",
      anchor: { x: 0.5, y: 0.5 },
    });
    const subText = Text({
      text: "Powerful Enemy Coming!",
      x: 0,
      y: 310,
      color: COLOR.RED_7,
      font: "36px Gill Sans",
      anchor: { x: 0.5, y: 0.5 },
      opacity: 0,
    });
    this.addChild(subText);

    on(EVENT.SWIPE, async () => {
      const moveCount = GameManager.getInstance().moveCount;
      this.text = `MOVE ${moveCount}`;
      const isThirteen = moveCount % 13 === 0 || moveCount >= 78;
      if (isThirteen) {
        this.color = COLOR.RED_7;
        await tween(subText, { opacity: 1 }, 500);
        await delay(800);
        await tween(subText, { opacity: 0 }, 400);
      } else {
        this.color = COLOR.GRAY_7;
      }
    });
  }
}
