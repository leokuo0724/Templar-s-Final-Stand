import { Belongs, CardType } from "./type";

import { CharacterCard } from "./character-card";
import {
  AttackDirection,
  AttackType,
  OptionalCharacterProps,
} from "../../../types/character";
import { EVENT } from "../../../constants/event";
import { emit, Sprite, Text } from "kontra";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { GameManager } from "../../../managers/game-manager";
import { randomPick } from "../../../utils/random-utils";
import { getEnemyPropsDescText } from "../../../utils/desc-utils";
import { TemplarCard } from "./templar-card";
import { Direction } from "../../../types/direction";
import { COLOR } from "../../../constants/color";
import { Enemy } from "../enemy";

export class EnemyCard extends CharacterCard {
  protected dT: Text;

  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.E,
      x,
      y,
      belongs: Belongs.ENEMY,
    });

    this.dT = Text({
      x: 0,
      y: 18,
      text: "",
      ...COMMON_TEXT_CONFIG,
      textAlign: "center",
    });
    this.main.addChild(this.dT);
    this.resetProps();
  }

  public async onWizardAttack(wizard: TemplarCard, level: number) {
    const gm = GameManager.gI();
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
    return Sprite();
  }

  protected deathCallback(): void {
    emit(EVENT.ENEMY_DEAD, this);
  }

  protected resetProps(): void {
    const gm = GameManager.gI();
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
    const { buff, desc, character } = randomPick(
      getEnemyBuffsAndDesc(level + 1, gm.isElite)
    );
    this.applyBuff(buff);
    this.dT.text = desc;
    this.refreshText();
    this.dmBg.opacity = 0;

    // reset icon
    const mainIcon = new Enemy(-23, -36, character);
    // const mainIcon = new Enemy(-18, -36, EnemyCharacter.CROSSBLADE);
    this.main.children[1] = mainIcon; // FIXME: This is a hacky way to replace the icon
  }
}

export enum EnemyCharacter {
  W,
  G,
  CS,
  S,
  CB,
  L,
}

let eliteCount = -1;
const getEnemyBuffsAndDesc = (
  factor: number,
  isElite: boolean
): {
  buff: OptionalCharacterProps;
  desc: string;
  character: EnemyCharacter | null;
}[] => {
  if (isElite) {
    const elites = [
      {
        buff: {
          attackDirection: AttackDirection.AROUND,
          health: 2 * factor,
          attack: 1 * factor,
        },
        desc: `"Whirlstriker"\nRange: around`,
        character: EnemyCharacter.W,
      },
      {
        buff: {
          shield: 4 * factor,
        },
        desc: `"Guardian"\nShield: ${4 * factor}`,
        character: EnemyCharacter.G,
      },
      {
        buff: {
          hitBack: 2 * factor,
          health: 2 * factor,
        },
        desc: `"Counterstriker"\nHit back: ${2 * factor}`,
        character: EnemyCharacter.CS,
      },
      {
        buff: {
          attackType: AttackType.PENETRATE,
          attack: 2 * factor,
        },
        desc: `"Spearman"\nPenetrate shield`,
        character: EnemyCharacter.S,
      },
      {
        buff: {
          attackDirection: AttackDirection.CROSS,
          health: 1 * factor,
        },
        desc: `"Crossblade"\nRange: cross`,
        character: EnemyCharacter.CB,
      },
      {
        buff: {
          attackDirection: AttackDirection.AROUND,
          attackType: AttackType.PENETRATE,
          shield: 5 * factor,
        },
        desc: `"Lancepiercer"\nPenetrate, around`,
        character: EnemyCharacter.L,
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
    return buffs.map((buff) => ({
      buff,
      desc: getEnemyPropsDescText(buff),
      character: null,
    }));
  }
};
