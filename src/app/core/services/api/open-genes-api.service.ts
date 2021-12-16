import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gene, Genes } from '../../models';
import { TranslateService } from '@ngx-translate/core';
import { AssociatedDiseaseCategories, AssociatedDiseases } from '../../models/open-genes-api/associated-diseases.model';
import { GenesWLifespanResearches } from '../../models/open-genes-api/genes-with-increase-lifespan-researches.model';
import { GenesInHorvathClock } from '../../models/open-genes-api/genes-in-horvath-clock.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly currentLang: string;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang;

    // API doesn't have Chinese language
    if (this.translate.currentLang === 'zh') {
      this.currentLang = 'en';
    }
  }

  getGenes(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`/api/gene?lang=${this.currentLang}`);
  }

  getLastEditedGene(): Observable<Genes[]> {
    return this.http.get<Genes[]>(`/api/gene/by-latest`);
  }

  getGenesByFunctionalClusters(list: number[]): Observable<Genes[]> {
    return this.http.get<Genes[]>(`/api/gene/by-functional-cluster/${list}?lang=${this.currentLang}`);
  }

  getGenesByExpressionChange(expression: number): Observable<Genes[]> {
    return this.http.get<Genes[]>(`/api/gene/by-expression-change/${expression}?lang=${this.currentLang}`);
  }

  getGeneByHGNCsymbol(symbol: string): Observable<Gene[]> {
    return this.http.get<Gene[]>(`/api/gene/${symbol}?lang=${this.currentLang}`);
  }

  getGoTermMatchByString(request: string): Observable<Genes[]> {
    return this.http.get<Genes[]>(`/api/gene/by-go-term/${request}`);
  }

  getDiseases(): Observable<AssociatedDiseases[]> {
    return this.http.get<AssociatedDiseases[]>(`/api/disease/`);
  }

  getDiseaseCategories(): Observable<AssociatedDiseaseCategories[]> {
    return this.http.get<AssociatedDiseaseCategories[]>(`/api/disease-category/`);
  }

  getGenesWLifespanResearches(): Observable<GenesWLifespanResearches[]> {
    return this.http.get<GenesWLifespanResearches[]>(`/api/increase-lifespan?lang=${this.currentLang}`);
  }

  getGenesInHorvathClock(): Observable<GenesInHorvathClock[]> {
    return this.http.get<GenesInHorvathClock[]>(`/api/methylation?lang=${this.currentLang}`);
  }
}
