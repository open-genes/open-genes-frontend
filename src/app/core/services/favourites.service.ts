import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FavouritesService {
  favourites = []; // TODO: заменить массив на мапу или обращаться к local storage напрямую
  storedData = JSON.parse(localStorage.getItem('favourites'));

  // Работа с хранилищем происходит через массив
  getItems() {
    if (this.storedData) {
      this.favourites = [...this.storedData]; // очищаем и заново заполняем массив, так как для каждого инстанса сервиса создается отдельный массив
      console.log(this.favourites);
    }
    return this.storedData;
  }

  addToCart(data: number) {
    this.favourites.push(data);
    localStorage.clear();
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  removeFromCart(data: number) {
    const index = this.favourites.indexOf(data);
    if (index > -1) {
      this.favourites.splice(index, 1);
      localStorage.setItem('favourites', JSON.stringify(this.favourites));
    }
  }

  isInCart(data: number) {
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
