import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Filter, Genes} from '../../../../../core/models';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})

export class FiltersComponent implements OnInit, OnDestroy {
  // @Input() Filters: Filter;
  @Input() dataSource: Genes[];
  @Input() isFilterPanel = true;
  searchedData: Genes[];

  // TODO: Заменить на сабджекты
  @Output() isLoading = new EventEmitter();
  @Output() filtersCleared = new EventEmitter();
  @Output() filterCluster = new EventEmitter<number[]>();
  @Output() filterExpression = new EventEmitter<number>();

  public filters = this.filterService.filters;

  constructor(
    private filterService: FilterService,
  ) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  /**
   * Sorting
   */
  private reverse() {
    this.searchedData.reverse();
  }

  private sortByName() {
    this.filters.byName ? this.reverse() : this.searchedData.sort((a, b) => {
      const A = (a.symbol + a.name).toLowerCase();
      const B = (b.symbol + b.name).toLowerCase();

      this.filters.byName = !this.filters.byName;

      return A > B ? 1 : A < B ? -1 : 0;
    });
  }

  private sortByAge() {
    this.filters.byAge ? this.reverse() : this.searchedData.sort((a, b) => {

      this.filters.byAge = !this.filters.byAge;

      return a.origin.order - b.origin.order;
    });
  }

  public sortBy(sortBy: string) {
    if (sortBy === 'name') { // TODO: remove strings comparison
      this.sortByName();

    } else {
      this.sortByAge();
    }
  }

  /**
   * Filters
   */
  public filterByFuncClusters(id: number) {
    this.filterService.filterByFuncClusters(id);
  }

  public filterByExpressionChange(id: number) {
    this.filterService.filterByExpressionChange(id);
  }

  /**
   * Filter reset
   */
  public clearFilters(filter: string) {
    this.filterService.clearFilters(filter);
  }
}
