import {Component} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent {

  menuVisible = false;

  constructor() {
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

}
