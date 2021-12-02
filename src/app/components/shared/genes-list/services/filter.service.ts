import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, Sort } from './filter.model';
import { FilterTypesEnum } from './filter-types.enum';
import { GenesListSettings } from '../genes-list-settings.model';
import { FilteredGenes } from '../../../../core/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { Pagination } from '../../../../core/models/settings.model';
import { A } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private url = environment.testApiUrl;
  private listOfFields$ = new BehaviorSubject<any>('');
  private filterChanges$ = new BehaviorSubject<any>([]);

  public currentFields: Observable<GenesListSettings> = this.listOfFields$.asObservable();
  public filterResult: Observable<Filter> = this.filterChanges$.asObservable();
  public isClearFiltersBtnShown = new BehaviorSubject<boolean>(false);
  public otherPageFilterState: number;

  public genesListSettings: GenesListSettings = {
    // Default:
    ifShowAge: true,
    ifShowFuncClusters: true,
    ifShowExpression: true,
    ifShowDiseases: true,
    ifShowDiseaseCategories: false,
    ifShowCriteria: true,
    ifShowMethylation: false,
    ifShowAgingMechanisms: false,
  };

  public sort: Sort = {
    byName: false,
    byAge: false,
  };

  public filters: Filter = {
    byAgeRelatedProcess: [],
    byDiseases: [],
    byDiseaseCategories: [],
    bySelectionCriteria: [],
    byExpressionChange: 0,
    byMethylationChange: '',
  };

  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };

  constructor(private http: HttpClient, private translate: TranslateService, private router: Router) {
    this.updateFields(this.genesListSettings);
    this.filterChanges$.next(this.filters);
  }

  public updateFields(fields) {
    this.listOfFields$.next(fields);
  }

  // Filter
  public onApplyFilter(filterType: string, filterValue: number | string): void {
    if (filterValue) {
      if (Array.isArray(this.filters[filterType])) {
        if (!this.filters[filterType].includes(filterValue)) {
          this.filters[filterType].push(filterValue);
        } else {
          this.filters[filterType] = this.filters[filterType].filter((item) => item !== filterValue);
        }
      } else if (typeof this.filters[filterType] === 'number') {
        if (this.filters[filterType] !== filterValue) {
          this.filters[filterType] = filterValue;
        } else {
          this.filters[filterType] = 0;
        }
      } else {
        if (this.filters[filterType] !== filterValue) {
          this.filters[filterType] = filterValue;
        } else {
          this.filters[filterType] = '';
        }
      }
      this.pagination.page = 1;
      this.setQueryParams(this.filters);
    } else {
      return;
    }

    this.areMoreThan2FiltersApplied();
  }

  private setQueryParams(filterParams: Filter) {
    const queryParams = {};
    for (const key in filterParams) {
      if (filterParams[key]) {
        if (Array.isArray(filterParams[key])) {
          if (filterParams[key].length) {
            queryParams[key] = this.filters[key].join();
          }
        } else {
          queryParams[key] = filterParams[key];
        }
      }
    }

    this.router.navigate([], {
      queryParams: queryParams,
    });
  }

  public onLoadMoreGenes(pagesTotal: number): void {
    if (this.pagination.page < pagesTotal) {
      this.pagination.page++;
    }
    this.areMoreThan2FiltersApplied();
  }

  // Clear
  public clearFilters(filterName?: string, updateQueryParams?: boolean): void {
    const {
      disease,
      disease_categories,
      functional_clusters,
      selection_criteria,
      expression_change,
      methylation_change,
    } = FilterTypesEnum;
    switch (filterName) {
      case functional_clusters:
        this.filters.byAgeRelatedProcess = [];
        break;
      case disease:
        this.filters.byDiseases = [];
        break;
      case disease_categories:
        this.filters.byDiseaseCategories = [];
        break;
      case selection_criteria:
        this.filters.bySelectionCriteria = [];
        break;
      case expression_change:
        this.filters.byExpressionChange = 0;
        break;
      case methylation_change:
        this.filters.byMethylationChange = '';
        break;
      default:
        this.sort.byName = false;
        this.sort.byAge = false;
        this.filters.byAgeRelatedProcess = [];
        this.filters.byDiseases = [];
        this.filters.byDiseaseCategories = [];
        this.filters.bySelectionCriteria = [];
        this.filters.byExpressionChange = 0;
        this.filters.byMethylationChange = '';
    }
    this.pagination.page = 1;
    if (updateQueryParams) {
      this.setQueryParams(this.filters);
    }
    
    this.areMoreThan2FiltersApplied();
  }

  public areMoreThan2FiltersApplied(): void {
    const sum = [];
    Object.values(this.filters).forEach((value) => {
      if ((value && value.length) || (typeof value === 'number' && value !== 0)) {
        sum.push(1);
      }
    });
    this.isClearFiltersBtnShown.next(sum.length >= 2);

    this.filterChanges$.next(this.filters);
  }

  getFilteredGenes(filterParams: Filter): Observable<FilteredGenes> {

    debugger;
    let params = new HttpParams()
      .set('lang', this.translate.currentLang)
      .set('page', this.pagination.page)
      .set('pageSize', this.pagination.pageSize);

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          if (value.length) {
            const str = value.join();
            params = params.set(`${key}`, `${str}`);
          }
        } else {
          params = params.set(`${key}`, `${value}`);
        }
      }
    });

    return this.http.get<FilteredGenes>(`${this.url}/api/gene/search`, { params });
  }
}
