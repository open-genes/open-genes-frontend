import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IGene} from '../models';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient,
              private translate: TranslateService) {
  }

  getGenes(): Observable<IGene[]> {
    return this.http.get<IGene[]>(`${this.url}/api?lang=${this.translate.currentLang}`);
  }

  getGeneById(id: number): Observable<IGene> {
    return this.http.get<IGene>(`${this.url}/api/gene/${id}?lang=${this.translate.currentLang}`);
  }

  getLastGene(): Observable<IGene[]> {
    return this.http.get<IGene[]>(`${this.url}/api/latest`);
  }

  getGenesByFunctionalClusters(fc: number[]): Observable<IGene[]> {
    return this.http.get<IGene[]>(`${this.url}/api/by-functional-cluster/${fc}?lang=${this.translate.currentLang}`);
  }
}
