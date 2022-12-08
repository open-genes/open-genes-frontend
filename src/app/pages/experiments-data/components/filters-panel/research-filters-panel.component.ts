import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApiResearchSearchParameters } from '../../../../core/models/filters/filter.model';
import { FilterPanelLogic } from '../../../../core/utils/filter-panel-logic';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { StudiesFilterService } from '../../../../core/services/filters/studies-filter.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-research-filters-panel',
  templateUrl: './research-filters-panel.component.html',
  styleUrls: ['./research-filters-panel.component.scss'],
})
export class ResearchDataFiltersPanelComponent extends FilterPanelLogic implements OnInit, OnDestroy {
  public filtersForm: FormGroup;
  @Output() filterReady: EventEmitter<string> = new EventEmitter<string>();

  // Search in selects
  searchText: any;

  // Selection criteria
  public selectionCriteria: any[] = []; // TODO: typing
  public predefinedSelectionCriteria: any[] = [];
  public selectionCriteriaModel: Observable<any[]>;

  // Model organism
  public modelOrganisms: any[] = [];
  public predefinedModelOrganisms: any[] = [];
  public modelOrganismsModel: Observable<any[]>;

  constructor(
    public filterService: StudiesFilterService,
    public apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    super(apiService, filterService);
    this.filtersForm = new FormGroup({
      selectionCriteriaSelect: new FormControl([[], [null]]),
      modelOrganismSelect: new FormControl([null, null]),
    });
  }

  ngOnInit(): void {
    // FILTERS
    // Selection criteria
    this.selectionCriteriaModel = this.populateSelect('criteria');
    this.selectionCriteriaModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        this.selectionCriteria = data;
      });

    // Model organism
    this.modelOrganismsModel = this.populateSelect('model-organisms');
    this.modelOrganismsModel
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: any[]) => {
        this.modelOrganisms = data;
      });

    // Set the values tha user has already selected in the genes list
    this.getState();
  }

  ngOnDestroy(): void {
    this.subscription$.complete();
  }

  /**
   * Retrieve filters state to a component
   */
  private getState(): void {
    this.filterService
      .getFilterState()
      .subscribe((data: any) => {
        if (data) {
          this.predefinedModelOrganisms = data.bySpecies;
          this.predefinedSelectionCriteria = data.bySelectionCriteria;
        }
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  /**
   * Wrap abstract class methods to update view on state change
   */
  private populateSelect(key: string): Observable<any[]> {
    const r = this.getEntitiesList(key);
    this.filterReady.emit(key);
    return r;
  }

  public applyAndUpdate(
    filterType: ApiResearchSearchParameters,
    $event: MatSelectChange | MatCheckboxChange
  ): void {
    this.apply(filterType, $event);
    this.getState();
  }

  /**
   * Form reset
   */
  public resetForm(): void {
    this.filtersForm.reset();
    this.filterService.clearFilters();
  }
}
