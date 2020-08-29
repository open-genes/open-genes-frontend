import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FavouritesService {
  public favourites = []; // TODO: replace an array with a map
  public storedData = JSON.parse(localStorage.getItem('favourites'));

  // All interaction with a storage comes through an array
  public getItems(): Observable<any[]> {
    if (this.storedData) {
      this.favourites = [...this.storedData];
      // We clear and fill array with updated data
      // because there is a separate array for every service instance.
    }

    return of(this.storedData);
  }

  public getNumberOfItems(): Observable<number> {
    if (this.storedData) {
      return of(this.storedData.length);
    } else {
      return of(0);
    }
  }

  public addToFavourites(data: number) {
    this.favourites.push(data);
    localStorage.clear();
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  public removeFromFavourites(data: number) {
    const index = this.favourites.indexOf(data);
    if (index > -1) {
      this.favourites.splice(index, 1);
      localStorage.setItem('favourites', JSON.stringify(this.favourites));
    }
  }

  public isInFavourites(data: number) {
    if (this.favourites.length !== 0) {
      return this.favourites.indexOf(data) > -1;
    } else {
      return false;
    }
  }

  public clearFavourites() {
    this.favourites = [];
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }
}
