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
import { EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Genes } from '../../../core/models';
import { GenesFilterService } from '../../../core/services/filters/genes-filter.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/browser/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { ApiGeneSearchParameters } from '../../../core/models/filters/filter.model';
import { SearchMode, SearchModeEnum, Settings } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';
import { FavouritesService } from '../../../core/services/favourites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { ApiResponse, PageOptions } from '../../../core/models/api-response.model';
import { SearchModel } from '../../../core/models/open-genes-api/search.model';
import { SortEnum } from '../../../core/services/filters/filter-types.enum';
import { appliedFilter } from './genes-list-settings.model';
import { Viewport } from '../../../core/utils/window-width';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesListComponent implements OnInit, OnDestroy {
  @Input() viewport: Viewport;
  @Input() cancelSearch: Observable<void>;
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
        this.resultingList = query as Genes[];
      } else {
        if (query.length > 1) {
          const length = (query as string).split(',').length;
          if (length > 1) {
            this.filterService.clearFilters('bySuggestions'); // TODO: don't delete but set default value
            this.querySubstrings = (query as string)
              .split(',')
              .map((query) => query.trim())
              .filter((q) => q);
            this.filterService.filters.byGeneSymbol = this.querySubstrings;
          } else {
            this.querySubstrings = [];
            delete this.filterService.filters.byGeneSymbol;
            this.filterService.filters.bySuggestions = query as string;
          }

          this.filterService.updateList(this.filterService.filters);
        } else {
          this.resultingList = [];
        }
      }

      if (this.resultingList.length) {
        this.openSnackBar();
      }

      this.isGoSearchPerformed = this.isGoTermsMode;
    } else {
      if (this.isGoTermsMode) {
        this.resultingList = [];
        this.isGoSearchPerformed = false;
        return;
      }
      this.querySubstrings = [];
      this.clearFilters();
    }

    this.downloadSearch(this.resultingList);
  }
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() errorStatus: EventEmitter<string> = new EventEmitter<string>();
  @Output() itemsNumber: EventEmitter<number> = new EventEmitter<number>();
  @Output() filterChanged: EventEmitter<appliedFilter> = new EventEmitter<appliedFilter>();

  public resultingList: Genes[] = [];
  public foundAndNotFoundGenes: Omit<SearchModel, 'items'>;
  public sortEnum = SortEnum;
  public searchMode: SearchMode;
  public isTableView: boolean;
  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public downloadJsonLink: string | SafeResourceUrl = '#';
  public currentPage: number;
  public options: PageOptions;
  public isLoading = false;

  private cancelSearchSubscription$: Subscription;
  private cachedData: Genes[] = [];
  private querySubstrings: string[] = [];
  private retrievedSettings: Settings;
  private searchModeEnum = SearchModeEnum;
  private subscription$ = new Subject();
  private genesFromInput: Genes[];
  private itemsPerPage = 20;
  private snackBarRef: MatSnackBarRef<SnackBarComponent>;
  private sortingOnFrontend = ['name'];

  constructor(
    public filterService: GenesFilterService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.viewport) {
      // 3 in a row vs 2 in a row
      this.itemsPerPage = this.viewport === 'widescreen' ? 21 : 20;
      this.filterService.pagination.pageSize = this.itemsPerPage;
    }
    this.activatedRoute?.queryParams
      .pipe(takeUntil(this.subscription$))
      .subscribe((params) => {
        if (Object.keys(params).length) {
          for (const key in params) {
            if (
              params[key] !==
              this.filterService.filters[key].toString()
            ) {
              this.filterService.applyFilter(
                key,
                params[key]
              );
            }
          }
        }
      });
    this.favouritesService.getItems();
    this.setInitSettings();
    this.setInitialState();

    this.cancelSearchSubscription$ = this.cancelSearch?.subscribe(() => {
      this.filterService.clearFilters();
      this.setInitialState();
    });
  }

  ngOnDestroy(): void {
    this.cancelSearchSubscription$?.unsubscribe();
    this.subscription$.unsubscribe();
    this.filterService.clearFilters();
  }

  private setInitSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.isTableView = this.retrievedSettings.isTableView;
  }

  /**
   * Get genes list
   */
  public setInitialState(): void {
    this.filterService.filterResult
      .pipe(
        takeUntil(this.subscription$),
        switchMap(() => {
          this.isLoading = !this.isGoTermsMode;
          this.loading.emit(!this.isGoTermsMode);
          this.isGoSearchPerformed = !this.isGoTermsMode;
          this.resultingList = [];

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
            this.resultingList = [...this.cachedData];
          }

          if (
            this.filterService.filters.byGeneSymbol?.length !== 0 ||
            this.filterService.filters.bySuggestions?.length !== 0
          ) {
            this.resetPagination();
          }

          this.downloadSearch(this.resultingList);
          this.setFoundAndNotFound();

          this.options = res.options;
          this.isLoading = false;
          this.loading.emit(false);
          this.itemsNumber.emit(res.options.objTotal);
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
      this.filterService.onLoadNextPage(this.options?.pagination?.pagesTotal);
      return;
    }

    if (this.genesFromInput?.length >= this.itemsPerPage) {
      this.currentPage++;
      const end = this.currentPage * this.itemsPerPage;
      const start = end - this.itemsPerPage;
      const nextPageData = this.genesFromInput.slice(start, end);
      this.resultingList.push(...nextPageData);
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
  public clearFilters(filterName?: ApiGeneSearchParameters): void {
    this.filterService.clearFilters(filterName);
    this.filterChanged.emit({ name: filterName, value: null });
    this.cdRef.markForCheck();
  }

  public resetPagination(): void {
    this.filterService.pagination.page = 1;
    this.currentPage = this.filterService.pagination.page;
  }

  /**
   * Sorting genes list
   */
  public sortBy(sort: Sort): void {
    const unSortedData = this.resultingList.slice();
    // TODO: remove sort on frontend
    // Some filters may still exist only on frontend
    if (this.sortingOnFrontend.includes(sort.active)) {
      if (!sort.active || sort.direction === '') {
        this.resultingList = this.cachedData;
        return;
      }
      this.resultingList = unSortedData.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case this.sortEnum.byName:
            return this.compare((a.symbol + a.name).toLowerCase(), (b.symbol + b.name).toLowerCase(), isAsc);
          default:
            return 0;
        }
      });
    } else {
      this.filterService.sortParams = sort;
      this.isLoading = true;
      this.resultingList = [];
      this.filterService.getSortedAndFilteredGenes().subscribe((sortedGenes) => {
        this.resultingList = sortedGenes.items;
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
  // private errorLogger(context: any, error: any) {
  //   console.warn(context, error);
  // }

  private openSnackBar(): void {
    this.snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.options ? this.options.objTotal : 0,
      },
      duration: 1200,
    });
  }

  private setFoundAndNotFound(): void {
    if (this.querySubstrings.length) {
      const notFoundGenes = [];
      let foundGenes = [];
      const uniqWords = [...new Set(this.querySubstrings)];
      if (uniqWords.length !== 0) {
        foundGenes = uniqWords.filter((symbol) => {
          const foundGene = this.resultingList.find((gene) => symbol === gene.symbol.toLowerCase());
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
}
