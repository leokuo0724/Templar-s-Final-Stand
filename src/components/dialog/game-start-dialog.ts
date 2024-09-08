import { getCanvas } from "kontra";
import { CustomButton, OverlayDialog } from "./shared-ui";
import {
  GameManager,
  GameState,
  TemplarClass,
} from "../../managers/game-manager";
import { LOCAL_STORAGE_KEY } from "../../constants/localstorage";

export class GameStartDialog extends OverlayDialog {
  private wBtn: CustomButton;
  private kBtn: CustomButton;
  private dBtn: CustomButton;

  constructor() {
    super(360, 180);
    const isPlayed = localStorage.getItem(LOCAL_STORAGE_KEY.PLAYED) === "t";
    this.titleText.text = "Pick a Class";
    this.descText.text = isPlayed
      ? "Time to check out new classes!"
      : "Knight is your only option for now";

    const { width: w, height: h } = getCanvas();
    this.wBtn = new CustomButton(
      w / 2 - 108,
      h / 2 + 52,
      TemplarClass.WIZARD,
      !isPlayed
    );
    this.kBtn = new CustomButton(w / 2, h / 2 + 52, TemplarClass.KNIGHT);
    this.dBtn = new CustomButton(
      w / 2 + 108,
      h / 2 + 52,
      TemplarClass.DEFENDER,
      !isPlayed
    );

    this.wBtn.bindClick(() => {
      this.onButtonClick(TemplarClass.WIZARD);
    });
    this.kBtn.bindClick(() => {
      this.onButtonClick(TemplarClass.KNIGHT);
    });
    this.dBtn.bindClick(() => {
      this.onButtonClick(TemplarClass.DEFENDER);
    });

    this.addChild([this.wBtn, this.kBtn, this.dBtn]);
  }

  private onButtonClick(cls: TemplarClass) {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INIT) return;
    gm.setClass(cls);
    this.wBtn.offClick();
    this.kBtn.offClick();
    this.dBtn.offClick();
  }

  public render(): void {
    const gm = GameManager.getInstance();
    if (gm.state !== GameState.INIT) return;
    super.render();
  }
}
