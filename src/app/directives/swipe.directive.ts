import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { Hammer } from 'hammerjs';

enum DirectionEnum {
  vertical = Hammer.DIRECTION_VERTICAL,
  horizontal = Hammer.DIRECTION_HORIZONTAL,
}

@Directive({
  selector: '[appSwipe]',
})
export class SwipeDirective implements AfterViewInit {
  private swipeDirection: DirectionEnum;
  @Input() set setDirection(value: DirectionEnum) {
    this.swipeDirection = value;
    this.swipe();
  }
  private hammer: any;

  constructor(private readonly element: ElementRef) {
    this.hammer = new Hammer(element, {});
  }

  ngAfterViewInit(): void {
    this.swipe();
  }

  public swipe() {
    this.hammer
      .get('swipe')
      .set({ direction: this.swipeDirection, threshold: 0 });
  }
}
