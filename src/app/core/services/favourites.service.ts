import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FavouritesService {
  favourites = []; // TODO: заменить массив на мапу
  storedData = JSON.parse(localStorage.getItem('favourites'));

  // Работа с хранилищем происходит через массив
  getItems() {
    if (this.storedData) {
      this.favourites.push(this.storedData);
    }
    return this.storedData;
  }

  addToCart(data) {
    this.favourites.push(data);
    localStorage.clear();
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  removeFromCart(data) {
    const index = this.favourites.indexOf(data);
    if (index > -1) {
      this.favourites.splice(index, 1);
      localStorage.setItem('favourites', JSON.stringify(this.favourites));
    }
  }

  isInCart(data) {
    if (this.favourites.length !== 0) {
      return this.favourites.indexOf(data) > -1;
    } else {
      return false;
    }
  }



  clearCart() {
    this.favourites = [];
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }
}
