import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { GenesFilterService } from '../../../../../core/services/filters/genes-filter.service';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ApiGeneSearchFilter } from '../../../../../core/models/filters/filter.model';
import { SettingsService } from '../../../../../core/services/settings.service';
import { Settings, SettingsEnum } from '../../../../../core/models/settings.model';
import { CommonModalComponent } from '../../../../ui-components/components/modals/common-modal/common-modal.component';
import { SortEnum } from '../../../../../core/services/filters/filter-types.enum';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent implements OnChanges {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;

  @Output() sortItem: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filters: ApiGeneSearchFilter = this.filterService.filters;
  public sortEnum = SortEnum;
  public isClear$ = this.filterService.twoOrMoreFiltersApplied;

  private settingsKey = SettingsEnum;
  private retrievedSettings: Settings;

  constructor(
    private filterService: GenesFilterService,
    private settingsService: SettingsService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    if (!this.isMobile) {
      this.dialog.closeAll();
    }
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
      autoFocus: false,
    });
  }
}
