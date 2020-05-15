import {Component, OnInit} from '@angular/core';
import {Genes} from 'src/app/core/models/genes.model';
import {CartService} from 'src/app/core/services/favourites.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [CartService]
})

export class FavouritesComponent implements OnInit {
  error: number;
  public favouriteGenes: any;


  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private cartService: CartService) {

    this.favouriteGenes = this.cartService.getItems();
    console.log(this.cartService.getItems());
  }

  public removeFromFavourites(id: number) {
    this.cartService.removeFromCart(id);
  }

  ngOnInit() {
  }
}
