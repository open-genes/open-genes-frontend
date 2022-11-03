import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FavouritesService } from 'src/app/core/services/favourites.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { EMPTY, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Symbols } from '../../core/models';

@Component({
  selector: 'app-favourites-page',
  templateUrl: './favourites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favouriteGenes: Symbols[];
  public genes: Symbols[];
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
            return this.apiService.getSymbols();
          }

          return EMPTY;
        }),
        takeUntil(this.subscription$)
      )
      .subscribe(
        (res) => {
          if (res?.length > 0) {
            this.genes = res;
            const queryParamsId = this.route.snapshot.queryParams.selected;
            const queryParamsIdSplit = queryParamsId?.split(',');
            if (queryParamsIdSplit) {
              this.favouriteGenes = res.filter((g) => queryParamsIdSplit.includes(g.id.toString()));
              this.isSharedList = true;
            } else {
              this.favouriteGenes = res.filter((g) => this.favouriteGenesIds.includes(g.id));
            }
            this.cdRef.markForCheck();
          }
        },
        (err) => {
          this.error = err;
          this.favouriteGenes = [];
        }
      );
  }
}
