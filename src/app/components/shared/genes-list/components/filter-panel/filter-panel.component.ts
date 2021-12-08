import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterTypesEnum, SortEnum } from '../../services/filter-types.enum';
import { FilterService } from '../../services/filter.service';
import { GeneFieldsModalComponent } from '../gene-fields-modal/gene-fields-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Filter, Sort } from '../../services/filter.model';
import { SettingsService } from '../../../../../core/services/settings.service';
import { Settings, SettingsEnum } from '../../../../../core/models/settings.model';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;

  @Output() sortItem: EventEmitter<string> = new EventEmitter();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filterTypes = FilterTypesEnum;
  public filters: Filter = this.filterService.filters;
  public sortEnum = SortEnum;
  public sort: Sort = this.filterService.sort;
  public isClear$ = this.filterService.isClearFiltersBtnShown;

  private settingsKey = SettingsEnum;
  private retrievedSettings: Settings;

  constructor(
    private filterService: FilterService,
    private settingsService: SettingsService,
    private dialog: MatDialog
  ) {}

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
   * Opening modal for filters and fields settings
   */
  public openFiltersModal(): void {
    this.dialog.open(GeneFieldsModalComponent, {
      panelClass: 'filters-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }
}
