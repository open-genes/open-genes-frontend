import { Directive, EventEmitter, Injector, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../services/api/open-genes-api.service';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { ApiSearchParameters, Filter } from '../models/filters/filter.model';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';

enum FilterStateEnum {
  'predefinedProcesses' = 'byAgeRelatedProcess',
  'predefinedExpressionChanges' = 'byExpressionChange',
  'predefinedDiseases' = 'byDiseases',
  'predefinedDiseaseCategories' = 'byDiseaseCategories',
  'predefinedSelectionCriteria' = 'bySelectionCriteria',
  'predefinedAgingMechanisms' = 'byAgingMechanism',
  'predefinedProteinClasses' = 'byProteinClass',
  'predefinedOrigin' = 'byOrigin',
  'predefinedFamilyOrigin' = 'byFamilyOrigin',
  'predefinedConservativeIn' = 'byConservativeIn',
}

interface StateParams {
  field: any[];
  type: string;
}

@Directive()
export class FilterPanelLogic {
  protected subscription$ = new Subject();
  public listSettings: GenesListSettings;
  @Output() filterReady: EventEmitter<string> = new EventEmitter<string>();

  constructor(public apiService: ApiService, public filterService: FilterService) {}

  public getStateForFields(updateFields: StateParams[]): void {
    this.filterService
      .getFilterState()
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: Filter) => {
        updateFields.forEach((f) => {
          const key = FilterStateEnum[f.type];
          f.field = data[key];
        });

        // this.emitViewUpdate.emit(false);
      });
  }

  public compareSelectValues(value1: any, value2: any): boolean {
    if (value1 && value2) {
      return value1 === value2;
    }
    return false;
  }

  /**
   * Get entities for filters lists
   */
  public getEntitiesList(key): Observable<any[]> {
    switch (key) {
      case 'processes':
        return this.apiService.getAgeRelatedProcesses();
      case 'mechanisms':
        return this.apiService.getAgingMechanisms();
      case 'criteria':
        return this.apiService.getSelectionCriteria();
      case 'diseases':
        return this.apiService.getDiseases();
      case 'disease-categories':
        return this.apiService.getDiseaseCategories();
      case 'classes':
        return this.apiService.getProteinClasses();
      case 'phylum':
        return this.apiService.getPhylum();
      default:
        return;
    }
  }

  public apply(filterType: ApiSearchParameters, $event: MatSelectChange | MatCheckboxChange): void {
    let value;
    if ($event instanceof MatCheckboxChange) {
      value = $event.checked;
    } else if ($event instanceof MatSelectChange) {
      value = $event.value;
    }
    this.filterService.clearFilters(filterType);

    // Check if event is emitted on select change
    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    // If value is emitted when user clicks empty option which is "Not selected"
    // There is no id 0, so we don't send this value
    if (Number(value) === 0) {
      return;
    }

    this.filterService.applyFilter(filterType, value);
  }
}
