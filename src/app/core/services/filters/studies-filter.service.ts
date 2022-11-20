import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResearchFilter } from '../../models/filters/filter.model';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SettingsService } from '../settings.service';
import { ApiResponse } from '../../models/api-response.model';
import { ResearchArguments, ResearchTypes } from '../../models/open-genes-api/researches.model';
import { ApiService } from '../api/open-genes-api.service';
import { FilterService } from './filter.service';

type StudiesFilter = Record<'sortBy' |
  'sortOrder' |
  'byDiseases' |
  'byDiseaseCategories' |
  'byAgeRelatedProcess' |
  'byExpressionChange' |
  'bySelectionCriteria' |
  'byAgingMechanism' |
  'byProteinClass' |
  'bySpecies' |
  'byOrigin' |
  'byFamilyOrigin' |
  'byConservativeIn' |
  'byGeneId' |
  'byGeneSymbol' |
  'bySuggestions' |
  'byChromosomeNum', any>

const defaultFilters: StudiesFilter = {
  sortBy: '',
  sortOrder: '',
  byDiseases: [],
  byDiseaseCategories: [],
  byAgeRelatedProcess: [],
  byExpressionChange: 0,
  bySelectionCriteria: [],
  byAgingMechanism: [],
  byProteinClass: [],
  bySpecies: null,
  byOrigin: [],
  byFamilyOrigin: [],
  byConservativeIn: [],
  byGeneId: null,
  byGeneSymbol: [],
  bySuggestions: '',
  byChromosomeNum: null,
} as const;

@Injectable({
  providedIn: 'root',
})
export class StudiesFilterService extends FilterService {
  public filters: StudiesFilter = JSON.parse(JSON.stringify(defaultFilters));

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
  getFilterState(): Observable<ApiResearchFilter> {
    return of(this.filters);
  }

  public getSortedAndFilteredStudies(studyType: ResearchArguments): Observable<ApiResponse<ResearchTypes>> {
    const params = this.getSortedAndFilteredParams();
    return this.apiService.getStudies(studyType, params);
  }
}
