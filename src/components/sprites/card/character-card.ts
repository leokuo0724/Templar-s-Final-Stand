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
};

export abstract class CharacterCard extends BaseCard {
  protected attackText: Text;
  protected healthText: Text;
  protected shieldText: Text;
  protected impactText: ImpactText;

  public belongs: Belongs;
  public health: number = 0;
  public shield: number = 0;
  public attack: number = 0;
  public hitRate: number = 0;
  public criticalRate: number = 0;
  public attackDirection: AttackDirection = AttackDirection.FRONT;
  public hitBackAttack: number = 0;

  constructor({ type, x, y, belongs }: CharacterCardProps) {
    super({ type, x, y });
    this.belongs = belongs;

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

    const remainingDamage = this.updateShield(-calculatedDamage);
    const isDead = this.updateHealth(-remainingDamage);
    if (!isDead && this.hitBackAttack > 0 && !isHitBack) {
      await this.execAttack(counterDirection, attacker, true);
    }
  }

  public async applyOverweightDamage() {
    await this.impactText.show(`Overweight -1`);
    this.updateHealth(-1);
  }

  // return true if the card is dead
  protected updateHealth(value: number): boolean | undefined {
    this.health += value;
    if (this.health <= 0) {
      this.setInactive();
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
    this.impactText.text = "";
  }

  public applyBuff(buff: OptionalCharacterProps) {
    this.updateHealth(buff.health || 0);
    this.updateShield(buff.shield || 0);
    this.updateAttack(buff.attack || 0);
    this.hitRate += buff.hitRate || 0;
    this.criticalRate += buff.criticalRate || 0;
    this.attackDirection = buff.attackDirection || this.attackDirection;
    this.hitBackAttack += buff.hitBackAttack || 0;

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
