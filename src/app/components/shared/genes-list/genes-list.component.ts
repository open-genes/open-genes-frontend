import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Genes} from '../../../core/models';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {FilterService} from './services/filter.service';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

// (filterCluster)="filterByFuncClusters($event)"
// (filterExpression)="filterByExpressionChange($event)"
// (filtersCleared)="filtersCleared()"

export class GenesListComponent implements OnInit, OnDestroy {
  @Input() dataSource: Genes[];
  @Input() isFilterPanel = true;

  searchedData: Genes[];
  genesPerPage = 20;
  loadedGenesQuantity = this.genesPerPage;
  isLoading = true;
  asCards = true;

  public filters = this.filterService.filters;
  private subscription$ = new Subject();

  constructor(
    private filterService: FilterService,
    private snackBar: MatSnackBar,
    private favouritesService: FavouritesService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.favouritesService.getItems();
  }

  ngOnInit() {
    this.getSearchData();
  }

  getSearchData() {
    this.searchedData = this.dataSource;
    this.isLoading = false;
    this.cdRef.markForCheck();
  }

  updateSearchedData(event: Genes[]) {
    this.searchedData = event;
  }

  toggleGenesView() {
    this.asCards = !this.asCards;
  }

  public filterByFuncClusters(id: number) {
    console.log('click on class filter in gene card passed value to a service');
    this.filterService.filterByFuncClusters(id);
    this.cdRef.markForCheck();
  }

  public filterByExpressionChange(id: number) {
    console.log('click on expression filter in gene card passed value to a service');
    this.filterService.filterByExpressionChange(id);
    this.cdRef.markForCheck();
  }

  public loadMoreGenes() {
    if (this.searchedData.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

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

  public getExpressionLocaleKey(expression: number) {
    const expressionTranslations = new Map([
      [0, 'expression_change_no_data'],
      [1, 'expression_change_decreased'],
      [2, 'expression_change_increased'],
      [3, 'expression_change_mixed']
    ]);

    return expressionTranslations.get(expression);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
