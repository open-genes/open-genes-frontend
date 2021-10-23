export interface Settings {
  showUiHints: boolean;
  searchMode: SearchMode;
  isTableView: boolean;
}

export enum SettingsEnum {
  showUiHints = 'showUiHints',
  searchMode = 'searchMode',
  isTableView = 'isTableView',
}

export enum SearchModeEnum {
  searchByGenes = 'searchByGenes',
  searchByGoTerms = 'searchByGoTerms',
  searchByGenesList = 'searchByGenesList',
}

export type SearchMode = 'searchByGenes' | 'searchByGoTerms' | 'searchByGenesList';
