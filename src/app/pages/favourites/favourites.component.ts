import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Genes } from "src/app/core/models/genes.model";
import { FavouritesService } from "src/app/core/services/favourites.service";
import { TranslateService } from "@ngx-translate/core";
import { ApiService } from "../../core/services/api/open-genes.api.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-favourites",
  templateUrl: "./favourites.component.html",
  providers: [FavouritesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  private favouritesSubscription$: Subscription;
  private genesSubscription$: Subscription;
  public favouriteGenesIds: any;
  public genes: Genes[];
  error: number;

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

  private getGenes() {
    this.favouritesSubscription$ = this.favouritesService.getItems().subscribe(
      () => {
        this.favouriteGenesIds = this.favouritesService.favourites;
        this.cdRef.markForCheck();
      },
      () => {
        this.favouriteGenesIds = [];
      }
    );

    this.genesSubscription$ = this.apiService.getGenes().subscribe(
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
    this.favouritesSubscription$.unsubscribe();
    this.genesSubscription$.unsubscribe();
  }
}
