import { Text, TextClass } from "kontra";
import { SwordIcon } from "../icons/sword-icon";
import { BaseCard } from "./base-card";
import { Belongs, CardType } from "./type";
import { HeartIcon } from "../icons/heart-icon";
import { ShieldIcon } from "../icons/shield-icon";
import { tween } from "../../../utils/tween-utils";
import { Direction } from "../../../types/direction";
import {
  AttackDirection,
  OptionalCharacterProps,
} from "../../../types/character";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";
import { COLOR } from "../../../constants/color";
import { zzfx } from "../../../audios/zzfx";

type CharacterCardProps = {
  type: CardType;
  x: number;
  y: number;
  belongs: Belongs;
  maxHealth: number;
  health: number;
  shield: number;
  dodgeRate: number;
  attack: number;
  hitRate: number;
  criticalRate: number;
  attackDirection: AttackDirection;
  hitBackAttack: number;
};

export abstract class CharacterCard extends BaseCard {
  protected attackText: Text;
  protected healthText: Text;
  protected shieldText: Text;
  protected impactText: ImpactText;

  public belongs: Belongs;
  public maxHealth: number;
  public health: number;
  public shield: number;
  public dodgeRate: number;
  public attack: number;
  public hitRate: number;
  public criticalRate: number;
  public attackDirection: AttackDirection;
  public hitBackAttack: number;

  constructor({
    type,
    x,
    y,
    belongs,
    maxHealth,
    health,
    shield,
    dodgeRate,
    attack,
    hitRate,
    criticalRate,
    attackDirection,
    hitBackAttack,
  }: CharacterCardProps) {
    super({ type, x, y });
    this.belongs = belongs;
    this.maxHealth = maxHealth;
    this.health = health;
    this.shield = shield;
    this.dodgeRate = dodgeRate; // TODO: consider to delete
    this.attack = attack;
    this.hitRate = hitRate;
    this.criticalRate = criticalRate;
    this.attackDirection = attackDirection;
    this.hitBackAttack = hitBackAttack;

    this.color = COLOR.DARK_6;

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
      new SwordIcon(20, 30),
      this.attackText,
      new HeartIcon(-46, -46),
      this.healthText,
      new ShieldIcon(28, -46),
      this.shieldText,
      this.impactText,
    ]);
  }

  public async execAttack(
    direction: Direction,
    target: CharacterCard,
    isHitBack: boolean = false
  ) {
    if (target.health <= 0) return;
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
    zzfx(...[3, , 179, , 0.03, 0.06, , 2.8, , , , , , 0.5, 25, , , 0.46, 0.05]);
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
      target.applyDamage(this, counterDirection(), isHitBack),
    ]);
  }

  public async applyDamage(
    attacker: CharacterCard,
    counterDirection: Direction,
    isHitBack: boolean = false
  ) {
    const { attack, hitBackAttack, hitRate, criticalRate } = attacker;
    const isHit = Math.random() <= hitRate;
    if (!isHit) {
      await this.impactText.show("Miss");
      return;
    }
    const isCritical = Math.random() <= criticalRate;
    const damage = isHitBack ? hitBackAttack : attack;
    const calculatedDamage = isCritical ? damage * 2 : damage;
    if (isCritical) {
      await this.impactText.show(`Critical -${calculatedDamage}`);
    } else {
      await this.impactText.show(`-${calculatedDamage}`);
    }

    const isDead = this.updateHealth(-calculatedDamage);
    if (!isDead && this.hitBackAttack > 0 && !isHitBack) {
      await this.execAttack(counterDirection, attacker, true);
    }
  }

  // return true if the card is dead
  private updateHealth(value: number): boolean | undefined {
    this.health += value;
    if (this.health <= 0) {
      this.setInactive();
      this.deathCallback();
      return true;
    }
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
    this.healthText.text = `${this.health}`;
  }
  protected abstract deathCallback(): void;

  public applyBuff(buff: OptionalCharacterProps) {
    this.maxHealth += buff.maxHealth || 0;
    this.health += buff.health || 0;
    this.health = Math.min(this.health, this.maxHealth);
    this.shield += buff.shield || 0;
    this.dodgeRate += buff.dodgeRate || 0;
    this.attack += buff.attack || 0;
    this.hitRate += buff.hitRate || 0;
    this.criticalRate += buff.criticalRate || 0;
    this.attackDirection = buff.attackDirection || this.attackDirection;
    this.hitBackAttack += buff.hitBackAttack || 0;

    this.attackText.text = `${this.attack}`;
    this.healthText.text = `${this.health}`;
    this.shieldText.text = `${this.shield}`;

    // TODO: show buff effect
  }
}

class ImpactText extends TextClass {
  constructor(y: number) {
    super({
      text: "",
      x: 0,
      y,
      color: COLOR.DARK_6,
      font: "24px Trebuchet MS",
      anchor: { x: 0.5, y: 0.5 },
      opacity: 0,
    });
  }

  public async show(text: string) {
    this.text = text;
    await Promise.all([
      tween(this, { opacity: 1 }, 500),
      tween(this, { targetY: this.y - 10 }, 500),
    ]);
    await tween(this, { opacity: 0 }, 300);
    this.y += 10;
  }
}
