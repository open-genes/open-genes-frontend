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
import { GenesFilterService } from '../../../core/services/filters/genes-filter.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/browser/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { ApiSearchParameters } from '../../../core/models/filters/filter.model';
import { Pagination, SearchMode, SearchModeEnum, Settings } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';
import { FavouritesService } from '../../../core/services/favourites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { ApiResponse } from '../../../core/models/api-response.model';
import { SearchModel } from '../../../core/models/open-genes-api/search.model';
import { SortEnum } from '../../../core/services/filters/filter-types.enum';
import { RouterParamsDecorator } from '../../../core/decorators/router-params.decorator';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@RouterParamsDecorator()
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
        this.resultingList = query as Genes[];
      } else {
        if (query.length > 1) {
          const length = (query as string).split(',').length;
          if (length > 1) {
            delete this.filterService.filters.bySuggestions; // TODO: don't delete but set default value
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

  public resultingList: Genes[] = [];
  public foundAndNotFoundGenes: Omit<SearchModel, 'items'>;
  public sortEnum = SortEnum;
  public searchMode: SearchMode;
  public isTableView: boolean;
  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public downloadJsonLink: string | SafeResourceUrl = '#';
  public currentPage: number;
  public pagination: Pagination;
  public isLoading = false;

  private cachedData: Genes[] = [];
  private querySubstrings: string[] = [];
  private retrievedSettings: Settings;
  private searchModeEnum = SearchModeEnum;
  private subscription$ = new Subject();
  private genesFromInput: Genes[];
  private genesPerPage = 20;
  private snackBarRef: MatSnackBarRef<SnackBarComponent>;

  constructor(
    public filterService: GenesFilterService,
    activatedRoute: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.favouritesService.getItems();
    this.setInitSettings();
    this.setInitialState();
  }

  ngOnDestroy(): void {
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

          if (this.filterService.filters.byGeneSymbol || this.filterService.filters.bySuggestions) {
            this.resetPagination();
            this.openSnackBar();
          }

          this.downloadSearch(this.resultingList);
          this.setFoundAndNotFound();

          this.pagination = res.options.pagination;
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
      this.filterService.onLoadMoreGenes(this.pagination.pagesTotal);
      return;
    }

    if (this.genesFromInput?.length >= this.genesPerPage) {
      this.currentPage++;
      const end = this.currentPage * this.genesPerPage;
      const start = end - this.genesPerPage;
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
  public clearFilters(filterName?: ApiSearchParameters): void {
    delete this.filterService.filters.bySuggestions;
    delete this.filterService.filters.byGeneSymbol;
    this.filterService.clearFilters(filterName ? filterName : null);
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

    if (sort.active !== this.sortEnum.byCriteriaQuantity) {
      if (!sort.active || sort.direction === '') {
        this.resultingList = this.cachedData;
        return;
      }
      this.resultingList = unSortedData.sort((a, b) => {
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
        length: this.resultingList ? this.resultingList.length : 0,
      },
      duration: 600,
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
