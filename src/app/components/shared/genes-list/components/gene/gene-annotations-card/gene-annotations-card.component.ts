import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FilterService } from '../../../services/filter.service';
import { FavouritesService } from '../../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneTableCardLogic } from '../../../../../../core/utils/gene-table-card-logic';

@Component({
  selector: 'app-gene-annotations-card',
  templateUrl: './gene-annotations-card.component.html',
  styleUrls: ['./gene-annotations-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneAnnotationsCardComponent extends GeneTableCardLogic {
  constructor(
    protected _filterService: FilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected _cdRef: ChangeDetectorRef,
  ) {
    super(_filterService, _favouritesService, _snackBar, _cdRef);
  }
}

