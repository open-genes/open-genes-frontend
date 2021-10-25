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
import { Subject } from 'rxjs';
import { ToMap } from '../../../core/utils/to-map';
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

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesListComponent extends ToMap implements OnInit, OnDestroy {
  @Input() isMobile: boolean;
  @Input() showFiltersPanel: boolean;

  @Input() set setSearchMode(value: SearchMode) {
    if (value) {
      this.isGoTermsMode = value === this.searchModeEnum.searchByGoTerms;
      this.isSearchByGenesList = value === this.searchModeEnum.searchByGenesList;
      this.isGoSearchPerformed = false;
      if (!this.isGoTermsMode) {
        this.updateGeneListOnSearch('');
      } else {
        this.searchGenesByGoTerm('');
      }
    }
  }

  @Input() set searchQuery(query: string) {
    if (this.isGoTermsMode) {
      this.searchGenesByGoTerm(query !== undefined && query !== '' ? query : '');
    } else if (this.isSearchByGenesList) {
      this.searchByGenesList(query !== undefined && query !== '' ? query : '');
    } else {
      this.updateGeneListOnSearch(query !== undefined && query !== '' ? query : '');
    }
  }

  @Input() genesList: Genes[];

  @Output() loaded = new EventEmitter<boolean>();

  public searchedData: Genes[] = [];
  public filterTypes = FilterTypesEnum;
  public sortEnum = SortEnum;
  public sort: Sort = this.filterService.sort;

  public isLoading = false;

  public isTableView: boolean;
  public isSearchByGenesList: boolean;
  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public isGoTermsModeError = false;


  public goModeCellData: any;
  public biologicalProcess: Map<any, any>;
  public cellularComponent: Map<any, any>;
  public molecularActivity: Map<any, any>;

  public downloadJsonLink: string | SafeResourceUrl = '#';
  public currentPage: number;
  public pageOptions: any;

  private retrievedSettings: Settings;
  private searchModeEnum = SearchModeEnum;
  private subscription$ = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private settingsService: SettingsService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
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
          return this.filterService.getFilteredGenes(filters);
        })
      )
      .subscribe(
        (filteredData) => {
          this.currentPage = this.filterService.filters.page
          if (this.currentPage == 1) {
            this.searchedData = [];
            this.searchedData.push(...filteredData.items);
          } else {
            this.searchedData.push(...filteredData.items);
          }
          this.downloadSearch(this.searchedData);
          this.pageOptions = filteredData.options.pagination;
          this.cdRef.markForCheck();
        },
        (error) => {
          console.log(error);
          this.cdRef.markForCheck();
        }
      );
    this.loaded.emit(true);
  }

  /**
   * Load next 20 genes
   */
  public loadMoreGenes(): void {
    this.filterService.onLoadMoreGenes(this.pageOptions.pagesTotal);
  }

  /**
   * Update already loaded and then filtered data on typing
   */
  public updateGeneListOnSearch(query: string): void {
    this.searchedData = this.genesList.filter((item) => {
      const searchedText = `${item.id} ${item?.ensembl ? item.ensembl : ''}
      ${item.symbol} ${item.name} ${item.aliases.join(' ')}`;
      return searchedText.toLowerCase().includes(query);
    });

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.searchedData.length ? this.searchedData.length : 0,
      },
      duration: 600,
    });
  }

  // TODO: this function isn't pure
  public searchGenesByGoTerm(query: string): void {
    this.isLoading = true;
    if (query) {
      this.apiService
        .getGoTermMatchByString(query)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (genes) => {
            this.searchedData = genes; // If nothing found, will return empty array
            this.downloadSearch(this.searchedData);
            this.isGoSearchPerformed = true;
            this.isLoading = false;

            // Map data if it's presented:
            for (const item of this.searchedData) {
              this.biologicalProcess = this.toMap(item.terms?.biological_process);
              this.cellularComponent = this.toMap(item.terms?.cellular_component);
              this.molecularActivity = this.toMap(item.terms?.molecular_activity);
            }

            const isAnyTermFound = this.biologicalProcess || this.cellularComponent || this.molecularActivity;
            this.isGoTermsModeError = !isAnyTermFound;

            this.goModeCellData = {
              biologicalProcess: this.biologicalProcess,
              cellularComponent: this.cellularComponent,
              molecularActivity: this.molecularActivity,
            };

            this.snackBar.openFromComponent(SnackBarComponent, {
              data: {
                title: 'items_found',
                length: this.searchedData ? this.searchedData.length : 0,
              },
              duration: 600,
            });

            this.cdRef.markForCheck();
          },
          (error) => this.errorLogger(this, error)
        );
    } else {
      this.isGoSearchPerformed = false;
      this.isLoading = false;
      this.cdRef.markForCheck();
    }
  }

  private searchByGenesList(query: string): void {
    if (query) {
      this.searchedData = [];
      const arrayOfWords = query
        .toLowerCase()
        .split(',')
        .map((res) => res.trim())
        .filter((res) => res);

      const uniqWords = [...new Set(arrayOfWords)];

      if (uniqWords.length !== 0) {
        uniqWords.forEach((symbol) => {
          const foundGene = this.genesList.find((gene) => symbol === gene.symbol.toLowerCase());
          if (foundGene) {
            this.searchedData.push(foundGene);
          }
        });
      }
    } else {
      this.searchedData = [...this.genesList];
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
    this.filterService.clearFilters(filterName ? filterName : null);
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
