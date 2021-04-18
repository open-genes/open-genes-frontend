import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Genes } from "src/app/core/models/API/genes.model";
import { FavouritesService } from "src/app/core/services/favourites.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../core/services/api/open-genes.api.service";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-favourites",
  templateUrl: "./favourites.component.html",
  providers: [FavouritesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favouriteGenesIds: number[] = [];
  public genes: Genes[];
  public error: number;
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.getGenes();
  }

  public unFavItem(geneId: number): void {
    this.favouritesService.removeFromFavourites(geneId);
    this.favouriteGenesIds = this.favouritesService.favourites;
    this.cdRef.markForCheck();
  }

  public clearFavs(): void {
    this.favouritesService.clearFavourites();
    this.favouriteGenesIds = this.favouritesService.favourites;
    this.cdRef.markForCheck();
  }

  private getGenes(): void {
    this.favouritesService.getItems()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
      (genes) => {
        if (genes) {
          this.favouriteGenesIds = genes;
        }
        this.cdRef.markForCheck();
      },
      () => {
        this.favouriteGenesIds = [];
      }
    );

    this.apiService.getGenes()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
      (genes) => {
        this.genes = genes;
        this.cdRef.markForCheck();
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
