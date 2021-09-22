import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FavouritesService } from '../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneTableCardLogic } from '../../../../../core/utils/gene-table-card-logic';

@Component({
  selector: 'app-genes-card',
  templateUrl: './genes-card.component.html',
  styleUrls: ['./genes-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesCardComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar
  ) {
    super(_filterService, _favouritesService, _snackBar);
  }
}
