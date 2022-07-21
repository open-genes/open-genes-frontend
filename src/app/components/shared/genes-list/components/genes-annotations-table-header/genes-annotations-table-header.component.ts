import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { GeneTableCardLogic } from '../../../../../core/utils/gene-table-card-logic';
import { FavouritesService } from '../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-genes-annotations-table-header',
  templateUrl: './genes-annotations-table-header.component.html',
  styleUrls: ['./genes-annotations-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesAnnotationsTableHeaderComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef
  ) {
    super(_filterService, _favouritesService, _snackBar, cdRef);
  }
}
