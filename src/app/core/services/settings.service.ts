import { Injectable } from '@angular/core';
import { SearchModeEnum, Settings } from '../models/settings.model';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { Subject } from 'rxjs';

type AnyGenesListSettingKey = keyof GenesListSettings;

type GenesListSettingKeys = {
  [K in AnyGenesListSettingKey]: K;
}[AnyGenesListSettingKey];

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settings: Settings = {
    showUiHints: false,
    searchMode: SearchModeEnum.searchByGenes,
    isTableView: true,
    showCookieBanner: true,
  };

  public genesListSettings: GenesListSettings = {
    // Default:
    ifShowAge: true,
    ifShowDiseases: false,
    ifShowDiseaseCategories: false,
    ifShowCriteria: true,
    ifShowHallmarks: true,
    ifShowProteinClasses: true,
    ifShowExperimentsStats: false,
    ifShowTags: true,
  };

  public genesListSettings$: Subject<GenesListSettings> = new Subject<GenesListSettings>();

  constructor() {
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    } else {
      this.settings = JSON.parse(localStorage.getItem('settings'));
    }

    if (!localStorage.getItem('visibleFields')) {
      localStorage.setItem('visibleFields', JSON.stringify(this.genesListSettings));
    } else {
      this.genesListSettings = JSON.parse(localStorage.getItem('visibleFields'));
    }
  }

  public setSettings(settingKey: string, value: any): void {
    // TODO: change to enum type
    // eslint-disable-next-line no-prototype-builtins
    if (this.settings.hasOwnProperty(settingKey)) {
      this.settings[settingKey] = value;
    }

    this.settings = Object.assign({ [settingKey]: value }, this.settings);
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  public getSettings(): Settings {
    return JSON.parse(localStorage.getItem('settings'));
  }

  public setVisibleFields(fields: GenesListSettings): void {
    localStorage.setItem('visibleFields', JSON.stringify(fields));
  }

  public updateVisibleFields(fields: GenesListSettings): void {
    this.genesListSettings = fields;
    this.genesListSettings$.next(fields);
  }

  public updateVisibleField(field: GenesListSettingKeys, fieldValue): void {
    this.genesListSettings[field] = fieldValue;
    this.genesListSettings$.next(this.genesListSettings);
  }

  public getVisibleFields(): GenesListSettings {
    return JSON.parse(localStorage.getItem('visibleFields'));
  }
}
