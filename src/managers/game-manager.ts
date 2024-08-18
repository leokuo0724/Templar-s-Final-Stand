import { emit, on, onInput } from "kontra";
import { EVENT } from "../constants/event";
import { Direction } from "../types/direction";

enum GAME_STATE {
  IDLE,
  SWIPING,
}

export class GameManager {
  private static instance: GameManager;
  private state: GAME_STATE = GAME_STATE.IDLE;

  private constructor() {
    onInput(
      ["arrowleft", "a", "swipeleft"],
      this.swipe.bind(this, Direction.LEFT)
    );
    onInput(
      ["arrowright", "d", "swiperight"],
      this.swipe.bind(this, Direction.RIGHT)
    );
    onInput(["arrowup", "w", "swipeup"], this.swipe.bind(this, Direction.UP));
    onInput(
      ["arrowdown", "s", "swipedown"],
      this.swipe.bind(this, Direction.DOWN)
    );

    on(EVENT.SWIPE_FINISH, () => {
      this.state = GAME_STATE.IDLE;
    });
  }
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  private swipe(direction: Direction) {
    if (this.state !== GAME_STATE.IDLE) return;
    this.state = GAME_STATE.SWIPING;
    emit(EVENT.SWIPE, direction);
  }
}
