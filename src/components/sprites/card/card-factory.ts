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
    const { moveCount, isDefender, isKnight } = GameManager.getInstance();
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
        isDefender ? CardType.SHIELD : CardType.WEAPON,
        randomItem,
        isKnight ? CardType.WEAPON : CardType.POTION,
        isDefender ? CardType.WEAPON : randomItem,
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
        return new EnemyCard({ x, y });
      case CardType.WEAPON:
        return new ItemCard({
          ...props,
          duration: 4,
          weight: BASE_WEIGHT_MAP[gm.cls!][CardType.WEAPON],
        });
      case CardType.SHIELD:
        return new ItemCard({
          ...props,
          duration: 6,
          weight: BASE_WEIGHT_MAP[gm.cls!][CardType.SHIELD],
        });
      case CardType.POTION:
        return new ItemCard({
          ...props,
          duration: 5,
          weight: 0,
        });
    }
  }
}
