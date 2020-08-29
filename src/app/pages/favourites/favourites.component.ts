import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, } from '@angular/core';
import {Genes} from 'src/app/core/models/genes.model';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [FavouritesService],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  ) {
  }

  public unFavItem(geneId: number) {
    this.favouritesService.removeFromFavourites(geneId);
    this.cdRef.markForCheck();
    return this.favouriteGenesIds;
  }

  public clearFavs() {
    this.favouritesService.clearFavourites();
    this.cdRef.markForCheck();
    return this.favouriteGenesIds;
  }

  ngOnInit() {
    this.getGenes();
  }

  private getGenes() {
    this.favouritesSubscription$ = this.favouritesService.getItems().subscribe((genes) => {
      this.favouriteGenesIds = this.favouritesService.favourites;
      this.cdRef.markForCheck();
    }, error => this.favouriteGenesIds = []);

    this.genesSubscription$ = this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
      this.cdRef.markForCheck();
    }, error => this.error = error);
  }

  ngOnDestroy(): void {
    this.favouritesSubscription$.unsubscribe();
    this.genesSubscription$.unsubscribe();
  }
}
