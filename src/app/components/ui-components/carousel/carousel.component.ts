import { Component, ContentChildren, QueryList, Input, Output, EventEmitter, AfterContentInit, Renderer2 } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { DirectivesModule } from '../../../directives/directives.module';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [
    DirectivesModule,
    NgForOf,
  ],
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
      setInterval(() => {
        if (this.currentIndex === this.items.length - 1) {
          this.changeSlide(0)
        } else  {
          this.changeSlide(nextSlideIndex)
        }
      }, this.autoPlayInterval);
    }
  }

  public changeSlide(index: number) {
    this.currentIndex = index;
    this.showOnlyCurrentSlide();
    this.slideChange.emit(index);
  }

  public nextSlide() {
    const nextSlideIndex = (this.currentIndex + 1) % this.items.length;
    this.changeSlide(nextSlideIndex);
  }

  public prevSlide() {
    const prevSlideIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.changeSlide(prevSlideIndex);
  }

  private showOnlyCurrentSlide() {
    this.items.forEach((item, i) => {
      const shouldDisplay = i === this.currentIndex;
      this.renderer.removeClass(item.elementRef.nativeElement, 'active');
      if (shouldDisplay) {
        this.renderer.addClass(item.elementRef.nativeElement, 'active');
      }
    });
  }
}
