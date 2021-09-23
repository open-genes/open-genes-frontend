import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GeneTableCardLogic } from '../../../../../core/utils/gene-table-card-logic';
import { FilterService } from '../../services/filter.service';
import { FavouritesService } from '../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    protected _snackBar: MatSnackBar,
    protected _cdRef: ChangeDetectorRef
  ) {
    super(_filterService, _favouritesService, _snackBar, _cdRef);
  }
}
