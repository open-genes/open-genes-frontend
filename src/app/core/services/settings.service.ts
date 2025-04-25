import { Injectable } from '@angular/core';
import { SearchModeEnum, Settings } from '../models/settings.model';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LocaleKeyType } from '../models/languages.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private defaultLanguage: LocaleKeyType = 'en';
  private settings: Settings = {
    showUiHints: false,
    searchMode: SearchModeEnum.searchByGenes,
    isTableView: true,
    showCookieBanner: true,
    language: this.defaultLanguage,
    showNewReleaseNotification: true,
  };

  public genesListSettings: GenesListSettings = {
    ifShowAge: true,
    ifShowDiseases: false,
    ifShowDiseaseCategories: false,
    ifShowCriteria: true,
    ifShowHallmarks: true,
    ifShowProteinClasses: true,
    ifShowExperimentsStats: false,
    ifShowTags: true,
  };

  constructor(
      private translate: TranslateService,
    ) {
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    } else {
      this.settings = JSON.parse(localStorage.getItem('settings'));
    }

    if (!localStorage.getItem('fieldsForShow')) {
      localStorage.setItem('fieldsForShow', JSON.stringify(this.genesListSettings));
    } else {
      this.genesListSettings = JSON.parse(localStorage.getItem('fieldsForShow'));
    }
  }

  public setSettings(settingKey: string, value: any): void {
    // TODO: change to enum type
    if (settingKey in this.settings) {
      this.settings[settingKey] = value;
    }

    this.settings = Object.assign({ [settingKey]: value }, this.settings);
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  public getSettings(): Settings {
    return JSON.parse(localStorage.getItem('settings'));
  }

  // Legacy:
  public setFieldsForShow(fields: GenesListSettings): void {
    localStorage.setItem('fieldsForShow', JSON.stringify(fields));
  }

  public getFieldsForShow(): GenesListSettings {
    return JSON.parse(localStorage.getItem('fieldsForShow'));
  }

  public setLanguage(): void {
    this.translate.addLangs(environment.languages);
    if (localStorage.getItem('lang')) {
      this.settings.language = localStorage.getItem('lang');
    } else {
      this.settings.language = this.defaultLanguage;
    }
    this.translate.use(this.settings.language);
  }

  public getLanguage(): string {
    return this.settings.language;
  }

  public updateLanguage(language: LocaleKeyType): void {
    if (!environment.languages) {
      return;
    }

    this.settings.language = language;
    localStorage.setItem('lang', this.settings.language);
    this.translate.use(this.settings.language);
  }
}
