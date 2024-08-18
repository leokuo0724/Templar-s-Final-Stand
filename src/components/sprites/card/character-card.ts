import { Text } from "kontra";
import { SwordIcon } from "../icons/sword-icon";
import { BaseCard } from "./base-card";
import { Belongs, CardType } from "./type";
import { HeartIcon } from "../icons/heart-icon";
import { ShieldIcon } from "../icons/shield-icon";
import { tween } from "../../../utils/tween-utils";
import { Direction } from "../../../types/direction";
import { AttackDirection } from "../../../types/character";
import { COMMON_TEXT_CONFIG } from "../../../constants/text";

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
    await tween(this.main, -5, -10, 100, 700);
    if ([Direction.RIGHT, Direction.LEFT].includes(direction)) {
      const xFactor = direction === Direction.RIGHT ? -1 : 1;
      await tween(this, this.x + 10 * xFactor, this.y, 50);
      await tween(this, this.x - 30 * xFactor, this.y, 40);
    } else {
      const yFactor = direction === Direction.DOWN ? -1 : 1;
      await tween(this, this.x, this.y + 10 * yFactor, 50);
      await tween(this, this.x, this.y - 30 * yFactor, 40);
    }
    await tween(this, origX, origY, 50, 400);
    tween(this.main, 0, 0, 200);
  }
}
