import { BaseCard } from "./base-card";
import { CardType } from "./type";
import { OptionalCharacterProps } from "../../../types/character";
import { Sword } from "../assets/sword";
import { ClockIcon } from "../icons/clock-icon";
import { Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { WeightIcon } from "../icons/weight-icon";
import { tween } from "../../../utils/tween-utils";

type ItemCardProps = {
  type: CardType;
  x: number;
  y: number;
  // props
  buff: OptionalCharacterProps;
  duration: number;
  weight: number;
};

export class ItemCard extends BaseCard {
  protected descriptionText: Text;
  protected durationText: Text;
  protected weightText: Text;

  constructor({ type, x, y, buff, duration, weight }: ItemCardProps) {
    super({ type, x, y });
    this.buff = buff;
    this.duration = duration;
    this.weight = weight;

    this.descriptionText = Text({
      x: 0,
      y: 18,
      text: getDescText(buff),
      ...COMMON_TEXT_CONFIG,
      font: "10px Trebuchet MS",
      textAlign: "center",
    });
    this.durationText = Text({
      text: `${duration}`,
      x: 42,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.weightText = Text({
      text: `${weight}`,
      x: -24,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.main.addChild([
      this.descriptionText,
      new ClockIcon(22, 32),
      this.durationText,
      new WeightIcon(-46, 32),
      this.weightText,
    ]);
  }

  protected getMainIcon() {
    switch (this.type) {
      case CardType.WEAPON:
        return new Sword(-3, -40, 0.45);
      default:
        throw new Error(`Invalid card type: ${this.type}`);
    }
  }

  public async equip() {
    await tween(this.main, { targetY: -24 }, 200, 50);
    this.main.y = 0;
  }
}

// Utils
const getDescText = (buff: OptionalCharacterProps) => {
  const buffTexts = Object.entries(buff).map(([key, value]) => {
    if (!value) return "";
    if (key === "attackDirection") return `attack: ${value}`;
    if ((value as number) > 0) return `${key} +${value}`;
    return `${key} ${value}`;
  });
  return buffTexts.join("\n");
};
