import { Component, ContentChildren, QueryList, Input, Output, EventEmitter, AfterContentInit, Renderer2 } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterContentInit {
  @Input() width = '100%';
  @Input() autoPlayInterval = 0; // Set to 0 to disable autoplay
  @Output() slideChange = new EventEmitter<number>();

  @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
  public dots: number[] = [];
  public currentIndex = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterContentInit() {
    this.showOnlyCurrentSlide();
    this.items.forEach((_, i) => this.dots.push(i));
    if (this.autoPlayInterval > 0) {
      const nextSlideIndex = (this.currentIndex + 1) % this.items.length;
      setInterval(() => this.changeSlide(nextSlideIndex), this.autoPlayInterval);
    }
  }

  public changeSlide(index: number) {
    this.currentIndex = index;
    this.showOnlyCurrentSlide();
    this.slideChange.emit(index);
  }

  private showOnlyCurrentSlide() {
    this.items.forEach((item, i) => {
      const shouldDisplay = i === this.currentIndex;
      this.renderer.removeClass(item.elementRef.nativeElement, 'active');
      if (shouldDisplay) {
        this.renderer.addClass(item.elementRef.nativeElement, 'active');
      }
    });
    console.log(this.currentIndex);
  }
}