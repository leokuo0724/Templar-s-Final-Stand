import { emit, on, onInput } from "kontra";
import { EVENT } from "../constants/event";
import { Direction } from "../types/direction";
import { ItemCard } from "../components/sprites/card/item-card";
import { EnemyCard } from "../components/sprites/card/enemy-card";
import { zzfx, zzfxM, zzfxP } from "../audios/zzfx";
import { bgm } from "../audios/bgm";

enum GAME_STATE {
  IDLE,
  SWIPING,
}

export class GameManager {
  private static instance: GameManager;

  private state: GAME_STATE = GAME_STATE.IDLE;
  public moveCount = 0;
  public level = Math.floor(this.moveCount / 5); // from 0

  public currentItems: ItemCard[] = [];
  public deprecatedEnemyCards: EnemyCard[] = [];

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
    on(EVENT.ENEMY_DEAD, this.onEnemyDead.bind(this));
    // @ts-ignore
    const music = zzfxP(...zzfxM(...bgm));
    music.loop = true;
  }
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  private swipe(direction: Direction) {
    if (this.state !== GAME_STATE.IDLE) return;
    this.moveCount++;
    this.state = GAME_STATE.SWIPING;
    zzfx(...[3, , 576, , , 0.007, 1, 0.6, , , -273, , , , , , , 0.64]);
    emit(EVENT.SWIPE, direction);
  }

  public addItems(itemCards: ItemCard[]) {
    itemCards.forEach((item) => this.currentItems.push(item));
    emit(EVENT.ITEMS_UPDATED, itemCards);
  }

  public onEnemyDead(card: EnemyCard) {
    this.deprecatedEnemyCards.push(card);
    emit(EVENT.REMOVE_ENEMY_DEAD, card);
  }
}
