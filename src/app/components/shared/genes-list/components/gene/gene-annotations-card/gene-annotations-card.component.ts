import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { GenesFilterService } from '../../../services/genes-filter.service';
import { FavouritesService } from '../../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneTableCardLogic } from '../../../../../../core/utils/gene-table-card-logic';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gene-annotations-card',
  templateUrl: './gene-annotations-card.component.html',
  styleUrls: ['./gene-annotations-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneAnnotationsCardComponent extends GeneTableCardLogic {
  @Input() isAdded: Observable<boolean>;
  @Output() unFav: EventEmitter<number> = new EventEmitter();
  @Output() fav: EventEmitter<number> = new EventEmitter();
  isAddToFavoritesShown: boolean;

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

