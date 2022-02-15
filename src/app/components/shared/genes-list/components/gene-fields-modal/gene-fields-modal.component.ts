import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GenesListSettings } from '../../genes-list-settings.model';
import { FilterService } from '../../services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SettingsService } from '../../../../../core/services/settings.service';
import { ApiService } from '../../../../../core/services/api/open-genes-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterTypes } from '../../../../../core/models/filter-types.model';

@Component({
  selector: 'app-gene-fields-modal',
  templateUrl: './gene-fields-modal.component.html',
  styleUrls: ['./gene-fields-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneFieldsModalComponent implements OnInit, OnDestroy {
  public filtersForm: FormGroup;
  public listSettings: GenesListSettings;

  public processes: any[];
  public processesModel: Observable<any[]>;

  private unsubscribe$ = new Subject();
  private subscription$ = new Subject();

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<GeneFieldsModalComponent>,
    private filterService: FilterService,
    private settingsService: SettingsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.filtersForm = new FormGroup({
      ageRelatedProcessesSelect: new FormControl([], null),
    });
  }

  ngOnInit(): void {
    this.updateCurrentFields();
    this.processesModel = this.getEntitiesList('age-related-processes');
    this.processesModel.pipe(takeUntil(this.subscription$)).subscribe((data) => {
      this.processes = data;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

  /**
   * Get entities for filters lists
   */

  private getEntitiesList(key): Observable<any[]> {
    switch (key) {
      case 'age-related-processes':
        return this.apiService.getAgeRelatedProcesses();
      case 'aging-mechanisms':
        return this.apiService.getAgingMechanisms();
      case 'selection-criteria':
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

  public apply(filterType: FilterTypes, filterValue: number | string): void {
    this.filterService.applyFilter(filterType, filterValue);
    this.cdRef.markForCheck();
  }

  public resetForm(): void {
    this.filtersForm.reset();
  }

  // Каждый форм контрол вызывает метод, получает объект formControlModel и потом:
  // formControlModel.stream$.pipe(takeUntil(this.unsubscribe$)).subscribe((items) => {
  //   data = Object.values(items)
  // });

  /**
   * Update list view
   */

  private updateCurrentFields() {
    this.filterService.currentFields.pipe(takeUntil(this.subscription$)).subscribe(
      (fields) => {
        this.settingsService.setFieldsForShow(fields);
        this.listSettings = fields;
        this.cdRef.markForCheck();
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
