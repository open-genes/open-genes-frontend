import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneTableCardLogic } from '../../../../../../core/utils/gene-table-card-logic';
import { GenesFilterService } from '../../../services/genes-filter.service';
import { FavouritesService } from '../../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gene-table-row',
  templateUrl: './gene-table-row.component.html',
  styleUrls: ['./gene-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneTableRowComponent extends GeneTableCardLogic {
  @Input() isAdded: Observable<boolean>;
  @Output() unFav: EventEmitter<number> = new EventEmitter();
  @Output() fav: EventEmitter<number> = new EventEmitter();

  constructor(
    protected _filterService: GenesFilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef,
  ) {
    super(_filterService, _favouritesService, _snackBar, cdRef);
  }

  unFavItem(id: number): void {
    this.unFav.emit(id);
  }

  favItem(id: number): void {
    this.fav.emit(id);
  }
}
