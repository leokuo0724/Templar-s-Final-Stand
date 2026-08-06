import { emit, on } from "kontra";
import { EVENT } from "../constants/event";
import { Direction } from "../types/direction";
import { ItemCard } from "../components/sprites/card/item-card";
import { zzfx, zzfxM, zzfxP } from "../audios/zzfx";
import { bgm } from "../audios/bgm";
import { SwipeDetector } from "../utils/swipe-detector";
import { negativeSFX, swipeSFX } from "../audios/sfx";

export type GameState =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5;
export type TemplarClass =
  | "Knight"
  | "Wizard"
  | "Defender";

export class GameManager {
  private static instance: GameManager;

  public state: GameState = 0;
  public move = 0;
  public get level() {
    return Math.floor(this.move / 5);
  }
  public get isElite() {
    return (
      (this.move > 0 && this.move % 13 === 0) ||
      (this.move >= 78 && this.move % 5 === 0)
    );
  }

  public music: AudioBufferSourceNode | null = null;
  public currentItems: ItemCard[] = [];
  public cls: TemplarClass | null = null;
  public get isW() {
    return this.cls === "Wizard";
  }
  public get isK() {
    return this.cls === "Knight";
  }
  public get isD() {
    return this.cls === "Defender";
  }
  public speed = 1; // 1x speed

  private constructor() {
    new SwipeDetector({
      onSwipeLeft: this.swipe.bind(this, 2),
      onSwipeRight: this.swipe.bind(this, 3),
      onSwipeUp: this.swipe.bind(this, 0),
      onSwipeDown: this.swipe.bind(this, 1),
    });

    window.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "a"].includes(e.key)) this.swipe(2);
      if (["ArrowRight", "d"].includes(e.key)) this.swipe(3);
      if (["ArrowUp", "w"].includes(e.key)) this.swipe(0);
      if (["ArrowDown", "s"].includes(e.key)) this.swipe(1);
    });

    on(EVENT.SWIPE_FINISH, () => {
      if (this.state === 5) return;
      this.state = 3;
    });
  }
  static gI() {
    // get instance
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setClass(cls: TemplarClass) {
    this.cls = cls;
    emit(EVENT.UPDATE_TEMPLAR_CLASS, cls);
    this.state = 2;
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
    if (this.state !== 3) return;
    this.move++;
    this.state = 4;
    zzfx(...swipeSFX);
    emit(EVENT.SWIPE, direction);
  }

  public addItems(itemCards: ItemCard[]) {
    itemCards.forEach((item) => {
      if (this.isD) item.duration = Math.min(5, item.duration); // defender can only have 5 duration
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
    if (this.state === 5) return;
    this.state = 5;
    this.music?.stop();
    zzfx(...negativeSFX);
    emit(EVENT.GAME_OVER);
  }
}
