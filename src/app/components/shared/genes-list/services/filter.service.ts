import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Filter } from './filter.model';
import { FilterTypesEnum } from './filter-types.enum';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public filters: Filter = {
    byName: false,
    byAge: false,
    byClasses: [],
    byExpressionChange: 0,
    bySelectionCriteria: [],
  };

  public $filters: Observable<Filter> = of({
    byName: false,
    byAge: false,
    byClasses: [],
    byExpressionChange: 0,
    bySelectionCriteria: [],
  });

  private areMt2FiltersApplied = new BehaviorSubject(false);
  // TODO: save this object in localStorage

  // Filter
  public filterByFuncClusters(id: number): Observable<number[]> {
    if (!this.filters.byClasses.includes(id)) {
      this.filters.byClasses.push(id);
    } else {
      this.filters.byClasses = this.filters.byClasses.filter(
        (item) => item !== id
      );
    }

    return of(this.filters.byClasses);
  }

  public filterByExpressionChange(expression: number): Observable<number> {
    if (this.filters.byExpressionChange !== expression) {
      this.filters.byExpressionChange = expression;
    } else {
      this.filters.byExpressionChange = 0;
    }

    return of(this.filters.byExpressionChange);
  }

  // TODO: Ask backend to send unique id's for each criteria, type will change to number[]
  public filterBySelectionCriteria(str: string): Observable<string[]> {
    if (!this.filters.bySelectionCriteria.includes(str)) {
      this.filters.bySelectionCriteria.push(str);
    } else {
      this.filters.bySelectionCriteria = this.filters.bySelectionCriteria.filter(
        (item) => item !== str
      );
    }

    return of(this.filters.bySelectionCriteria);
  }

  // Get
  public getByFuncClusters(): Observable<number[]> {
    return of(this.filters.byClasses);
  }

  public getByExpressionChange(): Observable<number> {
    return of(this.filters.byExpressionChange);
  }

  public getBySelectionCriteria(): Observable<string[]> {
    return of(this.filters.bySelectionCriteria);
  }

  // Clear
  public clearFilters(filter?: FilterTypesEnum): void {
    const { classes, expressionChange, age, name } = FilterTypesEnum;
    if (filter) {
      if (filter === name) {
        this.filters.byName = false;
      } else if (filter === age) {
        this.filters.byAge = false;
      } else if (filter === classes) {
        this.filters.byClasses = [];
      } else if (filter === expressionChange) {
        this.filters.byExpressionChange = 0;
      }
    } else {
      this.filters = {
        byName: false,
        byAge: false,
        byClasses: [],
        byExpressionChange: 0,
        bySelectionCriteria: [],
      };
    }
  }

  private howManyFiltersApplied(): number {
    const n = Number(this.filters.byName); // 0
    const a = Number(this.filters.byAge); // 0
    const c = this.filters.byClasses.length; // 0
    const e = this.filters.byExpressionChange; // 0
    const s = this.filters.bySelectionCriteria.length; // 0

    return n + a + c + e + s;
  }

  public areMoreThan2FiltersApplied(): Observable<boolean> {
    // when if filters change and their sum is more than 2:
    if (this.howManyFiltersApplied() >= 2) {
      return of(true);
    }

    return of(false);
  }
}
