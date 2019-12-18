import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';

import { IFilter, IGene } from '../../core/models';
import { TableService } from './table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataSource: IGene[];
  @Output() filterCluster = new EventEmitter<number[]>();
  @Output() filterExpression = new EventEmitter<string>();
  @Output() filtersCleared = new EventEmitter();
  searchedData: IGene[];
  genesPerPage = 30;
  loadedGenesQuantity = this.genesPerPage;
  loading = true;
  asCards = true;
  private subscription$ = new Subject();
  public filters: IFilter;

  constructor(private readonly tableService: TableService) {
    this.filters = {
      name: false,
      ageMya: false,
      expression: null,
      cluster: []
    };
    this.tableService.register(this);
  }

  ngOnInit() {}

  ngOnChanges() {
    this.searchedData = this.dataSource;
    this.loading = false;
  }

  getSearchedData(e: IGene[]) {
    this.searchedData = e;
  }

  geneView() {
    this.asCards = !this.asCards;
  }

  getGenes(sortBy) {
    if (sortBy === 'name') {
      this.filters.name ? this.reverse() : this.sortByName();
      this.filters.name = !this.filters.name;
    } else {
      this.filters.ageMya ? this.reverse() : this.sortByAge();
      this.filters.ageMya = !this.filters.ageMya;
    }
  }

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
      return a.ageMya - b.ageMya;
    });
  }

  public loadMoreGenes() {
    if (this.searchedData.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  filterByFuncClusters(id: number) {
    if (!this.filters.cluster.includes(id)) {
      this.filters.cluster.push(id);
    } else {
      this.filters.cluster = this.filters.cluster.filter(item => item !== id);
    }
    this.loading = true;
    this.filterCluster.emit(this.filters.cluster);
  }

  filterByExpressionChange(expression: string) {
    if (this.filters.expression !== expression) {
      this.filters.expression = expression;
    } else {
      this.filters.expression = null;
    }
    this.filters.cluster = [];
    this.loading = true;
    this.filterExpression.emit(this.filters.expression);
  }

  /**
   * Сброс фильтров
   */
  clearFilters() {
    this.filters = {
      name: false,
      ageMya: false,
      expression: null,
      cluster: []
    };
    this.filtersCleared.emit();
  }
}
