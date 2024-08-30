import { emit, on, onInput } from "kontra";
import { EVENT } from "../constants/event";
import { Direction } from "../types/direction";
import { ItemCard } from "../components/sprites/card/item-card";
import { EnemyCard } from "../components/sprites/card/enemy-card";
import { zzfx, zzfxM, zzfxP } from "../audios/zzfx";
import { bgm } from "../audios/bgm";
import { SwipeDetector } from "../utils/swipe-detector";

export enum GameState {
  INIT,
  IDLE,
  SWIPING,
  GAME_OVER,
}
export enum TemplarClass {
  KNIGHT,
  WIZARD,
  DEFENDER,
}

export class GameManager {
  private static instance: GameManager;

  public state: GameState = GameState.INIT;
  public moveCount = 0;
  public get level() {
    return Math.floor(this.moveCount / 5);
  }

  public currentItems: ItemCard[] = [];
  public reusableEnemyCards: EnemyCard[] = [];
  public cls: TemplarClass | null = null;

  private constructor() {
    new SwipeDetector({
      onSwipeLeft: this.swipe.bind(this, Direction.LEFT),
      onSwipeRight: this.swipe.bind(this, Direction.RIGHT),
      onSwipeUp: this.swipe.bind(this, Direction.UP),
      onSwipeDown: this.swipe.bind(this, Direction.DOWN),
    });

    onInput(["arrowleft", "a"], this.swipe.bind(this, Direction.LEFT));
    onInput(["arrowright", "d"], this.swipe.bind(this, Direction.RIGHT));
    onInput(["arrowup", "w"], this.swipe.bind(this, Direction.UP));
    onInput(["arrowdown", "s"], this.swipe.bind(this, Direction.DOWN));

    on(EVENT.SWIPE_FINISH, () => {
      if (this.state === GameState.GAME_OVER) return;
      this.state = GameState.IDLE;
    });
    on(EVENT.ENEMY_DEAD, this.onEnemyDead.bind(this));
  }
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setClass(cls: TemplarClass) {
    this.cls = cls;
    this.playBGM();
    emit(EVENT.UPDATE_TEMPLAR_CLASS, cls);
    this.state = GameState.IDLE;
  }

  private playBGM() {
    // TODO: click to play music
    // @ts-ignore
    const music = zzfxP(...zzfxM(...bgm));
    music.loop = true;
  }

  private swipe(direction: Direction) {
    if (this.state !== GameState.IDLE) return;
    this.moveCount++;
    this.state = GameState.SWIPING;
    zzfx(...[3, , 576, , , 0.007, 1, 0.6, , , -273, , , , , , , 0.64]);
    emit(EVENT.SWIPE, direction);
  }

  public addItems(itemCards: ItemCard[]) {
    console.log(itemCards.map((item) => item.duration));
    itemCards.forEach((item) => {
      if (this.cls === TemplarClass.DEFENDER)
        item.duration = Math.min(3, item.duration);
      this.currentItems.push(item);
    });
    emit(EVENT.ITEMS_UPDATED, itemCards, []);
  }
  public removeItems(itemCards: ItemCard[]) {
    // remove from current items
    const newCurrentItem = this.currentItems.filter(
      (item) => !itemCards.includes(item)
    );
    this.currentItems = newCurrentItem;
    emit(EVENT.ITEMS_UPDATED, [], itemCards);
  }

  public onEnemyDead(card: EnemyCard) {
    this.reusableEnemyCards.push(card);
    emit(EVENT.REMOVE_ENEMY_DEAD, card);
  }

  public gameOver() {
    this.state = GameState.GAME_OVER;
    emit(EVENT.GAME_OVER);
  }
}
