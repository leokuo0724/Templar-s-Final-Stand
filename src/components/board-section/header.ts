import {
  GameObjectClass,
  getCanvas,
  on,
  Sprite,
  Text,
  TextClass,
} from "kontra";
import { COLOR } from "../../constants/color";
import { EVENT } from "../../constants/event";
import { GameManager } from "../../managers/game-manager";
import { tween } from "../../utils/tween-utils";
import { delay } from "../../utils/time-utils";

export class Header extends GameObjectClass {
  constructor() {
    super();
    const { width, height } = getCanvas();
    const title = Text({
      text: "MOVE 0",
      x: width / 2,
      y: 46,
      color: COLOR.GRAY_7,
      font: "36px Gill Sans",
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
      font: "36px Gill Sans",
      anchor: { x: 0.5, y: 0.5 },
      opacity: 0,
    });
    enemyIndicator.addChild(enemyText);
    this.addChild(title, enemyIndicator);

    on(EVENT.SWIPE, async () => {
      const moveCount = GameManager.getInstance().moveCount;
      title.text = `MOVE ${moveCount}`;
      const isThirteen = moveCount % 13 === 0 || moveCount >= 78;
      if (isThirteen) {
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
