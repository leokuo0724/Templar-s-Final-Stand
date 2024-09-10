import { GameObjectClass, on, Sprite, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { Templar } from "../sprites/templar";
import { ItemPanel } from "./item-panel";
import { EVENT } from "../../constants/event";
import { TemplarCard } from "../sprites/card/templar-card";
import { FONT } from "../../constants/text";
import { TemplarClass } from "../../managers/game-manager";

export const INFO_PANEL_HEIGHT = 210;

export class InfoPanel extends GameObjectClass {
  private cT: Text; // class text
  private iT: Text; // info text
  private ow: Sprite; // ow warning
  private owT: Text; // ow warning text

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
      font: `14px ${FONT}`,
      color: COLOR.BROWN_7,
    };
    this.cT = Text({
      x: 116,
      y: 12,
      strokeColor: COLOR.BROWN_8,
      lineWidth: 0.8,
      ...textProps,
    });
    this.iT = Text({
      x: 116,
      y: 34,
      ...textProps,
    });
    const overweightConfig = { anchor: { x: 0.5, y: 0.5 }, opacity: 0 };
    this.ow = Sprite({
      x: 56,
      y: 28,
      width: 100,
      height: 34,
      color: COLOR.RED_7,
      ...overweightConfig,
    });
    this.owT = Text({
      ...textProps,
      color: COLOR.WHITE_6,
      text: "Overweight!",
      ...overweightConfig,
    });
    this.ow.addChild(this.owT);

    this.addChild([
      bg,
      new Templar({ x: 16, y: 74, condition: "i" }),
      new ItemPanel(116, 54),
      this.cT,
      this.iT,
      this.ow,
    ]);

    on(EVENT.UPDATE_TEMPLAR_CLASS, this.updateClassText.bind(this));
    on(EVENT.UPDATE_TEMPLAR_INFO, this.updateTemplarInfo.bind(this));
    on(EVENT.UPDATE_TEMPLAR_WEIGHT, this.updateOverweightText.bind(this));
  }

  private updateClassText(cls: TemplarClass) {
    switch (cls) {
      case TemplarClass.W:
        this.cT.text =
          "Wizard: low attack and hit rate, equip/combine potions to attack all";
        break;
      case TemplarClass.K:
        this.cT.text = "Knight: everything is normal but balanced";
        break;
      case TemplarClass.D:
        this.cT.text = "Defender: low attack, hit back with shield";
        break;
    }
  }

  private updateTemplarInfo(templarCard: TemplarCard) {
    const texts = [
      `Attack: ${templarCard.attackType}, ${templarCard.attackDirection}`,
      `Hit Rate: ${(templarCard.hitRate * 100).toFixed()}%`,
      `Critical Rate: ${(templarCard.critical * 100).toFixed()}%`,
      `Hit Back: ${templarCard.hitBack}`,
    ];
    this.iT.text = texts.join(" | ");
  }
  private updateOverweightText(isOverweight: boolean) {
    this.ow.opacity = isOverweight ? 1 : 0;
    this.owT.opacity = isOverweight ? 1 : 0;
  }
}
