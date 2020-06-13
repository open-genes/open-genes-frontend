import {Component, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {Genes} from 'src/app/core/models/genes.model';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [FavouritesService]
})

export class FavouritesComponent implements OnInit, OnChanges, OnDestroy {

  private favouritesSubscription$: Subscription;
  private genesSubscription$: Subscription;
  public favouriteGenesIds: any;
  public genes: Genes[];
  error: number;

  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService
  ) {

  }

  public unFavItem(geneId: number) {
    // console.log(this.favouritesService.favourites);
    this.favouritesService.removeFromFavourites(geneId);
    return this.favouriteGenesIds;
  }

  public clearFavs() {
    this.favouritesService.clearFavourites();
    window.location.reload(); // TODO: убрать этот костыль
    return this.favouriteGenesIds;
  }

  ngOnInit() {
    this.getGenes();
  }

  ngOnChanges() {
    this.getGenes();
  }

  private getGenes() {
    this.favouritesSubscription$ = this.favouritesService.getItems().subscribe((genes) => {
      this.favouriteGenesIds = this.favouritesService.favourites;
    }, error => this.favouriteGenesIds = []);

    this.genesSubscription$ = this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
    }, error => this.error = error);
  }

  ngOnDestroy(): void {
    this.favouritesSubscription$.unsubscribe();
    this.genesSubscription$.unsubscribe();
  }
}
