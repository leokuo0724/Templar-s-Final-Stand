import { CardType } from "../components/sprites/card/type";
import { TemplarClass } from "../managers/game-manager";

export const BASE_WEIGHT_MAP = {
  [TemplarClass.KNIGHT]: {
    [CardType.WEAPON]: 4,
    [CardType.SHIELD]: 3,
  },
  [TemplarClass.WIZARD]: {
    [CardType.WEAPON]: 5,
    [CardType.SHIELD]: 6,
  },
  [TemplarClass.DEFENDER]: {
    [CardType.WEAPON]: 5,
    [CardType.SHIELD]: 3,
  },
};
