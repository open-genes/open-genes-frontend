import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterTypesEnum, SortEnum } from '../../services/filter-types.enum';
import { FilterService } from '../../services/filter.service';
import { GeneFieldsModalComponent } from '../gene-fields-modal/gene-fields-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Filter, Sort } from '../../services/filter.model';
import { SettingsService } from '../../../../../core/services/settings.service';
import { Settings, SettingsEnum } from '../../../../../core/models/settings.model';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent implements OnInit {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;
  @Input() downloadJsonLink: string | SafeResourceUrl = '#';

  @Output() tableView: EventEmitter<boolean> = new EventEmitter();
  @Output() sortItem: EventEmitter<string> = new EventEmitter();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filterTypes = FilterTypesEnum;
  public filters: Filter = this.filterService.filters;
  public sortEnum = SortEnum;
  public sort: Sort = this.filterService.sort;

  public isTableView: boolean;
  public isClear$ = this.filterService.isClearFiltersBtnShown;

  private settingsKey = SettingsEnum;
  private retrievedSettings: Settings;

  constructor(
    private filterService: FilterService,
    private settingsService: SettingsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setInitSettings();
  }

  private setInitSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.isTableView = this.retrievedSettings.isTableView;
  }

  /**
   * Send clear filter item
   */
  public clearFilters(filterName?: string) {
    this.clearFilterItem.emit(filterName);
  }

  /**
   * Send sort item
   */
  public sortBy(name: string) {
    this.sortItem.emit(name);
  }

  /**
   * Change view
   */
  public toggleGenesView() {
    this.isTableView = !this.isTableView;
    this.settingsService.setSettings(this.settingsKey.isTableView, this.isTableView);
    this.tableView.emit(this.isTableView);
  }

  /**
   * Opening modal for list view settings
   */
  public openFiltersModal(): void {
    this.dialog.open(GeneFieldsModalComponent, {
      panelClass: 'filters-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }
}
