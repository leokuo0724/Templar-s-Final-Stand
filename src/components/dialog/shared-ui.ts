import { getCanvas, Sprite, SpriteClass, Text } from "kontra";
import { COLOR } from "../../constants/color";
import { FONT } from "../../constants/text";

export class OverlayDialog extends SpriteClass {
  protected wrapper: Sprite;
  protected tT: Text; // title text
  protected dT: Text; // description text

  constructor(width: number, height: number) {
    const { width: w, height: h } = getCanvas();
    super({
      width: w,
      height: h,
      opacity: 0.8,
      color: COLOR.DARK_6,
    });
    this.wrapper = Sprite({
      x: w / 2,
      y: h / 2,
      width,
      height,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.YELLOW_6,
    });
    this.tT = Text({
      text: "",
      x: w / 2,
      y: h / 2 - 52,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.BROWN_7,
      font: `24px ${FONT}`,
    });
    this.dT = Text({
      text: "",
      x: w / 2,
      y: h / 2,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.BROWN_7,
      font: `16px ${FONT}`,
      textAlign: "center",
      lineHeight: 1.2,
    });

    this.addChild([this.wrapper, this.tT, this.dT]);
  }
}

export class CustomButton extends SpriteClass {
  public isDisabled: boolean = false;
  public text: Text;
  private canvasCallback: ((event: PointerEvent) => void) | null = null;

  constructor(x: number, y: number, text: string, isDisabled: boolean = false) {
    super({
      x,
      y,
      width: 96,
      height: 28,
      color: COLOR.BROWN_7,
      anchor: { x: 0.5, y: 0.5 },
      opacity: isDisabled ? 0.3 : 1,
    });
    this.isDisabled = isDisabled;
    this.text = Text({
      text,
      anchor: { x: 0.5, y: 0.5 },
      color: COLOR.WHITE_6,
      font: `16px ${FONT}`,
    });
    this.addChild(this.text);
  }

  public bindClick(callback: () => void) {
    if (this.isDisabled) return;
    const canvas = getCanvas();
    this.canvasCallback = (event: PointerEvent) => {
      const isClicked = detectCanvasClick(event, this);
      if (isClicked) callback();
    };
    canvas.addEventListener("pointerdown", this.canvasCallback);
  }
  public offClick() {
    if (this.canvasCallback) {
      getCanvas().removeEventListener("pointerdown", this.canvasCallback);
    }
  }
}

export function detectCanvasClick(
  event: PointerEvent,
  sprite: Sprite
): boolean {
  const { offsetLeft, offsetTop } = event.target as HTMLCanvasElement;
  const { world } = sprite;
  const minX = world.x - world.width / 2;
  const maxX = world.x + world.width / 2;
  const minY = world.y - world.height / 2;
  const maxY = world.y + world.height / 2;

  const { width: w, height: h } = getCanvas();
  const scale = Math.min(innerWidth / w, innerHeight / h, devicePixelRatio);
  const x = (event.x - offsetLeft) / scale;
  const y = (event.y - offsetTop) / scale;
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}
