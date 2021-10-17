import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { GeneTableCardLogic } from '../../../../../core/utils/gene-table-card-logic';
import { FavouritesService } from '../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genes-table-header',
  templateUrl: './genes-table-header.component.html',
  styleUrls: ['./genes-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesTableHeaderComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef
  ) {
    super(_filterService, _favouritesService, _snackBar, cdRef);
  }
}
