import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  setStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getStorageValue(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
