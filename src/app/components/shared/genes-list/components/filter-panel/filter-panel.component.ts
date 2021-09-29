import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterTypesEnum } from '../../services/filter-types.enum';
import { FilterService } from '../../services/filter.service';
import { FieldsForShowComponent } from '../fields-for-show/fields-for-show.component';
import { MatDialog } from '@angular/material';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Filter } from '../../services/filter.model';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;
  @Input() downloadJsonLink: string | SafeResourceUrl = '#';

  @Output() tableView: EventEmitter<boolean> = new EventEmitter();
  @Output() sortItem: EventEmitter<string> = new EventEmitter();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filterTypes = FilterTypesEnum;
  public filters: Filter = this._filterService.filters;
  public isTableView = true;
  public isClear$ = this._filterService.isClearFiltersBtnShown;

  constructor(
    private _filterService: FilterService,
    private _dialog: MatDialog
  ) {}

  /**
   * Send clear filter item
   */
  public clearFilters(item?: any) {
    this.clearFilterItem.emit(item);
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
    this.tableView.emit(this.isTableView);
  }

  /**
   * Opening modal for list view settings
   */
  public openFiltersModal(): void {
    this._dialog.open(FieldsForShowComponent, {
      panelClass: 'filters-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }
}
