import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GeneTableCardLogic } from '../../../../../../core/utils/gene-table-card-logic';
import { FilterService } from '../../../services/filter.service';
import { FavouritesService } from '../../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gene-table-row',
  templateUrl: './gene-table-row.component.html',
  styleUrls: ['./gene-table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneTableRowComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected _cdRef: ChangeDetectorRef
  ) {
    super(_filterService, _favouritesService, _snackBar, _cdRef);
  }
}
