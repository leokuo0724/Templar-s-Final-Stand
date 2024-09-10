import { BASE_WEIGHT_MAP } from "../../../constants/weight";
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
    const { move, isD, isK } = GameManager.gI();
    const isSpawnEliteEnemy = move % 13 === 0;
    if (isSpawnEliteEnemy) {
      return CardFactory.factory({
        type: CardType.E,
        x,
        y,
      });
    } else {
      const randomItem = Math.random() > 0.5 ? CardType.P : CardType.S;
      const itemOrder = [
        CardType.E,
        isD ? CardType.S : CardType.W, // dual
        randomItem,
        isK ? CardType.W : CardType.P, // dual
        isD ? CardType.W : randomItem,
      ];
      return CardFactory.factory({
        type: itemOrder[move % itemOrder.length],
        x,
        y,
      });
    }
  }

  static factory(props: CreateCardProps): BaseCard {
    const { type, x, y } = props;
    const gm = GameManager.gI();
    switch (type) {
      case CardType.T:
        return new TemplarCard({ x, y });
      case CardType.E:
        return new EnemyCard({ x, y });
      case CardType.W:
        return new ItemCard({
          ...props,
          duration: 4,
          weight: BASE_WEIGHT_MAP[gm.cls!][CardType.W],
        });
      case CardType.S:
        return new ItemCard({
          ...props,
          duration: 6,
          weight: BASE_WEIGHT_MAP[gm.cls!][CardType.S],
        });
      case CardType.P:
        return new ItemCard({
          ...props,
          duration: 5,
          weight: 0,
        });
    }
  }
}
