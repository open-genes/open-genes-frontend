import { Injectable } from '@angular/core';

const SETTINGS_KEY = 'showHeadersDescription';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public settings = {
    isHeadersDescription: false,
  };

  constructor() {
    const settings = this.getSettings();

    if (settings) {
      this.settings = settings;
    }
  }

  setSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  }

  getSettings() {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY));
  }
}
