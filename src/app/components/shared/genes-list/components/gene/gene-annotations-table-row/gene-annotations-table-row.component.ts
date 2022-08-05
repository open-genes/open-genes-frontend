import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneTableCardLogic } from '../../../../../../core/utils/gene-table-card-logic';
import { GenesFilterService } from '../../../../../../core/services/filters/genes-filter.service';
import { FavouritesService } from '../../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gene-annotations-table-row',
  templateUrl: './gene-annotations-table-row.component.html',
  styleUrls: ['./gene-annotations-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneAnnotationsTableRowComponent extends GeneTableCardLogic {
  @Input() isAdded: Observable<boolean>;
  @Output() unFav: EventEmitter<number> = new EventEmitter();
  @Output() fav: EventEmitter<number> = new EventEmitter();

  constructor(
    protected _filterService: GenesFilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef
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
