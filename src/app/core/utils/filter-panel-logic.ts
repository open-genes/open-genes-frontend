import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '../services/api/open-genes-api.service';
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
  'predefinedModelOrganisms' = 'bySpecies',
}

interface StateParams {
  field: any[];
  type: string;
}

export abstract class FilterPanelLogic {
  protected subscription$ = new Subject();
  public listSettings: GenesListSettings;

  constructor(public api: ApiService, public service: any) {}

  public getStateForFields(updateFields: StateParams[]): void {
    this.service
      .getFilterState()
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any) => {
        updateFields.forEach((f) => {
          const key = FilterStateEnum[f.type];
          f.field = data[key];
        });
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
        return this.api.getAgeRelatedProcesses();
      case 'mechanisms':
        return this.api.getAgingMechanisms();
      case 'criteria':
        return this.api.getSelectionCriteria();
      case 'diseases':
        return this.api.getDiseases();
      case 'disease-categories':
        return this.api.getDiseaseCategories();
      case 'classes':
        return this.api.getProteinClasses();
      case 'phylum':
        return this.api.getPhylum();
      case 'model-organisms':
        return this.api.getModelOrganisms();
      default:
        return;
    }
  }

  public apply(filterType: any, $event: MatSelectChange | MatCheckboxChange): void {
    let value;
    if ($event instanceof MatCheckboxChange) {
      value = $event.checked;
    } else if ($event instanceof MatSelectChange) {
      value = $event.value;
    }
    this.service.clearFilters(filterType);

    // Check if event is emitted on select change
    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    // If value is emitted when user clicks empty option which is "Not selected"
    // There is no id 0, so we don't send this value
    if (Number(value) === 0) {
      return;
    }

    this.service.applyFilter(filterType, value);
  }
}
