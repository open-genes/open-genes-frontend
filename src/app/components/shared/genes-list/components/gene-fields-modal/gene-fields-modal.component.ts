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
  // FIELDS VISIBILITY
  public listSettings: GenesListSettings;
  // FILTERS
  // Age-related processes
  public processes: any[]; // TODO: typing
  public predefinedProcesses: any[];
  public processesModel: Observable<any[]>;
  // Expression
  public predefinedExpressionChanges: number;
  // Diseases
  public diseases: Map<number, any> = new Map();
  public predefinedDiseases: any[];
  public diseasesModel: Observable<any[]>;
  // Disease categories
  public diseaseCategories: Map<number, any> = new Map();
  public predefinedDiseaseCategories: any[];
  public diseaseCategoriesModel: Observable<any[]>;
  // Selection criteria
  public selectionCriteria: any[];
  public predefinedSelectionCriteria: any[];
  public selectionCriteriaModel: Observable<any[]>;
  // Aging mechanisms
  public agingMechanisms: any[];
  public predefinedAgingMechanisms: any[];
  private agingMechanismsModel: Observable<any[]>;

  public filtersForm: FormGroup;
  private unsubscribe$ = new Subject();
  private subscription$ = new Subject();

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<GeneFieldsModalComponent>,
    private filterService: FilterService,
    private settingsService: SettingsService
  ) {
    this.filtersForm = new FormGroup({
      ageRelatedProcessesSelect: new FormControl([[], [Validators.minLength(1)]]),
      expressionChangeSelect: new FormControl([[], null]),
      diseasesSelect: new FormControl([[], [Validators.minLength(1)]]),
      diseaseCategoriesSelect: new FormControl([[], [Validators.minLength(1)]]),
      selectionCriteriaSelect: new FormControl([[], [Validators.minLength(1)]]),
      agingMechanismsSelect: new FormControl([[], [Validators.minLength(1)]]),
    });

    this.updateVisibleFields();

    // FILTERS
    // Age-related processes
    this.processesModel = this.getEntitiesList('processes');
    this.processesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.processes = data;
    });
    this.predefinedProcesses = this.filterService.filters.byAgeRelatedProcess;

    // Diseases
    this.diseasesModel = this.getEntitiesList('diseases');
    this.diseasesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      // TODO: OG-661. Это поменяется при переходе на новую версию api/gene/search (будет массивом объектов)
      for (const [key, value] of Object.entries(data)) {
        this.diseases.set(+key, value);
      }
    });
    this.predefinedDiseases = this.filterService.filters.byDiseases;

    // Disease categories
    this.diseaseCategoriesModel = this.getEntitiesList('disease-categories');
    this.diseaseCategoriesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      // TODO: OG-661. Это поменяется при переходе на новую версию api/gene/search (будет массивом объектов)
      for (const [key, value] of Object.entries(data)) {
        this.diseaseCategories.set(+key, value);
      }
    });
    this.predefinedDiseaseCategories = this.filterService.filters.byDiseaseCategories;

    // Selection criteria
    this.selectionCriteriaModel = this.getEntitiesList('criteria');
    this.selectionCriteriaModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.selectionCriteria = data;
    });
    this.predefinedSelectionCriteria = this.filterService.filters.bySelectionCriteria;

    // Aging mechanisms
    this.agingMechanismsModel = this.getEntitiesList('mechanisms');
    this.agingMechanismsModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.agingMechanisms = data;
    });
    this.predefinedAgingMechanisms = this.filterService.filters.byAgingMechanisms;

    // Protein classes
    // TODO: нет эндпоинта со списком
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
      case 'classes':
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
      default:
        break;
    }
    this.filterService.updateFields(this.listSettings);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
