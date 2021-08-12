import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { of, Observable, ReplaySubject } from 'rxjs';
import { PageClass } from '../../../pages/page.class';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { Genes } from '../../../core/models';
import { FavouritesService } from 'src/app/core/services/favourites.service';
import { FilterService } from './services/filter.service';
import { FilterTypesEnum } from './services/filter-types.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenesListSettings } from './genes-list-settings.model';

@Component({
  selector: 'app-genes-list',
  templateUrl: './genes-list.component.html',
  styleUrls: ['./genes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesListComponent extends PageClass implements OnInit, OnDestroy {
  @Input() dataSource: Genes[];
  @Input() isFilterPanel = true;
  @Input() isGoSearchPerformed: boolean;
  @Output() updateGenesList = new EventEmitter();
  @Output() passQuery: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  listSettingsChanged: EventEmitter<GenesListSettings> = new EventEmitter();
  @ViewChild('templateAddedToFavorites') templateAddedToFavorites: ElementRef;
  @ViewChild('templateRemovedFromFavorites')
  templateRemovedFromFavorites: ElementRef;
  @ViewChild('searchResultsFound') searchResultsFound: ElementRef;

  public searchedData: Genes[];
  public genesPerPage = 20;
  public loadedGenesQuantity = this.genesPerPage;

  public isLoading = true;
  public asTableRow = true;
  public filters = this.filterService.filters;
  public filterTypes = FilterTypesEnum;
  public isClearFiltersBtnShown = false;

  public isGoTermsMode = false;
  public isGoTermsModeError = false;
  public biologicalProcess: Map<any, any>;
  public cellularComponent: Map<any, any>;
  public molecularActivity: Map<any, any>;

  @Input() isMobile: boolean;
  public isSettingsMenu = false;
  public listSettings: GenesListSettings = {
    // Default:
    ifShowAge: true,
    ifShowClasses: false,
    ifShowExpression: false,
    ifShowDiseases: true,
    ifShowCriteria: true,
  };

  private subscription$ = new ReplaySubject(1);

  constructor(
    private readonly apiService: ApiService,
    private translate: TranslateService,
    private filterService: FilterService,
    private snackBar: MatSnackBar,
    private favouritesService: FavouritesService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
    this.favouritesService.getItems();
  }

  ngOnInit(): void {
    this.areMoreThan2FiltersApplied();
    this.showPassedData();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  /**
   * HTTP
   */
  showPassedData(): void {
    this.searchedData = this.dataSource;
    this.isLoading = false;
    this.cdRef.markForCheck();
  }

  public filterByFuncClusters(id: number): void {
    this.filterService.filterByFuncClusters(id);
    this.filterService.getByFuncClusters().subscribe(
      (list) => {
        if (list.length !== 0) {
          this.apiService
            .getGenesByFunctionalClusters(list)
            .pipe(takeUntil(this.subscription$))
            .subscribe(
              (genes) => {
                this.searchedData = genes;
                this.cdRef.markForCheck();
              },
              (error) => this.errorLogger(this, error)
            );
        }
      },
      (error) => this.errorLogger(this, error)
    );
  }

  public filterByExpressionChange(id: number): void {
    this.filterService.filterByExpressionChange(id);
    this.filterService
      .getByExpressionChange()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (expression) => {
          if (expression) {
            this.apiService.getGenesByExpressionChange(expression).subscribe(
              (genes) => {
                this.searchedData = genes;
                this.cdRef.markForCheck();
              },
              (error) => this.errorLogger(this, error)
            );
          }
        },
        (error) => this.errorLogger(this, error)
      );
  }

  /**
   * Update already loaded and then filtered data on typing
   */
  public updateGeneListOnTyping(event: Genes[]): void {
    if (!this.isGoTermsMode) {
      this.searchedData = event;

      this.snackBar.open(
        `${this.searchResultsFound.nativeElement.textContent} ${this.searchedData.length}`,
        '',
        {
          duration: 600,
        }
      );
    }
  }

  public loadMoreGenes(): void {
    if (this.searchedData.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

  /**
   * Search genes by GO term string match
   */
  public setGoSearchMode(event: boolean): void {
    this.isGoTermsMode = event;
  }

  // TODO: this function isn't pure

  public searchGenesByGoTerm(query: string): void {
    if (query) {
      const request = query.toLowerCase();
      this.apiService
        .getGoTermMatchByString(request)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (genes) => {
            this.searchedData = genes; // If nothing found, will return empty array
            this.isGoSearchPerformed = true;

            // Map data if it's presented:
            for (const item of this.searchedData) {
              this.biologicalProcess = this.toMap(
                item.terms?.biological_process
              );
              this.cellularComponent = this.toMap(
                item.terms?.cellular_component
              );
              this.molecularActivity = this.toMap(
                item.terms?.molecular_activity
              );
            }

            const isAnyTermFound =
              this.biologicalProcess ||
              this.cellularComponent ||
              this.molecularActivity;
            this.isGoTermsModeError = !isAnyTermFound;

            this.snackBar.open(
              `${this.searchResultsFound.nativeElement.textContent} ${this.searchedData.length}`,
              '',
              {
                duration: 600,
              }
            );

            this.cdRef.markForCheck();
          },
          (error) => this.errorLogger(this, error)
        );
    } else {
      this.isGoSearchPerformed = false;
      this.cdRef.markForCheck();
    }
  }

  /**
   * View
   */
  toggleGenesView(): boolean {
    return (this.asTableRow = !this.asTableRow);
  }
  toggleSettingsMenu(): boolean {
    return (this.isSettingsMenu = !this.isSettingsMenu);
  }

  /**
   * Favorites
   */
  public favItem(geneId: number): void {
    this.favouritesService.addToFavourites(geneId);
    this.snackBar.open(
      this.templateAddedToFavorites.nativeElement.textContent,
      '',
      {
        duration: 600,
      }
    );
    this.isFaved(geneId);
    this.cdRef.markForCheck();
  }

  public unFavItem(geneId: number): void {
    this.favouritesService.removeFromFavourites(geneId);
    this.snackBar.open(
      this.templateRemovedFromFavorites.nativeElement.textContent,
      '',
      {
        duration: 600,
      }
    );
    this.isFaved(geneId);
    this.cdRef.markForCheck();
  }

  favOnEvent(event: number): void {
    this.favItem(event);
  }

  unFavOnEvent(event: number): void {
    this.unFavItem(event);
  }

  public isFaved(geneId: number): Observable<boolean> {
    return of(this.favouritesService.isInFavourites(geneId));
  }

  /**
   * List view settings
   */
  // TODO: Refactor this method
  changeGenesListSettings(parameter: string): void {
    switch (parameter) {
      case 'gene-age':
        this.listSettings.ifShowAge = !this.listSettings.ifShowAge;
        break;
      case 'classes':
        this.listSettings.ifShowClasses = !this.listSettings.ifShowClasses;
        break;
      case 'expression':
        this.listSettings.ifShowExpression = !this.listSettings
          .ifShowExpression;
        break;
      case 'diseases':
        this.listSettings.ifShowDiseases = !this.listSettings.ifShowDiseases;
        break;
      case 'criteria':
        this.listSettings.ifShowCriteria = !this.listSettings.ifShowCriteria;
        break;
      default:
        break;
    }

    this.listSettingsChanged.emit(this.listSettings);
  }

  /**
   * Filters translations
   */
  public getExpressionLocaleKey(expression: number): string {
    const expressionTranslations = new Map([
      [0, 'expression_change_no_data'],
      [1, 'expression_change_decreased'],
      [2, 'expression_change_increased'],
      [3, 'expression_change_mixed'],
    ]);

    return expressionTranslations.get(expression);
  }

  /**
   * Filter reset
   */
  public clearFilters(filter?: FilterTypesEnum): void {
    this.filterService.clearFilters(filter);
    this.searchedData = this.dataSource;
    this.cdRef.markForCheck();
  }

  passQueryUpper($event: string): void {
    this.passQuery.emit($event);
  }

  /**
   * Sorting
   */
  sortBy(sortBy: string): void {
    // TODO: use enum types here
    if (sortBy === 'name') {
      if (this.filters.byName) {
        this.reverse();
      } else {
        this.sortByName();
      }
      this.filters.byName = !this.filters.byName;
      this.cdRef.markForCheck();
    } else {
      if (this.filters.byAge) {
        this.reverse();
      } else {
        this.sortByAge();
      }
      this.filters.byAge = !this.filters.byAge;
      this.cdRef.markForCheck();
    }
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
    this.searchedData.sort((a, b) => a.origin.order - b.origin.order);
  }

  /**
   * Are filters applied
   */
  private areMoreThan2FiltersApplied() {
    this.filterService
      .areMoreThan2FiltersApplied()
      .pipe(takeUntil(this.subscription$))
      .subscribe((areApplied) => {
        this.isClearFiltersBtnShown = areApplied.getValue();
        this.cdRef.markForCheck();
      });
  }

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(context, error);
  }
}
