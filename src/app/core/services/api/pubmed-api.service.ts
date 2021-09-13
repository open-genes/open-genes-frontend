import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
