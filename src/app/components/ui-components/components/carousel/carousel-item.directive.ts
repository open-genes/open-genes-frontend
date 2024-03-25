import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCarouselItem]',
})
export class CarouselItemDirective {
  constructor(public elementRef: ElementRef) {}
}
