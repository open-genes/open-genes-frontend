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
import { Genes } from '../../../core/models';
import { FilterService } from './services/filter.service';
import { FilterTypesEnum, SortEnum } from './services/filter-types.enum';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Filter } from '../../../core/models/filters/filter.model';
import { SearchMode, SearchModeEnum, Settings } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';
import { FavouritesService } from '../../../core/services/favourites.service';
import { ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { ApiResponse } from '../../../core/models/api-response.model';
import { SearchModel } from '../../../core/models/open-genes-api/search.model';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesListComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean;
  @Input() showFiltersPanel: boolean;

  @Input() set setSearchMode(searchMode: SearchMode) {
    if (searchMode) {
      this.searchMode = searchMode;
      this.isGoTermsMode = searchMode === this.searchModeEnum.searchByGoTerms;
      this.snackBarRef?.dismiss();
      this.clearFilters();
    }
  }

  @Input() set genesList(query: Genes[] | string) {
    if (query) {
      if (this.isGoTermsMode) {
        this.searchedData = query as Genes[];
      } else {
        if (query.length > 2) {
          const length = (query as string).split(',').length;
          if (length > 1) {
            delete this.filterService.filters.bySuggestions;
            this.arrayOfWords = (query as string)
              .split(',')
              .map((query) => query.trim())
              .filter((q) => q);
            this.filterService.filters.byGeneSymbol = this.arrayOfWords;
          } else {
            this.arrayOfWords = [];
            delete this.filterService.filters.byGeneSymbol;
            this.filterService.filters.bySuggestions = query as string;
          }

          this.filterService.updateList(this.filterService.filters);
        } else {
          this.searchedData = [];
        }
      }

      if (this.searchedData.length) {
        this.openSnackBar();
      }

      this.isGoSearchPerformed = this.isGoTermsMode;
    } else {
      if (this.isGoTermsMode) {
        this.searchedData = [];
        this.isGoSearchPerformed = false;
        return;
      }
      this.arrayOfWords = [];
      this.clearFilters();
    }

    this.downloadSearch(this.searchedData);
  }

  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() errorStatus: EventEmitter<string> = new EventEmitter<string>();
  @Output() genesLength: EventEmitter<number> = new EventEmitter<number>();

  public searchedData: Genes[] = [];
  public foundAndNotFoundGenes: Omit<SearchModel, 'items'>;
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

  private cachedData: Genes[] = [];
  private arrayOfWords: string[] = [];
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
    private aRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.aRoute.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        for (const key in params) {
          if (params[key] !== this.filterService.filters[key].toString()) {
            this.filterService.applyFilter(key, params[key]);
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
          this.isLoading = !this.isGoTermsMode;
          this.loading.emit(!this.isGoTermsMode);
          this.isGoSearchPerformed = !this.isGoTermsMode;
          this.searchedData = [];

          return this.isGoTermsMode ? EMPTY : this.filterService.getSortedAndFilteredGenes();
        })
      )
      .subscribe(
        (res: ApiResponse<Genes>) => {
          this.currentPage = this.filterService.pagination.page;

          if (this.currentPage == 1) {
            this.cachedData = [];
          }
          if (res.items?.length) {
            this.cachedData.push(...res.items);
            this.searchedData = [...this.cachedData];
          }
          this.downloadSearch(this.searchedData);
          this.setFoundAndNotFound();

          this.pageOptions = res.options.pagination;
          this.isLoading = false;
          this.loading.emit(false);
          this.genesLength.emit(res.options.total);
          this.cdRef.markForCheck();
        },
        (error) => {
          console.warn(error);
          this.isLoading = false;
          this.loading.emit(false);
          this.errorStatus.emit(error.statusText);
          this.cdRef.markForCheck();
        }
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
    delete this.filterService.filters.bySuggestions;
    delete this.filterService.filters.byGeneSymbol;
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

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(context, error);
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

  private setFoundAndNotFound(): void {
    if (this.arrayOfWords.length) {
      const notFoundGenes = [];
      let foundGenes = [];

      const uniqWords = [...new Set(this.arrayOfWords)];

      if (uniqWords.length !== 0) {
        foundGenes = uniqWords.filter((symbol) => {
          const foundGene = this.searchedData.find((gene) => symbol === gene.symbol.toLowerCase());

          foundGene ? foundGenes.push(foundGene) : notFoundGenes.push(symbol);

          return !!foundGene;
        });
      }

      this.foundAndNotFoundGenes = {
        found: foundGenes,
        notFound: notFoundGenes,
      };
    } else {
      this.foundAndNotFoundGenes = {
        found: [],
        notFound: [],
      };
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
