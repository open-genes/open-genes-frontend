import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { Genes } from '../../../core/models';
import { FilterService } from './services/filter.service';
import { FilterTypesEnum, SortEnum } from './services/filter-types.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Filter, Sort } from './services/filter.model';
import { SearchMode, SearchModeEnum, Settings } from '../../../core/models/settings.model';
import { SettingsService } from '../../../core/services/settings.service';
import { FavouritesService } from '../../../core/services/favourites.service';
import { ActivatedRoute, Router } from '@angular/router';

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
      this.isGoSearchPerformed = false;
      this.isGoTermsMode = searchMode === this.searchModeEnum.searchByGoTerms;
      if (!this.isGoTermsMode) {
        debugger;
        this.clearFilters();
      }
    }
  }

  @Input() set genesList(genes: Genes[]) {
    if (this.isGoTermsMode) {
      this.searchedData = genes;
      this.isGoSearchPerformed = true;
      return;
    }

    if (genes) {
      if (genes.length) {
        this.searchedData = genes;
        this.openSnackBar();
      } else {
        this.clearFilters();
      }
    }

    this.downloadSearch(this.searchedData);
  }

  public searchedData: Genes[] = [];
  public filterTypes = FilterTypesEnum;
  public sortEnum = SortEnum;
  public sort: Sort = this.filterService.sort;

  public isLoading = false;

  public isTableView: boolean;
  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public isGoTermsModeError = false;

  public downloadJsonLink: string | SafeResourceUrl = '#';
  public currentPage: number;
  public pageOptions: any;

  private cachedData: Genes[] = [];
  private retrievedSettings: Settings;
  private searchModeEnum = SearchModeEnum;
  private subscription$ = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private settingsService: SettingsService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private aRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aRoute.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        for (const key in params) {
          this.filterService.filters[key] = params[key];
        }
      } else {
        this.setInitialState();
      }
    });
    this.favouritesService.getItems();
    this.setInitSettings();
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
          debugger;
          this.searchedData = [];
          this.isLoading = true;
          return this.filterService.getFilteredGenes(filters);
        })
      )
      .subscribe(
        (filteredData) => {
          this.currentPage = this.filterService.pagination.page;
          if (this.currentPage == 1) {
            this.cachedData = [];
            this.cachedData.push(...filteredData.items);
            this.searchedData = [...this.cachedData];
          } else {
            this.cachedData.push(...filteredData.items);
            this.searchedData = [...this.cachedData];
          }
          this.openSnackBar();
          this.downloadSearch(this.searchedData);
          this.pageOptions = filteredData.options.pagination;
          this.isLoading = false;
          this.cdRef.markForCheck();
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.cdRef.markForCheck();
        }
      );
  }

  /**
   * Load next 20 genes
   */
  public loadMoreGenes(): void {
    this.filterService.onLoadMoreGenes(this.pageOptions.pagesTotal);
  }

  private openSnackBar(): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
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
  public clearFilters(filterName?: string, updateQueryParams?: boolean): void {
    this.filterService.clearFilters(filterName ? filterName : null, updateQueryParams);
  }

  /**
   * Sorting genes list
   */
  public sortBy(evt: string): void {
    // TODO: use enum types here
    if (evt === this.sortEnum.name) {
      if (this.sort.byName) {
        this.reverse();
      } else {
        this.sortByName();
      }
      this.sort.byName = !this.sort.byName;
    } else {
      if (this.sort.byAge) {
        this.reverse();
      } else {
        this.sortByAge();
      }
      this.sort.byAge = !this.sort.byAge;
    }
    this.cdRef.markForCheck();
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
    this.searchedData.sort((a, b) => a.familyOrigin?.order - b.familyOrigin?.order);
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
}
