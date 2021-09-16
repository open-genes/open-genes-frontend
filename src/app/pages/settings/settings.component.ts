import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('settingsChanged') settingsChangedTmpl: ElementRef;

  constructor(private _settingsService: SettingsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.settings = this._settingsService.settings;
  }

  // TODO: use reactive forms when it is more fields
  onInterfaceHints(): void {
    this._settingsService.setSettings();

    this.snackBar.open(this.settingsChangedTmpl.nativeElement.textContent, '', {
      duration: 600,
    });
  }
}
