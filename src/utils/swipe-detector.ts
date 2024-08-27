type SwipeCallback = () => void;

interface SwipeOptions {
  onSwipeLeft?: SwipeCallback;
  onSwipeRight?: SwipeCallback;
  onSwipeUp?: SwipeCallback;
  onSwipeDown?: SwipeCallback;
}

export class SwipeDetector {
  private startX: number = 0;
  private startY: number = 0;
  private threshold: number = 50;

  constructor(private options: SwipeOptions) {
    this.addEventListeners();
  }

  private addEventListeners(): void {
    window.addEventListener("touchstart", this.onStart.bind(this));
    window.addEventListener("touchend", this.onEnd.bind(this));
    window.addEventListener("touchmove", this.preventDefault.bind(this));
  }

  private onStart(event: TouchEvent | MouseEvent): void {
    const point = this.getPoint(event);
    this.startX = point.clientX;
    this.startY = point.clientY;
  }

  private onEnd(event: TouchEvent | MouseEvent): void {
    const point = this.getPoint(event);
    const diffX = point.clientX - this.startX;
    const diffY = point.clientY - this.startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.threshold) {
      diffX > 0 ? this.options.onSwipeRight?.() : this.options.onSwipeLeft?.();
    } else if (Math.abs(diffY) > this.threshold) {
      diffY > 0 ? this.options.onSwipeDown?.() : this.options.onSwipeUp?.();
    }
  }

  private getPoint(event: TouchEvent | MouseEvent): {
    clientX: number;
    clientY: number;
  } {
    return event instanceof TouchEvent ? event.changedTouches[0] : event;
  }

  private preventDefault(event: TouchEvent | MouseEvent): void {
    event.preventDefault();
  }
}
