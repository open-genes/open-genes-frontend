import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { Genes } from '../../../core/models';
import { FilterService } from './services/filter.service';
import { FilterTypesEnum, SortEnum } from './services/filter-types.enum';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Filter } from './services/filter.model';
import { SearchMode, SearchModeEnum, Settings } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';
import { FavouritesService } from '../../../core/services/favourites.service';
import { ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';

interface FoundGenes {
  foundGenes: string[];
  notFoundGenes: string[];
}

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesListComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean;
  @Input() showFiltersPanel: boolean;
  @Input() notFoundAndFoundGenes: FoundGenes;

  @Input() set setSearchMode(searchMode: SearchMode) {
    if (searchMode) {
      this.searchMode = searchMode;
      this.isGoTermsMode = searchMode === this.searchModeEnum.searchByGoTerms;
      this.snackBarRef?.dismiss();
      this.clearFilters();
    }
  }

  @Input() set genesList(genes: Genes[]) {
    if (genes) {
      if (genes.length) {
        if (genes.length > this.genesPerPage) {
          this.currentPage = 1;
          this.genesFromInput = genes;
          this.searchedData = genes.slice(0, this.genesPerPage);
        } else {
          this.searchedData = genes;
        }
        this.isGoSearchPerformed = this.isGoTermsMode;
        this.openSnackBar();
      } else {
        this.clearFilters();
      }
    }

    if (genes === null) {
      this.searchedData = [];
      this.isGoSearchPerformed = this.isGoTermsMode;
    }
    this.downloadSearch(this.searchedData);
  }

  public searchedData: Genes[] = [];
  public filterTypes = FilterTypesEnum;
  public sortEnum = SortEnum;
  public searchMode: SearchMode;
  public isTableView: boolean;
  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public downloadJsonLink: string | SafeResourceUrl = '#';
  public currentPage: number;
  public pageOptions: any;
  public isLoading = false;
  @Output() loading = new EventEmitter<boolean>();

  private cachedData: Genes[] = [];
  private retrievedSettings: Settings;
  private searchModeEnum = SearchModeEnum;
  private subscription$ = new Subject();
  private genesFromInput: Genes[];
  private genesPerPage = 20;
  private snackBarRef: MatSnackBarRef<SnackBarComponent>;

  constructor(
    private filterService: FilterService,
    private settingsService: SettingsService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private aRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.aRoute.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        for (const key in params) {
          if (params[key] !== this.filterService.filters[key].toString()) {
            this.filterService.onApplyFilter(key, params[key]);
          }
        }
      }
    });

    this.favouritesService.getItems();
    this.setInitSettings();
    this.setInitialState();
  }

  private setInitSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.isTableView = this.retrievedSettings.isTableView;
  }

  /**
   * Get genes list
   */
  setInitialState(): void {
    this.filterService.filterResult
      .pipe(
        takeUntil(this.subscription$),
        switchMap((filters: Filter) => {
          if (this.isGoTermsMode) {
            this.isLoading = false;
            this.loading.emit(false);
          } else {
            this.isLoading = true;
            this.loading.emit(true);
          }
          this.searchedData = [];
          this.isGoSearchPerformed = !this.isGoTermsMode;
          return this.isGoTermsMode ? EMPTY : this.filterService.getSortedAndFilteredGenes();
        }),
      )
      .subscribe(
        (filteredData) => {
          // TODO: add an interface for the whole response
          this.currentPage = this.filterService.pagination.page;
          if (this.currentPage == 1) {
            this.cachedData = [];
            this.cachedData.push(...filteredData.items);
            this.searchedData = [...this.cachedData];
          } else {
            this.cachedData.push(...filteredData.items);
            this.searchedData = [...this.cachedData];
          }
          this.downloadSearch(this.searchedData);
          this.pageOptions = filteredData.options.pagination;
          this.isLoading = false;
          this.loading.emit(false);
          this.cdRef.markForCheck();
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.loading.emit(false);
          this.cdRef.markForCheck();
        },
      );
  }

  /**
   * Load next 20 genes
   */
  public loadMoreGenes(): void {
    if (!this.isGoTermsMode) {
      this.filterService.onLoadMoreGenes(this.pageOptions.pagesTotal);
      return;
    }

    if (this.genesFromInput?.length >= this.genesPerPage) {
      this.currentPage++;
      const end = this.currentPage * this.genesPerPage;
      const start = end - this.genesPerPage;
      const nextPageData = this.genesFromInput.slice(start, end);
      this.searchedData.push(...nextPageData);
    }
  }

  private openSnackBar(): void {
    this.snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.searchedData ? this.searchedData.length : 0,
      },
      duration: 600,
    });
  }

  /**
   * Change view
   */
  public toggleGenesView(event: boolean) {
    this.isTableView = event;
  }

  /**
   * Set genes list for download (JSON or CSV file)
   */
  private downloadSearch(data: any) {
    this.downloadJsonLink = this.fileExportService.downloadJson(data);
  }

  /**
   * Filter reset
   */
  public clearFilters(filterName?: string): void {
    this.filterService.clearFilters(filterName ? filterName : null);
  }

  /**
   * Sorting genes list
   */
  public sortBy(sort: Sort): void {
    const unSortedData = this.searchedData.slice();

    if (sort.active !== this.sortEnum.byCriteriaQuantity) {
      if (!sort.active || sort.direction === '') {
        this.searchedData = this.cachedData;
        return;
      }
      this.searchedData = unSortedData.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case this.sortEnum.byName:
            return this.compare((a.symbol + a.name).toLowerCase(), (b.symbol + b.name).toLowerCase(), isAsc);
          case this.sortEnum.byAge:
            return this.compare(a.familyOrigin?.order, b.familyOrigin?.order, isAsc);
          default:
            return 0;
        }
      });
    } else {
      this.filterService.sortParams = sort;
      this.isLoading = true;
      this.searchedData = [];
      this.filterService
        .getSortedAndFilteredGenes()
        .subscribe((sortedGenes) => {
          this.searchedData = sortedGenes.items;
          this.isLoading = false;
          this.cdRef.markForCheck();
        });
    }


  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(context, error);
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  public isFaved(geneId: number): Observable<boolean> {
    return of(this.favouritesService.isInFavourites(geneId));
  }

  public favItem(geneId: number): void {
    this.favouritesService.addToFavourites(geneId);
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'favourites_added',
        length: '',
      },
      duration: 600,
    });
    this.isFaved(geneId);
  }

  public unFavItem(geneId: number): void {
    this.favouritesService.removeFromFavourites(geneId);
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'favourites_removed',
        length: '',
      },
      duration: 600,
    });
    this.isFaved(geneId);
  }
}
