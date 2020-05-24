import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewChecked {
  // title = 'frontend';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(environment.languages);
    const lang = localStorage.getItem('lang') || environment.languages[0];
    this.translate.use(lang);
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    setTimeout(() => { // TODO: найти другой способ дождаться полной загрузки DOM, учитывая модули
      document.body.classList.remove('body--loading');
    }, 500);
  }
}
