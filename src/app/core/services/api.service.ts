import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gene, Genes} from '../models';
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

  getGenes(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api?lang=${this.translate.currentLang}`);
  }

  getLastEditedGene(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/latest`);
  }

  getGenesByFunctionalClusters(fc: number[]): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/by-functional-cluster/${fc}?lang=${this.translate.currentLang}`);
  }

  getGenesByExpressionChange(expression: string): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/by-expression-change/${expression}?lang=${this.translate.currentLang}`);
  }

  getGeneByHGNCsymbol(symbol: string): Observable<Gene[]> {
    return this.http.get<Gene[]>(`${this.url}/api/gene/${symbol}?lang=${this.translate.currentLang}`);
  }
}
