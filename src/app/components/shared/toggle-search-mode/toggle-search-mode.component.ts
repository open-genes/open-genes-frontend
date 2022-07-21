import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchMode, SearchModeEnum, Settings, SettingsEnum } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-toggle-search-mode',
  templateUrl: './toggle-search-mode.component.html',
  styleUrls: ['./toggle-search-mode.component.scss'],
})
export class ToggleSearchModeComponent implements OnInit {
  @Input() queryLength: number;
  @Input() isMobile: boolean;

  public searchMode: SearchMode;
  public searchModeEnum = SearchModeEnum;
  public toggleData = [
    {
      searchMode: SearchModeEnum.searchByGenes,
      toggleTitle: 'search_by_genes',
      icon: 'dna',
    },
    {
      searchMode: SearchModeEnum.searchByGoTerms,
      toggleTitle: 'search_by_annotations',
      icon: 'gene-ontology',
    },
  ];

  private retrievedSettings: Settings;
  private settingsKey = SettingsEnum;

  @Output() setMode: EventEmitter<SearchMode> = new EventEmitter<SearchMode>();

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.setInitSettings();
  }

  private setInitSettings(): void {
    this.searchMode = 'searchByGenes';
    this.retrievedSettings = this.settingsService.getSettings();
    if (
      (this.retrievedSettings.searchMode && this.retrievedSettings.searchMode == SearchModeEnum.searchByGenes) ||
      this.retrievedSettings.searchMode == SearchModeEnum.searchByGoTerms ||
      this.retrievedSettings.searchMode == SearchModeEnum.searchByGenesList
    ) {
      this.searchMode = this.retrievedSettings.searchMode;
    }
    this.setMode.emit(this.searchMode);
  }

  public setSearchMode(searchType: SearchMode): void {
    this.searchMode = searchType;
    this.setMode.emit(this.searchMode);
    this.settingsService.setSettings(this.settingsKey.searchMode, this.searchMode);
  }
}
