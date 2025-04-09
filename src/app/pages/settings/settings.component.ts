import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings, SettingsEnum } from '../../core/models/settings.model';
import { localesMap } from '../../core/maps/languages.map';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public retrievedSettings: Settings;
  private settingsKey = SettingsEnum;
  private successMessage = this.translate.getStreamOnTranslationChange('settings_settings_changed');
  public selectedLanguage: string;
  public locales = localesMap;
  private successMessageTranslation$ = new Subject<void>();

  constructor(
    private settingsService: SettingsService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.selectedLanguage = this.settingsService.getLanguage();
  }

  private showSuccessMessage(): void {
    this.translate.getStreamOnTranslationChange('settings_settings_changed')
      .pipe(takeUntil(this.successMessageTranslation$))
      .subscribe((msg) => {
      this.snackBar.open(msg, '', {
        duration: 600,
      });
    });
  }

  public toggleInterfaceHints(): void {
    this.retrievedSettings.showUiHints = !this.retrievedSettings.showUiHints;
    this.settingsService.setSettings(this.settingsKey.showUiHints, this.retrievedSettings.showUiHints);
    this.showSuccessMessage();
  }

  public changeLanguageSettings(language: string): void {
    this.settingsService.updateLanguage(language);
    this.selectedLanguage = this.settingsService.getLanguage();
    this.showSuccessMessage();
  }
}
