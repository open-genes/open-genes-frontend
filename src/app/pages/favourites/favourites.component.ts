import {Component, OnInit, OnChanges} from '@angular/core';
import {Genes} from 'src/app/core/models/genes.model';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [FavouritesService]
})

export class FavouritesComponent implements OnInit, OnChanges {

  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService) {
  }

  public genes: Genes[];
  public favouriteGenesIds: any;
  error: number;

  public unFavItem(geneId: number) {
    console.log(this.favouritesService.favourites);
    this.favouritesService.removeFromCart(geneId);
  }

  ngOnInit() {
    this.favouriteGenesIds = this.favouritesService.getItems();
    this.getGenes();
  }

  ngOnChanges() {

  }

  private getGenes() {
    this.apiService.getGenes().subscribe((genes) => {

      this.genes = genes;
    }, error => this.error = error);
  }
}
