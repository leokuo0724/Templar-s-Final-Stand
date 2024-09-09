import { emit, on } from "kontra";
import { EVENT } from "../constants/event";
import { Direction } from "../types/direction";
import { ItemCard } from "../components/sprites/card/item-card";
import { zzfx, zzfxM, zzfxP } from "../audios/zzfx";
import { bgm } from "../audios/bgm";
import { SwipeDetector } from "../utils/swipe-detector";
import { negativeSFX, swipeSFX } from "../audios/sfx";

export enum GameState {
  PROLOGUE,
  INIT,
  INTRO,
  IDLE,
  SWIPING,
  GAME_OVER,
}
export enum TemplarClass {
  KNIGHT = "Knight",
  WIZARD = "Wizard",
  DEFENDER = "Defender",
}

export class GameManager {
  private static instance: GameManager;

  public state: GameState = GameState.PROLOGUE;
  public move = 0;
  public get level() {
    return Math.floor(this.move / 5);
  }

  public music: AudioBufferSourceNode | null = null;
  public currentItems: ItemCard[] = [];
  public cls: TemplarClass | null = null;
  public get isWizard() {
    return this.cls === TemplarClass.WIZARD;
  }
  public get isKnight() {
    return this.cls === TemplarClass.KNIGHT;
  }
  public get isDefender() {
    return this.cls === TemplarClass.DEFENDER;
  }
  public speed = 1; // 1x speed

  private constructor() {
    new SwipeDetector({
      onSwipeLeft: this.swipe.bind(this, Direction.LEFT),
      onSwipeRight: this.swipe.bind(this, Direction.RIGHT),
      onSwipeUp: this.swipe.bind(this, Direction.UP),
      onSwipeDown: this.swipe.bind(this, Direction.DOWN),
    });

    window.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "a"].includes(e.key)) this.swipe(Direction.LEFT);
      if (["ArrowRight", "d"].includes(e.key)) this.swipe(Direction.RIGHT);
      if (["ArrowUp", "w"].includes(e.key)) this.swipe(Direction.UP);
      if (["ArrowDown", "s"].includes(e.key)) this.swipe(Direction.DOWN);
    });

    on(EVENT.SWIPE_FINISH, () => {
      if (this.state === GameState.GAME_OVER) return;
      this.state = GameState.IDLE;
    });
  }
  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setClass(cls: TemplarClass) {
    this.cls = cls;
    emit(EVENT.UPDATE_TEMPLAR_CLASS, cls);
    this.state = GameState.INTRO;
  }

  public toggleBGM() {
    if (this.music) {
      this.music.stop();
      this.music = null;
    } else {
      // @ts-ignore
      this.music = zzfxP(...zzfxM(...bgm));
      this.music!.loop = true;
    }
  }

  public toggleSpeed() {
    this.speed = this.speed === 1 ? 1.5 : this.speed === 1.5 ? 2 : 1;
  }

  private swipe(direction: Direction) {
    if (this.state !== GameState.IDLE) return;
    this.move++;
    this.state = GameState.SWIPING;
    zzfx(...swipeSFX);
    emit(EVENT.SWIPE, direction);
  }

  public addItems(itemCards: ItemCard[]) {
    itemCards.forEach((item) => {
      if (this.isDefender) item.duration = Math.min(6, item.duration);
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

  public gameOver() {
    this.state = GameState.GAME_OVER;
    this.music?.stop();
    zzfx(...negativeSFX);
    emit(EVENT.GAME_OVER);
  }
}
