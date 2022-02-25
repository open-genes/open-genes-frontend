/**
 * Model describing a common filters set for genes list
 */
export interface Filter {
  byGeneId?: number[];
  byDiseases: number[]; // by the name of the associated disease
  byDiseaseCategories: number[]; // by the name of the associated disease category
  byAgeRelatedProcess: number[]; // by functional classes
  bySelectionCriteria: number[]; // see selection criteria
  byMethylationChange: string; // by the gene's methylation change with age
  byExpressionChange: number; // by gene's age related expression change variant
  byAgingMechanisms: number[]; // by aging mechanisms the gene involved in
  byProteinClass: number[]; // by special categories of protein functions/associations (Human Protein Atlas)
}

export interface ISort {
  byName: boolean; // by gene name
  byAge: boolean; // by gene evolutionary age (familyOrigin.order field)
}
