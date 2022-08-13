/**
 * Common filters set for genes list
 */
export interface ApiGeneSearchFilter {
  bySuggestions?: string;
  byGeneSymbol?: string[];
  byGeneId?: number;
  byDiseases: number[]; // by the name of the associated disease
  byDiseaseCategories: number[]; // by the name of the associated disease category
  byAgeRelatedProcess: number[]; // by functional classes
  bySelectionCriteria: number[]; // see selection criteria
  byMethylationChange: string; // by the gene's methylation change with age
  byExpressionChange: number; // by gene's age related expression change variant
  byAgingMechanism: number[]; // by aging mechanisms the gene involved in
  byProteinClass: number[]; // by special categories of protein functions/associations (Human Protein Atlas)
  byOrigin: string[];
  byFamilyOrigin: string[];
  byConservativeIn: string[];
  researches: number; // send researches in response
}

export type ApiGeneSearchParameters =
  | 'byDiseases'
  | 'byDiseaseCategories'
  | 'byAgeRelatedProcess'
  | 'bySelectionCriteria'
  | 'byExpressionChange'
  | 'byMethylationChange'
  | 'byAgingMechanism'
  | 'byProteinClass'
  | 'byOrigin'
  | 'byFamilyOrigin'
  | 'byConservativeIn'
  | 'researches';

export interface ISort {
  byName: boolean; // by gene name
  byAge: boolean; // by gene evolutionary age (familyOrigin.order field)
}

/**
 * Common filters set for studies list
 */
export type StudiesSortPurple =
  | 'lifespanMinChangePercent'
  | 'lifespanMeanChangePercent'
  | 'lifespanMedianChangePercent'
  | 'lifespanMaxChangePercent';

type StudiesSortGeneral = 'criteriaQuantity' | 'familyPhylum';

export type StudiesSortBlue = StudiesSortGeneral;
export type StudiesSortGreen = StudiesSortGeneral;
export type StudiesSortYellow = StudiesSortGeneral;
export type StudiesSortOrange = StudiesSortGeneral;
export type StudiesSortPink = StudiesSortGeneral;
export type StudiesSortGray = StudiesSortGeneral;

export interface ApiResearchFilter {
  sortBy: StudiesSortPurple | StudiesSortGeneral | '';
  sortOrder: 'ASC' | 'DESC' | '';
  byDiseases: number[];
  byDiseaseCategories: number[];
  byAgeRelatedProcess: number[];
  byExpressionChange: number;
  bySelectionCriteria: number[];
  byAgingMechanism: number[];
  byProteinClass: number[];
  bySpecies: number[];
  byOrigin: string[];
  byFamilyOrigin: string[];
  byConservativeIn: string[];
  byGeneId: number;
  byGeneSymbol: string[];
  bySuggestions: string;
  byChromosomeNum: number;
}

export type ApiResearchSearchParameters =
  | 'sortBy'
  | 'sortOrder'
  | 'byDiseases'
  | 'byDiseaseCategories'
  | 'byAgeRelatedProcess'
  | 'byExpressionChange'
  | 'bySelectionCriteria'
  | 'byAgingMechanism'
  | 'byProteinClass'
  | 'bySpecies'
  | 'byOrigin'
  | 'byFamilyOrigin'
  | 'byConservativeIn'
  | 'byGeneId'
  | 'byGeneSymbol'
  | 'bySuggestions'
  | 'byChromosomeNum';
