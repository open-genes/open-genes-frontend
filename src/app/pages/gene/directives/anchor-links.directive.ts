import { Directive, AfterViewInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appDynamicContentAnchors]',
})
export class DynamicContentAnchorsDirective implements AfterViewInit {
  constructor(private ngZone: NgZone) {}

  // TODO: Use Element Ref instead of getting DOM elements directly
  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const anchors = document.getElementsByClassName('link--anchor');
        const referenceList = document.getElementById('reference');

        if (anchors && referenceList) {
          const anchorScroll = () => {
            const destinationOffset = referenceList.offsetTop + 10;
            window.scrollTo(0, destinationOffset);
          };
          for (const [, link] of Object.entries(anchors)) {
            link.addEventListener('click', anchorScroll, false);
          }
        }
      });
    });
  }
}
