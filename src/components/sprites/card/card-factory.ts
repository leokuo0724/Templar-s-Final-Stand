import { GameManager } from "../../../managers/game-manager";
import {
  AttackDirection,
  OptionalCharacterProps,
} from "../../../types/character";
import { randomPick } from "../../../utils/random-utils";
import { BaseCard } from "./base-card";
import { EnemyCard } from "./enemy-card";
import { ItemCard, ItemCardProps } from "./item-card";
import { TemplarCard } from "./templar-card";

import { CardType } from "./type";

type CreateCardProps = {
  type: CardType;
  x: number;
  y: number;
};

type ItemSetProps = Pick<ItemCardProps, "buff" | "duration" | "weight">;

export class CardFactory {
  static createCard(x: number, y: number): BaseCard {
    const { moveCount } = GameManager.getInstance();
    const isSpawnEnemy = moveCount % 13 === 0 || moveCount % 4 === 0;
    if (isSpawnEnemy) {
      return CardFactory.factory({
        type: CardType.ENEMY,
        x,
        y,
      });
    } else {
      const picked = randomPick([
        CardType.SHIELD,
        CardType.WEAPON,
        CardType.WEAPON,
        CardType.POTION,
      ]);
      return CardFactory.factory({
        type: picked,
        x,
        y,
      });
    }
  }

  static factory(props: CreateCardProps): BaseCard {
    const { type, x, y } = props;
    const gm = GameManager.getInstance();
    const factor = gm.level + 1;
    switch (type) {
      case CardType.TEMPLAR:
        return new TemplarCard({ x, y });
      case CardType.ENEMY:
        if (gm.reusableEnemyCards.length > 2) {
          const card = gm.reusableEnemyCards.shift()!;
          card.reset();
          card.x = x;
          card.y = y;
          return card;
        }
        return new EnemyCard({ x, y });
      case CardType.WEAPON: // TODO: combine card to upgrade
        return new ItemCard({
          ...props,
          ...CardFactory.randomPickWeapon(),
        });
      case CardType.SHIELD:
        return new ItemCard({
          ...props,
          buff: {
            shield: 1 * factor,
          },
          duration: 6,
          weight: 5,
        });
      case CardType.POTION:
        return new ItemCard({
          ...props,
          buff: this.randomPickPotionBuff(factor),
          duration: 4,
          weight: 0,
        });
      default:
        throw new Error(`Invalid card type: ${type}`);
    }
  }

  // TODO:
  private static randomPickWeapon(): ItemSetProps {
    const gm = GameManager.getInstance();
    const factor = gm.level + 1;
    const weaponSet: ItemSetProps[] = [
      {
        buff: { attack: 2 * factor, criticalRate: -0.1 },
        duration: 6,
        weight: 4,
      }, // Sword
      {
        buff: { attack: 1 * factor, criticalRate: 0.2 },
        duration: 6,
        weight: 2,
      }, // Dagger
      { buff: { attack: 3 * factor, hitRate: -0.3 }, duration: 6, weight: 4 }, // Axe
      {
        buff: {
          attack: 1 * factor,
          attackDirection:
            Math.random() > 0.5 ? AttackDirection.AROUND : AttackDirection.LINE,
        },
        duration: 6,
        weight: 6,
      }, // Bow
    ];
    return randomPick(weaponSet);
  }
  private static randomPickPotionBuff(factor: number): OptionalCharacterProps {
    const buffs: OptionalCharacterProps[] = [
      { health: 1 * factor * (Math.random() > 0.5 ? 1 : -1) },
      { criticalRate: Math.random() > 0.3 ? -0.1 : 0.1 },
      { hitRate: Math.random() > 0.3 ? -0.1 : 0.1 },
    ];
    return randomPick(buffs);
  }
}
