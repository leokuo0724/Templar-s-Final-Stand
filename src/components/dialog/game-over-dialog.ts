import { getCanvas, on } from "kontra";
import { GameState, GameManager } from "../../managers/game-manager";
import { EVENT } from "../../constants/event";
import { CustomButton, OverlayDialog } from "./shared-ui";
import { Templar } from "../sprites/templar";
import { LOCAL_STORAGE_KEY } from "../../constants/localstorage";

export class GameOverDialog extends OverlayDialog {
  private restartButton: CustomButton;
  private shareButton: CustomButton;
  private isShown: boolean = false;

  constructor() {
    const { width: w, height: h } = getCanvas();
    super(300, 200);
    this.titleText.text = "Game Over";
    this.titleText.y -= 14;
    this.descText.text = "";
    this.descText.y -= 14;
    this.shareButton = new CustomButton(w / 2, h / 2 + 36, "Share");
    this.restartButton = new CustomButton(w / 2, h / 2 + 70, "Restart");

    this.addChild([
      this.shareButton,
      this.restartButton,
      new Templar({ x: w / 2 - 32, y: h / 2 - 224, condition: "d" }),
    ]);

    on(EVENT.GAME_OVER, this.show.bind(this));
  }

  private show() {
    if (this.isShown) return;
    this.isShown = true;
    const gm = GameManager.getInstance();
    let bestScore = localStorage.getItem(LOCAL_STORAGE_KEY.BEST_SCORE);
    if (gm.moveCount > parseInt(bestScore ?? "0")) {
      bestScore = `${gm.moveCount}`;
      localStorage.setItem(LOCAL_STORAGE_KEY.BEST_SCORE, bestScore);
    }
    const content = `Survived for ${gm.moveCount} moves as a ${gm.cls}`;
    this.descText.text = `${content}!\nBest Score: ${bestScore}`;
    this.restartButton.bindClick(() => location.reload());
    localStorage.setItem(LOCAL_STORAGE_KEY.PLAYED, "t");

    this.shareButton.bindClick(() => {
      const url = `https://x.com/intent/post?text=${encodeURI(
        `${content} in Templar's Final Stand made by @leokuo0724. Play here:`
      )}&url=https://leokuo0724.github.io/Templar-s-Final-Stand`;
      open(url, "_blank");
    });
  }

  public render() {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.GAME_OVER) return;
    super.render();
  }
}
