import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../modules/third-party/material.module';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    TranslateModule,
  ],
})
export class LanguageComponent {
  @Input() theme: 'light' | 'dark' = 'dark';

  public languages = environment.languages;
  public currentIndex = environment.languages.indexOf(this.translate.currentLang);
  public nextIndex = (this.currentIndex + 1) % environment.languages.length;

  constructor(public translate: TranslateService) {}

  changeLanguage(language) {
    const currentIndex = environment.languages.indexOf(this.translate.currentLang);
    const nextIndex = (currentIndex + 1) % environment.languages.length;
    const nextLang = environment.languages[nextIndex];

    const languageSelector = (lang: string) => {
      if (lang === 'ru') {
        return environment.languages[0];
      }

      if (lang === 'en') {
        return environment.languages[1];
      }

      if (lang === 'zh') {
        return environment.languages[2];
      }

      return nextLang;
    };

    const languageSet = languageSelector(language);

    this.translate.use(languageSet);
    localStorage.setItem('lang', languageSet);
    window.location.reload();
  }
}
