import { GameManager } from "../../../managers/game-manager";
import { BaseCard } from "./base-card";
import { EnemyCard } from "./enemy-card";
import { ItemCard } from "./item-card";
import { TemplarCard } from "./templar-card";

import { CardType } from "./type";

type CreateCardProps = {
  type: CardType;
  x: number;
  y: number;
};

export class CardFactory {
  static createCard(x: number, y: number): BaseCard {
    const { moveCount } = GameManager.getInstance();
    const isSpawnEliteEnemy = moveCount % 13 === 0;
    if (isSpawnEliteEnemy) {
      return CardFactory.factory({
        type: CardType.ENEMY,
        x,
        y,
      });
    } else {
      const randomItem =
        Math.random() > 0.5 ? CardType.POTION : CardType.SHIELD;
      const itemOrder = [
        CardType.ENEMY,
        CardType.WEAPON,
        randomItem,
        CardType.WEAPON,
        randomItem,
      ];
      return CardFactory.factory({
        type: itemOrder[moveCount % itemOrder.length],
        x,
        y,
      });
    }
  }

  static factory(props: CreateCardProps): BaseCard {
    const { type, x, y } = props;
    const gm = GameManager.getInstance();
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
      case CardType.WEAPON:
        return new ItemCard({
          ...props,
          duration: 4,
          weight: 3,
        });
      case CardType.SHIELD:
        return new ItemCard({
          ...props,
          duration: 6,
          weight: 3,
        });
      case CardType.POTION:
        return new ItemCard({
          ...props,
          duration: 4,
          weight: 0,
        });
      default:
        throw new Error(`Invalid card type: ${type}`);
    }
  }
}
