import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiGeneSearchFilter } from '../../models/filters/filter.model';
import { Genes } from '../../models';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../settings.service';
import { ApiResponse } from '../../models/api-response.model';
import { Router } from '@angular/router';
import { FilterService } from './filter.service';
import { ApiService } from '../api/open-genes-api.service';
import { GenesListSettings } from '../../../components/shared/genes-list/genes-list-settings.model';
import { Sort } from '@angular/material/sort';
import { SortEnum } from './filter-types.enum';

type GenesFilter = Record<'byAgeRelatedProcess' |
  'byDiseases' |
  'byDiseaseCategories' |
  'bySelectionCriteria' |
  'byExpressionChange' |
  'byMethylationChange' |
  'byAgingMechanism' |
  'byProteinClass' |
  'byOrigin' |
  'byFamilyOrigin' |
  'byConservativeIn' |
  'researches' |
  'byGeneId' |
  'byGeneSymbol' |
  'bySuggestions' |
  'confidenceLevel', any>

const defaultFilters: GenesFilter = {
  byAgeRelatedProcess: [],
  byDiseases: [],
  byDiseaseCategories: [],
  bySelectionCriteria: [],
  byExpressionChange: 0,
  byMethylationChange: '',
  byAgingMechanism: [],
  byProteinClass: [],
  byOrigin: [],
  byFamilyOrigin: [],
  byConservativeIn: [],
  researches: 0,
  byGeneId: null,
  byGeneSymbol: [],
  bySuggestions: '',
  confidenceLevel: null,
} as const;

@Injectable({
  providedIn: 'root',
})
export class GenesFilterService extends FilterService {
  public filters = JSON.parse(JSON.stringify(defaultFilters));
  public currentFields: Observable<GenesListSettings> = this.listOfFields$.asObservable();
  public filterResult: Observable<ApiGeneSearchFilter> = this.filterChanges$.asObservable();
  public sortParams: Sort = {
    // Default:
    active: SortEnum.byConfidenceLevel,
    direction: 'asc',
  };

  constructor(
    http: HttpClient,
    translate: TranslateService,
    settingsService: SettingsService,
    router: Router,
    apiService: ApiService,
  ) {
    super(http, translate, settingsService, router, apiService);
    this.updateFields(settingsService.genesListSettings);
  }

  getFilters(): Record<string, any> {
    return this.filters;
  }

  getDefaultFilters(): Record<string, any> {
    return defaultFilters;
  }

  // Get state
  getFilterState(): Observable<ApiGeneSearchFilter> {
    return of(this.filters);
  }

  public getSortedAndFilteredGenes(): Observable<ApiResponse<Genes>> {
    let params = this.getSortedAndFilteredParams();

    if (this.sortParams && this.sortParams.direction) {
      params = params.set('sortBy', this.sortParams.active)
        .set('sortOrder', this.sortParams.direction.toUpperCase());
    }

    return this.apiService.getGenesV2(params);
  }
}
