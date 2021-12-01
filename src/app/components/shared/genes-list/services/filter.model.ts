/**
 * Model describing a common filters set for genes list
 */
export interface Filter {
  byDiseases: string[]; // by the name of the associated disease
  byDiseaseCategories: string[]; // by the name of the associated disease category
  byAgeRelatedProcess: number[]; // by functional classes
  bySelectionCriteria: string[]; // see selection criteria
  byMethylationChange: string; // by the gene's methylation change with age
  byExpressionChange: number; // by gene's age related expression change variant
}

export interface Sort {
  byName: boolean; // by gene name
  byAge: boolean; // by gene evolutionary age (familyOrigin.order field)
}
