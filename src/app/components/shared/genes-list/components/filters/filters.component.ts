import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Genes} from '../../../../../core/models';
import {FilterService} from '../../services/filter.service';
import {FilterTypesEnum} from '../../services/filter-types.enum';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FiltersComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  // @Input() Filters: Filter;
  @Input() dataSource: Genes[];
  @Input() isFilterPanel = true;
  @Input() searchedData: Genes[];

  // TODO: Заменить на сабджекты
  @Output() isLoading = new EventEmitter();
  @Output() filtersCleared = new EventEmitter();
  @Output() filterCluster = new EventEmitter<number[]>();
  @Output() filterExpression = new EventEmitter<number>();

  public filters = this.filterService.filters;
  public filterTypes = FilterTypesEnum;
  public isClearFiltersBtnShown = false;

  constructor(
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.areMoreThan2FiltersApplied();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Sorting
   */
  private reverse() {
    this.searchedData.reverse();
  }

  private sortByName() {
    this.searchedData.sort((a, b) => {
      const A = (a.symbol + a.name).toLowerCase();
      const B = (b.symbol + b.name).toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });
  }

  private sortByAge() {
    this.searchedData.sort((a, b) => {
      return a.origin.order - b.origin.order;
    });
  }

  sortBy(sortBy) { // TODO: use enum types here
    if (sortBy === 'name') {
      this.filters.byName ? this.reverse() : this.sortByName();
      this.filters.byName = !this.filters.byName;
      this.cdRef.markForCheck();
    } else {
      this.filters.byAge ? this.reverse() : this.sortByAge();
      this.filters.byAge = !this.filters.byAge;
      this.cdRef.markForCheck();
    }
  }

  /**
   * Filters
   */
  public filterByFuncClusters(id: number) {
    this.filterService.filterByFuncClusters(id);
    this.cdRef.markForCheck();
  }

  public filterByExpressionChange(id: number) {
    this.filterService.filterByExpressionChange(id);
    this.cdRef.markForCheck();
  }

  /**
   * Filter reset
   */
  public clearFilters(filter?: FilterTypesEnum) {
    this.filterService.clearFilters(filter);
    this.cdRef.markForCheck();
  }

  /**
   * Are filters applied
   */
  private areMoreThan2FiltersApplied() {
  this.filterService.areMoreThan2FiltersApplied().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(
        (areApplied) => {
          this.isClearFiltersBtnShown = areApplied.getValue();
          this.cdRef.markForCheck();
        }
      );
  }
}
