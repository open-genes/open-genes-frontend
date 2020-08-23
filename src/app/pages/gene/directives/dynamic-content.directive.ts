import {
  Directive,
  AfterViewInit,
  NgZone
} from '@angular/core';

@Directive({
  selector: '[appDynamicContentAnchors]'
})

export class DynamicContentAnchorsDirective implements AfterViewInit {
  constructor(
    private ngZone: NgZone) {
  }

  // TODO: Use Element Ref instead of getting DOM elements directly
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const anchors = document.getElementsByClassName('link--anchor');
        const referenceList = document.getElementById('reference');

        if (anchors && referenceList) {
          for (const link of anchors) {
            link.addEventListener('click', anchorScroll, false);
          }

          function anchorScroll() {
            const destinationOffset = referenceList.offsetTop + 10;
            window.scrollTo(0, destinationOffset);
          }
        }
      });
    });
  }
}
