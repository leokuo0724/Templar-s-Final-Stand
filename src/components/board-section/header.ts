import { on, TextClass } from "kontra";
import { COLOR } from "../../constants/color";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";

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

    on(EVENT.SWIPE, () => {
      this.text = `MOVE ${GameManager.getInstance().moveCount}`;
    });
  }
}
