import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResearchFilter } from '../../models/filters/filter.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Pagination } from '../../models/settings.model';
import { SettingsService } from '../settings.service';
import { Sort } from '@angular/material/sort';
import { ApiResponse } from '../../models/api-response.model';
import { GenesListSettings } from '../../../components/shared/genes-list/genes-list-settings.model';
import { ApiService } from '../api/open-genes-api.service';
import { ResearchArguments, ResearchTypes } from '../../models/open-genes-api/researches.model';

@Injectable({
  providedIn: 'root',
})
export class StudiesFilterService {
  private listOfFields$ = new BehaviorSubject<any>('');
  private filterChanges$ = new BehaviorSubject<any>([]);
  public currentFields: Observable<GenesListSettings> = this.listOfFields$.asObservable();
  public filterResult: Observable<ApiResearchFilter> = this.filterChanges$.asObservable();
  public twoOrMoreFiltersApplied = new BehaviorSubject<boolean>(false);
  public sortParams: Sort;

  public filters: ApiResearchFilter = {
    sortBy: '',
    sortOrder: '',
    byDiseases: [],
    byDiseaseCategories: [],
    byAgeRelatedProcess: [],
    byExpressionChange: 0,
    bySelectionCriteria: [],
    byAgingMechanism: [],
    byProteinClass: [],
    bySpecies: [],
    byOrigin: [],
    byFamilyOrigin: [],
    byConservativeIn: [],
    byGeneId: null,
    byGeneSymbol: [],
    bySuggestions: '',
    byChromosomeNum: null,
  };

  private filtersDefault: Readonly<ApiResearchFilter> = {
    sortBy: '',
    sortOrder: '',
    byDiseases: [],
    byDiseaseCategories: [],
    byAgeRelatedProcess: [],
    byExpressionChange: 0,
    bySelectionCriteria: [],
    byAgingMechanism: [],
    byProteinClass: [],
    bySpecies: [],
    byOrigin: [],
    byFamilyOrigin: [],
    byConservativeIn: [],
    byGeneId: null,
    byGeneSymbol: [],
    bySuggestions: '',
    byChromosomeNum: null,
  };

  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private apiService: ApiService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.updateFields(this.settingsService.genesListSettings);
    this.filterChanges$.next(this.filters);
  }

  public updateFields(fields): void {
    this.listOfFields$.next(fields);
  }

  // Get state
  getFilterState(): Observable<ApiResearchFilter> {
    return of(this.filters);
  }

  // Filter
  public applyFilter(filterType: string, filterValue: any): void {
    console.log('applyFilter', filterType, filterValue);
    if (filterValue) {
      if (Array.isArray(this.filters[filterType])) {
        const arrayValues = filterValue.toString().split(',');
        if (arrayValues.length > 1) {
          this.filters[filterType] = arrayValues.map((value: string | number) => (+value ? +value : value));
        } else {
          filterValue = +filterValue ? +filterValue : Array.isArray(filterValue) ? filterValue[0] : filterValue;
          if (!this.filters[filterType].includes(filterValue)) {
            this.filters[filterType].push(filterValue);
          } else {
            this.filters[filterType] = this.filters[filterType].filter((item) => item !== filterValue);
          }
        }
      } else if (typeof this.filters[filterType] === 'number') {
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

  public updateList(filterParams: ApiResearchFilter): void {
    this.filterChanges$.next(filterParams);
  }

  // Clear
  public clearFilters(filterName?: keyof ApiResearchFilter): void {
    if (filterName && filterName in this.filters) {
      this.filters[filterName as any] = JSON.parse(JSON.stringify(this.filtersDefault[filterName]));
    } else {
      this.filters = Object.assign({}, this.filters, this.filtersDefault);
    }
    this.pagination.page = 1;
    this.areMoreThan2FiltersApplied();
  }

  public getSortedAndFilteredStudies(studyType: ResearchArguments): Observable<ApiResponse<ResearchTypes>> {
    let params = new HttpParams()
      .set('lang', this.translate.currentLang)
      .set('page', this.pagination.page)
      .set('pageSize', this.pagination.pageSize);

    if (this.filters) {
      Object.entries(this.filters).forEach(([key, value]) => {
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
    }

    if (this.sortParams && this.sortParams.direction) {
      params = params.set('sortBy', this.sortParams.active).set('sortOrder', this.sortParams.direction.toUpperCase());
    }
    return this.apiService.getStudies(studyType, params);
  }

  private areMoreThan2FiltersApplied(): void {
    const sum = [];
    Object.values(this.filters).forEach((value) => {
      if ((value && value.length) || (typeof value === 'number' && value !== 0)) {
        sum.push(1);
      }
    });
    this.twoOrMoreFiltersApplied.next(sum.length >= 2);

    this.updateList(this.filters);
    this.applyQueryParams(this.filters);
  }

  private applyQueryParams(filterParams: ApiResearchFilter): void {
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
      urlWithoutParams = urlTree.root.children?.primary.segments.map((it) => it.path).join('/');
    }

    void this.router.navigate([urlWithoutParams], {
      queryParams: queryParams,
    });
  }
}
