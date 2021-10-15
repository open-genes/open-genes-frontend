import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Filter, Sort } from './filter.model';
import { FilterTypesEnum } from './filter-types.enum';
import { GenesListSettings } from '../genes-list-settings.model';
import { Genes } from '../../../../core/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private url = environment.apiUrl;
  private _listOfFields = new BehaviorSubject<any>('');
  public currentFields: Observable<GenesListSettings> = this._listOfFields.asObservable();
  public isClearFiltersBtnShown = new BehaviorSubject<boolean>(false);
  public updateSelectedFilter = new Subject<void>();

  public listOfFields: GenesListSettings = {
    // Default:
    ifShowAge: true,
    ifShowFuncClusters: true,
    ifShowExpression: true,
    ifShowDiseases: true,
    ifShowDiseaseCategories: false,
    ifShowCriteria: true,
    ifShowMethylation: false,
  };

  public filters: Filter = {
    byFunctionalClusters: [],
    byExpressionChange: 0,
    byMethylationChange: '',
    byDisease: '',
    byDiseaseCategories: '',
    bySelectionCriteria: '',
    page: 1,
  };

  public sort: Sort = {
    byName: false,
    byAge: false,
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) {
    this.updateFields(this.listOfFields);
  }

  public updateFields(fields) {
    this._listOfFields.next(fields);
  }

  // Filter
  public filterByFuncClusters(id: number): Observable<number[]> {
    if (!this.filters.byFunctionalClusters.includes(id)) {
      this.filters.byFunctionalClusters.push(id);
    } else {
      this.filters.byFunctionalClusters = this.filters.byFunctionalClusters.filter((item) => item !== id);
    }

    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
    return of(this.filters.byFunctionalClusters);
  }

  public filterByExpressionChange(expression: number): Observable<number> {
    if (this.filters.byExpressionChange !== expression) {
      this.filters.byExpressionChange = expression;
    } else {
      this.filters.byExpressionChange = 0;
    }

    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
    return of(this.filters.byExpressionChange);
  }

  public filterByMethylationChange(correlation: string): Observable<string> {
    if (this.filters.byMethylationChange !== correlation) {
      this.filters.byMethylationChange = correlation;
    } else {
      this.filters.byMethylationChange = '';
    }

    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
    return of(this.filters.byMethylationChange);
  }

  // TODO: Ask backend to send unique id's for each criteria, type will change to number[]
  public filterBySelectionCriteria(id: string): Observable<string> {
    if (!this.filters.bySelectionCriteria.includes(id)) {
      this.filters.bySelectionCriteria = id;
    } else {
      this.filters.bySelectionCriteria = '';
    }

    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
    return of(this.filters.bySelectionCriteria);
  }

  public filterByDisease(name: string): Observable<string> {
    if (!this.filters.byDisease.includes(name)) {
      this.filters.byDisease = name;
    } else {
      this.filters.byDisease = '';
    }

    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
    return of(this.filters.byDisease);
  }

  public filterByDiseaseCategories(key: string): Observable<string> {
    if (!this.filters.byDiseaseCategories.includes(key)) {
      this.filters.byDiseaseCategories = key;
    } else {
      this.filters.byDiseaseCategories = '';
    }
    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
    return of(this.filters.byDiseaseCategories);
  }

  // Get
  public getByFuncClusters(): Observable<number[]> {
    return of(this.filters.byFunctionalClusters);
  }

  public getByExpressionChange(): Observable<number> {
    return of(this.filters.byExpressionChange);
  }

  public getByMethylationChange(): Observable<string> {
    return of(this.filters.byMethylationChange);
  }

  public getBySelectionCriteria(): Observable<string> {
    return of(this.filters.bySelectionCriteria);
  }

  public getByDisease(): Observable<string> {
    return of(this.filters.byDisease);
  }

  public getByDiseaseCategories(): Observable<string> {
    return of(this.filters.byDiseaseCategories);
  }

  // Clear
  public clearFilters(filterName?: string): void {
    const { funcClusters, expressChange, methylChange, disease, disCategories, selectCriteria } = FilterTypesEnum;
    if (filterName) {
      if (filterName === funcClusters) {
        this.filters.byFunctionalClusters = [];
      } else if (filterName === expressChange) {
        this.filters.byExpressionChange = 0;
      } else if (filterName == methylChange) {
        this.filters.byMethylationChange = '';
      } else if (filterName === disease) {
        this.filters.byDisease = '';
      } else if (filterName === disCategories) {
        this.filters.byDiseaseCategories = '';
      } else if (filterName === selectCriteria) {
        this.filters.bySelectionCriteria = '';
      }
    } else {
      this.sort.byName = false;
      this.sort.byAge = false;
      this.filters.byFunctionalClusters = [];
      this.filters.byExpressionChange = 0;
      this.filters.byMethylationChange = '';
      this.filters.byDisease = '';
      this.filters.byDiseaseCategories = '';
      this.filters.bySelectionCriteria = '';
    }
    this.areMoreThan2FiltersApplied();
    this.getFilteredGenes(this.filters).subscribe();
  }

  public areMoreThan2FiltersApplied() {
    // convert filter values to array of numbers
    const sum = [];
    Object.values(this.filters).forEach((value) => {
      if ((value && value.length) || (typeof value === 'number' && value !== 0)) {
        sum.push(1);
      }
    });

    this.updateSelectedFilter.next();

    // when filters change and their sum is more than 2:
    this.isClearFiltersBtnShown.next(sum.length >= 2);
  }

  getFilteredGenes(filterParams: Filter): Observable<Genes[]> {
    let params = new HttpParams().set('lang', this.translate.currentLang);
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Array) {
          if (value.length) {
            const str = value.join();
            params = params.set(`${key}`, `${str}`);
          }
        } else {
          params = params.set(`${key}`, `${value}`);
        }
      }
    });
    console.log(filterParams)
    return this.http.get<Genes[]>(`${this.url}/api/gene`, {
      params,
    });
  }
}
