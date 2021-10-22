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
import { FilteredGenes, Genes } from '../../../core/models';
import { FilterService } from './services/filter.service';
import { FilterTypesEnum, SortEnum } from './services/filter-types.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Filter, Sort } from './services/filter.model';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesListComponent extends ToMap implements OnInit, OnDestroy {
  @Input() isMobile: boolean;
  @Input() showFiltersPanel: boolean;

  @Input() set dataFromSearchBar(value) {
    if (value) {
      const { isGoSearchMode, searchQuery } = value;
      this.isGoTermsMode = isGoSearchMode;
      this.isGoSearchPerformed = false;
      if (!isGoSearchMode) {
        this.updateGeneListOnSearch(searchQuery);
      } else {
        this.searchGenesByGoTerm(searchQuery);
      }
    }
  }

  @Input() genesList: Genes[];

  @Output() loaded = new EventEmitter<boolean>();

  public searchedData: Genes[];
  public filterTypes = FilterTypesEnum;
  public sortEnum = SortEnum;
  public sort: Sort = this.filterService.sort;

  public asTableRow = true;
  public isLoading = false;

  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public isGoTermsModeError = false;
  public goModeCellData: any;
  public biologicalProcess: Map<any, any>;
  public cellularComponent: Map<any, any>;
  public molecularActivity: Map<any, any>;

  public downloadJsonLink: string | SafeResourceUrl = '#';
  public currentPage = this.filterService.filters.page;
  public pagesTotal: number;
  private subscription$ = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.setInitialState();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  /**
   * Get genes list
   */
  setInitialState(): void {
    debugger;
    this.filterService.filterResult
      .pipe(
        takeUntil(this.subscription$),
        switchMap((filters: Filter) => {
          return this.filterService.getFilteredGenes(filters);
        })
      )
      .subscribe(
        (filteredData) => {
          this.searchedData.push(...filteredData.items);
          this.downloadSearch(this.searchedData);
          this.pagesTotal = filteredData.options.pagination.pagesTotal;
          this.loaded.emit(true);

          this.cdRef.markForCheck();
        },
        (error) => {
          console.log(error);
          this.loaded.emit(true);

          this.cdRef.markForCheck();
        }
      );
    this.loaded.emit(true);
  }

  /**
   * Load next 20 genes
   */
  public loadMoreGenes(): void {
    this.filterService.onLoadMoreGenes(this.pagesTotal);
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

  /**
   * Change view
   */
  public toggleGenesView(evt: boolean) {
    this.asTableRow = evt;
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
}
