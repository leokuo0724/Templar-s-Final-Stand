import { BaseCard } from "./base-card";
import { TemplarCard } from "./templar-card";

import { CardType } from "./type";

export class CardFactory {
  static createCard(type: CardType): BaseCard {
    switch (type) {
      case CardType.TEMPLAR:
        return new TemplarCard();
      case CardType.WEAPON:
        throw new Error("Not implemented");
    }
  }
}
