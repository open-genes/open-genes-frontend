import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

  constructor(public translate: TranslateService) {
  }

  changeLanguage() {
    const currentIndex = environment.languages.indexOf(this.translate.currentLang);
    const nextIndex = (currentIndex + 1) % environment.languages.length;
    const lang = environment.languages[nextIndex];
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

}
