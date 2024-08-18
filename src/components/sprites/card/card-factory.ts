import { BaseCard } from "./base-card";
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
        throw new Error("Not implemented");
    }
  }
}
