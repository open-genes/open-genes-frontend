import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { I80levelArticleQueryParams } from '../../models/vendorsApi/80level/80level.model';

@Injectable({
  providedIn: 'root',
})
export class EightyLevelService {
  private url = `${environment.openLongevity80LevelCMS}api/articles`;

  constructor(private http: HttpClient) {}

  public getArticles(params: I80levelArticleQueryParams): Observable<any> {
    let querySelectors = '';
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        querySelectors += `${param}=${value}`;
      });
    }

    return this.http.get(this.url + (params ? `?${querySelectors}` : ''));
  }
}
