import {
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../modules/third-party/material.module';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    TranslateModule,
    NgForOf,
  ],
})
export class LanguageComponent {
  @Input() theme: 'light' | 'dark' = 'dark';
  public languages = environment.languages.sort();
  public localesMap: { [key: string]: string } = {
    cs: 'Čeština',
    en: 'English',
    pt: 'Português',
    uk: 'Українська',
    es: 'Español',
    ru: 'Русский',
    zh: '中文',
  };

  constructor(public translate: TranslateService) {}

  changeLanguage(language: string) {
    console.log(`Chosen language: ${language}`);
    if (!this.languages.includes(language)) {
      return;
    }

    this.translate.use(language);
    localStorage.setItem('lang', language);
  }
}
