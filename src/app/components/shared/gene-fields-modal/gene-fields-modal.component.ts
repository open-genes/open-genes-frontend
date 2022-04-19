import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { GenesListSettings } from '../genes-list/genes-list-settings.model';
import { FilterService } from '../genes-list/services/filter.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SettingsService } from '../../../core/services/settings.service';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterTypes } from '../../../core/models/filters/filter-types.model';
import { MatSelectChange } from '@angular/material/select';
import { Filter } from '../../../core/models/filters/filter.model';
import { FilterTypesEnum } from '../genes-list/services/filter-types.enum';

@Component({
  selector: 'app-gene-fields-modal',
  templateUrl: './gene-fields-modal.component.html',
  styleUrls: ['./gene-fields-modal.component.scss'],
})
export class GeneFieldsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  // FIELDS VISIBILITY
  public listSettings: GenesListSettings;
  // FILTERS
  // Search in selects
  searchText: any;

  // Age-related processes
  public processes: any[] = []; // TODO: typing
  public predefinedProcesses: any[] = [];
  public processesModel: Observable<any[]>;
  // Expression
  public predefinedExpressionChanges: number;
  // Diseases
  public diseases: Map<number, any> = new Map();
  private cachedDisease: Map<number, any> = new Map();
  public predefinedDiseases: any[] = [];
  public diseasesModel: Observable<any[]>;
  // Disease categories
  public diseaseCategories: Map<number, any> = new Map();
  public predefinedDiseaseCategories: any[] = [];
  public diseaseCategoriesModel: Observable<any[]>;
  // Selection criteria
  public selectionCriteria: any[] = [];
  public predefinedSelectionCriteria: any[] = [];
  public selectionCriteriaModel: Observable<any[]>;
  // Aging mechanisms
  public agingMechanisms: any[] = [];
  public predefinedAgingMechanisms: any[] = [];
  private agingMechanismsModel: Observable<any[]>;
  // Protein classes
  public proteinClasses: any[] = [];
  public predefinedProteinClasses: any[] = [];
  private proteinClassesModel: Observable<any[]>;

  // Phylum
  public phylum: any[] = [];
  private phylumModel: Observable<any[]>;
  public predefinedOrigin: any[] = [];
  public predefinedFamilyOrigin: any[] = [];
  public predefinedConservativeIn: any[] =[]


  public filtersForm: FormGroup;
  public filterTypes = FilterTypesEnum;
  public isViewReady = false;

  private subscription$ = new Subject();

  @Output() showSkeletonChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() filterLoaded: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private apiService: ApiService,
    private filterService: FilterService,
    private settingsService: SettingsService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.filtersForm = new FormGroup({
      ageRelatedProcessesSearchInput: new FormControl([[], null]),
      ageRelatedProcessesSelect: new FormControl([[], [null]]),
      expressionChangeSelect: new FormControl([[], null]),
      diseasesSelect: new FormControl([[], [null]]),
      diseaseCategoriesSelect: new FormControl([[], [null]]),
      selectionCriteriaSelect: new FormControl([[], [null]]),
      agingMechanismsSelect: new FormControl([[], [null]]),
      proteinClassesSelect: new FormControl([[], [null]]),
      originSelect: new FormControl([[], [null]]),
      familyOriginSelect: new FormControl([[], [null]]),
      conservativeInSelect: new FormControl([[], [null]]),
    });
  }

  ngOnInit() {
    this.updateVisibleFields();

    // FILTERS
    // Age-related processes
    this.processesModel = this.getEntitiesList('processes');
    this.processesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.processes = data;
    });

    // Diseases
    this.diseasesModel = this.getEntitiesList('diseases');
    this.diseasesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      // TODO: В этом эндпоинте должен отдаваться массив объектов
      for (const [key, value] of Object.entries(data)) {
        // TODO: remove this check when backend will be fixed up
        if (value['name']) {
          this.diseases.set(+key, value);
          this.cachedDisease.set(+key, value);
        }
      }
    });

    // Disease categories
    this.diseaseCategoriesModel = this.getEntitiesList('disease-categories');
    this.diseaseCategoriesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      // TODO: В этом эндпоинте должен отдаваться массив объектов
      for (const [key, value] of Object.entries(data)) {
        // TODO: remove this check when backend will be fixed up
        if (value['icdCode'].length !== 0) {
          this.diseaseCategories.set(+key, value);
        }
      }
    });

    // Selection criteria
    this.selectionCriteriaModel = this.getEntitiesList('criteria');
    this.selectionCriteriaModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.selectionCriteria = data;
    });

    // Aging mechanisms
    this.agingMechanismsModel = this.getEntitiesList('mechanisms');
    this.agingMechanismsModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.agingMechanisms = data;
    });

    // Protein classes
    this.proteinClassesModel = this.getEntitiesList('classes');
    this.proteinClassesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.proteinClasses = data;
    });

    this.phylumModel = this.getEntitiesList('phylum');
    this.phylumModel
      .pipe(
        map((data: any) => data.sort((a, b) => a.order - b.order)),
        takeUntil(this.subscription$)
      )
      .subscribe((data: any[]) => {
        this.phylum = data;
      });

    // Set the values tha user has already selected in the genes list
    this.filterService
      .getFilterState()
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: Filter) => {
        this.predefinedProcesses = data.byAgeRelatedProcess;
        this.predefinedExpressionChanges = data.byExpressionChange;
        this.predefinedDiseases = data.byDiseases;
        this.predefinedDiseaseCategories = data.byDiseaseCategories;
        this.predefinedSelectionCriteria = data.bySelectionCriteria;
        this.predefinedAgingMechanisms = data.byAgingMechanism;
        this.predefinedProteinClasses = data.byProteinClass;
        this.predefinedOrigin = data.byOrigin;
        this.predefinedFamilyOrigin = data.byFamilyOrigin;
        this.predefinedConservativeIn = data.byConservativeIn;

        this.cdRef.detectChanges();
      });
  }

  ngAfterViewInit() {
    this.isViewReady = true;
    this.showSkeletonChange.emit(false);
  }

  ngOnDestroy(): void {
    this.subscription$.complete();
  }

  /**
   * Check if values being passed into a select control exist in options array
   */

  compareSelectValues(value1: any, value2: any): boolean {
    if (value1 && value2) {
      return value1 === value2;
    }
    return false;
  }

  /**
   * Get entities for filters lists
   */

  private getEntitiesList(key): Observable<any[]> {
    this.filterLoaded.emit(key);
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
        return this.apiService.getProteinClasses();
      case 'phylum':
        return this.apiService.getPhylum();
      default:
        return;
    }
  }

  public apply(filterType: FilterTypes, $event: MatSelectChange): void {
    this.filterService.clearFilters(filterType);

    // Check if event is emitted on select change
    if (Array.isArray($event.value) && $event.value.length === 0) {
      return;
    }

    // If value is emitted when user clicks empty option which is "Not selected"
    // There is no id 0, so we don't send this value
    if (Number($event.value) === 0) {
      return;
    }

    this.filterService.applyFilter(filterType, $event.value);
    this.cdRef.detectChanges();
  }

  public filterDiseases(event: KeyboardEvent): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.diseases = new Map(
      [...this.cachedDisease].filter(([key, value]) => value.name.toLowerCase().includes(searchText)),
    );
    event.stopPropagation();
  }

  public resetForm(formControlName: string = null): void {
    if (formControlName) {
      switch (formControlName) {
        case 'ageRelatedProcessesSelect':
          this.filterService.clearFilters('age_related_processes');
          break;
        case 'expressionChangeSelect':
          this.filterService.clearFilters('expression_change');
          break;
        case 'diseasesSelect':
          this.filterService.clearFilters('disease');
          break;
        case 'diseaseCategoriesSelect':
          this.filterService.clearFilters('disease_categories');
          break;
        case 'selectionCriteriaSelect':
          this.filterService.clearFilters('selection_criteria');
          break;
        case 'agingMechanismsSelect':
          this.filterService.clearFilters('aging_mechanism');
          break;
        case 'proteinClassesSelect':
          this.filterService.clearFilters('protein_classes');
          break;
        case 'originSelect':
          this.filterService.clearFilters('origin');
          break;
        case 'familyOriginSelect':
          this.filterService.clearFilters('family_origin');
          break;
        case 'conservativeInSelect':
          this.filterService.clearFilters('conservative_in,');
          break;
      }
    } else {
      this.filtersForm.reset();
      this.filterService.clearFilters();
    }
    this.cdRef.detectChanges();
  }

  /**
   * Update list view
   */

  private updateVisibleFields(): void {
    this.filterService.currentFields.pipe(takeUntil(this.subscription$)).subscribe(
      (fields) => {
        this.settingsService.setFieldsForShow(fields);
        this.listSettings = fields;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.warn(error);
      },
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
}
