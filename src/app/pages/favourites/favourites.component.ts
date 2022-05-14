import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Genes } from 'src/app/core/models';
import { FavouritesService } from 'src/app/core/services/favourites.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { EMPTY, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favourites-page',
  templateUrl: './favourites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favouriteGenes: Genes[];
  public genes: Genes[];
  public error: number;
  public isSharedList = false;

  private favouriteGenesIds: number[] = [];
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private getData(): void {
    this.favouritesService
      .getItems()
      .pipe(
        switchMap((idList) => {
          if (idList) {
            this.favouriteGenesIds = idList;
            this.cdRef.markForCheck();

            return this.apiService.getGenesV2();
          }

          return EMPTY;
        }),
        takeUntil(this.subscription$)
      )
      .subscribe(
        (filteredGenes) => {
          this.genes = filteredGenes.items;
          const queryParamsId = this.route.snapshot.queryParams.selected;
          const queryParamsIdSplit = queryParamsId?.split(',');
          if (queryParamsId) {
            this.favouriteGenes = filteredGenes.items.filter((gene) => queryParamsIdSplit.includes(gene.id.toString()));
            this.isSharedList = true;
          } else {
            this.favouriteGenes = filteredGenes.items.filter((gene) => this.favouriteGenesIds.includes(gene.id));
          }
          this.cdRef.markForCheck();
        },
        (err) => {
          this.error = err;
        }
      );
  }
}
