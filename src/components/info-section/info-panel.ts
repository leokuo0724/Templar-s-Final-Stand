import { GameObjectClass, on, Sprite, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { Templar } from "../sprites/templar";
import { ItemPanel } from "./item-panel";
import { EVENT } from "../../constants/event";
import { TemplarCard } from "../sprites/card/templar-card";
import { FONT } from "../../constants/text";
import { TemplarClass } from "../../managers/game-manager";

export const INFO_PANEL_HEIGHT = 200;

export class InfoPanel extends GameObjectClass {
  private classText: Text;
  private infoText: Text;
  private overweightText: Text;

  constructor(x: number, y: number) {
    super({ x, y });

    const bg = Sprite({
      x: 0,
      y: 0,
      color: COLOR.YELLOW_6,
      width: this.context.canvas.width,
      height: INFO_PANEL_HEIGHT,
    });
    const textProps = {
      text: "",
      font: `12px ${FONT}`,
      color: COLOR.BROWN_7,
    };
    this.classText = Text({
      x: 120,
      y: 10,
      ...textProps,
    });
    this.infoText = Text({
      x: 120,
      y: 28,
      ...textProps,
    });
    this.overweightText = Text({
      x: 56,
      y: 34,
      anchor: { x: 0.5, y: 0.5 },
      ...textProps,
      color: COLOR.BROWN_8,
    });

    this.addChild([
      bg,
      new Templar({ x: 16, y: 62, condition: "i" }),
      new ItemPanel(120, 46),
      this.classText,
      this.infoText,
      this.overweightText,
    ]);

    on(EVENT.UPDATE_TEMPLAR_CLASS, this.updateClassText.bind(this));
    on(EVENT.UPDATE_TEMPLAR_INFO, this.updateTemplarInfo.bind(this));
    on(EVENT.UPDATE_TEMPLAR_WEIGHT, this.updateOverweightText.bind(this));
  }

  private updateClassText(cls: TemplarClass) {
    switch (cls) {
      case TemplarClass.WIZARD:
        this.classText.text =
          "Wizard: low attack, low hit rate, equip or combine potions to attack all enemies";
        break;
      case TemplarClass.KNIGHT:
        this.classText.text = "Knight: everything is normal but balanced";
        break;
      case TemplarClass.DEFENDER:
        this.classText.text = "Defender: low attack, hit back with shield";
        break;
    }
  }

  private updateTemplarInfo(templarCard: TemplarCard) {
    const texts = [
      `Attack: ${templarCard.attackType}`,
      `Range: ${templarCard.attackDirection}`,
      `Hit Rate: ${(templarCard.hitRate * 100).toFixed()}%`,
      `Critical Rate: ${(templarCard.criticalRate * 100).toFixed()}%`,
      `Hit Back: ${templarCard.hitBackAttack}`,
    ];
    this.infoText.text = texts.join(" | ");
  }
  private updateOverweightText(isOverweight: boolean) {
    this.overweightText.text = isOverweight ? "Overweight!" : "";
  }
}
