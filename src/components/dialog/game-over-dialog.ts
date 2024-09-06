import { getCanvas, on } from "kontra";
import { GameState, GameManager } from "../../managers/game-manager";
import { EVENT } from "../../constants/event";
import { CustomButton, OverlayDialog } from "./shared-ui";
import { Templar } from "../sprites/templar";
import { LOCAL_STORAGE_KEY } from "../../constants/localstorage";

export class GameOverDialog extends OverlayDialog {
  private button: CustomButton;

  constructor() {
    const { width: w, height: h } = getCanvas();
    super(280, 180);
    this.titleText.text = "Game Over";
    this.descText.text = "";
    this.button = new CustomButton(w / 2, h / 2 + 50, "Restart");

    this.addChild([
      this.button,
      new Templar({ x: w / 2 - 32, y: h / 2 - 212, condition: "d" }),
    ]);

    on(EVENT.GAME_OVER, this.show.bind(this));
  }

  private show() {
    const gm = GameManager.getInstance();
    this.descText.text = `You did a great job!\nSurvived for ${gm.moveCount} moves!`;
    this.button.bindClick(() => window.location.reload());
    localStorage.setItem(LOCAL_STORAGE_KEY.PLAYED, "t");
  }

  public render() {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.GAME_OVER) return;
    super.render();
  }
}
