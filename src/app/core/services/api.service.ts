import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGene } from '../models';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGenes(): Observable<IGene[]> {
    return this.http
      .get<IGene[]>(`${this.url}/api?lang=ru`)
      .pipe(
        map(ev => {
          ev = ev.map(item => {
            return item;
          });
          return ev;
        }),
      );
  }
}
