import { Component, OnChanges, OnInit } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';

interface Settings {
  isHeadersDescription: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})

export class SettingsComponent implements OnInit {
  public settings: Settings;

  constructor(private _settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settings = this._settingsService.settings;
  }

  onInterfaceHints(): void {
    this._settingsService.setSettings();
  }
}
