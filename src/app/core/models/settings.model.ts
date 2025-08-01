import { LocaleKeyType } from './languages.model';

export interface Settings {
  showUiHints: boolean;
  searchMode: SearchMode;
  isTableView: boolean;
  showCookieBanner: boolean;
  language: LocaleKeyType;
  showNewReleaseNotification: boolean;
}

export enum SettingsEnum {
  showUiHints = 'showUiHints',
  searchMode = 'searchMode',
  isTableView = 'isTableView',
  showCookieBanner = 'showCookieBanner',
  releaseNotifications = 'showNewReleaseNotification',
}

export enum SearchModeEnum {
  searchByGenes = 'searchByGenes',
  searchByGoTerms = 'searchByGoTerms',
  searchByGenesList = 'searchByGenesList',
}

export type SearchMode = 'searchByGenes' | 'searchByGoTerms' | 'searchByGenesList';

export interface Pagination {
  page: number;
  pageSize: number;
  pagesTotal?: number;
}
