/**
 * Model describing a common filters set for genes list
 */
export interface Filter {
  byName: boolean; // by gene name
  byAge: boolean; // by gene evolutionary age (familyOrigin.order field)
  byClasses: number[]; // by functional classes
  byExpressionChange: number; // by gene's age related expression change variant
  bySelectionCriteria: string[]; // see selection criteria list
}
