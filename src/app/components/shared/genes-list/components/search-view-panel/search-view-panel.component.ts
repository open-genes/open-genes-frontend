import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SettingsService } from '../../../../../core/services/settings.service';
import { Settings, SettingsEnum } from '../../../../../core/models/settings.model';

@Component({
  selector: 'app-search-view-panel',
  templateUrl: './search-view-panel.component.html',
  styleUrls: ['./search-view-panel.component.scss'],
})
export class SearchViewPanelComponent implements OnInit {
  public isTableView: boolean;
  private settingsKey = SettingsEnum;
  private retrievedSettings: Settings;

  @Input() isMobile: boolean;
  @Input() downloadJsonLink: string | SafeResourceUrl = '#';
  @Output() tableView: EventEmitter<boolean> = new EventEmitter();

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.setInitSettings();
  }

  private setInitSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.isTableView = this.retrievedSettings.isTableView;
  }

  public toggleGenesView() {
    this.isTableView = !this.isTableView;
    this.settingsService.setSettings(this.settingsKey.isTableView, this.isTableView);
    this.tableView.emit(this.isTableView);
  }
}
