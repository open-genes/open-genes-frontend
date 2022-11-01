import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiGeneSearchFilter } from '../../models/filters/filter.model';
import { GenesListSettings } from '../../../components/shared/genes-list/genes-list-settings.model';
import { Genes } from '../../models';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../models/settings.model';
import { SettingsService } from '../settings.service';
import { Sort } from '@angular/material/sort';
import { ApiResponse } from '../../models/api-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GenesFilterService {
  private listOfFields$ = new BehaviorSubject<any>('');
  private filterChanges$ = new BehaviorSubject<any>([]);
  public currentFields: Observable<GenesListSettings> = this.listOfFields$.asObservable();
  public filterResult: Observable<ApiGeneSearchFilter> = this.filterChanges$.asObservable();
  public twoOrMoreFiltersApplied = new BehaviorSubject<boolean>(
    false
  );
  public sortParams: Sort;

  // TODO: it's bad that the one can directly change filters state here
  public filters: ApiGeneSearchFilter = {
    byAgeRelatedProcess: [],
    byDiseases: [],
    byDiseaseCategories: [],
    bySelectionCriteria: [],
    byExpressionChange: 0,
    byMethylationChange: '',
    byAgingMechanism: [],
    byProteinClass: [],
    byOrigin: [],
    byFamilyOrigin: [],
    byConservativeIn: [],
    researches: 0,
    byGeneId: null,
    byGeneSymbol: [],
    bySuggestions: '',
    confidenceLevel: null,
  };

  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.updateFields(
      this.settingsService.genesListSettings
    );
    this.filterChanges$.next(this.filters);
  }

  public updateFields(fields): void {
    this.listOfFields$.next(fields);
  }

  // Get state
  getFilterState(): Observable<ApiGeneSearchFilter> {
    return of(this.filters);
  }

  // Filter
  public applyFilter(filterType: string, filterValue: any): void {
    if (filterValue) {
      if (Array.isArray(this.filters[filterType])) {
        const arrayValues = filterValue
          .toString()
          .split(',');
        if (arrayValues.length > 1) {
          this.filters[
            filterType
          ] = arrayValues.map((value: string | number) =>
            +value ? +value : value
          );
        } else {
          filterValue = +filterValue
            ? +filterValue
            : Array.isArray(filterValue)
            ? filterValue[0]
            : filterValue;
          if (
            !this.filters[filterType].includes(filterValue)
          ) {
            this.filters[filterType].push(filterValue);
          } else {
            this.filters[filterType] = this.filters[
              filterType
            ].filter((item) => item !== filterValue);
          }
        }
      } else if (
        typeof this.filters[filterType] === 'number'
      ) {
        if (this.filters[filterType] !== +filterValue) {
          this.filters[filterType] = +filterValue;
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
    } else {
      return;
    }

    this.areMoreThan2FiltersApplied();
  }

  public onLoadMoreGenes(pagesTotal: number): void {
    if (this.pagination.page < pagesTotal) {
      this.pagination.page++;
    }
    this.updateList(this.filters);
  }

  public updateList(filterParams: ApiGeneSearchFilter): void {
    this.filterChanges$.next(filterParams);
  }

  // Clear
  public clearFilters(filterName?: keyof ApiGeneSearchFilter): void {
    switch (filterName) {
      case 'byAgeRelatedProcess':
        this.filters.byAgeRelatedProcess = [];
        break;
      case 'byDiseases':
        this.filters.byDiseases = [];
        break;
      case 'byDiseaseCategories':
        this.filters.byDiseaseCategories = [];
        break;
      case 'bySelectionCriteria':
        this.filters.bySelectionCriteria = [];
        break;
      case 'byExpressionChange':
        this.filters.byExpressionChange = null;
        break;
      case 'byMethylationChange':
        this.filters.byMethylationChange = '';
        break;
      case 'byAgingMechanism':
        this.filters.byAgingMechanism = [];
        break;
      case 'byProteinClass':
        this.filters.byProteinClass = [];
        break;
      case 'byFamilyOrigin':
        this.filters.byFamilyOrigin = [];
        break;
      case 'byConservativeIn':
        this.filters.byConservativeIn = [];
        break;
      case 'researches':
        this.filters.researches = 0;
        break;
      case 'byGeneId':
        this.filters.byGeneId = null;
        break;
      case 'byGeneSymbol':
        this.filters.byGeneSymbol = [];
        break;
      case 'bySuggestions':
        this.filters.bySuggestions = '';
        break;
      case 'confidenceLevel':
        this.filters.confidenceLevel = null;
        break;
      default:
        this.filters.byAgeRelatedProcess = [];
        this.filters.byDiseases = [];
        this.filters.byDiseaseCategories = [];
        this.filters.bySelectionCriteria = [];
        this.filters.byExpressionChange = null;
        this.filters.byMethylationChange = '';
        this.filters.byAgingMechanism = [];
        this.filters.byProteinClass = [];
        this.filters.byFamilyOrigin = [];
        this.filters.byConservativeIn = [];
        this.filters.researches = 0;
        this.filters.byGeneId = null;
        this.filters.byGeneSymbol = [];
        this.filters.bySuggestions = '';
        this.filters.confidenceLevel = null;
    }

    this.pagination.page = 1;
    this.areMoreThan2FiltersApplied();
  }

  public getSortedAndFilteredGenes(): Observable<ApiResponse<Genes>> {
    let params = new HttpParams()
      .set('lang', this.translate.currentLang)
      .set('page', this.pagination.page)
      .set('pageSize', this.pagination.pageSize);

    if (this.filters) {
      Object.entries(this.filters).forEach(
        ([key, value]) => {
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
        }
      );
    }

    if (this.sortParams && this.sortParams.direction) {
      params = params
        .set('sortBy', this.sortParams.active)
        .set(
          'sortOrder',
          this.sortParams.direction.toUpperCase()
        );
    }

    // return this.apiService.getGenesV2(params);
    return this.http.get<ApiResponse<Genes>>(
      `/api/gene/search`,
      { params }
    );
  }

  private areMoreThan2FiltersApplied(): void {
    const sum = [];
    Object.values(this.filters).forEach((value) => {
      if (
        (value && value.length) ||
        (typeof value === 'number' && value !== 0)
      ) {
        sum.push(1);
      }
    });
    this.twoOrMoreFiltersApplied.next(sum.length >= 2);

    this.updateList(this.filters);
    this.applyQueryParams(this.filters);
  }

  private applyQueryParams(
    filterParams: ApiGeneSearchFilter
  ): void {
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

    const urlTree = this.router.parseUrl(this.router.url);
    let urlWithoutParams = '/';
    if (Object.keys(urlTree.root.children).length !== 0) {
      urlWithoutParams = urlTree.root.children?.primary.segments
        .map((it) => it.path)
        .join('/');
    }

    void this.router.navigate([urlWithoutParams], {
      queryParams: queryParams,
    });
  }
}
