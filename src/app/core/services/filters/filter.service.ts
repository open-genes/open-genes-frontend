import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../models/settings.model';
import { SettingsService } from '../settings.service';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiService } from '../api/open-genes-api.service';
import { SortEnum } from './filter-types.enum';

export abstract class FilterService {
  listOfFields$ = new BehaviorSubject<any>('');
  filterChanges$ = new BehaviorSubject<any>([]);
  public twoOrMoreFiltersApplied = new BehaviorSubject<boolean>(false);
  public sortParams: Sort = {
    // Default:
    active: SortEnum.byConfidenceLevel,
    direction: 'asc'
  };

  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };

  protected constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private settingsService: SettingsService,
    private router: Router,
    public apiService: ApiService,
  ) {
    this.filterChanges$.next(this.getFilters());
  }

  abstract getFilters(): Record<string, any>;

  abstract getDefaultFilters(): Record<string, any>;

  public updateFields(fields): void {
    this.listOfFields$.next(fields);
  }

  // Get state
  getFilterState(): Observable<Record<string, any>> {
    return of(this.getFilters());
  }

  // Filter
  public applyFilter(filterType: string, filterValue: any): void {
    const filters = this.getFilters();
    if (filterValue) {
      if (Array.isArray(filters[filterType])) {
        const arrayValues = filterValue.toString().split(',');
        if (arrayValues.length > 1) {
          filters[filterType] = arrayValues.map((value: string | number) => (+value ? +value : value));
        } else {
          filterValue = +filterValue ? +filterValue : Array.isArray(filterValue) ? filterValue[0] : filterValue;
          if (!filters[filterType].includes(filterValue)) {
            filters[filterType].push(filterValue);
          } else {
            filters[filterType] = filters[filterType].filter((item) => item !== filterValue);
          }
        }
      } else if (typeof filters[filterType] === 'number') {
        if (filters[filterType] !== +filterValue) {
          filters[filterType] = +filterValue;
        } else {
          filters[filterType] = 0;
        }
      } else {
        if (filters[filterType] !== filterValue) {
          filters[filterType] = filterValue;
        } else {
          filters[filterType] = '';
        }
      }
      this.pagination.page = 1;
    } else {
      return;
    }
    this.filterChanges$.next(this.getFilters());
    this.areMoreThan2FiltersApplied();
  }

  public onLoadNextPage(pagesTotal: number): void {
    if (this.pagination.page < pagesTotal) {
      this.pagination.page++;
    }
    this.updateList(this.getFilters());
  }

  public updateList(filterParams: Record<string, any>): void {
    this.filterChanges$.next(filterParams);
  }

  //Observable<ApiResponse<Genes>>
  public getSortedAndFilteredParams(): HttpParams {
    let params = new HttpParams()
      .set('lang', this.translate.currentLang)
      .set('page', this.pagination.page)
      .set('pageSize', this.pagination.pageSize);

    const filters = this.getFilters();
    if (filters) {
      Object.entries(filters).forEach(
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
        },
      );
    }

    if (this.sortParams && this.sortParams.direction) {
      params = params
        .set('sortBy', this.sortParams.active)
        .set('sortOrder', this.sortParams.direction.toUpperCase());
    }

    return params;
  }

  public clearFilters(filterName?: string): void {
    const defaultFilters = this.getDefaultFilters();
    const filters = this.getFilters();
    if (filterName && defaultFilters[filterName]) {
      filters[filterName] = Array.isArray(defaultFilters[filterName]) ?
        [...defaultFilters[filterName]] : defaultFilters[filterName];
    } else {
      Object.getOwnPropertyNames(filters).forEach(function (prop) {
        filters[prop] = defaultFilters[prop];
      });
    }

    this.pagination.page = 1;
    this.areMoreThan2FiltersApplied();
  }

  areMoreThan2FiltersApplied(): void {
    const filters = this.getFilters();
    const sum = [];
    Object.values(filters).forEach((value) => {
      if ((value && value.length) || (typeof value === 'number' && value !== 0)) {
        sum.push(1);
      }
    });
    this.twoOrMoreFiltersApplied.next(sum.length >= 2);

    this.updateList(filters);
    this.applyQueryParams(filters);
  }

  private applyQueryParams(filterParams: Record<string, any>): void {
    const queryParams = {};
    const filters = this.getFilters();
    for (const key in filterParams) {
      const filterValue = filters[key];
      if (filterValue && filterValue.length > 0) {
        if (Array.isArray(filterValue)) {
          if (Array(filterValue).length) {
            queryParams[key] = Array(filterValue).join();
          }
        } else {
          queryParams[key] = filterValue;
        }
      }
    }

    const urlTree = this.router.parseUrl(this.router.url);
    const urlWithoutParams = !urlTree.root.children ?
      '/' : urlTree.root.children?.primary.segments
        .map((it) => it.path)
        .join('/');


    void this.router.navigate([urlWithoutParams], {
      queryParams: queryParams,
    });
  }
}
