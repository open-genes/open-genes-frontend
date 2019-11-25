import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['ru', 'en']);
    const lang = localStorage.getItem('lang') || 'ru';
    this.translate.use(lang);
  }

  changeLanguage() {
    const lang = this.translate.currentLang === 'en' ? 'ru' : 'en';
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
