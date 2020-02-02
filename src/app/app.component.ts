import {Component, OnInit, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  // title = 'frontend';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(environment.languages);
    const lang = localStorage.getItem('lang') || environment.languages[0];
    this.translate.use(lang);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    document.body.classList.remove('body--loading');
  }
}
