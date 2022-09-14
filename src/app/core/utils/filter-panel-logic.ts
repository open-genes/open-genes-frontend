import { Observable, of, Subject } from 'rxjs';
import { ApiService } from '../services/api/open-genes-api.service';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GenesListSettings } from '../../components/shared/genes-list/genes-list-settings.model';
import { map, takeUntil } from 'rxjs/operators';

export abstract class FilterPanelLogic {
  protected subscription$ = new Subject();
  public listSettings: GenesListSettings;

  constructor(public api: ApiService, public service: any) {}
  /**
   * Check if values being passed into a select control exist in options array
   */
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
    const diseases = [];
    const diseaseCategories = [];
    switch (key) {
      case 'processes':
        return this.api.getAgeRelatedProcesses();
      case 'mechanisms':
        return this.api.getAgingMechanisms();
      case 'criteria':
        return this.api.getSelectionCriteria();
      case 'diseases':
        this.api
          .getDiseases()
          .pipe(takeUntil(this.subscription$))
          .subscribe((data: any[]) => {
            for (const [id, entries] of Object.entries(data)) {
              if (entries.name?.length) {
                diseases.push({ id: Number(id), ...entries });
              }
            }
          });
        return of(diseases);
      case 'disease-categories':
        this.api
          .getDiseaseCategories()
          .pipe(
            takeUntil(this.subscription$),
            map((d) => {
              return d;
            }),
          )
          .subscribe((data: any[]) => {
          for (const [id, entries] of Object.entries(data)) {
            if (entries.icdCategoryName?.length && entries.icdCode?.length) {
              diseaseCategories.push({id: Number(id), ...entries});
            }
          }
        });
        return of(diseaseCategories);
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

    this.service.applyFilter(filterType, value);
  }
}
