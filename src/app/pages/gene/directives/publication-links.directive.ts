import { Directive, AfterViewInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appPublicationLinks]',
})
export class PublicationLinksDirective implements AfterViewInit {
  constructor(private ngZone: NgZone) {}

  // TODO: Use Element Ref instead of getting DOM elements directly
  public ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        const links = document.getElementsByClassName('link--publication');
        if (links) {
          Object.entries(links).forEach((link) => {
            console.log(link);
          });
        }
      });
    });
  }
}
