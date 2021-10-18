import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsEnum } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-toggle-search-mode',
  templateUrl: './toggle-search-mode.component.html',
  styleUrls: ['./toggle-search-mode.component.scss']
})
export class ToggleSearchModeComponent implements OnInit {
  public isGoTermsMode = false;
  private settingsKey = SettingsEnum;

  @Output() setMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.setMode.emit(this.isGoTermsMode);
    this.settingsService.setSettings(this.settingsKey.isGoSearchMode, this.isGoTermsMode);
  }

  public setGoSearchMode(): void {
    this.isGoTermsMode = !this.isGoTermsMode;
    this.setMode.emit(this.isGoTermsMode);
    this.settingsService.setSettings(this.settingsKey.isGoSearchMode, this.isGoTermsMode);
  }
}
