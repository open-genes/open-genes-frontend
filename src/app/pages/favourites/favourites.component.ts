import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Genes } from 'src/app/core/models';
import { FavouritesService } from 'src/app/core/services/favourites.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { EMPTY, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favouriteGenes: Genes[];
  public genes: Genes[];
  public error: number;

  private favouriteGenesIds: number[] = [];
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly _cdRef: ChangeDetectorRef,
    private readonly _apiService: ApiService,
    private _favouritesService: FavouritesService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private getData(): void {
    this._favouritesService
      .getItems()
      .pipe(
        switchMap((idList) => {
          if (idList) {
            this.favouriteGenesIds = idList;
            this._cdRef.markForCheck();

            return this._apiService.getGenes();
          }

          return EMPTY;
        }),
        takeUntil(this.subscription$)
      )
      .subscribe(
        (genes) => {
          this.genes = genes;
          const queryParamsId = this.route.snapshot.queryParams.selected;
          const queryParamsIdSplit = queryParamsId?.split(',');
          if (queryParamsId) {
            this.favouriteGenes = genes.filter((gene) => queryParamsIdSplit.includes(gene.id.toString()));
          } else {
            this.favouriteGenes = genes.filter((gene) => this.favouriteGenesIds.includes(gene.id));
          }
          this._cdRef.markForCheck();
        },
        (err) => {
          this.error = err;
        }
      );
  }
}
