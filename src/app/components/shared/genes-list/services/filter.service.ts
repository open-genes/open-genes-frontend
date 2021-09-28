import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Filter } from './filter.model';
import { FilterTypesEnum } from './filter-types.enum';
import { GenesListSettings } from '../genes-list-settings.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _listOfFields = new BehaviorSubject<any>('');
  public currentFields: Observable<GenesListSettings> = this._listOfFields.asObservable();

  public isClearFiltersBtnShown = new BehaviorSubject<boolean>(false);

  public listOfFields: GenesListSettings = {
    // Default:
    ifShowAge: true,
    ifShowClasses: true,
    ifShowExpression: true,
    ifShowDiseases: true,
    ifShowDiseaseCategories: false,
    ifShowCriteria: true,
    ifShowMethylation: false,
  };

  public filters: Filter = {
    byName: false,
    byAge: false,
    byClasses: [],
    byExpressionChange: 0,
    byMethylationChange: '',
    byDisease: '',
    byDiseaseCategories: '',
    bySelectionCriteria: '',
  };

  constructor() {
    this.updateFields(this.listOfFields);
  }

  public updateFields(fields) {
    this._listOfFields.next(fields);
  }

  // Filter
  public filterByFuncClusters(id: number): Observable<number[]> {
    if (!this.filters.byClasses.includes(id)) {
      this.filters.byClasses.push(id);
    } else {
      this.filters.byClasses = this.filters.byClasses.filter((item) => item !== id);
    }

    this.areMoreThan2FiltersApplied();
    return of(this.filters.byClasses);
  }

  public filterByExpressionChange(expression: number): Observable<number> {
    if (this.filters.byExpressionChange !== expression) {
      this.filters.byExpressionChange = expression;
    } else {
      this.filters.byExpressionChange = 0;
    }

    this.areMoreThan2FiltersApplied();
    return of(this.filters.byExpressionChange);
  }

  public filterByMethylationChange(correlation: string): Observable<string> {
    if (this.filters.byMethylationChange !== correlation) {
      this.filters.byMethylationChange = correlation;
    } else {
      this.filters.byMethylationChange = '';
    }

    this.areMoreThan2FiltersApplied();
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
    return of(this.filters.bySelectionCriteria);
  }

  public filterByDisease(name: string): Observable<string> {
    if (!this.filters.byDisease.includes(name)) {
      this.filters.byDisease = name;
    } else {
      this.filters.byDisease = '';
    }

    this.areMoreThan2FiltersApplied();
    return of(this.filters.byDisease);
  }

  public filterByDiseaseCategories(key: string): Observable<string> {
    if (!this.filters.byDiseaseCategories.includes(key)) {
      this.filters.byDiseaseCategories = key;
    } else {
      this.filters.byDiseaseCategories = '';
    }
    this.areMoreThan2FiltersApplied();
    return of(this.filters.byDiseaseCategories);
  }

  // Get
  public getByFuncClusters(): Observable<number[]> {
    return of(this.filters.byClasses);
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
  public clearFilters(filter?: FilterTypesEnum): void {
    const { name, age, classes, expressionChange, methylation, disease, diseaseCategories, criteria } = FilterTypesEnum;
    if (filter) {
      if (filter === name) {
        this.filters.byName = false;
      } else if (filter === age) {
        this.filters.byAge = false;
      } else if (filter === classes) {
        this.filters.byClasses = [];
      } else if (filter === expressionChange) {
        this.filters.byExpressionChange = 0;
      } else if (filter == methylation) {
        this.filters.byMethylationChange = '';
      } else if (filter === disease) {
        this.filters.byDisease = '';
      } else if (filter === diseaseCategories) {
        this.filters.byDiseaseCategories = '';
      } else if (filter === criteria) {
        this.filters.bySelectionCriteria = '';
      }
    } else {
      this.filters.byName = false;
      this.filters.byAge = false;
      this.filters.byClasses = [];
      this.filters.byExpressionChange = 0;
      this.filters.byMethylationChange = '';
      this.filters.byDisease = '';
      this.filters.byDiseaseCategories = '';
      this.filters.bySelectionCriteria = '';
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

    // when filters change and their sum is more than 2:
    if (sum.length >= 2) {
      return this.isClearFiltersBtnShown.next(true);
    }

    return this.isClearFiltersBtnShown.next(false);
  }
}
