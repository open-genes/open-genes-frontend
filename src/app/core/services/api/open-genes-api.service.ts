import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gene, Genes } from '../../models';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private translate: TranslateService) {}

  getGenes(): Observable<Genes[]> {
    return this.http.get<Genes[]>(
      `${this.url}/api/gene?lang=${this.translate.currentLang}`
    );
  }

  getLastEditedGene(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/gene/by-latest`);
  }

  getGenesByFunctionalClusters(list: number[]): Observable<Genes[]> {
    return this.http.get<Genes[]>(
      `${this.url}/api/gene/by-functional-cluster/${list}?lang=${this.translate.currentLang}`
    );
  }

  getGenesByExpressionChange(expression: number): Observable<Genes[]> {
    return this.http.get<Genes[]>(
      `${this.url}/api/gene/by-expression-change/${expression}?lang=${this.translate.currentLang}`
    );
  }

  getGeneByHGNCsymbol(symbol: string): Observable<Gene[]> {
    return this.http.get<Gene[]>(
      `${this.url}/api/gene/${symbol}?lang=${this.translate.currentLang}`
    );
  }

  getGoTermMatchByString(request: string): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/gene/by-go-term/${request}`);
  }
}
