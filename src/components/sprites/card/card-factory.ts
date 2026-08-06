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
        type: 1,
        x,
        y,
      });
    } else {
      const randomItem = Math.random() > 0.5 ? 4 : 3;
      const itemOrder: CardType[] = [
        1,
        isD ? 3 : 2, // dual
        randomItem,
        isK ? 2 : 4, // dual
        isD ? 2 : randomItem,
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
      case 0:
        return new TemplarCard({ x, y });
      case 1:
        return new EnemyCard({ x, y });
      case 2:
        return new ItemCard({
          ...props,
          duration: 4,
          weight: BASE_WEIGHT_MAP[gm.cls!][2],
        });
      case 3:
        return new ItemCard({
          ...props,
          duration: 6,
          weight: BASE_WEIGHT_MAP[gm.cls!][3],
        });
      case 4:
        return new ItemCard({
          ...props,
          duration: 5,
          weight: 0,
        });
    }
  }
}
