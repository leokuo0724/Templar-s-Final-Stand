import { BaseCard } from "./base-card";
import { CardType } from "./type";
import {
  AttackDirection,
  OptionalCharacterProps,
} from "../../../types/character";
import { ClockIcon } from "../icons/clock-icon";
import { Text } from "kontra";
import { COMMON_TEXT_CONFIG, FONT } from "../../../constants/text";
import { WeightIcon } from "../icons/weight-icon";
import { tween } from "../../../utils/tween-utils";
import { SwordIcon } from "../icons/sword-icon";
import { COLOR } from "../../../constants/color";
import { ShieldIcon } from "../icons/shield-icon";
import { PotionIcon } from "../icons/potion-icon";
import { getItemPropsDescText } from "../../../utils/desc-utils";
import { GameManager } from "../../../managers/game-manager";
import { randomPick } from "../../../utils/random-utils";
import { BASE_WEIGHT_MAP } from "../../../constants/weight";
import { WarningIcon } from "../icons/warning-icon";
import { checkIfBuff } from "../../../utils/buff-utils";

export type ItemCardProps = {
  type: CardType;
  x: number;
  y: number;
  // props
  duration: number;
  weight: number;
};

const MAX_ITEM_LEVEL = 4;
const MAX_ITEM_COLOR_MAP = {
  [CardType.W]: COLOR.DARK_6,
  [CardType.S]: COLOR.BROWN_8,
  [CardType.P]: COLOR.GREEN_7,
};

export class ItemCard extends BaseCard {
  protected dT: Text;
  protected drT: Text; // duration text
  protected wT: Text; // weight text
  public buff: OptionalCharacterProps;
  public duration: number;
  public weight: number;
  public level: number = 1;
  private wIcon: WarningIcon | null = null; // warning icon, only for potion

  constructor({ type, x, y, duration, weight }: ItemCardProps) {
    super({ type, x, y });
    this.duration = duration;
    this.weight = weight;

    this.buff = this.pickBuff();
    this.dT = Text({
      x: 0,
      y: 18,
      text: getItemPropsDescText(this.buff),
      ...COMMON_TEXT_CONFIG,
      textAlign: "center",
    });
    this.drT = Text({
      text: `${duration}`,
      x: 42,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.wT = Text({
      text: `${weight}`,
      x: -24,
      y: 40,
      ...COMMON_TEXT_CONFIG,
    });
    this.main.addChild([
      this.dT,
      new ClockIcon(22, 32),
      this.drT,
      new WeightIcon(-46, 32),
      this.wT,
    ]);
    this.resetProps();
  }

  protected getMainIcon() {
    switch (this.type) {
      case CardType.W:
        return new SwordIcon(-11, -32, 1);
      case CardType.S:
        return new ShieldIcon(-10, -31, 1, COLOR.WHITE_6);
      case CardType.P:
        return new PotionIcon(-9, -36);
      default:
        throw new Error();
    }
  }

  public async equip() {
    this.duration = Math.max(this.duration, 2);
    await Promise.all([
      tween(this.main, { targetY: -24 }, 300, 50),
      this.setChildrenOpacity(0, 300),
    ]);
    this.main.y = 0; // reset
  }

  protected resetProps(): void {
    this.drT.text = `${this.duration}`;
    this.wT.text = `${this.weight}`;
    if (this.type === CardType.P) {
      if (!this.wIcon) {
        this.wIcon = new WarningIcon(6, -14);
        this.addChild(this.wIcon);
      }
      const isBuff = checkIfBuff(this.buff);
      this.wIcon.opacity = isBuff ? 0 : 1;
    }
    if (this.level === MAX_ITEM_LEVEL) {
      // @ts-ignore
      this.circle.color = MAX_ITEM_COLOR_MAP[this.type];
    }
  }

  public updateDuration(value: number): boolean {
    this.duration += value;
    if (this.duration <= 0) return false;
    this.drT.text = `${this.duration}`;
    return true;
  }

  public upgrade(card: ItemCard) {
    this.level += card.level;
    this.level = Math.min(this.level, MAX_ITEM_LEVEL);
    this.duration += card.duration;
    this.duration = Math.min(this.duration, 10);
    this.weight = getItemWeight(this.type, this.level);

    this.buff = this.pickBuff();
    const description = getItemPropsDescText(this.buff);
    this.dT.text = description;
    if (description.split("\n").length > 2) {
      this.dT.font = `12px ${FONT}`;
      this.dT.y = 14;
    }
    this.resetProps();
  }

  public pickBuff() {
    const { isK, isW, isD, level } = GameManager.gI();
    const factor = level + 1;
    switch (this.type) {
      case CardType.W:
        return getWeaponLevelBuff(this.level, factor, isK);
      case CardType.S:
        return getShieldLevelBuff(this.level, factor, isD);
      case CardType.P:
        return getPotionLevelBuff(this.level, factor, isW);
      default:
        throw new Error();
    }
  }
}

const getItemWeight = (type: CardType, level: number) => {
  if (type === CardType.P) return 0;

  const { cls } = GameManager.gI();
  const baseWeight = BASE_WEIGHT_MAP[cls!][type as CardType.W | CardType.S];
  return baseWeight + level;
};

const getWeaponLevelBuff = (
  level: number,
  factor: number,
  isKnight: boolean
): OptionalCharacterProps => {
  const attack = isKnight ? factor + 2 * level : 1;
  const random = Math.random();
  if (level === 1) {
    return { attack };
  } else if (level === 2) {
    return random < 0.6
      ? { attack, critical: 0.05 }
      : { attack, hitRate: 0.05 };
  } else if (level === 3) {
    return {
      attack,
      attackDirection: AttackDirection.AROUND,
      hitBack: 1 * factor,
    };
  } else {
    return {
      attack,
      attackDirection: AttackDirection.CROSS,
      hitBack: 3 * factor,
    };
  }
};
const getShieldLevelBuff = (
  level: number,
  factor: number,
  isDefender: boolean
): OptionalCharacterProps => {
  return {
    shield: Math.floor(factor / 2 + (isDefender ? 3.7 : 2) * level),
  };
};
const getPotionLevelBuff = (
  level: number,
  factor: number,
  isWizard: boolean
): OptionalCharacterProps => {
  const random = Math.random();
  const baseVal = Math.ceil(level / 3);
  const baseRate = 0.025 + 0.025 * level;
  const decreaseFactor = isWizard ? 0.05 : 0.1;
  const buffs: OptionalCharacterProps[] = [
    {
      health:
        factor * (random > 0.65 - decreaseFactor * level ? baseVal : -baseVal),
    },
    {
      critical:
        factor * random > 0.95 - decreaseFactor * level ? baseRate : -baseRate,
    },
    {
      hitRate:
        factor * random > 0.95 - decreaseFactor * level ? baseRate : -baseRate,
    },
  ];

  return randomPick(buffs);
};
