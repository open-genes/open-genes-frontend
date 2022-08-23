import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
  selector: 'app-research-filters-panel',
  templateUrl: './research-filters-panel.component.html',
  styleUrls: ['./research-filters-panel.component.scss'],
})
export class ResearchDataFiltersPanelComponent extends FilterPanelLogic implements OnInit, OnDestroy {
  public filtersForm: FormGroup;
  @Output()
  filterReady: EventEmitter<string> = new EventEmitter<string>();

  // Search in selects
  searchText: any;

  // Age-related processes
  public modelOrganisms: any[] = []; // TODO: typing
  public predefinedModelOrganisms: any[] = [];
  public modelOrganismsModel: Observable<any[]>;

  constructor(
    public filterService: StudiesFilterService,
    public apiService: ApiService
  ) {
    super(apiService, filterService);
    this.filtersForm = new FormGroup({
      modelOrganismSelect: new FormControl([
        [],
        [null],
      ]),
    });
  }

  ngOnInit() {
    // FILTERS
    // Age-related processes
    this.modelOrganismsModel = this.populateSelect(
      'model-organisms'
    );
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
    this.getStateForFields([
      {
        field: this.predefinedModelOrganisms,
        type: 'predefinedModelOrganisms',
      },
    ]);
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

  // public toggleSwitchAndFilter(filterType: ApiResearchSearchParameters, $event): void {
  //   this.listSettings.ifShowExperimentsStats = $event.checked;
  //   this.filterService.applyFilter(filterType, Number(this.listSettings[filterType]));
  //   this.getState();
  // }

  /**
   * Form reset
   */
  public resetForm(formControlName: string = null): void {
    if (formControlName) {
      switch (formControlName) {
        case 'modelOrganismSelect':
          this.filterService.clearFilters('bySpecies');
          break;
      }
    } else {
      this.filtersForm.reset();
      this.filterService.clearFilters();
    }
  }
}
