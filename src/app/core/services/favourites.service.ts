import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  public favourites = [];
  public storedData = JSON.parse(localStorage.getItem('favourites'));

  // All interaction with a storage comes through an array
  public getItems(): Observable<any[]> {
    if (this.storedData) {
      this.favourites = [...this.storedData];
      // We clear and fill array with updated data
    }

    return of(this.favourites);
  }

  public getNumberOfItems(): Observable<number> {
    if (this.storedData) {
      return of(this.storedData.length);
    }

    return of(0);
  }

  public addToFavourites(data: number): void {
    this.favourites.push(data);
    this.storedData = [];
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  public removeFromFavourites(data: number): void {
    const index = this.favourites.indexOf(data);
    if (index > -1) {
      this.favourites.splice(index, 1);
      localStorage.setItem('favourites', JSON.stringify(this.favourites));
    }
  }

  public isInFavourites(data: number): boolean {
    if (this.favourites.length !== 0) {
      return this.favourites.indexOf(data) > -1;
    }

    return false;
  }

  public clearFavourites(): void {
    this.favourites = [];
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }
}
