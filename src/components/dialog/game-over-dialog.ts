import { getCanvas, on, Sprite, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { GameState, GameManager } from "../../managers/game-manager";
import { EVENT } from "../../constants/event";
import { FONT } from "../../constants/text";
import { CustomButton } from "./shared-ui";

export class GameOverDialog extends SpriteClass {
  private descText: Text;
  private button: CustomButton;

  constructor() {
    const { width, height } = getCanvas();
    super({
      width,
      height,
      opacity: 0.5,
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
    this.button = new CustomButton(width / 2, height / 2 + 50, "Restart");
    this.addChild([wrapper, title, this.descText, this.button]);

    on(EVENT.GAME_OVER, this.show.bind(this));
  }

  private show() {
    const gm = GameManager.getInstance();
    this.descText.text = `You did a great job!\nSurvived for ${gm.moveCount} moves!`;
    this.button.bindClick(() => window.location.reload());
  }

  public render() {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.GAME_OVER) return;
    super.render();
  }
}
