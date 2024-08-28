import { GameObjectClass, on, Sprite, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { Templar } from "../sprites/templar";
import { ItemPanel } from "./item-panel";
import { EVENT } from "../../constants/event";
import { TemplarCard } from "../sprites/card/templar-card";
import { FONT } from "../../constants/text";

export const INFO_PANEL_HEIGHT = 184;

export class InfoPanel extends GameObjectClass {
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

    this.infoText = Text({
      x: 120,
      y: 10,
      ...textProps,
    });
    this.overweightText = Text({
      x: 56,
      y: 16,
      anchor: { x: 0.5, y: 0.5 },
      ...textProps,
      color: COLOR.BROWN_8,
    });

    this.addChild([
      bg,
      new Templar({ x: 8, y: 42, withWeapon: true }),
      new ItemPanel(120, 30),
      this.infoText,
      this.overweightText,
    ]);

    on(EVENT.UPDATE_TEMPLAR_INFO, this.updateTemplarInfo.bind(this));
    on(EVENT.UPDATE_TEMPLAR_WEIGHT, this.updateOverweightText.bind(this));
  }

  private updateTemplarInfo(templarCard: TemplarCard) {
    const texts = [
      `Attack: ${templarCard.attackType}`,
      `Range: ${templarCard.attackDirection}`,
      `Hit Rate: ${templarCard.hitRate.toFixed(1)}`,
      `Critical Rate: ${templarCard.criticalRate.toFixed(1)}`,
      `Hit Back: ${templarCard.hitBackAttack}`,
    ];
    this.infoText.text = texts.join(" | ");
  }
  private updateOverweightText(isOverweight: boolean) {
    this.overweightText.text = isOverweight ? "Overweight!!!" : "";
  }
}
