import { getCanvas } from "kontra";
import { CustomButton, OverlayDialog } from "./shared-ui";
import {
  GameManager,
  GameState,
  TemplarClass,
} from "../../managers/game-manager";
import { LOCAL_STORAGE_KEY } from "../../constants/localstorage";

export class GameStartDialog extends OverlayDialog {
  private wizardButton: CustomButton;
  private knightButton: CustomButton;
  private defenderButton: CustomButton;

  constructor() {
    super(360, 180);
    const isPlayed = localStorage.getItem(LOCAL_STORAGE_KEY.PLAYED) === "t";
    this.titleText.text = "Pick a Class";
    this.descText.text = isPlayed
      ? "Time to check out new classes!"
      : "Knight is your only option for now";

    const { width: w, height: h } = getCanvas();
    this.wizardButton = new CustomButton(
      w / 2 - 108,
      h / 2 + 52,
      "Wizard",
      !isPlayed
    );
    this.knightButton = new CustomButton(w / 2, h / 2 + 52, "Knight");
    this.defenderButton = new CustomButton(
      w / 2 + 108,
      h / 2 + 52,
      "Defender",
      !isPlayed
    );

    this.wizardButton.bindClick(() => {
      this.onButtonClick(TemplarClass.WIZARD);
    });
    this.knightButton.bindClick(() => {
      this.onButtonClick(TemplarClass.KNIGHT);
    });
    this.defenderButton.bindClick(() => {
      this.onButtonClick(TemplarClass.DEFENDER);
    });

    this.addChild([this.wizardButton, this.knightButton, this.defenderButton]);
  }

  private onButtonClick(cls: TemplarClass) {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INIT) return;
    gm.setClass(cls);
    this.wizardButton.offClick();
    this.knightButton.offClick();
    this.defenderButton.offClick();
  }

  public render(): void {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INIT) return;
    super.render();
  }
}
