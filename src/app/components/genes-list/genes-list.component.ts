import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';

import { IFilter, Genes } from '../../core/models';
import { GenesListService } from './genes-list.service';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss']
})
export class GenesListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataSource: Genes[];
  @Output() filterCluster = new EventEmitter<number[]>();
  @Output() filterExpression = new EventEmitter<string>();
  @Output() filtersCleared = new EventEmitter();
  searchedData: Genes[];
  genesPerPage = 30;
  loadedGenesQuantity = this.genesPerPage;
  isLoading = true;
  asCards = true;
  private subscription$ = new Subject();
  public filters: IFilter;

  constructor(private readonly genesListService: GenesListService) {
    this.filters = {
      name: false,
      ageMya: false,
      expression: null,
      cluster: []
    };
    this.genesListService.register(this);
  }

  ngOnInit() {}

  ngOnChanges() {
    this.searchedData = this.dataSource;
    this.isLoading = false;
  }

  getSearchedData(e: Genes[]) {
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
    this.isLoading = true;
    this.filterCluster.emit(this.filters.cluster);
  }

  filterByExpressionChange(expression: string) {
    if (this.filters.expression !== expression) {
      this.filters.expression = expression;
    } else {
      this.filters.expression = null;
    }
    this.filters.cluster = [];
    this.isLoading = true;
    this.filterExpression.emit(this.filters.expression);
  }

  /**
   * Сброс фильтров
   */
  clearFilters(filter: string) {
    if (filter === 'all') {
      this.filters = {
        name: false,
        ageMya: false,
        expression: null,
        cluster: []
      };
      this.filtersCleared.emit();
    } else if (filter === 'name') {
      this.filters.name = false;
      this.filtersCleared.emit();
    } else if (filter === 'ageMya') {
      this.filters.ageMya = false;
      this.filtersCleared.emit();
    } else if (filter === 'expression') {
      this.filters.expression = null;
      this.filtersCleared.emit();
    } else if (filter === 'cluster') {
      this.filters.cluster = [];
      this.filtersCleared.emit();
    }
  }
}
