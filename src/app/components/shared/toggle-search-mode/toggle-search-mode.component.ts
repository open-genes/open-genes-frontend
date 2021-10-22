import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchMode, SearchModeEnum, Settings, SettingsEnum } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-toggle-search-mode',
  templateUrl: './toggle-search-mode.component.html',
  styleUrls: ['./toggle-search-mode.component.scss'],
})
export class ToggleSearchModeComponent implements OnInit {
  public searchMode: SearchMode;
  public toggleData = [
    {
      searchMode: SearchModeEnum.searchByGenes,
      toggleTitle: 'search_for_genes',
      description: 'search_for_genes_desc',
    },
    {
      searchMode: SearchModeEnum.searchByGoTerms,
      toggleTitle: 'search_for_go_terms',
      description: 'search_for_go_terms_desc',
    },
    {
      searchMode: SearchModeEnum.searchByGenesList,
      toggleTitle: 'Поиск генов по списку генов',
      description: 'Поиск генов по списку генов',
    },
  ]

  private retrievedSettings: Settings;
  private settingsKey = SettingsEnum;

  @Input() notFoundAndFoundGenes;

  @Output() setMode: EventEmitter<SearchMode> = new EventEmitter<SearchMode>();

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.setInitSettings();
  }

  private setInitSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.searchMode = this.retrievedSettings.searchMode;
    this.setMode.emit(this.searchMode);
  }

  public setSearchMode(searchType: SearchMode): void {
    this.searchMode = searchType;
    this.setMode.emit(this.searchMode);
    this.settingsService.setSettings(this.settingsKey.searchMode, this.searchMode);
  }

}
