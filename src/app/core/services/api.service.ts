import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGen } from '../models';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _url = 'http://open-genes.org/export';

  constructor(private _http: HttpClient) { }

  getGenes(): Observable<IGen[]> {
    return this._http.get<IGen[]>(this._url).pipe(map(ev => {
      ev = ev.map(item => {
        if (item.functionalClusters) {
          item.functionalClusters = (item.functionalClusters as string).split(',');
        }
        return item;
      });
      return ev;
    }));
  }
}
