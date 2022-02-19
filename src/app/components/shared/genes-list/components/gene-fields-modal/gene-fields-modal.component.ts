import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GenesListSettings } from '../../genes-list-settings.model';
import { FilterService } from '../../services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SettingsService } from '../../../../../core/services/settings.service';
import { ApiService } from '../../../../../core/services/api/open-genes-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterTypes } from '../../../../../core/models/filters/filter-types.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-gene-fields-modal',
  templateUrl: './gene-fields-modal.component.html',
  styleUrls: ['./gene-fields-modal.component.scss'],
})
export class GeneFieldsModalComponent implements OnDestroy {
  public listSettings: GenesListSettings;
  //
  public processes: any[];
  public predefinedProcesses: any[];
  public processesModel: Observable<any[]>;
  //
  public filtersForm: FormGroup;
  private unsubscribe$ = new Subject();
  private subscription$ = new Subject();

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<GeneFieldsModalComponent>,
    private filterService: FilterService,
    private settingsService: SettingsService,
  ) {
    this.filtersForm = new FormGroup({
      ageRelatedProcessesSelect: new FormControl([[], [Validators.minLength(1)]]),
    });

    this.updateVisibleFields();

    this.processesModel = this.getEntitiesList('processes');
    this.processesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.processes = data;
    });

    this.predefinedProcesses = this.filterService.filters.byAgeRelatedProcess;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

  /**
   * Check if values being passed into a select control exist in options array
   */

  compareSelectValues(value1: any | any[], value2: any): boolean {
    if (value1 && value2) {
      return value1.id === value2.id;
    }
    return false;
  }

  /**
   * Get entities for filters lists
   */

  private getEntitiesList(key): Observable<any[]> {
    switch (key) {
      case 'processes':
        return this.apiService.getAgeRelatedProcesses();
      case 'mechanisms':
        return this.apiService.getAgingMechanisms();
      case 'criteria':
        return this.apiService.getSelectionCriteria();
      case 'diseases':
        return this.apiService.getDiseases();
      // TODO: diseases have a different structure than other entities
      case 'disease-categories':
        return this.apiService.getDiseaseCategories();
      default:
        return;
    }
  }

  public apply(filterType: FilterTypes, $event: MatSelectChange): void {
    // Check if event is emitted on select change
    if (Array.isArray($event.value) && $event.value.length === 0) {
      return;
    }

    this.filterService.applyFilter(filterType, $event.value);
    console.log(this.filterService.filters.byAgeRelatedProcess);
  }

  public resetForm(): void {
    this.filtersForm.reset();
  }

  /**
   * Update list view
   */

  private updateVisibleFields() {
    this.filterService.currentFields.pipe(takeUntil(this.subscription$)).subscribe(
      (fields) => {
        this.settingsService.setFieldsForShow(fields);
        this.listSettings = fields;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * List view settings
   */

  public changeGenesListSettings(param: string): void {
    switch (param) {
      case 'gene-age':
        this.listSettings.ifShowAge = !this.listSettings.ifShowAge;
        break;
      case 'processes':
        this.listSettings.ifShowFuncClusters = !this.listSettings.ifShowFuncClusters;
        break;
      case 'expression':
        this.listSettings.ifShowExpression = !this.listSettings.ifShowExpression;
        break;
      case 'diseases':
        this.listSettings.ifShowDiseases = !this.listSettings.ifShowDiseases;
        break;
      case 'disease-categories':
        this.listSettings.ifShowDiseaseCategories = !this.listSettings.ifShowDiseaseCategories;
        break;
      case 'criteria':
        this.listSettings.ifShowCriteria = !this.listSettings.ifShowCriteria;
        break;
      case 'mechanisms':
        this.listSettings.ifShowAgingMechanisms = !this.listSettings.ifShowAgingMechanisms;
        break;
      case 'classes':
        this.listSettings.ifShowProteinClasses = !this.listSettings.ifShowProteinClasses;
        break;
      default:
        break;
    }
    this.filterService.updateFields(this.listSettings);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
