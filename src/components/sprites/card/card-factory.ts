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
  static createCard({ type, x, y }: CreateCardProps): BaseCard {
    // TODO: control values
    // TODO: reuse cards
    const gm = GameManager.getInstance();
    switch (type) {
      case CardType.TEMPLAR:
        return new TemplarCard({ x, y });
      case CardType.ENEMY:
        if (gm.deprecatedEnemyCards.length > 2) {
          console.log("reused");
          const card = gm.deprecatedEnemyCards.shift()!;
          card.reset();
          card.x = x;
          card.y = y;
          return card;
        }
        return new EnemyCard({ x, y });
      case CardType.WEAPON:
        return new ItemCard({
          type,
          x,
          y,
          buff: {
            attack: 1,
            hitRate: -0.1,
          },
          duration: 3,
          weight: 1,
        });
      default:
        throw new Error(`Invalid card type: ${type}`);
    }
  }
}
