import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { FavouritesService } from '../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneTableCardLogic } from '../../../../../core/utils/gene-table-card-logic';

@Component({
  selector: 'app-genes-table-row',
  templateUrl: './genes-table-row.component.html',
  styleUrls: ['./genes-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesTableRowComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar
  ) {
    super(_filterService, _favouritesService, _snackBar);
  }
}
