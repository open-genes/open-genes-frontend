import { ChangeDetectorRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { Genes } from '../models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { FavouritesService } from '../services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filter } from '../../components/shared/genes-list/services/filter.model';

export abstract class GeneTableCardLogic implements OnInit, OnDestroy {
  @Input() item: Genes;
  @Input() isGoTermsMode: boolean;
  @Input() goModeCellData: {
    biologicalProcess: any;
    cellularComponent: any;
    molecularActivity: any;
  };

  @Output() expressionChangeId = new EventEmitter<number | string>();
  @Output() funcClusterId = new EventEmitter<number | string>();
  @Output() methylationChange = new EventEmitter<number | string>();
  @Output() diseaseName = new EventEmitter<number | string>();
  @Output() diseaseCategories = new EventEmitter<number | string>();
  @Output() selectionCriteria = new EventEmitter<number | string>();

  public listSettings: GenesListSettings;
  public filters: Filter = this._filterService.filters;

  protected subscription$ = new Subject();

  protected constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCurrentFields();
    this.updateSelectedFilter();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  /**
   * Update list view on card or table
   */

  protected updateCurrentFields() {
    this._filterService.currentFields
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe((fields) => {
        this.listSettings = fields;
        this._cdRef.markForCheck();
      },
      (error) => {
        console.log(error);
        this._cdRef.markForCheck();
      }
    );
  }
  protected updateSelectedFilter() {
    this._filterService.updateSelectedFilter.subscribe(() => {
      this._cdRef.markForCheck();
    })
  }

  /**
   * get item id and send this to app-genes-list  (for filtering)
   */

  public onExpressionChange(id: number) {
    this.expressionChangeId.emit(id);
  }

  public onFuncCluster(id: number) {
    this.funcClusterId.emit(id);
  }

  public onMethylationChange(correlation: string) {
    this.methylationChange.emit(correlation);
  }

  public onDisease(correlation: string) {
    this.diseaseName.emit(correlation);
  }
  public onDiseaseCategories(correlation: string) {
    this.diseaseCategories.emit(correlation);
  }
  public onSelectCriteria(correlation: string) {
    this.selectionCriteria.emit(correlation);
  }

  /**
   * add and delete from favourites
   */
  public favItem(geneId: number): void {
    this._favouritesService.addToFavourites(geneId);
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'favourites_added',
        length: '',
      },
      duration: 600,
    });
    this.isFaved(geneId);
  }

  public unFavItem(geneId: number): void {
    this._favouritesService.removeFromFavourites(geneId);
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'favourites_removed',
        length: '',
      },
      duration: 600,
    });
    this.isFaved(geneId);
  }

  public isFaved(geneId: number): Observable<boolean> {
    return of(this._favouritesService.isInFavourites(geneId));
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
}
