import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PubmedApiService {

  private url = environment.pubmedApiUrl;
  private limit = 3;
  private params = 'db=pubmed&retmode=json';

  constructor(private http: HttpClient) {
  }

  public getNewsList(symbols: string): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.url}/esearch.fcgi?${this.params}&retmax=${this.limit}&term=${symbols}&datetype=pdat&reldate=180`);
  }

  public getNewsData(id: number): Observable<any> {
    return this.http.get(`${this.url}/esummary.fcgi?${this.params}&id=${id}`);
  }
}
