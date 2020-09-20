import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Filter} from '../../../../core/models';
import {FilterTypesEnum} from "./filter-types.enum";

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

  // TODO: потом сохранять этот объект в localStorage

  constructor() {
  }

  public filterByFuncClusters(id: number): Observable<any[]> {
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
}
