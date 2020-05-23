import {Component, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {Genes} from 'src/app/core/models/genes.model';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [FavouritesService]
})

export class FavouritesComponent implements OnInit, OnChanges, OnDestroy {

  private subscription$ = new Subject();
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
    this.favouritesService.getItems().subscribe((genes) => {
      this.favouriteGenesIds = this.favouritesService.favourites;
    }, error => this.favouriteGenesIds = []);

    this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
    }, error => this.error = error);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
