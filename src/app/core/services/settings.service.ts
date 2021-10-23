import { Injectable } from '@angular/core';
import { SearchModeEnum, Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings: Settings = {
    showUiHints: false,
    searchMode: SearchModeEnum.searchByGenes,
    isTableView: true,
  };

  constructor() {
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    } else {
      this.settings = JSON.parse(localStorage.getItem('settings'));
    }
  }

  setSettings(settingKey: string, value: any) {
    // TODO: change to enum type
    // eslint-disable-next-line no-prototype-builtins
    if (this.settings.hasOwnProperty(settingKey)) {
      this.settings[settingKey] = value;
    }

    this.settings = Object.assign({ [settingKey]: value }, this.settings);
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  getSettings() {
    return JSON.parse(localStorage.getItem('settings'));
  }
}
