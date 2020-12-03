import {Injectable} from '@angular/core';
import {Observable, of, BehaviorSubject} from 'rxjs';
import {Filter} from '../../../../core/models';
import {FilterTypesEnum} from './filter-types.enum';

@Injectable({
  providedIn: 'root'
})

export class FilterService {
  public filters: Filter = {
    byName: false,
    byAge: false,
    byClasses: [],
    byExpressionChange: 0,
  };

  private areMt2FiltersApplied = new BehaviorSubject(false);

  // TODO: save this object in localStorage

  constructor() {
  }

  // Filter
  public filterByFuncClusters(id: number): Observable<number[]> {
    if (!this.filters.byClasses.includes(id)) {
      this.filters.byClasses.push(id);
    } else {
      this.filters.byClasses = this.filters.byClasses.filter(item => item !== id);
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

  // Get
  public getByFuncClusters(): Observable<number[]> {
    return of(this.filters.byClasses);
  }

  public getByExpressionChange(): Observable<number> {
    return of(this.filters.byExpressionChange);
  }

  // Clear
  public clearFilters(filter?: FilterTypesEnum) {
    const {classes, expressionChange, age, name} = FilterTypesEnum; // destructuring
    if (filter === name) {
      this.filters.byName = false;
    } else if (filter === age) {
    } else if (filter === classes) {
      this.filters.byClasses = [];
    } else if (filter === expressionChange) {
      this.filters.byExpressionChange = 0;
    } else {
      this.filters = {
        byName: false,
        byAge: false,
        byClasses: [],
        byExpressionChange: 0
      };
    }
  }

  public whatFiltersApplied(): Observable<any> {
    return of(this.filters);
  }

  public areMoreThan2FiltersApplied(): Observable<BehaviorSubject<boolean>> {
    const n = Number(this.filters.byName); // 0
    const a = Number(this.filters.byAge); // 0
    const c = this.filters.byClasses.length; // 0
    const e = this.filters.byExpressionChange; // 0

    // then if flters change and their sum is more than 2:
    if ((n + a + c + e) >= 2) {
      this.areMt2FiltersApplied.next(true);
    }

    return of(this.areMt2FiltersApplied);
  }
}
