import {Component, OnInit} from '@angular/core';
import {Genes} from 'src/app/core/models/genes.model';
import {FavouritesService} from 'src/app/core/services/favourites.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [FavouritesService]
})

export class FavouritesComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService) {

    this.favouriteGenesIds = this.favouritesService.getItems();
  }

  public genes: Genes[];
  public favouriteGenesIds: any;
  error: number;

  public unFavItem(id) {
    this.favouritesService.removeFromCart(id);
    console.log('it works');
  }

  ngOnInit() {
    this.getGenes();
  }

  private getGenes() {
    this.apiService.getGenes().subscribe((genes) => {

      this.genes = genes;
    }, error => this.error = error);
  }
}
