import {Component, OnInit} from '@angular/core';
import {FavouritesService} from '../../core/services/favourites.service';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent implements OnInit {

  constructor(
    private favouritesService: FavouritesService
  ) {}

  favsCounter: number;
  menuVisible = false;



  private getCounters() {
    const favouritesSubscription = this.favouritesService.getItems().subscribe((genes) => {
      this.favsCounter = this.favouritesService.favourites.length;
    }, error => this.favsCounter = 0);
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;

    if (this.menuVisible === true) {
      document.body.classList.add('body--still');
    } else {
      document.body.classList.remove('body--still');
    }
  }

  ngOnInit() {
    this.getCounters();
  }
}
