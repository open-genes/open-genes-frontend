/**
 * Model describing a common filters set for genes list
 */
export interface Filter {
  byFunctionalClusters: number[]; // by functional classes
  byDisease: string[]; // by the name of the associated disease
  byDiseaseCategories: string[]; // by the name of the associated disease category
  bySelectionCriteria: string[]; // see selection criteria
  byMethylationChange: string; // by the gene's methylation change with age
  byExpressionChange: number[]; // by gene's age related expression change variant
  page?: number;
  pagesTotal?: number;
}

export interface Sort {
  byName: boolean; // by gene name
  byAge: boolean; // by gene evolutionary age (familyOrigin.order field)
}
