import { getCanvas, on } from "kontra";
import { GameState, GameManager } from "../../managers/game-manager";
import { EVENT } from "../../constants/event";
import { CustomButton, OverlayDialog } from "./shared-ui";
import { Templar } from "../sprites/templar";
import { LOCAL_STORAGE_KEY } from "../../constants/localstorage";

export class GameOverDialog extends OverlayDialog {
  private rBtn: CustomButton; // restart button
  private sBtn: CustomButton; // share button
  private isShown: boolean = false;

  constructor() {
    const { width: w, height: h } = getCanvas();
    super(300, 200);
    this.tT.text = "Game Over";
    this.tT.y -= 14;
    this.dT.text = "";
    this.dT.y -= 14;
    this.sBtn = new CustomButton(w / 2, h / 2 + 36, "Share");
    this.rBtn = new CustomButton(w / 2, h / 2 + 70, "Restart");

    this.addChild([
      this.sBtn,
      this.rBtn,
      new Templar({ x: w / 2 - 32, y: h / 2 - 224, condition: "d" }),
    ]);

    on(EVENT.GAME_OVER, this.show.bind(this));
  }

  private show() {
    if (this.isShown) return;
    this.isShown = true;
    const gm = GameManager.getInstance();
    let bestScore = localStorage.getItem(LOCAL_STORAGE_KEY.BEST_SCORE);
    if (gm.move > parseInt(bestScore ?? "0")) {
      bestScore = `${gm.move}`;
      localStorage.setItem(LOCAL_STORAGE_KEY.BEST_SCORE, bestScore);
    }
    const content = `Survived for ${gm.move} moves as a ${gm.cls}`;
    this.dT.text = `${content}!\nBest Score: ${bestScore}`;
    this.rBtn.bindClick(() => location.reload());
    localStorage.setItem(LOCAL_STORAGE_KEY.PLAYED, "t");

    this.sBtn.bindClick(() => {
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
