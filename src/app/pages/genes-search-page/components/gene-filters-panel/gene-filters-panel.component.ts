import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { appliedFilter, GenesListSettings } from '../../../../components/shared/genes-list/genes-list-settings.model';
import { ApiGeneSearchParameters, ApiResearchSearchParameters } from '../../../../core/models/filters/filter.model';
import { SettingsService } from '../../../../core/services/settings.service';
import { GenesFilterService } from '../../../../core/services/filters/genes-filter.service';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FilterPanelLogic } from '../../../../core/utils/filter-panel-logic';

type formControls =
  | 'diseasesSelect'
  | 'diseaseCategoriesSelect'
  | 'selectionCriteriaSelect'
  | 'agingMechanismsSelect'
  | 'proteinClassesSelect'
  | 'originSelect'
  | 'familyOriginSelect'
  | 'conservativeInSelect'
  | 'experimentsStatsCheckbox';

enum formControlToFilter {
  'diseasesSelect' = 'byDiseases',
  'diseaseCategoriesSelect' = 'byDiseaseCategories',
  'selectionCriteriaSelect' = 'bySelectionCriteria',
  'agingMechanismsSelect' = 'byAgingMechanism',
  'proteinClassesSelect' = 'byProteinClass',
  'originSelect' = 'byOrigin',
  'familyOriginSelect' = 'byFamilyOrigin',
  'conservativeInSelect' = 'byConservativeIn',
  'experimentsStatsCheckbox' = 'researches'
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-gene-filters-panel',
  templateUrl: './gene-filters-panel.component.html',
  styleUrls: ['./gene-filters-panel.component.scss'],
})
export class GeneFiltersPanelComponent extends FilterPanelLogic implements OnChanges, OnInit, OnDestroy {
  public filtersForm: FormGroup;

  // FIELDS VISIBILITY
  public listSettings: GenesListSettings;
  // FILTERS
  // Search in selects
  searchText: any;

  // Diseases
  public diseases: any[] = [];
  private cachedDiseases: any[] = [];
  public predefinedDiseases: any[] = [];
  public diseasesModel: Observable<any[]>;
  // Disease categories
  public diseaseCategories: any[] = [];
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

  @Input() set lastChangedFilter(filter: appliedFilter) {
    // Change detection workaround
    if (filter.name) {
      this.getState();
    }
  }
  @Output() filterLoaded: EventEmitter<never> = new EventEmitter<never>();
  @Output() filterApplied: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private apiService: ApiService,
    private filterService: GenesFilterService,
    private settingsService: SettingsService,
    private readonly cdRef: ChangeDetectorRef,
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

  ngOnChanges(): void {
    this.getState();
  }

  ngOnInit(): void {
    this.updateVisibleFields();

    // FILTERS
    // Diseases and Disease categories are an exclusion
    // TODO: These two endpoints should output an array of objects

    // Diseases
    this.diseasesModel = this.getEntities('diseases');
    this.diseasesModel
      .subscribe((data: any[]) => {
        console.log('diseases', data);
        this.diseases = data;
        this.cachedDiseases = data;
      });

    // Disease categories
    this.diseaseCategoriesModel = this.getEntities('disease-categories');
    this.diseaseCategoriesModel
      .subscribe((data: any[]) => {
        this.diseaseCategories = data;
      });

    // Selection criteria
    this.selectionCriteriaModel = this.getEntities('criteria');
    this.selectionCriteriaModel
      .subscribe((data: any[]) => {
        this.selectionCriteria = data;
      });

    // Aging mechanisms
    this.agingMechanismsModel = this.getEntities('mechanisms');
    this.agingMechanismsModel
      .subscribe((data: any[]) => {
        this.agingMechanisms = data;
      });

    // Protein classes
    this.proteinClassesModel = this.getEntities('classes');
    this.proteinClassesModel
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
    console.log('GeneFiltersPanelComponent.getState()')
    this.filterService
      .getFilterState()
      .subscribe((data: any) => {
        if (data) {
          this.predefinedDiseases = data.byDiseases;
          this.predefinedDiseaseCategories = data.byDiseaseCategories;
          this.predefinedSelectionCriteria = data.bySelectionCriteria;
          this.predefinedAgingMechanisms = data.byAgingMechanism;
          this.predefinedProteinClasses = data.byProteinClass;
          this.predefinedOrigin = data.byOrigin;
          this.predefinedFamilyOrigin = data.byFamilyOrigin;
          this.predefinedConservativeIn = data.byConservativeIn;
          this.listSettings.ifShowExperimentsStats = !!data.researches;
        }
        console.log('filters', this.filterService.filters);
        console.log('predefinedDiseases', this.predefinedDiseases);
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  /**
   * Wrap abstract class methods to update view on state change
   */
  private getEntities(key: string): Observable<any[]> {
    const r = this.getEntitiesList(key);
    this.filterApplied.emit(key);
    // TODO: use to display skeleton loader
    return r;
  }

  public applyAndUpdate(
    filterType: ApiResearchSearchParameters,
    $event: MatSelectChange | MatCheckboxChange): void {
    this.apply(filterType, $event);
    this.getState();
    this.filterLoaded.emit();
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
   * Search
   */
  public filterDiseases(event: KeyboardEvent): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.diseases = this.cachedDiseases.filter(
      (d) => d.name.toLowerCase().includes(searchText)
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
  public resetForm(formControlName: formControls = null): void {
    if (formControlName) {
      this.filterService.clearFilters(formControlToFilter[formControlName]);
      this.filtersForm.controls[formControlName].reset();
    } else {
      this.filtersForm.reset();
      this.filterService.clearFilters();
    }
  }
}
