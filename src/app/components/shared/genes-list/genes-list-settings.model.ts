export interface appliedFilter {
  name: string;
  value: any | any[];
}

export interface GenesListSettings {
  ifShowAge: boolean;
  ifShowDiseases: boolean;
  ifShowDiseaseCategories: boolean;
  ifShowCriteria: boolean;
  ifShowHallmarks: boolean;
  ifShowProteinClasses: boolean;
  ifShowExperimentsStats: boolean;
  ifShowTags: boolean;
}
