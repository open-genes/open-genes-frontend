import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { GenesListSettings } from '../../genes-list-settings.model';
import { GenesFilterService } from '../../../../../core/services/filters/genes-filter.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SettingsService } from '../../../../../core/services/settings.service';
import { ApiService } from '../../../../../core/services/api/open-genes-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ApiGeneSearchParameters,
  ApiResearchSearchParameters,
} from '../../../../../core/models/filters/filter.model';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FilterPanelLogic } from '../../../../../core/utils/filter-panel-logic';

@Component({
  selector: 'app-gene-filters-panel',
  templateUrl: './gene-filters-panel.component.html',
  styleUrls: ['./gene-filters-panel.component.scss'],
})
export class GeneFiltersPanelComponent
  extends FilterPanelLogic
  implements OnInit, OnDestroy {
  public filtersForm: FormGroup;
  @Output()
  filterReady: EventEmitter<string> = new EventEmitter<string>();

  // FIELDS VISIBILITY
  public listSettings: GenesListSettings;
  // FILTERS
  // Search in selects
  searchText: any;

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
  public predefinedConservativeIn: any[] = [];
  // Experiments
  public predefinedExperimentsStats: boolean;

  @Output()
  showSkeletonChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  filterLoaded: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private apiService: ApiService,
    private filterService: GenesFilterService,
    private settingsService: SettingsService
  ) {
    super(apiService, filterService);
    this.filtersForm = new FormGroup({
      diseasesSelect: new FormControl([[], [null]]),
      diseaseCategoriesSelect: new FormControl([[], [null],]),
      selectionCriteriaSelect: new FormControl([[], [null],]),
      agingMechanismsSelect: new FormControl([[], [null]]),
      proteinClassesSelect: new FormControl([[], [null]]),
      originSelect: new FormControl([[], [null]]),
      familyOriginSelect: new FormControl([[], [null]]),
      conservativeInSelect: new FormControl([[], [null]]),
      experimentsStatsCheckbox: new FormControl([
        false,
        [null],
      ]),
    });
  }

  ngOnInit() {
    this.updateVisibleFields();

    // FILTERS
    // Diseases and Disease categories are an exclusion
    // TODO: These two endpoints should output an array of objects

    // Diseases
    this.diseasesModel = this.getEntities('diseases');
    this.diseasesModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        for (const [key, value] of Object.entries(data)) {
          // TODO: remove this check when backend will be fixed up
          if (value['name']) {
            this.diseases.set(+key, value);
            this.cachedDisease.set(+key, value);
          }
        }
      });

    // Disease categories
    this.diseaseCategoriesModel = this.getEntities('disease-categories');
    this.diseaseCategoriesModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        for (const [key, value] of Object.entries(data)) {
          // TODO: remove this check when backend will be fixed up
          if (value['icdCode'].length !== 0) {
            this.diseaseCategories.set(+key, value);
          }
        }
      });

    // Selection criteria
    this.selectionCriteriaModel = this.getEntities('criteria');
    this.selectionCriteriaModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        this.selectionCriteria = data;
      });

    // Aging mechanisms
    this.agingMechanismsModel = this.getEntities('mechanisms');
    this.agingMechanismsModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        this.agingMechanisms = data;
      });

    // Protein classes
    this.proteinClassesModel = this.getEntities('classes');
    this.proteinClassesModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        this.proteinClasses = data;
      });

    // Gene origin and homology
    this.phylumModel = this.getEntities('phylum');
    this.phylumModel
      .pipe(
        map((data: any) =>
          data.sort((a, b) => a.order - b.order)
        ),
        takeUntil(this.subscription$)
      )
      .subscribe((data: any[]) => {
        this.phylum = data;
      });

    // Set the values that user has already selected in the genes list
    this.getState();
  }

  ngOnDestroy(): void {
    this.subscription$.complete();
  }

  /**
   * Retrieve filters state to a component
   */
  private getState(): void {
    this.getStateForFields([
      {
        field: this.predefinedDiseases,
        type: 'predefinedDiseases',
      },
      {
        field: this.predefinedDiseaseCategories,
        type: 'predefinedDiseaseCategories',
      },
      {
        field: this.predefinedSelectionCriteria,
        type: 'predefinedSelectionCriteria',
      },
      {
        field: this.predefinedAgingMechanisms,
        type: 'predefinedAgingMechanisms',
      },
      {
        field: this.predefinedProteinClasses,
        type: 'predefinedProteinClasses',
      },
      {
        field: this.predefinedOrigin,
        type: 'predefinedOrigin',
      },
      {
        field: this.predefinedFamilyOrigin,
        type: 'predefinedFamilyOrigin',
      },
      {
        field: this.predefinedConservativeIn,
        type: 'predefinedConservativeIn',
      },
      {
        field: this.predefinedExperimentsStats,
        type: 'predefinedExperimentsStats',
      },
    ]);
  }

  /**
   * Wrap abstract class methods to update view on state change
   */
  private getEntities(key: string): Observable<any[]> {
    const r = this.getEntitiesList(key);
    this.filterReady.emit(key);
    return r;
  }

  public applyAndUpdate(
    filterType: ApiResearchSearchParameters,
    $event: MatSelectChange | MatCheckboxChange): void {
    this.apply(filterType, $event);
    this.getState();
  }

  public toggleSwitchAndFilter(filterType: ApiGeneSearchParameters, $event): void {
    this.listSettings.ifShowExperimentsStats = $event.checked;
    this.filterService.applyFilter(
      filterType,
      Number(this.listSettings.ifShowExperimentsStats)
    );
    this.getState();
  }

  /**
   * Exclusions
   */
  public filterDiseases(event: KeyboardEvent): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.diseases = new Map(
      [...this.cachedDisease].filter(([key, value]) =>
        value.name.toLowerCase().includes(searchText)
      )
    );
    event.stopPropagation();
  }

  /**
   * Update list view
   */
  private updateVisibleFields(): void {
    this.filterService.currentFields
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (fields) => {
          this.settingsService.setFieldsForShow(fields);
          this.listSettings = fields;
        },
        (error) => {
          console.warn(error);
        }
      );
  }

  /**
   * List view settings
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public toggleGenesListSettings(
    param: string,
    callback?: void | ((...args: any[]) => void)
  ): void {
    switch (param) {
      case 'gene-age':
        this.listSettings.ifShowAge = !this.listSettings
          .ifShowAge;
        break;
      case 'diseases':
        this.listSettings.ifShowDiseases = !this
          .listSettings.ifShowDiseases;
        break;
      case 'disease-categories':
        this.listSettings.ifShowDiseaseCategories = !this
          .listSettings.ifShowDiseaseCategories;
        break;
      case 'criteria':
        this.listSettings.ifShowCriteria = !this
          .listSettings.ifShowCriteria;
        break;
      case 'mechanisms':
        this.listSettings.ifShowAgingMechanisms = !this
          .listSettings.ifShowAgingMechanisms;
        break;
      case 'classes':
        this.listSettings.ifShowProteinClasses = !this
          .listSettings.ifShowProteinClasses;
        break;
      default:
        break;
    }
    this.filterService.updateFields(this.listSettings);

    if (callback instanceof Function) {
      callback(...callback.arguments);
    }
  }

  /**
   * Form reset
   */
  public resetForm(formControlName: string = null): void {
    if (formControlName) {
      switch (formControlName) {
        case 'diseasesSelect':
          this.filterService.clearFilters('byDiseases');
          break;
        case 'diseaseCategoriesSelect':
          this.filterService.clearFilters('byDiseaseCategories');
          break;
        case 'selectionCriteriaSelect':
          this.filterService.clearFilters('bySelectionCriteria');
          break;
        case 'agingMechanismsSelect':
          this.filterService.clearFilters('byAgingMechanism');
          break;
        case 'proteinClassesSelect':
          this.filterService.clearFilters('byProteinClass');
          break;
        case 'originSelect':
          this.filterService.clearFilters('byOrigin');
          break;
        case 'familyOriginSelect':
          this.filterService.clearFilters('byFamilyOrigin');
          break;
        case 'conservativeInSelect':
          this.filterService.clearFilters('byConservativeIn');
          break;
        case 'experimentsStatsCheckbox':
          this.filterService.clearFilters('researches');
          break;
      }
    } else {
      this.filtersForm.reset();
      this.filterService.clearFilters();
    }
  }
}
