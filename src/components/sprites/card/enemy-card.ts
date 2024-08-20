import { Belongs, CardType } from "./type";

import { CharacterCard } from "./character-card";
import { AttackDirection } from "../../../types/character";
import { Sword } from "../assets/sword";
import { EVENT } from "../../../constants/event";
import { emit } from "kontra";

export class EnemyCard extends CharacterCard {
  constructor({ x, y }: { x: number; y: number }) {
    super({
      type: CardType.ENEMY,
      x,
      y,
      belongs: Belongs.ENEMY,
      maxHealth: 10,
      health: 10,
      shield: 0,
      dodgeRate: 0,
      attack: 1,
      hitRate: 0.8,
      criticalRate: 0.2,
      attackDirection: AttackDirection.FRONT,
      hitBackAttack: 0,
    });
  }

  protected getMainIcon() {
    return new Sword(-3, -40, 0.45);
  }

  protected deathCallback(): void {
    emit(EVENT.ENEMY_DEAD, this);
  }
}
