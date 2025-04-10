import {
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../modules/third-party/material.module';
import { NgClass, NgForOf } from '@angular/common';
import { localesMap } from '../../core/maps/languages.map';
import { LocaleKeyType } from '../../core/models/languages.model';
import { SettingsService } from '../../core/services/settings.service';

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
  public languages = environment.languages.sort();
  public languageNameFromIsoCode = localesMap;

  constructor(
    public translate: TranslateService,
    private settingsService: SettingsService
  ) {}

  public changeLanguage(language: LocaleKeyType): void {
    this.settingsService.updateLanguage(language);
  }
}
