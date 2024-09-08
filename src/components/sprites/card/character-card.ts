import { emit, Sprite, SpriteClass, Text } from "kontra";
import { SwordIcon } from "../icons/sword-icon";
import { BaseCard } from "./base-card";
import { Belongs, CardType } from "./type";
import { HeartIcon } from "../icons/heart-icon";
import { ShieldIcon } from "../icons/shield-icon";
import { tween } from "../../../utils/tween-utils";
import { Direction } from "../../../types/direction";
import {
  AttackDirection,
  AttackType,
  OptionalCharacterProps,
} from "../../../types/character";
import { COMMON_TEXT_CONFIG, FONT } from "../../../constants/text";
import { COLOR } from "../../../constants/color";
import { zzfx } from "../../../audios/zzfx";
import { delay } from "../../../utils/time-utils";
import { EVENT } from "../../../constants/event";
import { GameManager } from "../../../managers/game-manager";
import { GRID_SIZE } from "../../../constants/size";
import { attackSFX, makeUpgradeSFX, negativeSFX } from "../../../audios/sfx";
import { checkIfBuff } from "../../../utils/buff-utils";

type CharacterCardProps = {
  type: CardType;
  x: number;
  y: number;
  belongs: Belongs;
};

export abstract class CharacterCard extends BaseCard {
  protected damageBg: Sprite;
  protected attackText: Text;
  protected healthText: Text;
  protected shieldText: Text;
  protected impactText: ImpactText;

  public belongs: Belongs;
  public health: number = 0;
  public shield: number = 0;
  public attack: number = 0;
  public hitRate: number = 0;
  public critical: number = 0;
  public attackDirection: AttackDirection = AttackDirection.FRONT;
  public hitBack: number = 0;
  public attackType: string = AttackType.NORMAL;

  constructor({ type, x, y, belongs }: CharacterCardProps) {
    super({ type, x, y });
    this.belongs = belongs;

    this.color = COLOR.DARK_6;

    this.damageBg = Sprite({
      x: 0,
      y: 0,
      width: GRID_SIZE,
      height: GRID_SIZE,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.WHITE_6,
      opacity: 0,
    });
    this.attackText = Text({
      text: `${this.attack}`,
      x: 42,
      y: 39,
      ...COMMON_TEXT_CONFIG,
    });
    this.healthText = Text({
      text: `${this.health}`,
      x: -33,
      y: -34,
      ...COMMON_TEXT_CONFIG,
    });
    this.shieldText = Text({
      text: `${this.shield}`,
      x: 37,
      y: -34,
      ...COMMON_TEXT_CONFIG,
    });
    this.impactText = new ImpactText(0);
    this.main.addChild([
      this.damageBg,
      new SwordIcon(20, 30),
      this.attackText,
      new HeartIcon(-45.5, -45.5),
      this.healthText,
      new ShieldIcon(28, -46),
      this.shieldText,
      this.impactText,
    ]);
  }

  public async execAttack(
    direction: Direction,
    target: CharacterCard,
    isHitBack: boolean = false,
    isPenetrate: boolean = false
  ) {
    if (target.health <= 0 || this.health <= 0) return;
    const origX = this.x;
    const origY = this.y;
    await tween(this.main, { targetX: -5, targetY: -10 }, 100, 700);

    if ([Direction.RIGHT, Direction.LEFT].includes(direction)) {
      const xFactor = direction === Direction.RIGHT ? -1 : 1;
      await tween(
        this,
        { targetX: this.x + 10 * xFactor, targetY: this.y },
        50
      );
      await tween(
        this,
        { targetX: this.x - 30 * xFactor, targetY: this.y },
        40
      );
    } else {
      const yFactor = direction === Direction.DOWN ? -1 : 1;
      await tween(
        this,
        { targetX: this.x, targetY: this.y + 10 * yFactor },
        50
      );
      await tween(
        this,
        { targetX: this.x, targetY: this.y - 30 * yFactor },
        40
      );
    }
    if (this.type === CardType.TEMPLAR) emit(EVENT.TEMPLAR_ATTACK);
    zzfx(...attackSFX);
    await tween(this, { targetX: origX, targetY: origY }, 50, 400);

    const counterDirection = () => {
      switch (direction) {
        case Direction.RIGHT:
          return Direction.LEFT;
        case Direction.LEFT:
          return Direction.RIGHT;
        case Direction.UP:
          return Direction.DOWN;
        case Direction.DOWN:
          return Direction.UP;
      }
    };
    await Promise.all([
      tween(this.main, { targetX: 0, targetY: 0 }, 200),
      target.applyDamage(this, counterDirection(), isHitBack, isPenetrate),
    ]);
  }

  private async playDamage() {
    for (let i = 0; i < 2; i++) {
      await tween(this.damageBg, { opacity: 0.5 }, 80);
      await tween(this.damageBg, { opacity: 0 }, 0);
    }
    this.damageBg.opacity = 0;
  }

  public async applyDamage(
    attacker: CharacterCard,
    counterDirection: Direction,
    isHitBack: boolean = false,
    isPenetrate: boolean = false,
    wizardAttack: number = 0
  ) {
    const { attack, hitBack, hitRate, critical } = attacker;
    const isHit = Math.random() <= hitRate;
    if (!isHit) {
      await this.impactText.show("Miss");
      if (this.hitBack > 0 && !isHitBack && !wizardAttack)
        await this.execAttack(counterDirection, attacker, true, false);
      return;
    }
    this.playDamage();
    const isCritical = Math.random() <= critical;
    const damage = isHitBack
      ? hitBack
      : wizardAttack > 0
      ? wizardAttack
      : attack;
    const calculatedDamage = isCritical ? damage * 2 : damage;
    if (isCritical) {
      await this.impactText.show(`Critical -${calculatedDamage}`);
    } else {
      await this.impactText.show(`-${calculatedDamage}`);
    }

    const remainingDamage = isPenetrate
      ? calculatedDamage
      : this.updateShield(-calculatedDamage);
    const isDead = await this.updateHealth(-remainingDamage);
    if (!isDead && this.hitBack > 0 && !isHitBack && !wizardAttack)
      await this.execAttack(counterDirection, attacker, true, false);
  }

  public async applyOverweightDamage() {
    await Promise.all([
      this.impactText.show(`Overweight -1`),
      this.updateHealth(-1),
    ]);
  }

  // return true if the card is dead
  protected async updateHealth(value: number): Promise<boolean | undefined> {
    this.health += value;
    if (this.health <= 0) {
      await this.setInactive();
      this.deathCallback();
      return true;
    }
    this.healthText.text = `${this.health}`;
  }
  protected abstract deathCallback(): void;

  protected updateShield(value: number): number {
    let remainingDamage: number = 0;
    this.shield += value;
    if (this.shield <= 0) {
      remainingDamage = -this.shield;
      this.shield = 0;
    }
    this.shieldText.text = `${this.shield}`;
    const { isDefender } = GameManager.getInstance();
    if (this.type === CardType.TEMPLAR && isDefender) {
      this.hitBack = this.shield;
      emit(EVENT.UPDATE_TEMPLAR_INFO, this);
    }
    return remainingDamage;
  }
  protected updateAttack(value: number) {
    this.attack += value;
    this.attackText.text = `${this.attack}`;
  }
  protected refreshText() {
    this.attackText.text = `${this.attack}`;
    this.healthText.text = `${this.health}`;
    this.shieldText.text = `${this.shield}`;
    this.impactText.reset();
  }

  public applyBuff(buff: OptionalCharacterProps, isDebuff: boolean = false) {
    this.updateHealth(buff.health || 0);
    this.updateShield(buff.shield || 0);
    this.updateAttack(buff.attack || 0);
    this.hitRate += buff.hitRate || 0;
    this.hitRate = Math.max(Math.min(this.hitRate, 1), 0);
    this.critical += buff.critical || 0;
    this.critical = Math.max(Math.min(this.critical, 1), 0);
    if (this.attackDirection !== AttackDirection.CROSS || isDebuff) {
      this.attackDirection = buff.attackDirection || this.attackDirection;
    }
    this.attackType = buff.attackType || this.attackType;
    this.hitBack += buff.hitBack || 0;

    if (this.type === CardType.TEMPLAR) {
      emit(EVENT.UPDATE_TEMPLAR_INFO, this);
      if (!isDebuff) {
        const isBuff = checkIfBuff(buff);
        emit(EVENT.TEMPLAR_BUFF_EFFECT, isBuff);
        isBuff ? zzfx(...makeUpgradeSFX(true)) : zzfx(...negativeSFX);
      }
    }
  }
}

class ImpactText extends SpriteClass {
  private _text: Text;
  public set text(text: string) {
    this._text.text = text;
  }

  constructor(y: number) {
    super({
      x: 0,
      y,
      width: 100,
      height: 20,
      color: COLOR.BROWN_8,
      anchor: { x: 0.5, y: 0.5 },
      opacity: 0,
    });
    this._text = Text({
      text: "",
      font: `16px ${FONT}`,
      color: COLOR.WHITE_6,
      anchor: { x: 0.5, y: 0.5 },
    });
    this.addChild(this._text);
  }

  public async show(text: string) {
    this._text.text = text;
    const origY = this.y;
    await Promise.all([
      tween(this._text, { opacity: 1 }, 500),
      tween(this, { opacity: 1 }, 500),
      tween(this, { targetY: this.y - 10 }, 500),
    ]);
    await delay(100);
    await Promise.all([
      tween(this._text, { opacity: 0 }, 300),
      tween(this, { opacity: 0 }, 300),
    ]);
    this.y = origY;
  }
  public reset() {
    this.opacity = 0;
    this._text.opacity = 0;
  }
}
