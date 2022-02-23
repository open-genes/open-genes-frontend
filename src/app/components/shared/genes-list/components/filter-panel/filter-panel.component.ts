import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterTypesEnum, SortEnum } from '../../services/filter-types.enum';
import { FilterService } from '../../services/filter.service';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Filter } from '../../../../../core/models/filters/filter.model';
import { SettingsService } from '../../../../../core/services/settings.service';
import { Settings, SettingsEnum } from '../../../../../core/models/settings.model';
import { CommonModalComponent } from '../../../../ui-components/components/modals/common-modal/common-modal.component';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;

  @Output() sortItem: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filterTypes = FilterTypesEnum;
  public filters: Filter = this.filterService.filters;
  public sortEnum = SortEnum;
  public isClear$ = this.filterService.isClearFiltersBtnShown;

  private settingsKey = SettingsEnum;
  private retrievedSettings: Settings;

  constructor(
    private filterService: FilterService,
    private settingsService: SettingsService,
    private dialog: MatDialog,
  ) {
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
  public sortBy(event: Sort) {
    this.sortItem.emit(event);
  }

  /**
   * Opening modal for filters and fields settings
   */
  public openFiltersModal(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'filters-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }
}
