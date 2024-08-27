import { Belongs, CardType } from "./type";

import { CharacterCard } from "./character-card";
import {
  AttackDirection,
  OptionalCharacterProps,
} from "../../../types/character";
import { EVENT } from "../../../constants/event";
import { emit, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { GameManager } from "../../../managers/game-manager";
import { randomPick } from "../../../utils/random-utils";
import { EnemyIcon } from "../icons/enemy-icon";

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
    return new EnemyIcon(-8, -29);
  }

  protected deathCallback(): void {
    emit(EVENT.ENEMY_DEAD, this);
  }

  protected resetProps(): void {
    const { level, moveCount } = GameManager.getInstance();
    this.health = 5 + 2 * level;
    this.attack = 2 + 1 * level;
    this.shield = 0;
    this.hitRate = 0.8;
    this.criticalRate = 0.1;
    this.attackDirection = AttackDirection.FRONT;
    this.hitBackAttack = 0;

    const isElite = moveCount > 0 && moveCount % 13 === 0;

    // Add extra buff
    const { buff, desc } = randomPick(getEnemyBuffsAndDesc(level + 1, isElite));
    this.applyBuff(buff);
    this.descriptionText.text = desc;
    this.refreshText();
  }
}

let eliteCount = -1;
const getEnemyBuffsAndDesc = (
  factor: number,
  isElite: boolean
): { buff: OptionalCharacterProps; desc: string }[] => {
  if (isElite) {
    const elites = [
      {
        buff: {
          attackDirection: AttackDirection.AROUND,
          health: 2 * factor,
        },
        desc: `"Whirlstriker"\nAttack: around`,
      },
      {
        buff: {
          attackDirection: AttackDirection.LINE,
          attack: 2 * factor,
          health: 1 * factor,
        },
        desc: `"Spearman"\nAttack: line`,
      },
      {
        buff: {
          hitBackAttack: 3 * factor,
          health: 2 * factor,
        },
        desc: `"Counterstriker"\nHit back: ${3 * factor}`,
      },
    ];
    eliteCount < elites.length - 1 ? eliteCount++ : (eliteCount = 0);
    return [elites[eliteCount]];
  } else {
    const buffs = [
      { shield: 2 * factor, health: -2 * factor },
      { health: 1 * factor, attack: -1 * factor },
      { criticalRate: 0.1 * factor, health: -2 * factor },
      { attack: 1 * factor, hitRate: -0.2 },
    ];
    return buffs.map((buff) => ({ buff, desc: getDescText(buff) }));
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
