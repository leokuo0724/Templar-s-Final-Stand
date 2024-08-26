import { Belongs, CardType } from "./type";

import { CharacterCard } from "./character-card";
import {
  AttackDirection,
  CharacterProps,
  OptionalCharacterProps,
} from "../../../types/character";
import { Sword } from "../assets/sword";
import { EVENT } from "../../../constants/event";
import { emit, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { GameManager } from "../../../managers/game-manager";
import { getRandomPropertyKeys } from "../../../utils/random-utils";

const BASIC_ENEMY_PROPS: CharacterProps = {
  health: 5,
  attack: 2,
  // advanced
  shield: 0,
  hitRate: 0.8,
  criticalRate: 0.2,
  attackDirection: AttackDirection.FRONT,
  hitBackAttack: 0,
};

export class EnemyCard extends CharacterCard {
  protected descriptionText: Text;

  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.ENEMY,
      x,
      y,
      belongs: Belongs.ENEMY,
    });

    this.descriptionText = Text({
      x: 0,
      y: 18,
      text: "",
      ...COMMON_TEXT_CONFIG,
      textAlign: "center",
    });
    this.main.addChild(this.descriptionText);
    this.resetProps();
  }

  protected getMainIcon() {
    return new Sword(-3, -40, 0.45);
  }

  protected deathCallback(): void {
    emit(EVENT.ENEMY_DEAD, this);
  }

  protected resetProps(): void {
    const { moveCount, level } = GameManager.getInstance();
    const props = {
      ...BASIC_ENEMY_PROPS,
      health: BASIC_ENEMY_PROPS.health + 2 * level,
      attack: BASIC_ENEMY_PROPS.attack + 1 * level,
    };
    const keys = getRandomPropertyKeys(props, 2);
    const isElite = moveCount > 0 && moveCount % 13 === 0;
    const buff = keys.reduce((acc, key, index) => {
      const factor = level + 1;
      const isBuff = isElite || index === 0;
      return { ...acc, ...processBuff(key, props, factor, isBuff) };
    }, {});

    const {
      health,
      shield,
      attack,
      hitRate,
      criticalRate,
      attackDirection,
      hitBackAttack,
    } = props;
    this.health = health;
    this.shield = shield;
    this.attack = attack;
    this.hitRate = hitRate;
    this.criticalRate = criticalRate;
    this.attackDirection = attackDirection;
    this.hitBackAttack = hitBackAttack;
    this.descriptionText.text = getDescText(buff);
    this.refreshText();
  }
}

// Utils
const processBuff = (
  key: keyof CharacterProps,
  obj: CharacterProps,
  factor: number,
  isBuff: boolean
): OptionalCharacterProps => {
  switch (key) {
    case "health":
      const hValue = (isBuff ? 1 : -1) * factor;
      obj.health += hValue;
      return {
        health: hValue,
      };
    case "shield":
      if (!isBuff) return {};
      const sValue = 2 * factor;
      obj.shield += sValue;
      return {
        shield: sValue,
      };
    case "attack":
      const atValue = (isBuff ? 1 : -1) * factor;
      obj.attack += atValue;
      return {
        attack: atValue,
      };
    case "hitRate":
      const hitValue = isBuff ? 0.1 * factor : -0.1;
      obj.hitRate += hitValue;
      return {
        hitRate: hitValue,
      };
    case "criticalRate":
      const criticalValue = isBuff ? 0.1 * factor : -0.1;
      obj.criticalRate += criticalValue;
      return {
        criticalRate: criticalValue,
      };
    case "attackDirection":
      if (!isBuff) return {};
      const dirValue =
        Math.random() > 0.5 ? AttackDirection.AROUND : AttackDirection.LINE;
      return {
        attackDirection: dirValue,
      };
    case "hitBackAttack":
      if (!isBuff) return {};
      const hbValue = 1 * factor;
      obj.hitBackAttack += hbValue;
      return {
        hitBackAttack: hbValue,
      };
    default:
      return {};
  }
};

const getDescText = (buff: OptionalCharacterProps) => {
  const buffTexts = Object.entries(buff).map(([key, value]) => {
    if (!value) return "";
    if (key === "attackDirection") return `attack: ${value}`;
    if ((value as number) > 0) return `high ${key}`;
    return `low ${key}`;
  });
  return buffTexts.join("\n");
};
