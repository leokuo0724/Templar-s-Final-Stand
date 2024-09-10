import { Belongs, CardType } from "./type";

import { CharacterCard } from "./character-card";
import {
  AttackDirection,
  AttackType,
  OptionalCharacterProps,
} from "../../../types/character";
import { EVENT } from "../../../constants/event";
import { emit, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { GameManager } from "../../../managers/game-manager";
import { randomPick } from "../../../utils/random-utils";
import { getEnemyPropsDescText } from "../../../utils/desc-utils";
import { TemplarCard } from "./templar-card";
import { Direction } from "../../../types/direction";
import { COLOR } from "../../../constants/color";
import { Enemy } from "../enemy";

export class EnemyCard extends CharacterCard {
  protected descText: Text;

  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.ENEMY,
      x,
      y,
      belongs: Belongs.ENEMY,
    });

    this.descText = Text({
      x: 0,
      y: 18,
      text: "",
      ...COMMON_TEXT_CONFIG,
      textAlign: "center",
    });
    this.main.addChild(this.descText);
    this.resetProps();
  }

  public async onWizardAttack(wizard: TemplarCard, level: number) {
    const gm = GameManager.getInstance();
    const factor = gm.level;
    await this.applyDamage(
      wizard,
      Direction.UP,
      false,
      wizard.attackType === AttackType.PENETRATE,
      Math.floor(level * factor * 0.8)
    );
  }

  protected getMainIcon() {
    const gm = GameManager.getInstance();
    return new Enemy(-18, -36, gm.isElite);
  }

  protected deathCallback(): void {
    emit(EVENT.ENEMY_DEAD, this);
  }

  protected resetProps(): void {
    const gm = GameManager.getInstance();
    const level = gm.level;
    this.health = 5 + 2 * level;
    this.attack = 2 + 1 * level;
    this.shield = 0;
    this.hitRate = 0.8;
    this.attackDirection = AttackDirection.FRONT;
    this.attackType = AttackType.NORMAL;
    this.hitBack = 0;

    if (gm.isElite) this.circle.color = COLOR.BROWN_8;
    this.critical = gm.isElite ? 0 : 0.1; // Prevent elite enemy from critical (overpower)

    // Add extra buff
    const { buff, desc } = randomPick(
      getEnemyBuffsAndDesc(level + 1, gm.isElite)
    );
    this.applyBuff(buff);
    this.descText.text = desc;
    this.refreshText();
    this.damageBg.opacity = 0;
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
          attack: 1 * factor,
        },
        desc: `"Whirlstriker"\nRange: around`,
      },
      {
        buff: {
          shield: 4 * factor,
        },
        desc: `"Guardian"\nShield: ${4 * factor}`,
      },
      {
        buff: {
          hitBack: 2 * factor,
          health: 2 * factor,
        },
        desc: `"Counterstriker"\nHit back: ${2 * factor}`,
      },
      {
        buff: {
          attackType: AttackType.PENETRATE,
          attack: 2 * factor,
        },
        desc: `"Penetrator"\nPenetrate shield`,
      },
      {
        buff: {
          attackDirection: AttackDirection.CROSS,
          health: 1 * factor,
        },
        desc: `"Spearman"\nRange: cross`,
      },
      {
        buff: {
          attackDirection: AttackDirection.AROUND,
          attackType: AttackType.PENETRATE,
          shield: 5 * factor,
        },
        desc: `"Stormpiercer"\nPenetrate, around`,
      },
    ];
    eliteCount < elites.length - 1 ? eliteCount++ : (eliteCount = 0);
    return [elites[eliteCount]];
  } else {
    const buffs = [
      { shield: 2 * factor, health: -2 * factor },
      { health: 1 * factor, attack: Math.floor(-0.5 * factor) },
      { critical: 0.05 * factor, health: -2 * factor },
      { attack: 1 * factor, hitRate: -0.2 },
    ];
    return buffs.map((buff) => ({ buff, desc: getEnemyPropsDescText(buff) }));
  }
};
