import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings, SettingsEnum } from '../../core/models/settings.model';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public retrievedSettings: Settings;
  private settingsKey = SettingsEnum;
  @ViewChild('settingsChanged') settingsChangedTmpl: ElementRef;

  constructor(private settingsService: SettingsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.retrievedSettings = this.settingsService.getSettings();
  }

  public toggleInterfaceHints(): void {
    this.retrievedSettings.showUiHints = !this.retrievedSettings.showUiHints;
    this.settingsService.setSettings(this.settingsKey.showUiHints, this.retrievedSettings.showUiHints);
    this.snackBar.open(this.settingsChangedTmpl.nativeElement.textContent, '', {
      duration: 600,
    });
  }
}
