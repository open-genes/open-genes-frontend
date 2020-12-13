import {
  Component,
  OnInit,
  Inject, Input,
} from '@angular/core';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})

export class BurgerMenuComponent implements OnInit {

  @Inject(Document) public document: Document;

  constructor() {
  }

  @Input() favsCounter: string;
  isMenuVisible = false;

  ngOnInit() {
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
    if (this.isMenuVisible === true) {
      document.body.classList.add('body--still');
    } else {
      document.body.classList.remove('body--still');
    }
  }
}
