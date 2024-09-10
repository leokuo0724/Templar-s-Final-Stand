import { CardType } from "../components/sprites/card/type";
import { TemplarClass } from "../managers/game-manager";

export const BASE_WEIGHT_MAP = {
  [TemplarClass.K]: {
    [CardType.W]: 3,
    [CardType.S]: 4,
  },
  [TemplarClass.W]: {
    [CardType.W]: 5,
    [CardType.S]: 6,
  },
  [TemplarClass.D]: {
    [CardType.W]: 5,
    [CardType.S]: 3,
  },
};
