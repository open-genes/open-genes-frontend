import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
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
export class FilterPanelComponent {
  @Input() isMobile: boolean;
  @Input() isGoTermsMode: boolean;
  @Input() twoOrMoreFiltersApplied: BehaviorSubject<boolean>;

  @Output() sortItem: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() clearFilterItem: EventEmitter<any> = new EventEmitter();

  public filters: ApiGeneSearchFilter = this.filterService.filters;
  public sortParams: Sort = this.filterService.sortParams;
  public sortEnum = SortEnum;

  constructor(
    private filterService: GenesFilterService,
    private cdRef: ChangeDetectorRef,
  ) {
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
}
