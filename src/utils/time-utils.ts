import { GameManager } from "../managers/game-manager";

export function delay(ms: number) {
  return new Promise((resolve) => {
    const { speed } = GameManager.getInstance();
    setTimeout(resolve, ms / speed);
  });
}
