import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { Gene } from '../models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { FavouritesService } from '../services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filter } from '../models/filters/filter.model';

@Directive()
export abstract class GeneTableCardLogic implements OnInit, OnDestroy {
  @Input() item: Gene;

  public listSettings: GenesListSettings;
  public filters: Filter = this.filterService.filters;
  protected subscription$ = new Subject();

  protected constructor(
    protected filterService: FilterService,
    protected favouritesService: FavouritesService,
    protected snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCurrentFields();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  /**
   * Update list view on card or table
   */
  protected updateCurrentFields() {
    this.filterService.currentFields.pipe(takeUntil(this.subscription$)).subscribe(
      (fields) => {
        this.listSettings = fields;
        this.cdRef.markForCheck();
      },
      (error) => {
        console.warn(error);
        this.cdRef.markForCheck();
      }
    );
  }

  /**
   * get item id and send this to app-genes-list  (for filtering)
   */

  public applyFilter(filterType: string, filterValue: number | string): void {
    this.filterService.applyFilter(filterType, filterValue);
  }

  /**
   * add and delete from favourites
   */
  public favItem(geneId: number): void {
    if (!this.isFaved(geneId)) {
      this.favouritesService.addToFavourites(geneId);
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          title: 'favourites_added',
          length: '',
        },
        duration: 600,
      });
    }

    this.isFaved(geneId);
  }

  public unFavItem(geneId: number): void {
    if (this.isFaved(geneId)) {
      this.favouritesService.removeFromFavourites(geneId);
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          title: 'favourites_removed',
          length: '',
        },
        duration: 600,
      });
    }

    this.isFaved(geneId);
  }

  public isFaved(geneId: number): Observable<boolean> {
    return of(this.favouritesService.isInFavourites(geneId));
  }

  /**
   * Narrow type and check if age related process filter is active
   */
  public isAgeRelatedProcessActive(id: string): boolean {
    return this.filters.byAgeRelatedProcess.includes(Number(id));
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
