import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, ISort } from './filter.model';
import { FilterTypesEnum } from './filter-types.enum';
import { GenesListSettings } from '../genes-list-settings.model';
import { FilteredGenes } from '../../../../core/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Pagination } from '../../../../core/models/settings.model';
import { SettingsService } from '../../../../core/services/settings.service';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private listOfFields$ = new BehaviorSubject<any>('');
  private filterChanges$ = new BehaviorSubject<any>([]);

  public currentFields: Observable<GenesListSettings> = this.listOfFields$.asObservable();
  public filterResult: Observable<Filter> = this.filterChanges$.asObservable();
  public isClearFiltersBtnShown = new BehaviorSubject<boolean>(false);

  public sortParams: Sort;

  public filters: Filter = {
    byAgeRelatedProcess: [],
    byDiseases: [],
    byDiseaseCategories: [],
    bySelectionCriteria: [],
    byExpressionChange: 0,
    byMethylationChange: '',
    byAgingMechanisms: [],
    byProteinClass: [],
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
    this.updateFields(this.settingsService.genesListSettings);
    this.filterChanges$.next(this.filters);
  }

  public updateFields(fields): void {
    this.listOfFields$.next(fields);
  }

  // Filter
  public onApplyFilter(filterType: string, filterValue: number | string): void {
    if (filterValue) {
      if (Array.isArray(this.filters[filterType])) {
        const arrayValues = filterValue.toString().split(',');
        if (arrayValues.length > 1) {
          this.filters[filterType] = arrayValues.map(Number);
        } else {
          if (!this.filters[filterType].includes(+filterValue)) {
            this.filters[filterType].push(+filterValue);
          } else {
            this.filters[filterType] = this.filters[filterType].filter((item) => item !== +filterValue);
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

  public updateList(filterParams: Filter): void {
    this.filterChanges$.next(filterParams);
  }

  // Clear
  public clearFilters(filterName?: string): void {
    const {
      disease,
      disease_categories,
      functional_clusters,
      selection_criteria,
      expression_change,
      methylation_change,
      aging_mechanism,
      protein_classes,
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
      case aging_mechanism:
        this.filters.byAgingMechanisms = [];
        break;
      case protein_classes:
        this.filters.byProteinClass = [];
        break;
      default:
        this.filters.byAgeRelatedProcess = [];
        this.filters.byDiseases = [];
        this.filters.byDiseaseCategories = [];
        this.filters.bySelectionCriteria = [];
        this.filters.byExpressionChange = 0;
        this.filters.byMethylationChange = '';
        this.filters.byAgingMechanisms = [];
        this.filters.byProteinClass = [];
    }
    this.pagination.page = 1;

    this.areMoreThan2FiltersApplied();
  }

  public getSortedAndFilteredGenes(): Observable<FilteredGenes> {
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
      params = params
        .set('sortBy', this.sortParams.active)
        .set('sortOrder', this.sortParams.direction.toUpperCase())
    }

    return this.http.get<FilteredGenes>(`/api/gene/search`, { params });
  }

  private areMoreThan2FiltersApplied(): void {
    const sum = [];
    Object.values(this.filters).forEach((value) => {
      if ((value && value.length) || (typeof value === 'number' && value !== 0)) {
        sum.push(1);
      }
    });
    this.isClearFiltersBtnShown.next(sum.length >= 2);

    this.updateList(this.filters);

    this.setQueryParams(this.filters);
  }

  private setQueryParams(filterParams: Filter): void {
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

    this.router.navigate([''], {
      queryParams: queryParams,
    });
  }
}
