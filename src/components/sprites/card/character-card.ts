import { Text } from "kontra";
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
    this.main.addChild([
      new SwordIcon(20, 30),
      this.attackText,
      new HeartIcon(-46, -46),
      this.healthText,
      new ShieldIcon(28, -46),
      this.shieldText,
    ]);
  }

  public async playAttack(direction: Direction) {
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
    await tween(this, { targetX: origX, targetY: origY }, 50, 400);
    tween(this.main, { targetX: 0, targetY: 0 }, 200);
  }

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
