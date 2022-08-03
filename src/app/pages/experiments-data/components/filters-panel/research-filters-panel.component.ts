import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SettingsService } from '../../../../core/services/settings.service';
import { ApiSearchParameters } from '../../../../core/models/filters/filter.model';
import { FilterPanelLogic } from '../../../../core/utils/filter-panel-logic';
import { GenesFilterService } from 'src/app/components/shared/genes-list/services/genes-filter.service';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';

@Component({
  selector: 'app-research-filters-panel',
  templateUrl: './research-filters-panel.component.html',
  styleUrls: ['./research-filters-panel.component.scss'],
})
export class ResearchDataFiltersPanelComponent extends FilterPanelLogic implements OnInit, OnDestroy {
  public filtersForm: FormGroup;

  // Search in selects
  searchText: any;

  // Age-related processes
  public processes: any[] = []; // TODO: typing
  public predefinedProcesses: any[] = [];
  public processesModel: Observable<any[]>;

  constructor(
    private settingsService: SettingsService,
    public filterService: GenesFilterService,
    public apiService: ApiService
  ) {
    super(apiService, filterService);
    this.filtersForm = new FormGroup({
      ageRelatedProcessesSearchInput: new FormControl([[], null]),
    });
  }

  ngOnInit() {
    this.updateVisibleFields();

    // FILTERS
    // Age-related processes
    this.processesModel = this.populateSelect('processes');
    this.processesModel.pipe(takeUntil(this.subscription$)).subscribe((data: any[]) => {
      this.processes = data;
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
        field: this.predefinedProcesses,
        type: 'processes',
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

  public applyAndUpdate(filterType: ApiSearchParameters, $event: MatSelectChange | MatCheckboxChange): void {
    this.apply(filterType, $event);
    this.getState();
  }

  /**
   * Update list view
   */
  public toggleGenesListSettings(param: string, callback?: void | ((...args: any[]) => void)): void {
    switch (param) {
      case 'processes':
        this.listSettings.ifShowFuncClusters = !this.listSettings.ifShowFuncClusters;
        break;
      default:
        break;
    }
    this.filterService.updateFields(this.listSettings);

    if (callback instanceof Function) {
      callback(...callback.arguments);
    }
  }

  public toggleSwitchAndFilter(filterType: ApiSearchParameters, $event): void {
    this.listSettings.ifShowResearches = !$event.checked;
    this.filterService.applyFilter(filterType, Number(this.listSettings.ifShowResearches));
    this.getState();
  }

  private updateVisibleFields(): void {
    this.filterService.currentFields.pipe(takeUntil(this.subscription$)).subscribe(
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
   * Form reset
   */
  public resetForm(formControlName: string = null): void {
    if (formControlName) {
      switch (formControlName) {
        case 'ageRelatedProcessesSelect':
          this.filterService.clearFilters('byAgeRelatedProcess');
          break;
      }
    } else {
      this.filtersForm.reset();
      this.filterService.clearFilters();
    }
  }
}
