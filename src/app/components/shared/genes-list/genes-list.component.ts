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
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Genes} from '../../../core/models';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {FilterService} from './services/filter.service';
import {takeUntil} from 'rxjs/operators';
import {FilterTypesEnum} from './services/filter-types.enum';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../../core/services/api.service';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GenesListComponent implements OnInit, OnDestroy {
  @Input() dataSource: Genes[];
  @Input() isFilterPanel = true;
  @Input() isGoTermsMode = false;
  @Output() updateGenesList = new EventEmitter();

  private ngUnsubscribe = new Subject();
  public filters = this.filterService.filters;
  public filterTypes = FilterTypesEnum;
  public isClearFiltersBtnShown = false;

  searchedData: Genes[];
  genesPerPage = 20;
  loadedGenesQuantity = this.genesPerPage;
  isLoading = true;
  asTableRow = true;

  constructor(
    private readonly apiService: ApiService,
    private translate: TranslateService,
    private filterService: FilterService,
    private snackBar: MatSnackBar,
    private favouritesService: FavouritesService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    this.favouritesService.getItems();
  }

  ngOnInit() {
    this.areMoreThan2FiltersApplied();
    this.getSearchData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * HTTP
   */
  getSearchData() {
    this.searchedData = this.dataSource;
    this.isLoading = false;
    this.cdRef.markForCheck();
  }

  public filterByFuncClusters(id: number) {
    console.log('updateGenesByFuncClusters called');
    this.filterService.filterByFuncClusters(id);
    this.filterService.getByFuncClusters().subscribe((list) => {
      if (list.length !== 0) {
        this.apiService.getGenesByFunctionalClusters(list).subscribe((genes) => {
          this.searchedData = genes;
          this.cdRef.markForCheck();
        }, error => this.errorLogger(this, error));
      }
    }, error => this.errorLogger(this, error));
  }

  public filterByExpressionChange(id: number) {
    console.log('updateGenesByExpressionChange called');
    this.filterService.filterByExpressionChange(id);
    this.filterService.getByExpressionChange().subscribe((expression) => {
      if (expression) {
        this.apiService.getGenesByExpressionChange(expression).subscribe(genes => {
          this.searchedData = genes;
          this.cdRef.markForCheck();
        }, error => this.errorLogger(this, error));
      }
    }, error => this.errorLogger(this, error));
  }

  /**
   * Update and load
   */

  updateSearchedData(event: Genes[]) {
    this.searchedData = event;
  }

  loadMoreGenes() {
    if (this.searchedData.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

  /**
   * View
   */
  toggleGenesView() {
    return this.asTableRow = !this.asTableRow;
  }

  /**
   * Favorites
   */
  public favItem(geneId: number) {
    this.favouritesService.addToFavourites(geneId);
    this.snackBar.open('Добавлено в Избранное!', '', {
      duration: 600
    });
    this.isFaved(geneId);
  }

  public unFavItem(geneId: number) {
    this.favouritesService.removeFromFavourites(geneId);
    this.snackBar.open('Убрано из Избранного!', '', {
      duration: 600
    });
    this.isFaved(geneId);
  }

  public isFaved(geneId: number) {
    return this.favouritesService.isInFavourites(geneId);
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
   * Filters translations
   */
  public getExpressionLocaleKey(expression: number) {
    const expressionTranslations = new Map([
      [0, 'expression_change_no_data'],
      [1, 'expression_change_decreased'],
      [2, 'expression_change_increased'],
      [3, 'expression_change_mixed']
    ]);

    return expressionTranslations.get(expression);
  }

  /**
   * Filter reset
   */
  public clearFilters(filter?: FilterTypesEnum) {
    this.filterService.clearFilters(filter);
    this.searchedData = this.dataSource;
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

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(error);
  }
}
