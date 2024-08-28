import { getCanvas, on, Sprite, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { GAME_STATE, GameManager } from "../../managers/game-manager";
import { EVENT } from "../../constants/event";
import { FONT } from "../../constants/text";

export class GameOverDialog extends SpriteClass {
  private descText: Text;
  private button: Button;

  constructor() {
    const { width, height } = getCanvas();
    super({
      width,
      height,
      opacity: 0.8,
      color: COLOR.DARK_6,
    });

    const wrapper = Sprite({
      x: width / 2,
      y: height / 2,
      width: 280,
      height: 180,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.YELLOW_6,
    });
    const title = Text({
      text: "Game Over",
      x: width / 2,
      y: height / 2 - 48,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.BROWN_7,
      font: `24px ${FONT}`,
    });
    this.descText = Text({
      text: "",
      x: width / 2,
      y: height / 2,
      anchor: { x: 0.5, y: 0.5 },
      textAlign: "center",
      color: COLOR.BROWN_7,
      font: `16px ${FONT}`,
    });
    this.button = new Button(width / 2, height / 2 + 50, "Restart");
    this.addChild([wrapper, title, this.descText, this.button]);

    on(EVENT.GAME_OVER, this.show.bind(this));
  }

  private show() {
    const gm = GameManager.getInstance();
    this.descText.text = `You did a great job!\nSurvived for ${gm.moveCount} moves!`;
    const canvas = getCanvas();
    canvas.addEventListener("pointerdown", (event) => {
      const { offsetLeft, offsetTop } = event.target as HTMLCanvasElement;
      const { world } = this.button;
      const minX = world.x - world.width / 2;
      const maxX = world.x + world.width / 2;
      const minY = world.y - world.height / 2;
      const maxY = world.y + world.height / 2;
      const x = event.x - offsetLeft;
      const y = event.y - offsetTop;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        window.location.reload();
      }
    });
  }

  public render() {
    const gm = GameManager.getInstance();
    if (gm.state !== GAME_STATE.GAME_OVER) return;
    super.render();
  }
}

class Button extends SpriteClass {
  private text: Text;

  constructor(x: number, y: number, text: string) {
    super({
      x,
      y,
      width: 96,
      height: 28,
      color: COLOR.BROWN_7,
      anchor: { x: 0.5, y: 0.5 },
    });
    this.text = Text({
      text,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.WHITE_6,
      font: `16px ${FONT}`,
    });
    this.addChild(this.text);
  }
}
