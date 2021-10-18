import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PubmedApiService {
  private url = environment.searchApiUrl;

  constructor(private http: HttpClient) {}

  public getNewsList(symbols: string[], limit: number, page: number): Observable<any> {
    return this.http.post(`${this.url}publication/all`, {
      symbols,
      limit,
      page,
    });
  }

  public getArticleByDoi(doi: number | string): Observable<any> {
    const doid = '10.1038/ncb1866'
    const params = new HttpParams().set('doi', `${doid}`);
    return this.http.get(`${this.url}publication/getInfoByDOI`, { params });
  }
}
