import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CookieBannerComponent {
  constructor() {}
}
