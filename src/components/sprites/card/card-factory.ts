import { BaseCard } from "./base-card";
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
    switch (type) {
      case CardType.TEMPLAR:
        return new TemplarCard({ x, y });
      case CardType.WEAPON:
        return new ItemCard({
          type,
          x,
          y,
          buff: {
            attack: 1,
            hitRate: -1,
          },
          duration: 3,
          weight: 1,
        });
      default:
        throw new Error(`Invalid card type: ${type}`);
    }
  }
}
