import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
} from '@angular/core';

enum SwipeDirectionEnum {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  UNKNOWN = '',
}

@Directive({
  selector: '[appSwipeHorizontal]',
  exportAs: 'SwipeDirective',
})
export class SwipeHorizontalDirective {
  @Output() readonly OnSwipeUp = new EventEmitter<void>();
  @Output() readonly OnSwipeRight = new EventEmitter<void>();
  @Output() readonly OnSwipeDown = new EventEmitter<void>();
  @Output() readonly OnSwipeLeft = new EventEmitter<void>();
  @Input() insensitiveDistance = 30;

  private isFiredTouchStart = false;
  private isBlocked = false;
  private lastPosition = 0;
  private position = 0;
  private distance = 0;

  constructor(private readonly zone: NgZone) {}

  private get swipingDirection(): SwipeDirectionEnum {
    return this.distance > this.insensitiveDistance
      ? SwipeDirectionEnum.RIGHT
      : this.distance < -this.insensitiveDistance
      ? SwipeDirectionEnum.LEFT
      : SwipeDirectionEnum.UNKNOWN;
  }

  private static getTouch(event: any): Touch | null {
    return event.touches
      ? event.touches.item(0)
      : event.changedTouches
      ? event.changedTouches.item(0)
      : null;
  }

  private fireSwipe(): void {
    switch (this.swipingDirection) {
      case SwipeDirectionEnum.RIGHT:
        this.OnSwipeRight.emit();
        break;
      case SwipeDirectionEnum.LEFT:
        this.OnSwipeLeft.emit();
        break;
      case SwipeDirectionEnum.UNKNOWN:
      default:
        break;
    }

    this.distance = 0;
  }

  @HostListener(`touchstart`, [`$event`])
  onTouchStart(event: any): void {
    if (this.isBlocked) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const touch = SwipeHorizontalDirective.getTouch(event);

      if (touch) {
        this.isFiredTouchStart = true;
        this.position = touch.clientX;
        this.distance = 0;
      }
    });
  }

  @HostListener(`touchmove`, [`$event`])
  onTouchMove(event: any): void {
    if (!this.isFiredTouchStart) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const touch = SwipeHorizontalDirective.getTouch(event);

      if (touch) {
        const position = touch.clientX - this.position;

        this.distance += position - this.lastPosition;
        this.lastPosition = position;
      }
    });
  }

  @HostListener(`document:touchend`)
  onTouchEnd(): void {
    if (!this.isFiredTouchStart) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.isBlocked = false;
      this.isFiredTouchStart = false;
      this.position = this.lastPosition = 0;
      this.fireSwipe();
    });
  }
}
