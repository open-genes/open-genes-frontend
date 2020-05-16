import {Component, OnInit} from '@angular/core';
import {FavouritesService} from '../../core/services/favourites.service';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent implements OnInit {

  public favsCounter: number;
  menuVisible = false;

  constructor(
    private favouritesService: FavouritesService
  ) {}

  ngOnInit() {
    this.favouritesService.getItems();
    this.favsCounter = this.favouritesService.favourites.length;
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible === true) {
      document.body.classList.add('body--still');
    } else {
      document.body.classList.remove('body--still');
    }
  }
}
