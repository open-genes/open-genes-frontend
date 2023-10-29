import { Directive, AfterViewInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appDynamicContentAnchors]',
})
export class DynamicContentAnchorsDirective implements AfterViewInit {
  constructor(private ngZone: NgZone) {}
  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const content = document.getElementById('dynamic-content');
        Object.values(content.getElementsByTagName('a')).map((el) => {
          el.addEventListener(
            'click',
            function (e) {
              if (el.getAttribute('href').includes('#')) {
                e.preventDefault();
                const destinationId = el.getAttribute('href').split('#').pop();
                if (destinationId?.length !== 0) {
                  const destination = document.getElementById(destinationId);
                  if (destination) {
                    window.scrollTo(0, destination.offsetTop);
                  }
                }
              }
            },
            true
          );
        });
      });
    });
  }
}
