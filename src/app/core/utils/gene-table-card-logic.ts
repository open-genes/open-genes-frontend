import {
  ChangeDetectorRef,
  Directive, EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
} from '@angular/core';
import { appliedFilter, GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { Genes } from '../models';
import { GenesFilterService } from '../services/filters/genes-filter.service';
import { FavouritesService } from '../services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiGeneSearchFilter } from '../models/filters/filter.model';

@Directive()
export abstract class GeneTableCardLogic
  implements OnInit, OnDestroy {
  @Input() item: Genes;
  @Output() filterChanged: EventEmitter<appliedFilter> = new EventEmitter<appliedFilter>();

  public listSettings: GenesListSettings;
  public filters: ApiGeneSearchFilter = this.filterService
    .filters;
  protected subscription$ = new Subject();

  protected constructor(
    protected filterService: GenesFilterService,
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
    this.filterService.currentFields
      .pipe(takeUntil(this.subscription$))
      .subscribe(
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
    this.filterChanged.emit({ name: filterType, value: filterValue });
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
    return of(
      this.favouritesService.isInFavourites(geneId)
    );
  }

  /**
   * Narrow type and check if age related process filter is active
   */
  public isAgeRelatedProcessActive(id: string): boolean {
    return this.filters.byAgeRelatedProcess.includes(
      Number(id)
    );
  }

  /**
   * Filters translations
   */
  public getExpressionLocaleKey(
    expression: number
  ): string {
    const expressionTranslations = new Map([
      [0, 'expression_change_no_data'],
      [1, 'expression_change_decreased'],
      [2, 'expression_change_increased'],
      [3, 'expression_change_mixed'],
    ]);

    return expressionTranslations.get(expression);
  }
}
