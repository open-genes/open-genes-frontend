import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gene, Genes } from '../../models';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AssociatedDiseaseCategories, AssociatedDiseases } from '../../models/openGenesApi/associated-diseases.model';
import { GenesWLifespanResearches } from '../../models/openGenesApi/genes-with-increase-lifespan-researches.model';
import { GenesInHorvathClock } from '../../models/openGenesApi/genes-in-horvath-clock.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private currentLang: string;
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;

    // API doesn't have Chinese language
    if (this.translate.currentLang === 'zh') {
      this.currentLang = 'en';
    }
  }

  getGenes(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/gene?lang=${this.currentLang}`);
  }

  getLastEditedGene(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/gene/by-latest`);
  }

  getGenesByFunctionalClusters(list: number[]): Observable<Genes[]> {
    return this.http.get<Genes[]>(
      `${this.url}/api/gene/by-functional-cluster/${list}?lang=${this.currentLang}`
    );
  }

  getGenesByExpressionChange(expression: number): Observable<Genes[]> {
    return this.http.get<Genes[]>(
      `${this.url}/api/gene/by-expression-change/${expression}?lang=${this.currentLang}`
    );
  }

  getGeneByHGNCsymbol(symbol: string): Observable<Gene[]> {
    return this.http.get<Gene[]>(`${this.url}/api/gene/${symbol}?lang=${this.currentLang}`);
  }

  getGoTermMatchByString(request: string): Observable<Genes[]> {
    return this.http.get<Genes[]>(`${this.url}/api/gene/by-go-term/${request}`);
  }

  getDiseases(): Observable<AssociatedDiseases[]> {
    return this.http.get<AssociatedDiseases[]>(`${this.url}/api/disease/`);
  }

  getDiseaseCategories(): Observable<AssociatedDiseaseCategories[]> {
    return this.http.get<AssociatedDiseaseCategories[]>(`${this.url}/api/disease-category/`);
  }

  getGenesWLifespanResearches(): Observable<GenesWLifespanResearches[]> {
    return this.http.get<GenesWLifespanResearches[]>(
      `${this.url}/api/increase-lifespan?lang=${this.currentLang}`
    );
  }

  getGenesInHorvathClock(): Observable<GenesInHorvathClock[]> {
    return this.http.get<GenesInHorvathClock[]>(`${this.url}/api/methylation?lang=${this.currentLang}`);
  }
}
