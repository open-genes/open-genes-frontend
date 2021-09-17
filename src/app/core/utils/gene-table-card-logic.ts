import { EventEmitter, Input, Output } from '@angular/core';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { Genes } from '../models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { FavouritesService } from '../services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { Observable, of } from 'rxjs';

export abstract class GeneTableCardLogic {
  @Input() listSettings: GenesListSettings;
  @Input() isGoTermsMode: boolean;
  @Input() item: Genes;
  @Input() goModeCellData: {
    biologicalProcess: any;
    cellularComponent: any;
    molecularActivity: any;
  };

  @Output() expressionChangeId = new EventEmitter<number>();
  @Output() funcClusterId = new EventEmitter<number>();
  @Output() methylationChange = new EventEmitter<string>();

  public filters = this._filterService.filters;

  protected constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar
  ) {}

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
