import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private _filterChanges = new BehaviorSubject<any>([]);

  public currentFields: Observable<GenesListSettings> = this._listOfFields.asObservable();
  public filterResult: Observable<Filter> = this._filterChanges.asObservable();
  public isClearFiltersBtnShown = new BehaviorSubject<boolean>(false);

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

  public sort: Sort = {
    byName: false,
    byAge: false,
  };

  public filters: Filter = {
    byFunctionalClusters: [],
    byDisease: [],
    byDiseaseCategories: [],
    bySelectionCriteria: [],
    byMethylationChange: '',
    byExpressionChange: 0,
    page: 1,
    pagesTotal: 20,
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) {
    this.updateFields(this.listOfFields);
    this._filterChanges.next(this.filters);
  }

  public updateFields(fields) {
    this._listOfFields.next(fields);
  }

  // Filter
  public onApplyFilter(filterType: string, filterValue: number | string): void {
    if (this.filters[filterType] instanceof Array) {
      if (!this.filters[filterType].includes(filterValue)) {
        this.filters[filterType].push(filterValue);
      } else {
        this.filters[filterType] = this.filters[filterType].filter((item) => item !== filterValue);
      }
    } else {
      if (this.filters[filterType] !== filterValue) {
        this.filters[filterType] = filterValue;
      } else {
        this.filters[filterType] = '';
      }
    }
    this.areMoreThan2FiltersApplied();
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
        this.filters.byDisease = [];
      } else if (filterName === disCategories) {
        this.filters.byDiseaseCategories = [];
      } else if (filterName === selectCriteria) {
        this.filters.bySelectionCriteria = [];
      }
    } else {
      this.sort.byName = false;
      this.sort.byAge = false;
      this.filters.byFunctionalClusters = [];
      this.filters.byExpressionChange = 0;
      this.filters.byMethylationChange = '';
      this.filters.byDisease = [];
      this.filters.byDiseaseCategories = [];
      this.filters.bySelectionCriteria = [];
    }
    this.areMoreThan2FiltersApplied();
  }

  public areMoreThan2FiltersApplied() {
    // convert filter values to array of numbers
    const sum = [];
    Object.values(this.filters).forEach((value) => {
      if ((value && value.length) || (typeof value === 'number' && value !== 0)) {
        sum.push(1);
      }
    });

    this._filterChanges.next(this.filters);

    // when filters change and their sum is more than 2:
    this.isClearFiltersBtnShown.next(sum.length >= 4);
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

    return this.http.get<Genes[]>(`${this.url}/api/gene`, { params });
  }
}
