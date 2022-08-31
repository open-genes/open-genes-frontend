import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { CommonModalComponent } from '../../../../ui-components/components/modals/common-modal/common-modal.component';
import { SortEnum } from '../../../../../core/services/filters/filter-types.enum';
import { BehaviorSubject } from 'rxjs';
import { ApiGeneSearchFilter } from '../../../../../core/models/filters/filter.model';
import { GenesFilterService } from '../../../../../core/services/filters/genes-filter.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent implements OnChanges {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;
  @Input() twoOrMoreFiltersApplied: BehaviorSubject<boolean>;

  @Output() sortItem: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filters: ApiGeneSearchFilter = this.filterService.filters;
  public sortEnum = SortEnum;

  constructor(
    private filterService: GenesFilterService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(): void {
    if (!this.isMobile) {
      this.dialog.closeAll();
    }
  }

  /**
   * Emit event when resetting a filter
   */
  public clearFilters(filterName?: string) {
    this.clearFilterItem.emit(filterName);
    this.cdRef.detectChanges();
  }

  /**
   * Emit event when sorting
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
