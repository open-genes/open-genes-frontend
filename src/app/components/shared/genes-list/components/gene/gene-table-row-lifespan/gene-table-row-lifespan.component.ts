import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GeneTableCardLogic } from '../../../../../../core/utils/gene-table-card-logic';
import { GenesFilterService } from '../../../services/genes-filter.service';
import { FavouritesService } from '../../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gene-table-row-lifespan',
  templateUrl: './gene-table-row-lifespan.component.html',
  styleUrls: ['./gene-table-row-lifespan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneTableRowLifespanComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: GenesFilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef
  ) {
    super(_filterService, _favouritesService, _snackBar, cdRef);
  }
}
