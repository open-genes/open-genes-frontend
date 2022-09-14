import {
  AfterViewInit,
  Directive, ElementRef,
  NgZone,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appScrollableContainer]',
  exportAs: 'ScrollableContainer',
})
export class ScrollableContainerDirective implements AfterViewInit, OnDestroy {
  private eventListener: EventListener;

  constructor(
    private el: ElementRef,
    private readonly zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const classHidden = 'view__fadeout--hidden';
      const scrollThreshold = 5;
      const childEl = this.el.nativeElement;
      const children = childEl.children;
      const parentWidth = childEl.parentNode.offsetWidth;
      const fadeOutLeft = childEl.parentNode.querySelector('.view__fadeout--l');
      const fadeOutRight = childEl.parentNode.querySelector('.view__fadeout--r');
      for (let i = 0; i < children.length; i++) {
        const childWidth = children[i].offsetWidth;
        if (childWidth > parentWidth) {
          if (childEl.offsetLeft < parentWidth) {
            fadeOutRight.classList.remove(classHidden);
          }

          this.eventListener = childEl.addEventListener('scroll', (e) => {
            if (e.target.scrollLeft > scrollThreshold) {
              if ((e.target.scrollWidth - (Number(e.target.scrollLeft) + scrollThreshold)) > (parentWidth - scrollThreshold)) {
                fadeOutLeft.classList.remove(classHidden);
                fadeOutRight.classList.remove(classHidden);
              } else {
                if (!fadeOutRight.classList.contains(classHidden)) {
                  fadeOutRight.classList.add(classHidden);
                }
              }
            } else {
              if (!fadeOutLeft.classList.contains(classHidden)) {
                fadeOutLeft.classList.add(classHidden);
              }
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('scroll', this.eventListener);
  }
}
