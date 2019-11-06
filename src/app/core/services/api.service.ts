import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGen } from '../models';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGenes(): Observable<IGen[]> {
    return this.http
      .get<IGen[]>(`${this.url}/export`)
      .pipe(
        map(ev => {
          ev = ev.map(item => {
            if (item.functionalClusters) {
              item.functionalClusters = (item.functionalClusters as string).split(',');
            }
            return item;
          });
          return ev;
        }),
      );
  }
}
