import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  constructor() { }

  setStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getStorageValue(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
