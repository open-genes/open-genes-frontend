import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { IFilter, IGene } from '../../core/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataSource: IGene[];
  // @Input() filters: IFilter;
  public filters: IFilter;
  @Output() filterCluster = new EventEmitter<number[]>();
  @Output() filterExpression = new EventEmitter<string>();
  @Output() filtersChanged = new EventEmitter<IFilter>();
  @Output() filtersCleared = new EventEmitter();
  searchedData: IGene[];
  genesPerPage = 30;
  loadedGenesQuantity = this.genesPerPage;
  loading = true;
  isSorted = {
    name: false,
    ageMya: false
  };
  asCards = true;
  private subscription$ = new Subject();
  public funcCluster: number[] = [];
  public expression: string;

  constructor() {
    this.filters = {
      name: false,
      ageMya: false,
      expression: null,
      cluster: []
    };
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    this.searchedData = this.dataSource;
    this.loading = false;
    if (changes.filters && changes.filters.currentValue) {
      // this.filters = changes.filters.currentValue;
    } else {

    }
  }

  getSearchedData(e: IGene[]) {
    this.searchedData = e;
  }

  geneView() {
    this.asCards = !this.asCards;
  }

  getGenes(sortBy) {
    if (sortBy === 'name') {
      this.isSorted.name ? this.reverse() : this.sortByName();
      this.isSorted.name = !this.isSorted.name;
      this.filters.name = !this.filters.name;
    } else {
      this.isSorted.ageMya ? this.reverse() : this.sortByAge();
      this.isSorted.ageMya = !this.isSorted.ageMya;
      this.filters.ageMya = !this.filters.ageMya;
    }
    this.filtersChanged.emit(this.filters);
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
      // this.funcCluster.push(id);
      this.filters.cluster.push(id);
    } else {
      // this.funcCluster = this.funcCluster.filter(item => item !== id);
      this.filters.cluster = this.filters.cluster.filter(item => item !== id);
    }
    this.expression = null;
    this.loading = true;
    // this.filters.cluster = [...this.funcCluster];
    console.log('filters', this.filters);
    // this.filterCluster.emit(this.funcCluster);
    this.filterCluster.emit(this.filters.cluster);
    this.filtersChanged.emit(this.filters);
  }

  filterByExpressionChange(expression: string) {
    if (this.filters.expression !== expression) {
      // this.expression = expression;
      this.filters.expression = expression;
    } else {
      // this.expression = null;
      this.filters.expression = null;
    }
    // this.funcCluster = [];
    this.filters.cluster = [];
    this.loading = true;
    this.filterExpression.emit(this.expression);
    this.filtersChanged.emit(this.filters);
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
