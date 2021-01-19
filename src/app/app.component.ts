import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewChecked {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(environment.languages);
    const lang = localStorage.getItem('lang') || navigator.language.substring(0, 2);
    this.translate.use(lang);
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    setTimeout(() => { // TODO: find a proper way to wait for the full DOM loading considering all modules
      document.body.classList.remove('body--loading');
    }, 500);
  }
}
