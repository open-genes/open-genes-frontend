import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent {
  @Input() theme: 'light' | 'dark' = 'dark';

  public languages = environment.languages;
  public currentIndex = environment.languages.indexOf(
    this.translate.currentLang
  );
  public nextIndex = (this.currentIndex + 1) % environment.languages.length;

  constructor(public translate: TranslateService) {}

  changeLanguage(language) {
    const currentIndex = environment.languages.indexOf(
      this.translate.currentLang
    );
    const nextIndex = (currentIndex + 1) % environment.languages.length;
    const nextLang = environment.languages[nextIndex];
    const languageSelector = (l: string) => {
      if (l === 'ru') {
        return environment.languages[0];
      } else if (l === 'en') {
        return environment.languages[1];
      } else {
        return nextLang;
      }
    };

    const languageSet = languageSelector(language);

    this.translate.use(languageSet);
    localStorage.setItem('lang', languageSet);
    window.location.reload();
  }
}
