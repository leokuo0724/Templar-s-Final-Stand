import { getCanvas, Sprite, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { FONT } from "../../constants/text";
import { CustomButton } from "./shared-ui";
import {
  GameManager,
  GameState,
  TemplarClass,
} from "../../managers/game-manager";

export class GameStartDialog extends SpriteClass {
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
      width: 360,
      height: 180,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.YELLOW_6,
    });
    const title = Text({
      text: "Pick a Class",
      x: width / 2,
      y: height / 2 - 52,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.BROWN_7,
      font: `24px ${FONT}`,
    });
    const descText = Text({
      text: "Pick a class to fight against enemies",
      x: width / 2,
      y: height / 2,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.BROWN_7,
      font: `16px ${FONT}`,
    });

    const gm = GameManager.getInstance();
    const wizardButton = new CustomButton(
      width / 2 - 108,
      height / 2 + 52,
      "Wizard"
    );
    wizardButton.bindClick(() => gm.setClass(TemplarClass.WIZARD));
    const knightButton = new CustomButton(width / 2, height / 2 + 52, "Knight");
    knightButton.bindClick(() => gm.setClass(TemplarClass.KNIGHT));
    const defenderButton = new CustomButton(
      width / 2 + 108,
      height / 2 + 52,
      "Defender"
    );
    defenderButton.bindClick(() => gm.setClass(TemplarClass.DEFENDER));

    this.addChild([
      wrapper,
      title,
      descText,
      wizardButton,
      knightButton,
      defenderButton,
    ]);
  }

  public render(): void {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INIT) return;
    super.render();
  }
}
