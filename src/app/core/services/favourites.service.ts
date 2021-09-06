import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  public favLength$ = new BehaviorSubject<number>(0);
  public favourites = [];
  public storedData = JSON.parse(localStorage.getItem('favourites'));

  constructor() {
    this.favLength$.next(this.storedData.length);
  }

  // All interaction with a storage comes through an array
  public getItems(): Observable<any[]> {
    this.storedData = JSON.parse(localStorage.getItem('favourites'));
    if (this.storedData) {
      this.favourites = [...this.storedData];
      // We clear and fill array with updated data
    }

    return of(this.favourites);
  }


  public addToFavourites(geneId: number): void {
    this.favourites.push(geneId);
    this.favLength$.next(this.favourites.length);
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  public removeFromFavourites(geneId: number): void {
    const index = this.favourites.indexOf(geneId);
    if (index > -1) {
      this.favourites.splice(index, 1);
      this.favLength$.next(this.favourites.length);
      localStorage.setItem('favourites', JSON.stringify(this.favourites));
    }
  }

  public clearFavourites(): void {
    this.favourites = [];
    this.favLength$.next(this.favourites.length);
    localStorage.setItem('favourites', JSON.stringify(this.favourites));
  }

  public isInFavourites(data: number): boolean {
    if (this.favourites.length !== 0) {
      return this.favourites.indexOf(data) > -1;
    }

    return false;
  }


}
