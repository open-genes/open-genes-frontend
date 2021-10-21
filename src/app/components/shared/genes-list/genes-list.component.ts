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
import { FilterTypesEnum } from './services/filter-types.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Filter } from './services/filter.model';
import { SettingsService } from '../../../core/services/settings.service';
import { Settings } from '../../../core/models/settings.model';

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
  public genesPerPage = 20;
  public loadedGenesQuantity = this.genesPerPage;

  public isTableView: boolean;
  public filters: Filter = this.filterService.filters;
  public filterTypes = FilterTypesEnum;

  public isGoTermsMode: boolean;
  public isGoSearchPerformed: boolean;
  public isGoTermsModeError = false;
  public isLoading = false;
  public goModeCellData: any;
  public biologicalProcess: Map<any, any>;
  public cellularComponent: Map<any, any>;
  public molecularActivity: Map<any, any>;

  public downloadJsonLink: string | SafeResourceUrl = '#';

  private subscription$ = new Subject();
  private retrievedSettings: Settings;

  constructor(
    private readonly apiService: ApiService,
    private settingsService: SettingsService,
    private filterService: FilterService,
    private fileExportService: FileExportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    super();
    this.setInitialSettings();
  }

  ngOnInit(): void {
    if (!this.isGoTermsMode) {
      this.setInitialState();
    }
    this.loaded.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  /**
   * HTTP
   */
  private setInitialState(): void {
    this.searchedData = [...this.genesList];
    this.downloadSearch(this.searchedData);
    this.loaded.emit(true);
    this.cdRef.markForCheck();
  }

  private setInitialSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.isTableView = this.retrievedSettings.isTableView;
    this.isGoTermsMode = this.retrievedSettings.isGoSearchMode;
  }

  public filterByFuncClusters(id: number): void {
    this.filterService.filterByFuncClusters(id);
    this.filterService
      .getByFuncClusters()
      .pipe(
        switchMap((list) => {
          if (list.length !== 0) {
            return this.apiService.getGenesByFunctionalClusters(list);
          }
        }),
        takeUntil(this.subscription$),
      )
      .subscribe(
        (genes) => {
          this.searchedData = genes;
          this.downloadSearch(this.searchedData);
          this.cdRef.markForCheck();
        },
        (error) => this.errorLogger(this, error)
      );
  }

  public filterByExpressionChange(id: number): void {
    this.filterService.filterByExpressionChange(id);
    this.filterService
      .getByExpressionChange()
      .pipe(
        switchMap((expression) => {
          if (expression) {
            return this.apiService.getGenesByExpressionChange(expression);
          }
        }),
        takeUntil(this.subscription$),
      )
      .subscribe(
        (genes) => {
          this.searchedData = genes;
          this.downloadSearch(this.searchedData);
          this.cdRef.markForCheck();
        },
        (error) => this.errorLogger(this, error)
      );
  }

  public filterBySelectionCriteria(id: string): void {
    this.filterService.filterBySelectionCriteria(id);
    // TODO: DRY
    if (id) {
      const check = [];
      this.searchedData = this.searchedData.filter((gene) => {
        for (const [key, value] of Object.entries(gene.commentCause)) {
          if (id === key) {
            check.push(id);
          }
          if (check.length !== 0) {
            return id === key;
          }
        }
      });
    }
    this.downloadSearch(this.searchedData);
    this.cdRef.markForCheck();
  }

  public filterByMethylationChange(correlation: string): void {
    this.filterService.filterByMethylationChange(correlation);
    if (name) {
      const check = [];
      this.searchedData = this.searchedData.filter((gene) => {
        Object.values(gene.methylationCorrelation).forEach((item) => {
          if (correlation === item) {
            check.push(correlation);
          }
          if (check.length !== 0) {
            return correlation === item;
          }
        });
      });
    }
    this.downloadSearch(this.searchedData);
    this.cdRef.markForCheck();
  }

  public filterByDisease(name: string): void {
    this.filterService.filterByDisease(name);
    if (name) {
      const check = [];
      this.searchedData = this.searchedData.filter((gene) => {
        for (const [key, value] of Object.entries(gene.diseases)) {
          if (name === String(value['name'])) {
            check.push(name);
          }
          if (check.length !== 0) {
            return name === String(value['name']);
          }
        }
      });
    }
    this.downloadSearch(this.searchedData);
    this.cdRef.markForCheck();
  }

  public filterByDiseaseCategories(category: string): void {
    this.filterService.filterByDiseaseCategories(category);
    if (category) {
      this.searchedData = this.searchedData.filter((gene) => {
        for (const [key, value] of Object.entries(gene.diseaseCategories)) {
          return category === key;
        }
      });
    }
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

  public loadMoreGenes(): void {
    if (this.searchedData?.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
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
   * View
   */
  public toggleGenesView(evt: boolean) {
    this.isTableView = evt;
  }

  /**
   * List for download
   */
  private downloadSearch(data: any) {
    this.downloadJsonLink = this.fileExportService.downloadJson(data);
  }

  /**
   * Filter reset
   */
  public clearFilters(filter?: FilterTypesEnum): void {
    this.filterService.clearFilters(filter ? filter : null);
    this.setInitialState();
  }

  /**
   * Sorting
   */
  public sortBy(evt: string): void {
    // TODO: use enum types here
    if (evt === this.filterTypes.name) {
      if (this.filters.byName) {
        this.reverse();
      } else {
        this.sortByName();
      }
      this.filters.byName = !this.filters.byName;
    } else {
      if (this.filters.byAge) {
        this.reverse();
      } else {
        this.sortByAge();
      }
      this.filters.byAge = !this.filters.byAge;
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
